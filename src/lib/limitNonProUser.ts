import { auth } from "@clerk/nextjs/server";
import { checkPaystackSubscription } from "./paystackSubscription";
import { db } from "./db";
import { chats } from "./db/schema";
import { eq } from "drizzle-orm";

export async function limitNonProUser() {
    const {userId} = await auth();
    if (!userId) return false;
    const isProUser = await checkPaystackSubscription();
    if (!isProUser) {
        const noOfUploads = await db.$count(chats,eq(chats.userId, userId));
        console.log(`Number of uploads: ${noOfUploads}`);
        if (noOfUploads >= 3) { 
          return true;
        } 
    }
    return false;
}