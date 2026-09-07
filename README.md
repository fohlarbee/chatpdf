# ChatPDF

ChatPDF is a Next.js application that lets users chat with their PDF documents using a RAG (Retrieval-Augmented Generation) system powered by Google Gemini. Built with Next.js, Clerk for authentication, and Stripe for payments and subscriptions.

## Getting Started

Clone the repository and install dependencies:

```bash
git clone https://github.com/fohlarbee/chatpdf.git
cd chatpdf
npm install
```

Run the development server:

```bash
npm run dev
```

Open [http://localhost:3000](http://localhost:3000) to view the app.

## Environment Variables

```env
NEXT_PUBLIC_CLERK_FRONTEND_API=<your-clerk-frontend-api>
CLERK_API_KEY=<your-clerk-api-key>
STRIPE_SECRET_KEY=<your-stripe-secret-key>
STRIPE_WEBHOOK_SECRET=<your-stripe-webhook-secret>
GEMINI_API_KEY=<your-gemini-api-key>
PINECONE_API_KEY=<your-pinecone-api-key>
PINECONE_ENVIRONMENT=<your-pinecone-environment>
```

## Features

- Chat with PDF documents using a Gemini-powered RAG pipeline
- User authentication with Clerk
- Payment and subscription management with Stripe
- PDF upload and viewing

## Database Migrations

```bash
npx drizzle-kit studio
npx drizzle-kit push
npx drizzle-kit generate
npx drizzle-kit migrate
```

## Deploy

Deploy easily on [Vercel](https://vercel.com/new?utm_medium=default-template&filter=next.js&utm_source=create-next-app&utm_campaign=create-next-app-readme).

## Contributing

Contributions are welcome — open an issue or submit a pull request.

## License

MIT
