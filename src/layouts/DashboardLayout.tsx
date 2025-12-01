import { Outlet } from 'react-router-dom';
import Navbar from '@/components/Navbar';
import { Toaster } from 'sonner';

export default function DashboardLayout() {
  return (
    <div className="min-h-screen bg-page text-main transition-colors duration-300 flex flex-col">
      <Toaster richColors position="top-right" />
      <Navbar />

      <main className="flex-1 w-full">
        <div className="layout-container py-6 sm:py-8">
          <Outlet />
        </div>
      </main>

      <footer className="border-t border-border py-6 bg-card mt-auto">
        <div className="layout-container text-center text-body-sm">
          © 2024 UniVent. Toate drepturile rezervate.
        </div>
      </footer>
    </div>
  );
}