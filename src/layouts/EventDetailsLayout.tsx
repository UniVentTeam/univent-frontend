import { Outlet } from 'react-router-dom';
import { Toaster } from 'sonner';
import {BottomNav} from "@/components/layout/BottomNav.tsx";
import {HeaderSection} from "@/components/layout/HeaderSection.tsx";

export default function EventDetailsLayout() {
  return (
    <div className="min-h-screen bg-[#CDEBFA]">
        <HeaderSection />
      <Toaster richColors position="top-right" />

      {/* FĂRĂ Header global */}
      {/* FĂRĂ BottomNav */}

      <Outlet />
            <BottomNav/>
      
    </div>
  );
}
