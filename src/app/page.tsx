// import Image from "next/image";

import { Button } from "@/components/ui/button";
import { UserButton } from "@clerk/nextjs";
import { auth,  } from "@clerk/nextjs/server";
import Link from "next/link";
import { ArrowRightIcon, LogIn } from 'lucide-react'
import FileUpload from "@/components/FileUpload";
import { checkSubscription } from "@/lib/subscriptions";
import SubcriptionButton from "@/components/SubcriptionButton";
import { db } from "@/lib/db";
import { chats } from "@/lib/db/schema";
import { eq } from "drizzle-orm";
import Image from "next/image";

export default async function Home() {
  const {userId} = await auth();
  const isAuth = !!userId;
  const isPro = await checkSubscription();
  let firstChat;
  if (userId){
    firstChat = await db.select()
    .from(chats)
    .where(eq(chats.userId, userId));
    if (firstChat) firstChat = firstChat[0];
  }

  
  return (
   <div className="w-screen min-h-screen bg-gradient-to-r from-pink-300 via-purple-300 to-indigo-400">
      <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2">
          <div className="flex flex-col items-center text-center">
              <div className="flex items-center text-center flex-col ">
                <h1 className="p-4 text-5xl font-semibold text-center">Chat with any PDF</h1>
                <UserButton afterSwitchSessionUrl="/"/>
              </div>

              <div className="flex mt-2">
               
                   {isAuth && firstChat && (
                        <Link href={`/chats/${firstChat.id}`}> 
                         <Button> Go to Chats <ArrowRightIcon className="ml-2"/></Button>
                        </Link>
                    )}
                     {isAuth && ( <div className="ml-3"><SubcriptionButton isPro={isPro}/></div>)}

              </div>
              <p className="max-w-xl mt-2 text-lg text-slate-600">Join millions of students, research experts and proffessionals to instantly answer questions and understand research with AI</p>
              <div className=" w-full mt-4">
                {isAuth ? (<FileUpload/>)
                :(
                  <Link href='/sign-in'>
                    <Button>Login to get started
                      <LogIn className="w-4 h-4 ml-2"/>
                    </Button>
                  </Link>
                )
                }
                
                <div className="w-full mt-4 self-center border rounded-lg shadow-lg hidden md:flex">
                   <Image alt="" src='/HeroSection_image.png' width={600} height={250}
                    className="w-full rounded-lg border border-white border-opacity-5 shadow-lg"
                   />
                </div>
                <div className="mt-4 text-center">
                  <p className="text-sm text-gray-600">Developer</p>
                  <Link href={process.env.PORTFOLIO_URL as string}>
                    <p className="text-blue-600 hover:underline">@fohlarbee</p>
                  </Link>
               </div>


              </div>
          </div> 
      </div>
   </div>
  );
}
