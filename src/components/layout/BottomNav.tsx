// src/components/BottomNav.tsx  (sau unde îl ai)

import React from "react";

const navigationItems = [
  { id: 1, icon: "public/assets/vector-20.svg", label: "Home" },
  { id: 2, icon: "public/assets/vector-21.svg", label: "Calendar" },
  { id: 3, icon: "public/assets/vector-22.svg", label: "Saved" },
  { id: 4, icon: "public/assets/vector-23.svg", label: "Profile" },
  { id: 5, icon: "public/assets/vector-24.svg", label: "Inscrieri" },
] as const;

export const BottomNav: React.FC = () => {
  return (
    <nav className="fixed bottom-0 left-0 w-full bg-[#3fbff666] rounded-t-[10px] shadow-[5px_5px_10px_#00000040] z-10 px-4 sm:px-8 [@media(min-width:1400px)]:px-[15rem] py-3 sm:py-5">
      <div className="flex flex-wrap items-center justify-between gap-6 sm:gap-10 md:gap-12 lg:gap-16">
        {navigationItems.map((item) => (
          <button
  key={item.id}
  className="flex flex-col items-center w-[70px] sm:w-[80px] transition-transform duration-200 hover:scale-110 active:scale-95"
  aria-label={item.label}
>
  <div className="relative w-[70px] sm:w-[80px] h-[70px] sm:h-[80px]">
    <img
      className="absolute w-[70%] h-[70%] top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 object-contain drop-shadow-md"
      alt={item.label}
      src={item.icon}
    />
  </div>
  <span className="text-black text-[12px] sm:text-sm text-center font-bold mt-2 drop-shadow">
    {item.label}
  </span>
</button>

        ))}
      </div>
    </nav>
  );
};