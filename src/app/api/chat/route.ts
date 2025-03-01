import {createDataStreamResponse,  Message,  streamText  } from 'ai'
import {  createCohere } from '@ai-sdk/cohere';
import { db } from '@/lib/db';
import { chats, messages as _messages } from '@/lib/db/schema';
import { eq } from 'drizzle-orm';
import { getContext } from '@/lib/context';
import { NextResponse } from 'next/server';

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
                temperature: 0.3,
                onStepFinish: async(partialCompletion) => {
                  aiResponse += partialCompletion.text;

                  // save user message to db
                 await db.insert(_messages).values({
                    chatId,
                    content: lastMessage.content,
                    role: 'user',
                  });
                },
                onFinish: async () => {
                  // save ai message to db

                 await db.insert(_messages).values({
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


// import { CohereClientV2 } from 'cohere-ai';
// import { NextResponse } from 'next/server';
// import { createDataStreamResponse } from 'ai';

// export const runtime = 'edge';

// const cohere = new CohereClientV2({
//   token: process.env.COHEREAI_API_KEY,
// });

// export async function POST(req: Request) {
//   try {
//     const { messages } = await req.json();
    
//     return createDataStreamResponse({
//       execute: async (dataStream) => {
//         // Optional: Write an initial message to the client
//         dataStream.writeData('initialized call\n');

//         // Start the chat stream from Cohere
//         const stream = await cohere.chatStream({
//           model: 'command-r7b-12-2024',
//           messages,
//           temperature: 0.7,
//         });

//         // Iterate over the streaming chat events
//         for await (const chatEvent of stream) {
//           if (chatEvent.type === 'content-delta') {
//             // Extract the text from the event delta (adjust the property path as needed)
//             const chunk = chatEvent.delta?.message?.content?.text;
//             // console.log('chunk', chunk);
//             if (chunk) {
//               // Write this chunk to the stream
//               dataStream.writeData(chunk);
//               console.log(dataStream.writeData(chunk));
//             }
//           }
//         }

//         // Write a final message when the stream is done
//         dataStream.writeData('\ncall completed');
//       },
//       onError: (error) => {
//         console.error('Streaming error:', error);
//         // Optionally, return a custom error message to the client
//         return error instanceof Error ? error.message : String(error);
//       },
//     });
//   } catch (error) {
//     console.error('POST handler error:', error);
//     throw new Error('Error getting streams');
//   }
// }
