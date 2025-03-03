import { createPaymentLink } from "@/lib/paystack";
import { auth, currentUser } from "@clerk/nextjs/server";
import { NextResponse } from "next/server";

export async function POST() {
    const {userId}  = await auth();
    const user = await currentUser();
    if (!userId) return NextResponse.json({error:'Unauthorized'}, {status:401});
    const amount = 2000;
    const email = user?.emailAddresses[0].emailAddress as string;
    try {
        const resOBJ = await createPaymentLink({
            amount,
            email,
            metadata: {
                email,
            }
        });
        // console.log('paystack payment obj', resOBJ);
        return NextResponse.json(resOBJ, {status: 200});
    } catch (error) {
        console.error(error);
        return NextResponse.json('Error creating payment link', {status: 500});
}}