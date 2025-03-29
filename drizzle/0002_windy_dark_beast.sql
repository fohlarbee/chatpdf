ALTER TABLE "chats" ALTER COLUMN "id" DROP DEFAULT;--> statement-breakpoint
ALTER TABLE "messages" ALTER COLUMN "id" DROP DEFAULT;--> statement-breakpoint
ALTER TABLE "messages" ALTER COLUMN "chat_id" SET DATA TYPE varchar;--> statement-breakpoint
ALTER TABLE "user_subscriptions" ALTER COLUMN "id" DROP DEFAULT;--> statement-breakpoint
ALTER TABLE "users_paystack_subscriptions" ALTER COLUMN "id" DROP DEFAULT;