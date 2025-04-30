import { useState } from 'react';
import { Link } from 'react-router-dom';
import { Mail, Lock } from 'lucide-react';
import Button from '../common/Button';
import { useAuth } from '../../context/AuthContext';

function LoginForm() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const { login, isLoading, error } = useAuth();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    await login(email, password);
  };

  const getErrorMessage = (error: string) => {
    if (error.includes('email_not_confirmed')) {
      return (
        <div className="space-y-2">
          <p>Please verify your email address before logging in.</p>
          <p className="text-sm">
            Check your inbox (and spam folder) for the confirmation email. 
            If you didn't receive it, you can request a new one on the signup page.
          </p>
        </div>
      );
    }
    return error;
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-4 w-full">
      {error && (
        <div className="bg-error-50 text-error-700 p-3 rounded-md text-sm">
          {getErrorMessage(error)}
        </div>
      )}
      
      <div>
        <label htmlFor="email" className="block text-sm font-medium text-gray-700 mb-1">
          Email
        </label>
        <div className="relative">
          <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
            <Mail size={18} className="text-gray-400" />
          </div>
          <input
            id="email"
            type="email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            required
            className="block w-full pl-10 pr-3 py-2 border border-gray-300 rounded-md shadow-sm focus:ring-primary-500 focus:border-primary-500"
            placeholder="you@example.com"
          />
        </div>
      </div>
      
      <div>
        <div className="flex items-center justify-between mb-1">
          <label htmlFor="password" className="block text-sm font-medium text-gray-700">
            Password
          </label>
          <Link to="#" className="text-sm text-primary-600 hover:text-primary-500">
            Forgot password?
          </Link>
        </div>
        <div className="relative">
          <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
            <Lock size={18} className="text-gray-400" />
          </div>
          <input
            id="password"
            type="password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            required
            className="block w-full pl-10 pr-3 py-2 border border-gray-300 rounded-md shadow-sm focus:ring-primary-500 focus:border-primary-500"
            placeholder="••••••••"
          />
        </div>
      </div>
      
      <div>
        <Button
          type="submit"
          variant="primary"
          fullWidth
          isLoading={isLoading}
        >
          Sign in
        </Button>
      </div>
      
      <div className="text-center text-sm">
        <span className="text-gray-500">Don't have an account?</span>{' '}
        <Link to="/signup" className="text-primary-600 hover:text-primary-500 font-medium">
          Sign up
        </Link>
      </div>
    </form>
  );
}

export default LoginForm;