"use client";
import React from 'react';
import { DrizzleChat } from '@/lib/db/schema';
import Link from 'next/link';
import { Button } from './ui/button';
import { EllipsisIcon, Loader2, MessageCircle, PlusCircle, Trash2 } from 'lucide-react';
import { cn } from '@/lib/utils';
import PaystackSubcriptionButton from './PaystackSubscriptionBtn';
import axios from 'axios';
import toast from 'react-hot-toast';
import { Dialog, DialogClose, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle } from './ui/dialog';
import { Popover, PopoverContent, PopoverTrigger } from './ui/popover';


type Props = {
    chats: DrizzleChat[];
    chatId: string;
    isPro: boolean;
}

const ChatSidebar = ({chats, chatId, isPro}: Props) => {
    const [loading, setLoading] = React.useState(false);
    const [open, setOpen] = React.useState(false);

   
    const handleDeleteChat = async (chatId: string) => {
        try {
            setLoading(true);
            const res = await axios.delete('/api/chat', {data: {chatId}});
            toast.success(res.data.message);
            window.location.reload();

        } catch (error) {
            if (error instanceof Error)
              toast.error(error.message || 'An error occurred');
        }
        finally{
            setLoading(false);
        }
    }
   
  return (
    <>
     <Dialog open={open} onOpenChange={setOpen}>
              <DialogContent>
                <DialogHeader>
                    <DialogTitle>Are you sure you want to delete this chat?</DialogTitle>
                    <DialogDescription>
                        Both the chat and the messages will be deleted permanently.
                    </DialogDescription>
                   
                </DialogHeader>
                <DialogFooter className='sm:justify-end'>
                        <DialogClose  asChild>
                             <Button type='button' variant='destructive' onClick={() => handleDeleteChat(chatId)}>Delete</Button>


                        </DialogClose>
                    </DialogFooter>
              </DialogContent>
          </Dialog>
    <div className='w-full h-screen p-4 text-gray-200 bg-gray-900 sticky z-500 '>
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
                    className={cn('rounded-lg p-3 text-slate-300 flex items-center group', {
                        'bg-blue-600 text-[#fff]': chat.id === chatId,
                        'hover:text-[#fff]': chat.id !== chatId
                    })}
                    >
                        <MessageCircle className='mr-2'/>
                        <p className='w-full overflow-hidden text-sm truncate whitespace-nowrap text-ellipsis flex justify-between'>
                            {`${chat.pdfName.slice(0, 20)}...`}
                            {loading && chat.id === chatId
                            ? <Loader2 className='size-6 ml-2 animate-spin' />
                            : (chats.indexOf(chat) !== 0 && (
                                <Popover>
                                     <PopoverTrigger>
                                        <EllipsisIcon className='ml-auto text-gray-200 opacity-0 group-hover:opacity-100 transition-opacity 
                                        duration-200 size-5'/>
                                     </PopoverTrigger>
                                     <PopoverContent className='w-32'>
                                        <div className='flex justify-center w-full px-3'>
                                            <div
                                            onClick={() => setOpen(true)}
                                            className='flex justify-between cursor-pointer'>
                                                <Trash2 
                                                className={cn('text-red-500 size-5 mr-2 hover:opacity-100 text-left flex', {
                                                    'animate-spin': loading && chat.id === chatId
                                                })} />
                                            <p className='hover:bg-[#fff] text-red-500'>Delete</p>
                                            </div>
                                           

                                        </div>
                                        
                                     </PopoverContent>

                                </Popover>
                                // <Trash2 onClick={() => setOpen(true)}
                                //  className={cn('ml-2 text-red-300 inline-flex opacity-50 hover:opacity-100', {
                                //      'animate-spin': loading && chat.id === chatId
                                //  })} color='#ff6347'/>
                            ))}
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
    
    </>

  )
}

export default ChatSidebar