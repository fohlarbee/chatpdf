"use client";
import React, { useState } from 'react';
import ChatSidebar from '@/components/ChatSidebar';
import PDFViewer from '@/components/PDFViewer';
import ChatComponent from '@/components/ChatComponent';
import { DrizzleChat } from '@/lib/db/schema';

interface ChatPageClientProps {
  chats: DrizzleChat[];
  chatId: string;
  currentChat: DrizzleChat;
  isPro: boolean;
}

const ChatPageClient: React.FC<ChatPageClientProps> = ({ chats, chatId, currentChat, isPro }) => {
  const [sidebarVisible, setSidebarVisible] = useState(false);

  return (
    <div className='flex max-h-screen overflow-scroll'>
      <div className="flex w-full max-h-screen overflow-scroll">
        <div className={`md:flex-[1] max-w-xs z-30 ${sidebarVisible ? 'flex' : 'hidden'} md:flex z-50`}>
          <ChatSidebar chats={chats} chatId={chatId} isPro={isPro} />
        </div>
        <div className={`max-h-screen p-4 overflow-scroll md:flex-[5] hidden lg:flex ${sidebarVisible ? 'flex flex-[5]' : ''}`}>
          <PDFViewer pdfUrl={currentChat.pdfUrl} />
        </div>
        <div className="border-l-4 border-l-slate-200 flex-[3]">
          <ChatComponent chatId={chatId} setSidebarVisible={setSidebarVisible} sidebarVisible={sidebarVisible} />
        </div>
      </div>
    </div>
  );
};

export default ChatPageClient;