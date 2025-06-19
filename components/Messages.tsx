"use client"
import { Message } from '@/types/types'
import { usePathname } from 'next/navigation';
import Avatar from './Avatar';
import { UserCircle } from 'lucide-react';
import ReactMarkdown from 'react-markdown';
import remarkGfm from 'remark-gfm';

function Messages({messages, chatBotName} : {messages: Message[], chatBotName: string}) {
    const path = usePathname();
    const isReviewPage = path.includes("review-sessions");

    return (
    <div className='flex-1 flex flex-col overflow-y-auto space-y-10 py-10 px-5 bg-white rounded-lg'>
        {messages.map(msg => {
            const isSender = msg.sender !== 'user';

            return (
                <div 
                    key={msg.id}
                    className={`chat ${isSender ? 'chat-start' : 'chat-end'} relative`}
                >
                    {isReviewPage && (
                        <p className='absolute -bottom-5 text-xs text-gray-300'>
                            Send {new Date(msg.created_at).toLocaleString()}
                        </p>
                    )}

                    <div className={`chat-image avatar w-10 ${!isSender && '-mr-4'}`}>
                        {isSender ? (
                            <Avatar 
                                seed={chatBotName}
                                className='h-12 w-12 bg-white rounded-full border-2 border-[#2991EE]'
                            />
                        ) : (
                            <UserCircle 
                                className='text-[#2991EE]'
                            />
                        )}
                    </div>

                    <p
                        className={`chat-bubble text-white ${
                            isSender ? "chat-bubble-primary bg-[#4D7DFB]"
                            : "chat-bubble-secondary bg-gray-200 text-gray-700"
                        }`}
                    >
                        <div className="break-words">
                            <ReactMarkdown
                                remarkPlugins={[remarkGfm]}
                            >
                                {msg?.content}
                            </ReactMarkdown>
                        </div>
                    </p>

                </div>
            )
        })}
    </div>
  )
}

export default Messages