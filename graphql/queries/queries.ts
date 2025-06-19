import { gql } from "@apollo/client";

export const GET_CHATBOT_BY_ID = gql`
    query GetChatbotById($id: Int!) {
        chatbots(id: $id) {
            id
            name
            created_at
            chatbot_characteristics {
                id
                content
                created_at
            }
            chat_sessions {
                id
                created_at
                guest_id
                messages {
                    id
                    content
                    created_at
                }
            }
        }
    }
`;

// # query GetChatbotByUser($clerk_user_id: String!) {
// # chatbotsByUser(clerk_user_id: $clerk_user_id) {

// query GetChatbotByUser {
// chatbotsList {
export const GET_CHATBOT_BY_USER = gql`
  query GetChatbotByUser {
    chatbotsList {
      id
      clerk_user_id
      name
      created_at
      chatbot_characteristics {
        id
        content
        created_at
      }
      chat_sessions {
        id
        created_at
        guest_id
        messages {
          id
          content
          created_at
        }
      }
    }
  }
`;

export const GET_MESSAGES_BY_CHAT_SESSION_ID = gql`
  query GetMessagesByChatSessionId($chat_session_id: Int!) {
    chat_sessions(id: $chat_session_id) {
      id
      messages {
        id
        content
        sender
        created_at
      }
    }
  }
`;
