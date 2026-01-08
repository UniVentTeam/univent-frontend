import { Outlet } from 'react-router-dom';
import { Toaster } from 'sonner';
import {BottomNav} from "@/components/layout/BottomNav.tsx";
import {HeaderSection} from "@/components/layout/HeaderSection.tsx";
import { HeroSection } from '@/components/layout/HeroSection';

export default function DashboardLayout() {
  return (
    <div className="flex flex-col min-h-screen transition-colors duration-300 bg-page text-main">
      <Toaster richColors position="top-right" />
      {/*<Navbar />
      <HeroSection />*/}
      <HeaderSection/>

      <main className="flex-1 w-full">
        <div /*className="py-6 sm:py-8"*/> 
          <Outlet />
        </div>
      </main>

{/*<BottomNav/>*/}
      

      {/*<footer className="py-6 mt-auto border-t border-border bg-card">*/}
      {/*  <div className="text-center layout-container text-body-sm">*/}
      {/*    © 2025 UniVent. Toate drepturile rezervate.*/}
      {/*  </div>*/}
      {/*</footer>*/}
    </div>
  );
}