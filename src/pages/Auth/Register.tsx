import { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { authService } from '@/api/authService';
import { UserPlus } from 'lucide-react';
import { cn } from '@/utils/cn';
import { toast } from 'sonner';

export default function RegisterPage() {
  const navigate = useNavigate();

  const [fullName, setFullName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setError(null);
    setIsLoading(true);

    if (!email || !password || !fullName) {
      setError('All fields are required.');
      setIsLoading(false);
      return;
    }

    try {
      await authService.register({ fullName, email, password });
      // The service shows a success toast
      // Redirect to login page after a short delay to allow user to read the toast
      setTimeout(() => {
        navigate('/auth/login');
      }, 2000);
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
          <h1 className="text-h2">Create an Account</h1>
          <p className="text-body-sm mt-1">Join UniVent to discover amazing events.</p>
        </header>

        <div>
          <label className="label" htmlFor="fullName">
            Full Name
          </label>
          <input
            id="fullName"
            type="text"
            className="input-field"
            placeholder="Ex: Popescu Ion"
            value={fullName}
            onChange={(e) => setFullName(e.target.value)}
            disabled={isLoading}
          />
        </div>

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
          <UserPlus className={cn("transition-all", isLoading && "animate-pulse")} size={16} />
          {isLoading ? 'Creating Account...' : 'Create Account'}
        </button>

        <p className="text-center text-caption">
          Already have an account?{' '}
          <Link to="/auth/login" className="font-medium text-blue-500 hover:underline">
            Sign In
          </Link>
        </p>
      </form>
    </div>
  );
}
