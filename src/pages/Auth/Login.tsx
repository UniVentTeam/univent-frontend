import { useState, useEffect } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { useAuthStore } from '@/stores/authStore';
import { authService } from '@/api/authService';
import { LogIn } from 'lucide-react';
import { cn } from '@/utils/cn';

export default function LoginPage() {
  const navigate = useNavigate();
  const { isAuthenticated } = useAuthStore();

  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  // Redirect if already logged in
  useEffect(() => {
    if (isAuthenticated) {
      navigate('/');
    }
  }, [isAuthenticated, navigate]);

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setError(null);
    setIsLoading(true);

    if (!email || !password) {
      setError('Email and password are required.');
      setIsLoading(false);
      return;
    }

    try {
      await authService.login({ email, password });
      // The useEffect will handle the redirect
    } catch (err) {
      setError((err as Error).message);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="w-full max-w-md">
      <form onSubmit={handleSubmit} className="card bg-card p-8 space-y-6">
        <header className="text-center">
          <h1 className="text-h2">Welcome Back</h1>
          <p className="text-body-sm mt-1">Enter your credentials to access your account.</p>
        </header>

        <div>
          <label className="label" htmlFor="email">
            Email Address
          </label>
          <input
            id="email"
            type="email"
            className="input-field"
            placeholder="name@usv.ro"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            disabled={isLoading}
          />
        </div>

        <div>
          <label className="label" htmlFor="password">
            Password
          </label>
          <input
            id="password"
            type="password"
            className="input-field"
            placeholder="••••••••"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            disabled={isLoading}
          />
        </div>
        
        {error && <p className="text-sm text-red-500 text-center">{error}</p>}

        <button type="submit" className={cn("btn btn-primary w-full gap-2", isLoading && "cursor-wait")} disabled={isLoading}>
          <LogIn className={cn("transition-all", isLoading && "animate-pulse")} size={16} />
          {isLoading ? 'Signing In...' : 'Sign In'}
        </button>

        <p className="text-center text-caption">
          Don't have an account?{' '}
          <Link to="/auth/register" className="font-medium text-blue-500 hover:underline">
            Sign Up
          </Link>
        </p>
      </form>
    </div>
  );
}
