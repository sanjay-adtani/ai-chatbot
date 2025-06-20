"use client"
import Avatar from "@/components/Avatar";
import Messages from "@/components/Messages";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog"
import { Input } from "@/components/ui/input";
import { GET_CHATBOT_BY_ID, GET_MESSAGES_BY_CHAT_SESSION_ID } from "@/graphql/queries/queries";
import { startNewChat } from "@/lib/startNewChat";
import { GetChatbotByIdResponse, GetChatbotByIdVariables, Message, MessagesByChatSessionIdResponse, MessagesByChatSessionIdVariables } from "@/types/types";
import { useQuery } from "@apollo/client";
import { Label } from "@radix-ui/react-label";
import { FormEvent, useEffect, useState } from "react"
import {z} from "zod";
import { useForm, Controller } from "react-hook-form";

const formSchema = z.object({
    message: z.string().min(2, "Your message is too short."),
});

function ChatBOT({params}: {params: {id: string}}) {
    const id = params?.id ?? 0;
    const [name, setName] = useState("");
    const [email, setEmail] = useState("");
    const [isOpen, setIsOpen] = useState(true);
    const [chatId, setChatId] = useState(0);
    const [loading, setLoading] = useState(false);
    const [messages, setMessages] = useState<Message[]>([]);

    const form = useForm<z.infer<typeof formSchema>>({
        resolver: zodResolver(formSchema), 
        defaultValues: {
            message: ""
        }
    });

    const {data: chatBotData} = useQuery<GetChatbotByIdResponse, GetChatbotByIdVariables>(GET_CHATBOT_BY_ID, {
        variables: {id}
    })
    const { data, error } = useQuery<MessagesByChatSessionIdResponse, MessagesByChatSessionIdVariables>(GET_MESSAGES_BY_CHAT_SESSION_ID, {
        variables: {
            chat_session_id: chatId
        },
        skip: !chatId
    })
    console.log('query', error?.message);
    

    useEffect(()=>{
        if (data) {
            setMessages(data?.chat_sessions?.messages ?? []);
        }
    }, [data])

    async function handleSubmit(e: FormEvent) {
        e.preventDefault();
        setLoading(true);
        
        const chatId = await startNewChat(name, email, Number(id)) ?? 0;

        setChatId(chatId);
        setLoading(false);
        setIsOpen(false);
    }

    async function onSubmit(data: z.infer<typeof formSchema>) {
        setLoading(true);
        const {message: formMessage} = data;
        const message = formMessage;
        form.reset();
        
        if (!name || !email) { 
            setIsOpen(true);
            setLoading(false);
            return;
        }

        const userMessage: Message = {
            id: Date.now(),
            content: message,  
            created_at: new Date().toISOString(),
            chat_session_id: chatId,
            sender: "user"
        }
        const loadingMessage: Message = {
            id: Date.now()+1,
            content: 'Thinking...',  
            created_at: new Date().toISOString(),
            chat_session_id: chatId,
            sender: "ai"
        }

        setMessages(prev => [...prev, userMessage, loadingMessage]);

        try {
            const response = await fetch('/api/send-message', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({
                    name: name,
                    chat_session_id: chatId,
                    chatbot_id: id,
                    content: message
                })
            })
            const result = await response.json();

            setMessages(prev => prev.map(msg =>
                msg.id === loadingMessage.id ? {...msg, content: result.message} : msg
            ));

        } 
        catch (error) {
            console.error("Error sending message:", error);
        } 
    }

    return (
        <div className="w-full flex bg-gray-100">
            <Dialog open={isOpen} onOpenChange={setIsOpen}>
                <DialogContent className="sm:max-w-[424px]">
                    <form onSubmit={handleSubmit}>
                        <DialogHeader>
                            <DialogTitle>Lets help you out!</DialogTitle>
                            <DialogDescription>
                                I just need a few details to get started.
                            </DialogDescription>
                        </DialogHeader>
                        <div className="grid gap-4 py-4 ">
                            <div className="grid grid-cols-4 items-center gap-4">
                                <Label htmlFor="name" className="text-right">Name</Label>
                                <Input 
                                    id="name" 
                                    value={name} 
                                    onChange={e=>setName(e.target.value)}
                                    placeholder="Sanju Bhaiya"
                                    className="col-span-3"
                                />
                            </div>
                            <div className="grid grid-cols-4 items-center gap-4">
                                <Label htmlFor="email" className="text-right">Email</Label>
                                <Input 
                                    id="email" 
                                    value={email} 
                                    onChange={e=>setEmail(e.target.value)}
                                    placeholder="sanju@secmed.com"
                                    className="col-span-3"
                                />
                            </div>
                        </div>

                        <DialogFooter>
                            <Button type="submit" disabled={!name || !email || loading}>
                                { !loading? "Continue" : "Loading..." }
                            </Button>
                        </DialogFooter>
                    </form>

                </DialogContent>
            </Dialog>

            <div className="flex flex-col w-full max-w-3xl mx-auto bg-white md:rounded-t-lg shadow-2xl md:mt-10">
                <div className="pb-4 border-b sticky top-0 z-50 bg-[#4D7DFB] py-5 px-10 text-white md:rounded-t-lg flex items-center space-x-4">
                    <Avatar 
                        seed={chatBotData?.chatbots.name ?? 'chatbot'}
                        className="h-12 w-12 bg-white rounded-full border-2 border-white"
                    />
                    <div>
                        <h1 className="truncate text-lg">{chatBotData?.chatbots.name}</h1>
                        <p className="text-sm text-gray-300">
                            ⚡ Typically replies Instantly
                        </p>
                    </div>
                </div>
                <Messages chatBotName={chatBotData?.chatbots.name ?? ''} messages={messages} />

                <form 
                    onSubmit={form.handleSubmit(onSubmit)}
                    className="flex items-start sticky bottom-0 z-50 space-x-5 drop-shadow-lg p-4 bg-gray-400 rounded-md"
                >
                    <Controller
                        control={form.control}
                        name="message"
                        render={({ field }) => (
                            <Input
                                {...field}
                                placeholder="Type your message..."
                                className="p-8 bg-white"
                            />
                        )}
                    />
                    <Button type="submit" disabled={form.formState.isSubmitting || !form.formState.isValid} className="h-full">
                        Send
                    </Button>
                </form>

                </div>

        </div>
    )
}

function zodResolver<T extends z.ZodTypeAny>(formSchema: T): import("react-hook-form").Resolver<z.infer<T>> {
    return async (values) => {
        const result = formSchema.safeParse(values);
        if (result.success) {
            return {
                values: result.data,
                errors: {},
            };
        } else {
            const errors = result.error.formErrors.fieldErrors;
            return {
                values: {},
                errors: Object.keys(errors).reduce((all, key) => {
                    const message = errors[key]?.[0];
                    if (message) {
                        all[key] = {
                            type: "manual",
                            message,
                        };
                    }
                    return all;
                }, {} as Record<string, unknown>),
            };
        }
    };
}

export default ChatBOT
