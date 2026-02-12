import { useState, useEffect } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import { motion } from 'framer-motion';
import { Lock, Mail, Eye, EyeOff, Loader2 } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { useAuth } from '@/hooks/useAuth';
import { useToast } from '@/hooks/use-toast';

const AdminLogin = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const { signIn, user, isAdmin, isLoading } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();
  const { toast } = useToast();

  const from = location.state?.from?.pathname || '/admin/dashboard';

  useEffect(() => {
    if (!isLoading && user && isAdmin) {
      navigate(from, { replace: true });
    }
  }, [user, isAdmin, isLoading, navigate, from]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);

    const { error } = await signIn(email, password);

    if (error) {
      toast({
        title: 'Login Failed',
        description: error.message || 'Invalid email or password',
        variant: 'destructive',
      });
      setIsSubmitting(false);
    }
  };

  if (isLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-charcoal">
        <Loader2 className="w-8 h-8 animate-spin text-dusty-gold" />
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-charcoal flex items-center justify-center p-4">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="w-full max-w-md"
      >
        {/* Logo */}
        <div className="text-center mb-8">
          <a href="/" className="inline-block">
            <span className="font-serif text-3xl font-semibold text-dusty-gold">
              Flagstaff Escapes
            </span>
          </a>
          <p className="text-cream-light/60 mt-2">Admin Panel</p>
        </div>

        {/* Login Card */}
        <div className="bg-cream-light/5 border border-cream-light/10 rounded-xl p-8 backdrop-blur-sm">
          <div className="flex items-center justify-center w-16 h-16 rounded-full bg-primary/20 mx-auto mb-6">
            <Lock className="w-8 h-8 text-dusty-gold" />
          </div>

          <h1 className="text-2xl font-serif font-semibold text-cream-light text-center mb-2">
            Welcome Back
          </h1>
          <p className="text-cream-light/60 text-center mb-8">
            Sign in to access the admin dashboard
          </p>

          <form onSubmit={handleSubmit} className="space-y-5">
            <div>
              <label className="text-sm font-medium text-cream-light/80 mb-2 block">
                Email Address
              </label>
              <div className="relative">
                <Mail className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-cream-light/40" />
                <Input
                  type="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  required
                  placeholder="admin@example.com"
                  className="pl-10 bg-cream-light/5 border-cream-light/20 text-cream-light placeholder:text-cream-light/40 focus:border-dusty-gold"
                />
              </div>
            </div>

            <div>
              <label className="text-sm font-medium text-cream-light/80 mb-2 block">
                Password
              </label>
              <div className="relative">
                <Lock className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-cream-light/40" />
                <Input
                  type={showPassword ? 'text' : 'password'}
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  required
                  placeholder="••••••••"
                  className="pl-10 pr-10 bg-cream-light/5 border-cream-light/20 text-cream-light placeholder:text-cream-light/40 focus:border-dusty-gold"
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute right-3 top-1/2 -translate-y-1/2 text-cream-light/40 hover:text-cream-light"
                >
                  {showPassword ? <EyeOff className="w-5 h-5" /> : <Eye className="w-5 h-5" />}
                </button>
              </div>
            </div>

            <Button
              type="submit"
              disabled={isSubmitting}
              className="w-full bg-dusty-gold hover:bg-dusty-gold/90 text-charcoal font-semibold"
            >
              {isSubmitting ? (
                <>
                  <Loader2 className="w-4 h-4 animate-spin mr-2" />
                  Signing In...
                </>
              ) : (
                'Sign In'
              )}
            </Button>
          </form>
        </div>

        <p className="text-center text-cream-light/40 text-sm mt-6">
          <a href="/" className="hover:text-cream-light transition-colors">
            ← Back to Website
          </a>
        </p>
      </motion.div>
    </div>
  );
};

export default AdminLogin;
