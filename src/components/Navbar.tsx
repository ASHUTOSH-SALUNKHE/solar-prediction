"use client";

import Link from "next/link";
import { Sheet, SheetContent, SheetTrigger } from "@/components/ui/sheet";
import { Button } from "@/components/ui/button";
import { HomeIcon, DumbbellIcon, UserIcon, MenuIcon, ZapIcon } from "lucide-react";
import { UserButton, SignInButton, SignUpButton } from "@clerk/nextjs";
import { useAuth } from "@clerk/nextjs";

const Navbar = () => {
  const { isSignedIn } = useAuth();

  return (
    <header className="fixed top-0 left-0 right-0 z-50 bg-background/60 backdrop-blur-md border-b border-border py-3">
      <div className="container mx-auto flex items-center justify-between">
        {/* LOGO */}
        <Link href="/" className="flex items-center gap-2">
          <div className="p-1 bg-primary/10 rounded">
            <ZapIcon className="w-4 h-4 text-red-600" />
          </div>
          <span className="text-xl font-bold font-mono">
            <span className="text-red-600">Nitro</span>.ai
          </span>
        </Link>

        {/* DESKTOP NAVIGATION */}
        <nav className="hidden lg:flex items-center gap-5">
          {isSignedIn ? (
            <>
              <Link href="/" className="flex items-center gap-1.5 text-sm hover:text-primary transition-colors">
                <HomeIcon size={16} />
                <span>Home</span>
              </Link>

              <Link href="/generate-program" className="flex items-center gap-1.5 text-sm hover:text-primary transition-colors">
                <DumbbellIcon size={16} />
                <span>Generate</span>
              </Link>

              <Link href="/profile" className="flex items-center gap-1.5 text-sm hover:text-primary transition-colors">
                <UserIcon size={16} />
                <span>Profile</span>
              </Link>

              <Button asChild variant="outline" className="ml-2 border-red-600/50 text-red-600 hover:text-white hover:bg-primary/10">
                <Link href="/generate-program">Get Started</Link>
              </Button>

              <UserButton />
            </>
          ) : (
            <>
              <SignInButton>
                <Button variant={"outline"} className="border-primary/50 text-primary hover:text-white hover:bg-primary/10">
                  Sign In
                </Button>
              </SignInButton>

              <SignUpButton>
                <Button className="bg-primary text-primary-foreground hover:bg-primary/90">
                  Sign Up
                </Button>
              </SignUpButton>
            </>
          )}
        </nav>

        {/* MOBILE NAVIGATION */}
        <div className="lg:hidden">
          <Sheet>
            <SheetTrigger>
              <MenuIcon className="h-6 w-6" />
            </SheetTrigger>
            <SheetContent side="left" className="p-6">
              <div className="flex flex-col gap-6 mt-10">
                {isSignedIn ? (
                  <>
                    <UserButton />
                    <Link href="/" className="flex items-center gap-2 text-lg font-semibold">
                      <HomeIcon size={18} />
                      Home
                    </Link>

                    <Link href="/generate-program" className="flex items-center gap-2 text-lg font-semibold">
                      <DumbbellIcon size={18} />
                      Generate
                    </Link>

                    <Link href="/profile" className="flex items-center gap-2 text-lg font-semibold">
                      <UserIcon size={18} />
                      Profile
                    </Link>

                    <Button asChild variant="outline" className="border-red-600/50 text-red-600 hover:text-white hover:bg-primary/10">
                      <Link href="/generate-program">Get Started</Link>
                    </Button>

                    
                  </>
                ) : (
                  <>
                    <SignInButton>
                      <Button variant="outline" className="border-primary/50 text-primary hover:text-white hover:bg-primary/10 w-full">
                        Sign In
                      </Button>
                    </SignInButton>

                    <SignUpButton>
                      <Button className="bg-primary text-primary-foreground hover:bg-primary/90 w-full">
                        Sign Up
                      </Button>
                    </SignUpButton>
                  </>
                )}
              </div>
            </SheetContent>
          </Sheet>
        </div>
      </div>
    </header>
  );
};

export default Navbar;
