import client from "@/graphql/apolloClient";
import {gql} from "@apollo/client";
import {
	INSERT_CHAT_SESSION,
	INSERT_GUEST,
	INSERT_MESSAGE,
} from "@/graphql/mutations/mutations";

export const startNewChat = async (
	guestName: string,
	guestEmail: string,
	chatbotId: number,
) => {
	try {
		// Create a new guest entry
		const guestResult = await client.mutate({
			mutation: INSERT_GUEST,
			variables: {
				name: guestName,
				email: guestEmail,
			},
		});
		const guestId = guestResult.data.insertGuests.id;

		// Initialise a new chat session
		const chatSessionResult = await client.mutate({
			mutation: INSERT_CHAT_SESSION,
			variables: {chatbot_id: chatbotId, guest_id: guestId},
		});
		const chatSessionId = chatSessionResult.data.insertChat_sessions.id;

		// Insert initial message (Optional)
		await client.mutate({
			mutation: INSERT_MESSAGE,
			variables: {
				chat_session_id: chatSessionId,
				sender: "ai",
				// TODO: Change to be dynamic content that can be set by admin
				content: `Welcome ${guestName}!\n How can I assist you today?`,
			},
		});

		console.log("New chat session successfully created");
		return chatSessionId;
	} catch (error) {
		console.error("Error starting new session: ", error);
	}
};
