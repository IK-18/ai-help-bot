export interface Chatbot {
	id: number;
	clerk_user_id: string;
	name: string;
	created_at: string;
	welcome_message: string;
	public_access: boolean;
	chatbot_characteristics: ChatbotCharacteristic[];
	chat_sessions: ChatSession[];
}

export interface ChatbotCharacteristic {
	id: number;
	chatbot_id: number;
	content: string;
	created_at: string;
}

export interface Guest {
	id: number;
	name: string;
	email: string;
	created_at: string;
}

export interface ChatSession {
	id: number;
	chatbot_id: number;
	guest_id: number | null;
	created_at: string;
	messages: Message[];
	guests: Guest;
}

export interface Message {
	id: number;
	chat_session_id: number;
	content: string;
	created_at: string;
	sender: "ai" | "user";
}

export interface GetChatbotByIdResponse {
	chatbots: Chatbot;
}

export interface GetChatbotByIdVariables {
	id: string;
}

export interface GetChatbotsByUserData {
	chatbotsByUser: Chatbot[];
}

export interface GetChatbotsByUserDataVariables {
	clerk_user_id: string;
}

export interface GetUserChatbotsData {
	chatbotsByUser: Chatbot[];
}

export interface GetUserChatbotsVariables {
	clerk_user_id: string;
}

export interface GetChatSessionMessagesResponse {
	chat_sessions: {
		id: number;
		created_at: string;
		messages: Message[];
		chatbots: {name: string};
		guests: {
			name: string;
			email: string;
		};
	};
}

export interface GetChatSessionMessagesVariablse {
	id: number;
}

export interface MessagesByChatSessionIdResponse {
	chat_sessions: ChatSession;
}

export interface MessagesByChatSessionIdVariables {
	chat_session_id: number;
}

export interface APIError {
	message: string;
	code?: string;
	details?: unknown;
}

export interface ChatbotConfig {
	id: number;
	name: string;
	welcomeMessage: string;
	theme?: {
		primaryColor: string;
		secondaryColor: string;
	};
}

export interface EmbedInstructionsProps {
	chatbotId: number;
}
