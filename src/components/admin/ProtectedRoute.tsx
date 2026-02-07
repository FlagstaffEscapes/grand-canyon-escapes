import { ReactNode } from 'react';
import { Navigate, useLocation } from 'react-router-dom';
import { useAuth } from '@/hooks/useAuth';
import { Loader2 } from 'lucide-react';

interface ProtectedRouteProps {
  children: ReactNode;
}

export const ProtectedRoute = ({ children }: ProtectedRouteProps) => {
  const { user, isAdmin, isLoading } = useAuth();
  const location = useLocation();

  if (isLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-charcoal">
        <div className="text-center">
          <Loader2 className="w-8 h-8 animate-spin text-dusty-gold mx-auto mb-4" />
          <p className="text-cream-light/70">Loading...</p>
        </div>
      </div>
    );
  }

  if (!user) {
    return <Navigate to="/admin/login" state={{ from: location }} replace />;
  }

  if (!isAdmin) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-charcoal">
        <div className="text-center max-w-md p-8">
          <h1 className="font-serif text-3xl text-cream-light mb-4">Access Denied</h1>
          <p className="text-cream-light/70 mb-6">
            You don't have permission to access the admin panel. Please contact an administrator.
          </p>
          <a href="/" className="text-dusty-gold hover:underline">
            Return to Homepage
          </a>
        </div>
      </div>
    );
  }

  return <>{children}</>;
};
