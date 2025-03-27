import { pgEnum, pgTable, text, timestamp, varchar} from 'drizzle-orm/pg-core';

export const userSystemEnum = pgEnum('user_system_enum', ['system', 'user']);
export const chats = pgTable('chats', {
    id: varchar('id', {length:256}).primaryKey(),
    pdfName: text('pdf_name').notNull(),
    pdfUrl: text('pdf_url').notNull(),
    userId: varchar('user_id', {length:256}).notNull(),
    fileKey: text('file_key').notNull(),
    createdAt: timestamp('created_at').notNull().defaultNow()
    
});

export type DrizzleChat = typeof chats.$inferSelect;

export const messages = pgTable('messages', {
    id: varchar('id', {length:256}).primaryKey(),
    chatId: varchar('chat_id').references(() => chats.id).notNull(),
    content: text('content').notNull(), 
    role:userSystemEnum('role').notNull(),
    createdAt: timestamp('created_at').notNull().defaultNow()
});

export const userSubscriptions = pgTable('user_subscriptions', {
    id: varchar('id', {length:256}).primaryKey(),
    userId: varchar('user_id', {length:256}).notNull().unique(),
    stripeCustomerId: varchar('stripe_customer_id', {length:256}).notNull().unique(),
    stripeSubscriptionId: varchar('stripe_subscription_id', {length:256}).unique(),
    stripePriceId: varchar('stripe_price_id', {length:256}),
    stripeCurrentPeriodEnd: timestamp('stripe_current_period_end'),
});

export const usersPaystackSubscriptions = pgTable('users_paystack_subscriptions', {
    id: varchar('id', {length:256}).primaryKey(),
    userId: varchar('user_id', {length:256}).notNull().unique(),
    paystackReference: varchar('paystack_reference', {length:256}).notNull().unique(),
    paystackCustomerId: varchar('paystack_customer_id', {length:256}).notNull().unique(),
    // paystackSubscriptionId: varchar('paystack_subscription_id', {length:256}).notNull().unique(),
    paystackStatus: text('paystack_status').notNull(),
    paystackCurrentPeriodEnd: timestamp('paystack_current_period_end').notNull()
});