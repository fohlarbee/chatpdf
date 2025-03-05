"use client";
import React from 'react';
import { DrizzleChat } from '@/lib/db/schema';
import Link from 'next/link';
import { Button } from './ui/button';
import { MessageCircle, PlusCircle } from 'lucide-react';
import { cn } from '@/lib/utils';
import PaystackSubcriptionButton from './PaystackSubscriptionBtn';


type Props = {
    chats: DrizzleChat[];
    chatId: number;
    isPro: boolean;
}

const ChatSidebar = ({chats, chatId, isPro}: Props) => {

    // const handlePaystack = async () => {
    //     try {
    //         const res = await axios.post('/api/paystack') as {data:{paymentLink: string, reference: string}};
    //         console.log('paystack res', res);

    //         window.location.href = res.data.paymentLink;
            
    //     } catch (error) {
    //         console.error(error);
            
    //     }
    // }
   
  return (
    <div className='w-full h-screen p-4 text-gray-200 bg-gray-900 '>
        <Link href='/'>
        <Button className='w-full border border-[#fff] border-dashed mb-4'>
            <PlusCircle className='mr-2 w-4 h-4'/>
            New Chat
        </Button>
        </Link>

        <div className="flex flex-col gap-2 mt--4">
            {chats.map((chat) => (
                <Link key={chat.id} href={`/chats/${chat.id}`}>
                    <div
                    className={cn('rounded-lg p-3 text-slate-300 flex items-center', {
                        'bg-blue-600 text-[#fff]': chat.id === chatId,
                        'hover:text-[#fff]': chat.id !== chatId
                    })}
                    >
                        <MessageCircle className='mr-2'/>
                        <p className='w-full overflow-hidden text-sm truncate whitespace-nowrap text-ellipsis'>
                            {chat.pdfName}
                        </p>
                    </div>
                </Link>
            ))}
        </div>

    
        <div className='absolute bottom-10 left-4 w-full'>
            <div className='flex items-center gap-2 text-sm text-slate-500 flex-wrap mb-2'>
                <Link href='/'>Home</Link>
                <Link href={process.env.NEXT_PUBLIC_GITHUB_SOURCE as string}>Source</Link>
                <Link href='/sign-out'>Sign Out</Link>

            </div>
           <PaystackSubcriptionButton isPro={isPro}/>
           {/* <Button onClick={handlePaystack}>
                Test Paystack
           </Button> */}
          

        </div>
    </div>
  )
}

export default ChatSidebar