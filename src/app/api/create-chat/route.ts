import { db } from "@/lib/db";
import { chats } from "@/lib/db/schema";
import { loadAzureBlobIntoPinecone } from "@/lib/pinecone";
import { auth } from "@clerk/nextjs/server";
import { NextResponse } from "next/server";
import {v4 as uuid4} from 'uuid';

export async function POST(req: Request) {
    const {userId} = await auth();
    if(!userId){
        return NextResponse.json({error:"Unauthorized"}, {status: 401});
    }
    try {
        const body = await req.json();
        const {fileName, fileKey, pdfUrl} = body;
         await loadAzureBlobIntoPinecone(fileName);  
         const chatId = await db.insert(chats).values({
            id: uuid4(),
            fileKey,
            pdfName: fileName,
            pdfUrl,
            userId,
         }).returning({insertedId: chats.id});
        return NextResponse.json({chatId: chatId[0].insertedId}, {status: 200});  
    } catch (error) {
        if (error instanceof Error){ 
            console.log(error)
            return NextResponse.json(error.message, {status: 500});
        }
    }

}

