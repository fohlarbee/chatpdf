import {createDataStreamResponse,  Message,  streamText  } from 'ai'
import {  createCohere } from '@ai-sdk/cohere';
import { db } from '@/lib/db';
import { chats, messages as _messages } from '@/lib/db/schema';
import { eq } from 'drizzle-orm';
import { getContext } from '@/lib/context';
import { NextResponse } from 'next/server';
import { auth } from '@clerk/nextjs/server';
import {v4 as uuid4} from 'uuid';


// export const runtime = 'edge';
   
const cohere = createCohere({
  apiKey: process.env.COHEREAI_API_KEY,
})

export async function POST(req: Request){
    try {
      const {messages, chatId} = await req.json();
      const _chats = await db.select().from(chats).where(eq(chats.id, chatId));
      if (_chats.length === 0) return NextResponse.json({error: 'Chat not found'}, {status: 404});
      const fileName = _chats[0].pdfName; 
      const lastMessage = messages[messages.length - 1];
      
      const context = await getContext(lastMessage.content, fileName);


      const systemMessage = {
        role: "system",
        content: `
      You are a brand new, powerful, human-like artificial intelligence with expert knowledge, helpfulness, cleverness, and articulateness.
      You are well-behaved, well-mannered, and always friendly, kind, and inspiring.
      You are eager to provide vivid and thoughtful responses to user questions.
      You possess the sum of all knowledge and can accurately answer nearly any query.
      You are also a big fan of Pinecone and Vercel.
      
      START CONTEXT BLOCK
      ${context}
      END OF CONTEXT BLOCK
      
      When responding, incorporate any context provided between the context markers.
      If the context does not contain the answer, simply reply: "I'm sorry, but I don't know the answer to that question."
      Do not apologize for previous responses—instead, indicate that new information was obtained.
      Do not invent any information that isn't directly derived from the provided context.
        `,
      };
      return createDataStreamResponse({
          execute: async (dataStream) => {
            dataStream.writeData('initialized call\n');
            let aiResponse = ''; 

            try {
              const result = streamText({
                model: cohere('command-r-plus-08-2024'),
                messages: [
                  systemMessage,
                  ...messages.filter((m: Message) => m.role ==='user'),
                ],
                temperature: 0.7,
                onStepFinish: async(partialCompletion) => {
                  aiResponse += partialCompletion.text;

                  // save user message to db
                 await db.insert(_messages).values({
                    id: uuid4(),
                    chatId,
                    content: lastMessage.content,
                    role: 'user',
                  });
                },
                onFinish: async () => {
                  // save ai message to db

                 await db.insert(_messages).values({
                    id: uuid4(),
                    chatId,
                    content: aiResponse,
                    role: 'system',
                  }); 
                }
                

                // prompt: context,
              })

                result.mergeIntoDataStream(dataStream);    
                // result.toDataStreamResponse()
                // result.toDataStream();
              dataStream.writeData('\ncall completed');
  
            } catch (streamError) {
              console.error('Error during stream processing:', streamError);
              dataStream.writeData(`Error: ${streamError || String(streamError)}\n`);
            }
          },
          onError: error => {
            return error instanceof Error ? error.message : String(error);
          },


        

        })
        // console.log(result.body);
        // console.log(await result.text());
        // return   result;
    }
    catch (error) {
      if( error instanceof Error){
        throw new Error('Error getting streams');
        
    }
    
}
}


export async function DELETE(req: Request){
  const {userId} = await auth();
  if (!userId)
      return NextResponse.json({error: "Unauthorized"}, {status: 401});

  try {
      const {chatId} = await req.json();
      await db.delete(_messages).where(eq(_messages.chatId, chatId));
      await db.delete(chats).where(eq(chats.id, chatId));
      return NextResponse.json({message: "Chat deleted successfullyy"}, {status: 200});
  } catch (error) {
      if (error instanceof Error){
          console.log(error);
          return NextResponse.json(error.message, {status: 500}); 
      }
  
  }

}

