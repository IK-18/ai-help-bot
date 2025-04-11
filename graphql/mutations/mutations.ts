import {gql} from "@apollo/client";

export const CREATE_CHATBOT = gql`
	mutation CreateChatbot(
		$clerk_user_id: String!
		$name: String!
		$welcome_message: String
		$public_access: Boolean
	) {
		insertChatbots(
			clerk_user_id: $clerk_user_id
			name: $name
			welcome_message: $welcome_message
			public_access: $public_access
		) {
			id
			name
			welcome_message
			public_access
		}
	}
`;

export const REMOVE_CHARACTERISTIC = gql`
	mutation RemoveCharacteristic($characteristicId: Int!) {
		deleteChatbot_characteristics(id: $characteristicId) {
			id
			# Add other fields you might want to return after removal
		}
	}
`;

export const DELETE_CHATBOT = gql`
	mutation DeleteChatbot($id: Int!) {
		deleteChatbots(id: $id) {
			id
		}
	}
`;

export const ADD_CHARACTERISTIC = gql`
	mutation AddCharacteristic($chatbotId: Int!, $content: String!) {
		insertChatbot_characteristics(
			chatbot_id: $chatbotId
			content: $content
		) {
			id
			content
			created_at
			# Add other fields you may want to return after adding
		}
	}
`;

export const UPDATE_CHATBOT = gql`
	mutation UpdateChatbot(
		$id: Int!
		$name: String!
		$welcome_message: String
		$public_access: Boolean
	) {
		updateChatbots(
			id: $id
			name: $name
			welcome_message: $welcome_message
			public_access: $public_access
		) {
			id
			name
			created_at
			#  Add other fields you amy want to return after update
			welcome_message
			public_access
		}
	}
`;

export const INSERT_MESSAGE = gql`
	mutation InsertMessage(
		$chat_session_id: Int!
		$content: String!
		$sender: String!
	) {
		insertMessages(
			chat_session_id: $chat_session_id
			content: $content
			sender: $sender
		) {
			id
			content
			created_at
			sender
		}
	}
`;

export const INSERT_GUEST = gql`
	mutation insertGuest($name: String!, $email: String!) {
		insertGuests(name: $name, email: $email) {
			id
		}
	}
`;

export const INSERT_CHAT_SESSION = gql`
	mutation insertChatSession($chatbot_id: Int!, $guest_id: Int!) {
		insertChat_sessions(chatbot_id: $chatbot_id, guest_id: $guest_id) {
			id
		}
	}
`;
