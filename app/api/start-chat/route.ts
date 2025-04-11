import {NextRequest, NextResponse} from "next/server";
import {useQuery} from "@apollo/client";
import {
	GET_CHATBOT_BY_ID,
	GET_MESSAGES_BY_CHAT_SESSION_ID,
} from "@/graphql/queries/queries";
import {startNewChat} from "@/actions/actions";
import serverClient from "@/lib/server/serverClient";
import {
	GetChatbotByIdResponse,
	GetChatbotByIdVariables,
	MessagesByChatSessionIdResponse,
	MessagesByChatSessionIdVariables,
} from "@/types/types";

const corsHeaders = {
	"Access-Control-Allow-Origin": "*",
	"Access-Control-Allow-Methods": "GET,POST,PUT,DELETE,OPTIONS",
	"Access-Control-Allow-Headers": "Content-Type, Authorization",
};

export async function POST(req: NextRequest) {
	try {
		const body = await req.json();
		const {name, email, chatbotId} = body;

		const chatSessionId = await startNewChat(name, email, chatbotId);

		const {data: chatbotData} = await serverClient.query<
			GetChatbotByIdResponse,
			GetChatbotByIdVariables
		>({
			query: GET_CHATBOT_BY_ID,
			variables: {id: chatbotId},
		});

		const {data: messagesData} = await serverClient.query<
			MessagesByChatSessionIdResponse,
			MessagesByChatSessionIdVariables
		>({
			query: GET_MESSAGES_BY_CHAT_SESSION_ID,
			variables: {chat_session_id: chatSessionId},
			fetchPolicy: "no-cache",
		});

		return NextResponse.json(
			{
				chat_session_id: chatSessionId,
				chatbotData: chatbotData,
				messages: messagesData.chat_sessions.messages,
			},
			{headers: corsHeaders},
		);
	} catch (error) {
		console.error("Error creating chat session:", error);
		return NextResponse.json(
			{error: "Internal Server Error"},
			{status: 500},
		);
	}
}
