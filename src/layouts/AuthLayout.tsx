import { Outlet } from 'react-router-dom';
import { Toaster } from 'sonner';
import { LanguageToggle } from '@/components/LanguageToggle';

const AuthLayout = () => {
  return (
    <div className="min-h-screen bg-page flex items-center justify-center p-4 relative">
      <div className="absolute top-4 right-4">
        <LanguageToggle />
      </div>
      <Toaster richColors position="top-right" />
      <main>
        <Outlet />
      </main>
    </div>
  );
};

export default AuthLayout;
