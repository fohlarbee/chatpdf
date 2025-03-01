"use client";
import React from 'react'
import {useChat} from '@ai-sdk/react'
import { Input } from './ui/input';
import { Button } from './ui/button';
import { AlignJustify, Send } from 'lucide-react';
import MessageList from './MessageList';
import { useQuery } from '@tanstack/react-query';
import axios from 'axios';
import {Message} from 'ai'

const ChatComponent = ({chatId, setSidebarVisible, sidebarVisible}: {chatId: number, setSidebarVisible: (visible: boolean) => void, sidebarVisible:boolean}) => {
  const {data, isLoading} = useQuery({
    queryKey: ['chat', chatId],
    queryFn: async () => {
      const response = await axios.post<Message[]>('/api/get-messages', {chatId});
      return response.data;
    }
  });
  const {handleInputChange, handleSubmit, input, messages} = useChat({
    api:'/api/chat',
    body:{
      chatId
    },
    initialMessages:data || []
  });

  const handleSideBar = () => {
    setSidebarVisible(!sidebarVisible)
  }

  React.useEffect(() => {
    const messageContainer = document.getElementById('message-container');
    if (messageContainer){
      messageContainer.scrollTo({
        top: messageContainer.scrollHeight,
        behavior: 'smooth' 
      });
    }
    
  },[messages])

  return (
    <div className='relative max-h-screen h-screen overflow-scroll' id='message-container'>
        {/* header */}
        <div className="sticky top-0 inset-x-0 p-2 bg-[#fff] h-fit flex flex-row">
              <AlignJustify className='ml-1 cursor-pointer'
              onClick={handleSideBar}
              />
              <h3 className='text-xl font-bold ml-2'> Chat</h3>
        </div>

        {/* messages list */}
        <MessageList messages={messages} isLoading={isLoading}/>

        <form onSubmit={handleSubmit}
        className={`fixed sm:fixed md:absolute bottom-0 mb-1 z-20 inset-x-0 p-2 bg-[#fff] py-4`} >
          <div className="flex">
              <Input
            value={input}
            onChange={handleInputChange}
            placeholder='Ask any question...'
            className='w-full'
            />
            <Button
          className='bg-blue-600 ml-2'
            >
            <Send className='h-4 w-4'/>
            </Button>
          </div>
        </form>
    </div>
  )
}

export default ChatComponent