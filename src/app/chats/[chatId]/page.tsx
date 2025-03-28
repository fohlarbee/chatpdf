import { auth } from '@clerk/nextjs/server'
import {redirect} from 'next/navigation';
import React   from 'react';
import { db } from "@/lib/db";
import { chats, DrizzleChat } from '@/lib/db/schema';
import { eq } from 'drizzle-orm';
import ChatPageClient from '@/components/ChatPageClient';
import { checkPaystackSubscription } from '@/lib/paystackSubscription';

  
 


  interface AuthResponse {
    userId: string | null;
  }
  type Props  =  {
    params: Promise<{chatId: string}>;
  }

  /* eslint-disable */

  const ChatPage = async ({ params }: Props) => {
    const { chatId } = await params;
    const { userId }: AuthResponse = await auth();
    if (!userId) return redirect('/sign-in');

    const _chats = (await db.select().from(chats).where(eq(chats.userId, userId))) as DrizzleChat[];
    if (!_chats) return redirect('/');
    if (!_chats.find((chat) => chat.id === (chatId))) return redirect('/');

    const currentChat = _chats.find((chat) => chat.id === (chatId));
    if (!currentChat) return redirect('/');
    // const isPro = await checkSubscription();
    const isPro = await checkPaystackSubscription();
    return (
      <ChatPageClient
        chatId={(chatId)}
        chats={_chats}
        currentChat={currentChat}
        isPro={isPro}
      />
    );
  };

  // export const getServerSideProps: GetServerSideProps = async (context) => {
  //   const {chatId} = context.params as {chatId: string};

  //   return {
  //     props:{
  //       chatId
  //     }
  //   }
  // }
  
  export default ChatPage;