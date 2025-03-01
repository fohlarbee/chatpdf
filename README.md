# ChatPDF

ChatPDF is a Next.js application that allows users to chat and interact with PDF documents. This project leverages the power of Next.js, Clerk for authentication, and Stripe for handling payments and subscriptions.

## Getting Started

First, clone the repository and install the dependencies:

```bash
git clone https://github.com/fohlarbee/chatpdf.git
cd chatpdf
npm install
# or
yarn install
# or
pnpm install
# or
bun install
```

Then, run the development server:

```bash
npm run dev
# or
yarn dev
# or
pnpm dev
# or
bun dev
```

Open [http://localhost:3000](http://localhost:3000) with your browser to see the result.

You can start editing the page by modifying `app/page.tsx`. The page auto-updates as you edit the file.

## Environment Variables

Make sure to set up the following environment variables in your `.env` file:

```env
NEXT_PUBLIC_CLERK_FRONTEND_API=<your-clerk-frontend-api>
CLERK_API_KEY=<your-clerk-api-key>
STRIPE_SECRET_KEY=<your-stripe-secret-key>
STRIPE_WEBHOOK_SECRET=<your-stripe-webhook-secret>
COHEREAI_API_KEY=<your-cohereai-api-key>
PINECONE_API_KEY=<your-pinecone-api-key>
PINECONE_ENVIRONMENT=<your-pinecone-environment>
```

## Features

- User authentication with Clerk
- Payment processing with Stripe
- Chat functionality with AI responses
- PDF document interaction and viewing
- Subscription management

## Learn More

To learn more about the technologies used in this project, take a look at the following resources:

- [Next.js Documentation](https://nextjs.org/docs) - learn about Next.js features and API.
- [Clerk Documentation](https://clerk.dev/docs) - learn about Clerk for authentication.
- [Stripe Documentation](https://stripe.com/docs) - learn about Stripe for payment processing.
- [Cohere Documentation](https://docs.cohere.ai) - learn about Cohere for AI responses.
- [Pinecone Documentation](https://docs.pinecone.io) - learn about Pinecone for vector database.

## Deploy on Vercel

The easiest way to deploy your Next.js app is to use the [Vercel Platform](https://vercel.com/new?utm_medium=default-template&filter=next.js&utm_source=create-next-app&utm_campaign=create-next-app-readme) from the creators of Next.js.

Check out our [Next.js deployment documentation](https://nextjs.org/docs/app/building-your-application/deploying) for more details.

## Database Migrations

To manage database migrations, you can use Drizzle Kit:

```bash
npx drizzle-kit studio
npx drizzle-kit push
npx drizzle-kit generate
npx drizzle-kit migrate
```

## Contributing

Contributions are welcome! Please open an issue or submit a pull request if you have any improvements or bug fixes.

## License

This project is licensed under the MIT License.

<!-- ```bash
npx drizzle-kit studio
npx drizzle-kit push
npx drizzle-kit generate
npx drizzle-kit migrate-->

<!--Why does the
    const loader = new PDFLoader(file);
    const loadedDocs = await loader.load();
    don't read a file of 'Dad's neco result' or 'Mum's neco result' type -->


``` -->
