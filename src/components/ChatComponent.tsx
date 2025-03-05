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
    <div className='relative max-h-screen h-screen overflow-scroll bg-red-200' id='message-container'>
        {/* header */}
        <div className="sticky top-0 inset-x-0 p-2 bg-[#eee] h-fit flex flex-row z-50 border-b-4 shadow-lg border border-opacity-5">
              <AlignJustify className='ml-1 cursor-pointer md:hidden'
              onClick={handleSideBar}
              />
              <h3 className='sticky text-xl font-bold ml-2 w-full  md:text-center'> Chat</h3>
        </div>

        {/* messages list */}
        <div className=''>
          <MessageList messages={messages} isLoading={isLoading}/>

         

        </div>
        <form onSubmit={handleSubmit}
          className={`sticky z-50 overflow-hidden sm:fixed md:sticky md:z-50 bottom-2 mb-1 inset-x-0 p-2 py-4 bg-[#fff]`} >
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