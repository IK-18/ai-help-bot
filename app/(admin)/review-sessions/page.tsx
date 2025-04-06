import ChatbotSessions from "@/components/ChatbotSessions";
import {GET_USER_CHATBOTS} from "@/graphql/queries/queries";
import serverClient from "@/lib/server/serverClient";
import {
	Chatbot,
	GetUserChatbotsData,
	GetUserChatbotsVariables,
} from "@/types/types";
import {auth} from "@clerk/nextjs/server";

const ReviewSessions = async () => {
	const {userId, sessionClaims} = await auth.protect();

	if (!userId) return;

	// Get the chatbots for the user
	const {
		data: {chatbotsByUser},
	} = await serverClient.query<GetUserChatbotsData, GetUserChatbotsVariables>(
		{
			query: GET_USER_CHATBOTS,
			variables: {clerk_user_id: userId},
		},
	);

	const sortedChatbotsByUser: Chatbot[] = chatbotsByUser.map((chatbot) => ({
		...chatbot,
		chat_sessions: [...chatbot.chat_sessions].sort(
			(a, b) =>
				new Date(b.created_at).getTime() -
				new Date(a.created_at).getTime(),
		),
	}));

	return (
		<div className='flex-1 px-10'>
			<h1 className='text-xl md:text-3xl font-semibold mt-10'>
				Chat Sessions
			</h1>
			<h2 className='mb-5'>
				Review all the chat sesions the chat bots have had with your
				customers.
			</h2>
			<ChatbotSessions chatbots={sortedChatbotsByUser} />
		</div>
	);
};
export default ReviewSessions;
