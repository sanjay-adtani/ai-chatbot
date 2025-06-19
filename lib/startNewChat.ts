import client from "@/graphql/apolloClient";
import { INSERT_CHAT_SESSION, INSERT_MESSAGE } from "@/graphql/mutations/mutations";
import { INSERT_GUEST } from "@/graphql/mutations/mutations";

export async function startNewChat(guestName: string, guestEmail: string, chatbotId: number) {
    try {
        // 1 create guest
        const guestResult = await client.mutate({
            mutation: INSERT_GUEST,
            variables: {
                name: guestName,
                email: guestEmail,
                created_at: new Date().toISOString()
            }
        })
        const guestID = guestResult.data.insertGuests.id;
        
        // 2 init new session
        const chatSessionID = await client.mutate({
            mutation:INSERT_CHAT_SESSION,
            variables: {
                chatbot_id: chatbotId,
                guestID,
                created_at: new Date().toISOString()
            }
        })
        
        // 3 insert initial message
        if (chatSessionID?.data?.insertChat_sessions?.id) {
            console.log("INSERT_MESSAGE variables:", {
                chat_session_id: Number(chatSessionID?.data?.insertChat_sessions?.id),
                sender: "ai",
                content: `Welcome ${guestName}!\n How can I assist you today?`,
                created_at: new Date().toISOString()
            });
            
            await client.mutate({
                mutation: INSERT_MESSAGE,
                variables: {
                    chat_session_id: Number(chatSessionID?.data?.insertChat_sessions?.id),
                    sender: "ai",
                    content: `Welcome ${guestName}!\n How can I assist you today?`,
                    created_at: new Date().toISOString()
                }
            })
        }
        
        console.log('New chat session successfully created');
        return Number(chatSessionID?.data?.insertChat_sessions?.id) ?? 0
    }catch(err) {
        console.log('Error while starting new chat', err);
        
    }
}