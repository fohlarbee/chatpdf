import { db } from "@/lib/db";
import { userSubscriptions } from "@/lib/db/schema";
import { stripe } from "@/lib/stripe";
import { auth, currentUser } from "@clerk/nextjs/server";
import { eq } from "drizzle-orm";
import { NextResponse } from "next/server";


const return_url = process.env.NEXT_BASE_URL + '/';

 
export async function GET(){
    try{
        const {userId}  = await auth();
        const user = await currentUser();

        if (!userId) return NextResponse.json({error:'Unauthorized'}, {status:401});

        const _userSubscriptions = await db.select().from(userSubscriptions).where(eq(userSubscriptions.userId, userId));
        if (_userSubscriptions[0] && _userSubscriptions[0].stripeCustomerId){
            //Trying to cancel the subscription
            const stripeSesion = await stripe.billingPortal.sessions.create({
                customer:_userSubscriptions[0].stripeCustomerId,
                return_url
            });
            return NextResponse.json({url: stripeSesion.url}) 
        }

        // User first time trying to subscribe
        const stripeSession = await stripe.checkout.sessions.create({
            success_url: return_url,
            cancel_url: return_url,
            payment_method_types:['card',],
            mode:"subscription",
            billing_address_collection:"auto",
            customer_email:user?.emailAddresses[0].emailAddress,
            line_items:[
                {
                    price_data:{
                        currency:'ngn',
                        product_data:{
                            name:'ChatPDF Pro',
                            description:'Unlimited access to ChatPDF Pro features',
                            
                        },
                        unit_amount: 200000,
                        recurring:{
                            interval:'month'
                        }
                    },
                    quantity:1
                }
            ],
            metadata:{
                userId
            }
        });
        return NextResponse.json({url: stripeSession.url});
    }catch(err){
        console.log(err)
        if (err instanceof Error) return NextResponse.json({error:err.message}, {status:500});
    }
}