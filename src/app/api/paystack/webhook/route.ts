import { db } from "@/lib/db";
import { usersPaystackSubscriptions } from "@/lib/db/schema";
import { NextResponse } from "next/server";

export async function POST(req:Request){
    const {event, data:{status, reference, metadata, customer, id}} = await req.json();


    if (event != "charge.success")
        return NextResponse.json({ message: "Unsupported event", status: "error" });
    if (status != "success")
    return NextResponse.json({ message: "Unsuccessful transaction", status: "error" });

    const currentDate = new Date();
    const paystackCurrentPeriodEnd = new Date(currentDate.setDate(currentDate.getDate() + 30));

    await db.insert(usersPaystackSubscriptions).values({
        id,
        userId: metadata.userId,
        paystackCustomerId: customer.id,
        paystackReference: reference,
        paystackStatus: status,
        paystackCurrentPeriodEnd: paystackCurrentPeriodEnd,
    });

    return NextResponse.json({ message: "Subscription successful", status: "success" });

}