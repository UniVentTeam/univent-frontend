import { Outlet } from 'react-router-dom';
import { Toaster } from 'sonner';

const AuthLayout = () => {
  return (
    <div className="min-h-screen bg-page flex items-center justify-center p-4">
      <Toaster richColors position="top-right" />
      <main>
        <Outlet />
      </main>
    </div>
  );
};

export default AuthLayout;
