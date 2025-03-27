import { clerkMiddleware, createRouteMatcher } from "@clerk/nextjs/server";
import { NextResponse } from "next/server";

// Define the protected routes
// const isProtectedRoute = createRouteMatcher([
//   '/sign-in(.*)',
//   '/sign-up(.*)',
//   // Add other protected routes here
// ]);

// Define the public routes
const isPublicRoute = createRouteMatcher([
  '/api/webhook', 'api/paystack/webhook',// Add your public route(s) here
]);

export default clerkMiddleware(async (auth, req) => {
  // If the route is public, allow access without authentication
  if (isPublicRoute(req)) {
    return NextResponse.next();
  }
 

//   // If the route is protected, redirect to sign-in if not authenticated
//   if (!isProtectedRoute(req)) {
//     return (await auth()).redirectToSignIn();
//   }

  return NextResponse.next();
});

export const config = {
  matcher: [
    // Protect the root route
    // '/',
    // Skip Next.js internals and all static files, unless found in search params
    '/((?!_next|[^?]*\\.(?:html?|css|js(?!on)|jpe?g|webp|png|gif|svg|ttf|woff2?|ico|csv|docx?|xlsx?|zip|webmanifest)).*)',
    // Always run for API routes
    '/(api|trpc)(.*)',
  ],
}; 