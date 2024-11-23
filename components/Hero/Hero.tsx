import React from "react";
import { Button } from "../ui/button";
import Link from "next/link";
import "./hero.css";
import MotionDiv from "../client/Motion_div";
const Hero = () => {
  return (
    <section className="w-full min-h-screen flex flex-col justify-center items-center text-center relative dark:bg-dot-white/[0.2] bg-dot-black/[0.2]">
      <div className="py-7 px-8 relative w-full flex justify-center">
        <div className="relative px-6">
          <MotionDiv
            className=""
            initial_opacity={0}
            initial_y={40}
            final_opacity={1}
            final_y={0}
            transition_delay={0}
            transition_duration={0.4}
            transition_type="easeInOut"
            once={true}
          >
            <h1 className="text-5xl lg:text-7xl font-extrabold tracking-wide leading-[3.7rem] py-2 text_glow sticky z-[12]">
              Agile Project Manager
            </h1>
          </MotionDiv>

          <div className="absolute h-screen left-0 top-1/2 y_translate border-l border-primary border-dashed" />
          <div className="absolute h-screen right-0 top-1/2 y_translate border-l border-primary border-dashed" />
        </div>
        <div className="absolute w-full top-0 left-0 border-t border-foreground/20 border-dashed" />
        <div className="absolute w-full bottom-0 left-0 border-t border-primary border-dashed" />
      </div>
      <div className="absolute w-full h-full fade z-10 pointer-events-none" />
      <p className="mt-4 text-muted-foreground tracking-wide">
        Say goodbye to bullet points and excel sheets.
      </p>
      <p className="text-xl w-full px-20">
        <span className="text-primary">Create</span>,{" "}
        <span className="text-primary">manage</span>, and{" "}
        <span className="text-primary">collaborate</span> on projects with{" "}
        <span className="text-primary">ease</span>.
      </p>
      <Button asChild className="mt-4 border-primary" variant="outline">
        <Link href={"/sign-in"}>Sign in</Link>
      </Button>
    </section>
  );
};

export default Hero;
