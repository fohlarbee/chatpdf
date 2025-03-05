import { auth } from "@clerk/nextjs/server";
import { db } from "./db";
import { usersPaystackSubscriptions } from "./db/schema";
import { eq } from "drizzle-orm";


const DAY_IN_MS = 1000 * 60 * 60 * 24;
export const checkPaystackSubscription = async () => {
    const {userId} = await auth();
    if (!userId) return false;

    const _userSubscription  = await db
    .select()
    .from(usersPaystackSubscriptions)
    .where(eq(usersPaystackSubscriptions.userId, userId));

    if (!_userSubscription[0]) return false;

    const userSubscription = _userSubscription[0];

    const isValid = 
    userSubscription.paystackReference &&
    userSubscription.paystackCurrentPeriodEnd &&
     (
        userSubscription.paystackCurrentPeriodEnd
        .getTime() + DAY_IN_MS > Date.now());

    return !!isValid;
}