// src/components/layout/HeaderSection.tsx

import React from 'react';
import { User } from 'lucide-react';
import { cn } from '@/utils/cn';

export const HeaderSection: React.FC = () => {
  return (
    <header className="relative flex flex-col w-full bg-page shadow-md">
      <nav
        className="w-full flex flex-row sm:flex-row items-center justify-between bg-blue-500/40 rounded-[10px] px-4 sm:px-8 py-1 gap-4 sm:gap-0"
        role="navigation"
        aria-label="Main navigation"
      >
        {/* LEFT: Logo + UniVent */}
        <div className="flex items-center gap-4 sm:gap-8">
          <a
            href="/"
            className="flex w-16 sm:w-20 h-16 sm:h-20 items-center p-2 sm:p-5 bg-card/40 rounded-[20px] shadow-lg"
            aria-label="UniVent Home"
          >
            <div className="relative flex-1 grow h-[55%]">
              <img
                className="absolute left-[10%]"
                alt="UniVent Logo"
                src="/assets/vector-25.svg"
              />
            </div>
          </a>

          <div className="text-xl font-normal text-primary sm:text-2xl md:text-3xl">
            UniVent
          </div>
        </div>

        {/* RIGHT: Student + Sign out buttons */}
        <div className="flex flex-row items-center gap-2 sm:flex-row sm:gap-6">
          <button
            className={cn('btn btn-secondary', 'w-auto sm:!w-[170px] h-10 sm:h-11 rounded-full')}
            aria-label="Student profile"
            type="button"
          >
            <span className="font-bold text-sm sm:text-2xl">
              Student
            </span>
            <User className="w-5 h-5 sm:w-6 sm:h-6" />
          </button>

          <button
            className={cn('btn btn-secondary', 'w-auto sm:!w-[120px] h-10 sm:h-11 rounded-full')}
            aria-label="Sign out"
            type="button"
          >
            <span className="text-sm font-bold sm:text-2xl">
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
        <h1 className="text-center lg:text-left text-4xl sm:text-5xl md:text-6xl lg:text-7xl !text-[4rem] font-bold leading-tight text-white max-w-full lg:max-w-[1000px] z-10 drop-shadow-2xl">
          Visează, creează, inovează!<br />
          Evenimente universitare
        </h1>

        <img
          className="z-10 object-cover w-full h-auto max-w-sm border-4 shadow-2xl sm:max-w-md md:max-w-lg lg:max-w-2xl rounded-2xl border-border"
          alt="University events showcase"
          src="/assets/rectangle-6.svg"
        />
      </section>
    </header>
  );
};