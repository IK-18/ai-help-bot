import {NextRequest, NextResponse} from "next/server";
import Groq from "groq-sdk";
import serverClient from "@/lib/server/serverClient";
import {
	GetChatbotByIdResponse,
	GetChatbotByIdVariables,
	MessagesByChatSessionIdResponse,
	MessagesByChatSessionIdVariables,
} from "@/types/types";
import {
	GET_CHATBOT_BY_ID,
	GET_MESSAGES_BY_CAHT_SESSION_ID,
} from "@/graphql/queries/queries";
import {ChatCompletionMessageParam} from "groq-sdk/resources/chat/completions.mjs";
import {INSERT_MESSAGE} from "@/graphql/mutations/mutations";

const groq = new Groq({apiKey: process.env.GROQ_KEY});

export const POST = async (req: NextRequest) => {
	const {chat_session_id, chatbot_id, content, name} = await req.json();

	console.log(
		`Received message from chat session ${chat_session_id}: ${content} (chatbot: ${chatbot_id})`,
	);

	try {
		// Fetch chatbot characteristics
		const {data} = await serverClient.query<
			GetChatbotByIdResponse,
			GetChatbotByIdVariables
		>({
			query: GET_CHATBOT_BY_ID,
			variables: {id: chatbot_id},
		});

		const chatbot = data.chatbots;
		if (!chatbot) {
			return NextResponse.json(
				{error: "Chatbot not found"},
				{status: 404},
			);
		}

		// Fetch previous messages
		const {data: messagesData} = await serverClient.query<
			MessagesByChatSessionIdResponse,
			MessagesByChatSessionIdVariables
		>({
			query: GET_MESSAGES_BY_CAHT_SESSION_ID,
			variables: {chat_session_id: chat_session_id},
			fetchPolicy: "no-cache",
		});

		const prevMessages = messagesData.chat_sessions.messages;

		const formattedPreviousMessages: ChatCompletionMessageParam[] =
			prevMessages.map((msg) => ({
				role: msg.sender === "ai" ? "system" : "user",
				name: msg.sender === "ai" ? "system" : name,
				content: msg.content,
			}));

		// Combine characteristics into a system prompt
		const systemPrompt = chatbot.chatbot_characteristics
			.map((c) => c.content)
			.join(" + ");

		console.log(systemPrompt);

		const messages: ChatCompletionMessageParam[] = [
			{
				role: "system",
				name: "system",
				content: `You are a helpful assistant talking to ${name}. If a generic question is asked which is not relevant or in the same scope or domain as the points enterd in the key information section, kindly inform the user they're only allowed to search for the specified content. Use emojis where possible. Here is some key information that you need to be aware of, these are elements you may be asked abouut: ${systemPrompt}`,
			},
			...formattedPreviousMessages,
			{role: "user", name: name, content: content},
		];

		// Send the message to Groq's completions API
		const groqResponse = await groq.chat.completions.create({
			messages: messages,
			model: "llama-3.3-70b-versatile",
		});

		const aiResponse = groqResponse.choices[0].message.content?.trim();

		if (!aiResponse) {
			return NextResponse.json(
				{error: "Failed to generate AI response"},
				{status: 500},
			);
		}

		// Insert message into database
		await serverClient.mutate({
			mutation: INSERT_MESSAGE,
			variables: {chat_session_id, content, sender: "user"},
		});

		// Insert the AI's response
		const aiMessageResult = await serverClient.mutate({
			mutation: INSERT_MESSAGE,
			variables: {chat_session_id, content: aiResponse, sender: "ai"},
		});

		// Return AI's response back to the client
		return NextResponse.json({
			id: aiMessageResult.data.insertMessages.id,
			content: aiResponse,
		});
	} catch (error) {
		console.error("error sending message ", error);
		return NextResponse.json({error}, {status: 500});
	}
};
