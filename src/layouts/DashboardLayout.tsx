import { Outlet } from 'react-router-dom';
import Navbar from '@/components/Navbar';
import { Toaster } from 'sonner';

export default function DashboardLayout() {
  return (
    <div className="flex flex-col min-h-screen transition-colors duration-300 bg-page text-main">
      <Toaster richColors position="top-right" />
      <Navbar />

      <main className="flex-1 w-full">
        <div className="py-6 layout-container sm:py-8">
          <Outlet />
        </div>
      </main>

      <footer className="py-6 mt-auto border-t border-border bg-card">
        <div className="text-center layout-container text-body-sm">
          © 2024 UniVent. Toate drepturile rezervate.
        </div>
      </footer>
    </div>
  );
}