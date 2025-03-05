import { db } from "@/lib/db";
import { usersPaystackSubscriptions } from "@/lib/db/schema";
import { verifyPayment } from "@/lib/paystack";
import { NextResponse } from "next/server";

export async function POST(req:Request){
    try {
        const body = await req.json();
        // const bodyText = await req.text();

        console.log(body);
        const {reference} = body;
        // const {userId}  = await auth();
        // const user = await currentUser();
        // if (!userId) return NextResponse.json({error:'Unauthorized'}, {status:401});
    
        const verificationResult = await verifyPayment(reference);
        if (!verificationResult || verificationResult.status !== 'success') {
            return NextResponse.json({error: 'Payment verification failed'}, {status:400});
        }
        console.log('verificationResult', verificationResult);


        const currentDate = new Date();
            const paystackCurrentPeriodEnd = new Date(currentDate.setDate(currentDate.getDate() + 30));
        
            await db.insert(usersPaystackSubscriptions).values({
                id: verificationResult.id,
                userId:verificationResult.metadata.userId,
                paystackCustomerId: verificationResult.customer.id,
                paystackReference: reference,
                paystackStatus: verificationResult.status,
                paystackCurrentPeriodEnd: paystackCurrentPeriodEnd,
            });
        
            return NextResponse.json({ message: "Subscription successful", status: "success" });
    
       
        
    } catch (error) {
        console.error(error);
    }
}