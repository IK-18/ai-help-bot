export type Message = {
	id: number;
	content: string;
	created_at: string;
	chat_session_id: number;
	sender: "user" | "ai";
};

export interface ChatbotCharacteristic {
	id: number;
	chatbot_id: number;
	content: string;
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

export interface Guest {
	id: number;
	name: string;
	email: string;
	created_at: string;
}

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

export interface GetChatbotByIdResponse {
	chatbots: Chatbot;
}
