import { db } from "@/lib/db";
import { userSubscriptions } from "@/lib/db/schema";
import { stripe } from "@/lib/stripe";
import { eq,  } from "drizzle-orm";
import { headers } from "next/headers";
import { NextResponse } from "next/server";
import Stripe from "stripe";


export async function POST(req: Request){
    const body = await req.text();
    const signature = (await headers()).get('Stripe-Signature') as string;
    let event: Stripe.Event;

    try {
        event = stripe.webhooks.constructEvent(
            body,
            signature, 
            process.env.STRIPE_WEBHOOK_SECRET as string
        );
    } catch (error) {
        console.log('error', error);
        return NextResponse.json({error: 'Webhook Error'}, {status:400});
        
    }

    const session = event.data.object as Stripe.Checkout.Session;

    // New Subscription created
    if (event.type === 'checkout.session.completed'){
        const subscription = await stripe.subscriptions
        .retrieve(
            session.subscription as string
        );
        if (!session?.metadata?.userId) 
            return NextResponse
                .json({error:'User not found'}, {status:400});
        await db.insert(userSubscriptions).values({
            userId: session.metadata.userId,
            stripeCustomerId: subscription.customer as string,
            stripeSubscriptionId: subscription.id,
            stripePriceId: subscription.items.data[0].price.id,
            stripeCurrentPeriodEnd: new Date(subscription.current_period_end * 1000),                    
        });
        
    }

    // Subscription renewed
    if (event.type === 'invoice.payment_succeeded'){
        const subscription = await stripe.subscriptions
                                .retrieve(
                                    session.subscription as string,
                                )
        await db.update(userSubscriptions).set({
            stripeCurrentPeriodEnd: new Date(subscription.current_period_end * 1000),
            stripePriceId: subscription.items.data[0].price.id
        }).where(eq(userSubscriptions.stripeSubscriptionId, subscription.id));
    }

    return NextResponse.json(null, {status: 200});
}