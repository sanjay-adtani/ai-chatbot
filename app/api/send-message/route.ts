import { INSERT_MESSAGE } from "@/graphql/mutations/mutations";
import { GET_CHATBOT_BY_ID, GET_MESSAGES_BY_CHAT_SESSION_ID } from "@/graphql/queries/queries";
import { serverClient } from "@/lib/server/serverClient";
import { GetChatbotByIdResponse, MessagesByChatSessionIdResponse } from "@/types/types";
import { NextRequest, NextResponse } from "next/server";
import OpenAI from "openai";
import { ChatCompletionMessageParam } from "openai/resources/index.mjs";

// const corsHeaders = {
//     "Access-Control-Allow-Origin": "*",
//     "Access-Control-Allow-Methods": "GET, POST, PUT, PATCH, DELETE, OPTIONS",
//     "Access-Control-Allow-Headers": "Content-Type, Authorization",
// };

const openai = new OpenAI({
    apiKey: process.env.OPENAI_API_KEY,
})

export async function POST(request: NextRequest) {
    const { chat_session_id, chatbot_id, content, name } = await request.json();

    console.log("Received request:", {
        chat_session_id,
        chatbot_id,
        content,
        name
    });

    try {
        // fetch chatbot chars
        const {data} = await serverClient.query<GetChatbotByIdResponse>({
            query: GET_CHATBOT_BY_ID,
            variables: {
                id: chatbot_id
            }
        })
        const chatbot = data.chatbots;

        if (!chatbot) {
            return NextResponse.json({ error: "Chatbot not found" }, {
                status: 404,
            });
        }

        // fetch prev msgs
        const {data: messagesData} = await serverClient.query<MessagesByChatSessionIdResponse>({
            query: GET_MESSAGES_BY_CHAT_SESSION_ID,
            variables: {
                chat_session_id
            },
            fetchPolicy: "no-cache"
        });
        const prevMsgs = messagesData.chat_sessions?.messages ?? [];

        const formattedPreviousMessages: ChatCompletionMessageParam[] = prevMsgs.map(msg => ({
            role: msg.sender === "ai" ? "system" : "user",
            name: msg.sender === "ai" ? "system" : name,
            content: msg.content
        }));

        // combine chars
        const systemPrompts = chatbot.chatbot_characteristics.map(c => c.content).join(" + ");

        const messages: ChatCompletionMessageParam[] = [
            {
                role: "system", 
                name: "system",
                content: `You are a helpful assistant talking to ${name}. If a generic question is asked which is not relevant or in the same scope or domain as the points in mentioned in the key information section, kindly inform the user they’re only allowed to search for the specified content. Use Emoji’s where possible. Here is some key information that you need to be aware of, these are elements you may be asked about: ${systemPrompts}`,
            },
            ...formattedPreviousMessages,
            {
                role: "user",
                name: name,
                content: content
            }
        ]

        // send to openai
        const openaiResponse = await openai.chat.completions.create({
            model: "gpt-4o",
            // model: "gpt-3.5-turbo",
            messages: messages
        });

        const aiResponse = openaiResponse?.choices?.[0]?.message?.content?.trim();

        if (!aiResponse) {
            return NextResponse.json({ error: "No response from AI" }, {
                status: 500,
            });
        }

        // store user message
        await serverClient.mutate({
            mutation: INSERT_MESSAGE,
            variables: {
                chat_session_id,
                content: content,
                sender: "user"
            }
        });

        // store ai message
        await serverClient.mutate({
            mutation: INSERT_MESSAGE,
            variables: {
                chat_session_id,
                content: aiResponse,
                sender: "ai"
            }
        });

        return NextResponse.json({
            message: aiResponse,
            chat_session_id,
            chatbot_id
        }, {
            status: 200,
        });

    } catch (err) {
        console.error("Error >>>>", err);
        return NextResponse.json(err, {
            status: 500,
        });
    }
}