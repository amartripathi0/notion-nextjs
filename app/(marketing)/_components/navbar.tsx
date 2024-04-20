"use client";
import { useScrollTop } from '@/hooks/use-scroll-top'
import { cn } from '@/lib/utils';
import React from 'react'
import { Logo } from './logo';
import { ModeToggle } from '@/components/mode-toggle';
import { useConvexAuth } from 'convex/react';
import { SignInButton, UserButton } from '@clerk/clerk-react';
import { Button } from '@/components/ui/button';
import { Spinner } from '@/components/spinner';
import Link from 'next/link';

function Navbar() {
  const {isAuthenticated , isLoading} = useConvexAuth()
  const scrolled = useScrollTop()
  return (
    <nav
    className= {
      cn("z-50 fixed top-0 dark:bg-[#1F1F1F] bg-background flex items-center w-full p-6",
      scrolled && "border-b shadow-sm"
      )}
    >
      <Logo/>
      <div className="md:ml-auto md:justify-end justify-between w-full flex items-center gap-x-2">
          {isLoading && <Spinner />}
          {!isAuthenticated && !isLoading && (
            <>
            <SignInButton>
              <Button variant={"ghost"} size={"sm"}>
                Log in
              </Button>
            </SignInButton>

            <SignInButton>
              <Button size={"sm"}>
                Get Notion free
              </Button>
            </SignInButton>

          </>
          )}
          {
            isAuthenticated && !isLoading && 
            <>
            <Button variant={"ghost"} size={"sm"} asChild>
                <Link href = '/documents'>
                Enter Notion
                </Link>

            </Button>
            <UserButton afterSignOutUrl='/'/>
            </>
          }
        <ModeToggle/>
      </div>
    </nav>
  )
}

export default Navbar
