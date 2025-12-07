// src/pages/Student/components/HeaderSection.tsx

import React from "react";

export const HeaderSection: React.FC = () => {
  return (
    <header className="relative w-full flex flex-col bg-[#f5f5f566] shadow-[0px_4px_4px_#00000040]">
      <nav
        className="w-full flex flex-row sm:flex-row items-center justify-between bg-[#3fbff666] rounded-[10px] px-4 sm:px-[9rem] sm:pr-[10rem] py-2 gap-4 sm:gap-0"
        role="navigation"
        aria-label="Main navigation"
      >
         {/* LEFT: Logo + UniVent */}
        <div className="flex items-center gap-4 sm:gap-8">
          <a
            href="/"
            className="flex w-20 sm:w-24 h-20 sm:h-24 items-center p-2 sm:p-5 bg-[#ffffff66] rounded-[20px] shadow-[5px_5px_5px_#00000040]"
            aria-label="UniVent Home"
          >
            <div className="relative flex-1 grow h-[55%]">
              <img
                className="absolute left-[10%]"
                alt="UniVent Logo"
                src="public/assets/vector-25.svg"
              />
            </div>
          </a>

          <div className="univent-text text-black text-xl sm:text-2xl md:text-3xl font-normal [font-family:'Jacques_Francois_Shadow-Regular',Helvetica]">
            UniVent
          </div>
        </div>

        {/* RIGHT: Student + Sign out buttons */}
        <div className="flex flex-row items-center gap-2 sm:flex-row sm:gap-6">
          <button
            className="flex w-auto sm:!w-[170px] h-[45px] sm:h-[49px] items-center justify-center gap-2.5 rounded-full shadow-[inset_4px_5px_6px_#00000040,0px_8px_13px_#00000040,inset_2px_-3px_4px_#00000040]"
            aria-label="Student profile"
            type="button"
          >
            <span className="font-bold text-sm sm:text-2xl [font-family:'Inter-Bold',Helvetica]">
              Student
            </span>
            <img className="w-5 h-5 sm:w-6 sm:h-6" src="public/assets/vector-26.svg" alt="" />
          </button>

          <button
            className="flex w-auto sm:!w-[120px] h-[45px] sm:h-[49px] items-center justify-center gap-2.5 rounded-full shadow-[inset_4px_5px_6px_#00000040,0px_8px_13px_#00000040,inset_2px_-3px_4px_#00000040] relative"
            aria-label="Sign out"
            type="button"
          >
            <img
              className="absolute inset-0 object-cover w-full h-full"
              alt=""
              src="public/assets/rectangle-1.svg"
            />
            <span className="relative text-sm font-bold sm:text-2xl">
              Sign out
            </span>
          </button>
        </div>
      </nav>

     {/* HERO SECTION */}
      <section
  className="hero-section flex flex-row lg:flex-row w-full items-center justify-between gap-4 lg:gap-8 
             p-4 sm:p-6 md:p-10 lg:px-[5%] 
             bg-[url('/frame-2.jpg')] bg-cover bg-center 
             bg-black/40 bg-blend-overlay 
             h-[500px] lg:h-[500px]" 
  aria-label="Hero section"
>
        <h1 className="text-center lg:text-left text-4xl sm:text-5xl md:text-6xl lg:text-7xl !text-[4rem] font-bold leading-tight [font-family:'Raleway-Bold',Helvetica] max-w-full lg:max-w-[1000px] text-white z-10 drop-shadow-2xl">
          Visează, creează, inovează!<br />
          Evenimente universitare
        </h1>

        <img
          className="z-10 object-cover w-full h-auto max-w-sm border-4 shadow-2xl sm:max-w-md md:max-w-lg lg:max-w-2xl rounded-2xl border-white/20"
          alt="University events showcase"
          src="public/assets/rectangle-6.svg"
        />
      </section>
    </header>
  );
};