import React from 'react';
import {Message} from '@ai-sdk/react';
import { cn } from '@/lib/utils';
import { Loader2 } from 'lucide-react';

const MessageList = ({messages, isLoading}: {messages: Message[], isLoading: boolean}) => {
    if (isLoading) return <div 
    className='absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 '>
        <Loader2 className='w-6 h-6 animate-spin'/>

    </div>
    if (!messages || messages.length === 0) return <div>No messages</div>

  return (
    <div className='flex flex-col gap-2 px-4 mb-20 z-20'>
        {messages.map((m) => {
            return (
                <div key={m.id}
                    className={cn('flex', {
                        'justify-end pl-10': m.role === 'user',
                        'justify-start pr-10': m.role === 'assistant'
                    })}
                    >
                        <div 
                        className={cn('rounded-lg px-3 text-sm py-1 shadow-md ring-1 ring-gray-900/10', {
                            'bg-blue-600 text-[#fff]' : m.role === 'user', 
                        })}
                        >
                            <p>{m.content}</p>
                        </div>
                    
                </div>
            )
        })}
    </div>
  )
}

export default MessageList