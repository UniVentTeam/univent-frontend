import React from 'react';
import { cn } from '@/utils/cn';
import { useTranslation } from 'react-i18next';

export const HeroSection: React.FC = () => {
  const { t } = useTranslation();

  return (
    <section
      className="hero-section flex flex-row lg:flex-row w-full items-center justify-between gap-4 lg:gap-8 
             p-4 sm:p-6 md:p-10 lg:px-[5%] 
             bg-[url('/frame-2.jpg')] bg-cover bg-center 
             bg-black/40 bg-blend-overlay"
      aria-label="Hero section"
    >
      <h1
        className={cn(
          'text-3xl',
          'text-center lg:text-left leading-tight text-white max-w-full lg:max-w-[1000px] z-10 drop-shadow-2xl'
        )}
        dangerouslySetInnerHTML={{ __html: t('header.heroTitle') }}
      />

      <img
        className="z-10 object-cover w-full h-auto max-w-sm shadow-2xl sm:max-w-md md:max-w-lg lg:max-w-2xl rounded-2xl border-border"
        alt="University events showcase"
        src="/assets/rectangle-6.svg"
      />
    </section>
  );
};
