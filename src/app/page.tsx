"use client"

import TerminalOverlay from "@/components/TerminalOverlay";
import { Button } from "@/components/ui/button";
import UserPrograms from "@/components/UserPrograms";
import { ArrowRightIcon } from "lucide-react";
import Link from "next/link";

const HomePage = () => {

  

  return (
    <div className="flex flex-col min-h-screen text-foreground overflow-hidden">
      <section className="relative z-10 py-24 flex-grow">
        <div className="container mx-auto px-4">
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-center relative">
            {/* CORNER DECARATION */}
            <div className="absolute -top-10 left-0 w-40 h-40 border-l-2 border-t-2 " />

            {/* LEFT SIDE CONTENT */}
            <div className="lg:col-span-7 space-y-8 relative text-center lg:text-left lg:ml-3">
              <h1 className="text-5xl sm:text-6xl md:text-7xl lg:text-6xl font-bold tracking-tight ">
                <div>
                  <span className="text-foreground">Power</span>
                </div>
                <div>
                  <span className="text-orange-600">Your Home</span>
                </div>
                <div className="pt-2">
                  <span className="text-foreground">With Predictive</span>
                </div>
                <div className="pt-2">
                  <span className="text-foreground">Solar </span>
                  <span className="text-orange-600">Intelligence</span>
                </div>
              </h1>

              {/* SEPERATOR LINE */}
              <div className="h-px w-full bg-gradient-to-r from-primary via-secondary to-primary opacity-50 "></div>

              <p className="text-lg sm:text-xl text-muted-foreground lg:w-2/3">
                  Talk to our AI assistant and get personalized solar panel recommendations, cost estimates, and energy savings tailored to your home's conditions.
              </p>


              {/* STATS */}
              <div className="flex items-center gap-10 py-6 font-mono justify-center xl:justify-normal">
                <div className="flex flex-col">
                  <div className="text-2xl text-red-600">HIGH</div>
                  <div className="text-xs uppercase tracking-wider">ACCURACY</div>
                </div>
                <div className="h-12 w-px bg-gradient-to-b from-transparent via-border to-transparent"></div>
                <div className="flex flex-col">
                  <div className="text-2xl text-red-600">3min</div>
                  <div className="text-xs uppercase tracking-wider">GENERATION</div>
                </div>
                <div className="h-12 w-px bg-gradient-to-b from-transparent via-border to-transparent"></div>
                <div className="flex flex-col">
                  <div className="text-2xl text-red-600">100%</div>
                  <div className="text-xs uppercase tracking-wider">PERSONALIZED</div>
                </div>
              </div>

              {/* BUTTON */}
              <div className="flex flex-col sm:flex-row gap-4 pt-6 xl:pt-0 justify-center lg:justify-normal">
                <Button
                  size="lg"
                  asChild
                  className="overflow-hidden bg-orange-600 text-primary-foreground px-8 py-6 text-lg font-medium"
                >
                  <Link href={"/generate-program"} className="flex items-center  font-mono">
                    Build Your Program
                    <ArrowRightIcon className="ml-2 size-5" />
                  </Link>
                </Button>
              </div>
            </div>

            {/* RIGHT SIDE CONTENT */}
            <div className="lg:col-span-5 relative mt-3 xl:mt-0">
              {/* CORNER PIECES */}
              <div className="absolute -inset-4 pointer-events-none">
                <div className="absolute top-0 left-0 w-16 h-16 border-l-2 border-t-2 border-border" />
                <div className="absolute top-0 right-0 w-16 h-16 border-r-2 border-t-2 border-border" />
                <div className="absolute bottom-0 left-0 w-16 h-16 border-l-2 border-b-2 border-border" />
                <div className="absolute bottom-0 right-0 w-16 h-16 border-r-2 border-b-2 border-border" />
              </div>

              {/* IMAGE CONTANINER */}
              <div className="relative aspect-square w-full max-w-xl sm:max-w-xl md:max-w-xl lg:max-w-xl xl:max-w-xl mx-auto flex justify-center">

                <div className="relative overflow-hidden rounded-lg bg-cyber-black">
                  <img
                    src="/image.png"
                    alt="AI Fitness Coach"
                    className="size-full object-cover object-center"
                  />

                  {/* SCAN LINE */}
                  <div className="absolute inset-0 bg-[linear-gradient(transparent_0%,transparent_calc(50%-1px),var(--cyber-glow-primary)_50%,transparent_calc(50%+1px),transparent_100%)] bg-[length:100%_8px] animate-scanline pointer-events-none" />

                  {/* DECORATIONS ON TOP THE IMAGE */}
                  <div className="absolute inset-0 pointer-events-none">
                    <div className="absolute top-1/3 left-1/3 w-1/3 h-1/3 border border-primary/40 rounded-full" />

                    {/* Targeting lines */}
                    <div className="absolute top-1/2 left-0 w-1/4 h-px bg-purple-300/50" />
                    <div className="absolute top-1/2 right-0 w-1/4 h-px bg-primary/50" />
                    <div className="absolute top-0 left-1/2 h-1/4 w-px bg-primary/50" />
                    <div className="absolute bottom-0 left-1/2 h-1/4 w-px bg-primary/50" />
                  </div>

                  
                </div>

                {/* TERMINAL OVERLAY */}
                
              </div>
              <TerminalOverlay />
            </div>
          </div>
        </div>
      </section>

      
    </div>
  );
};
export default HomePage;