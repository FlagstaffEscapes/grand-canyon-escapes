import { Link, useLocation } from 'react-router-dom';
import { useEffect } from 'react';
import { motion } from 'framer-motion';
import { Home, ArrowLeft } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Layout } from '@/components/layout/Layout';

const NotFound = () => {
  const location = useLocation();

  useEffect(() => {
    console.error("404 Error: User attempted to access non-existent route:", location.pathname);
  }, [location.pathname]);

  return (
    <Layout>
      <div className="min-h-[80vh] flex items-center justify-center bg-background">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
          className="text-center px-4"
        >
          <h1 className="font-serif text-8xl md:text-9xl font-bold text-primary/20 mb-4">404</h1>
          <h2 className="font-serif text-3xl md:text-4xl font-semibold mb-4">Page Not Found</h2>
          <p className="text-muted-foreground text-lg mb-8 max-w-md mx-auto">
            The page you're looking for seems to have wandered off into the wilderness. Let's get you back on track.
          </p>
          <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
            <Button variant="default" size="lg" asChild>
              <Link to="/">
                <Home className="w-4 h-4" />
                Back to Home
              </Link>
            </Button>
            <Button variant="outline" size="lg" asChild>
              <Link to="/properties">
                <ArrowLeft className="w-4 h-4" />
                View Properties
              </Link>
            </Button>
          </div>
        </motion.div>
      </div>
    </Layout>
  );
};

export default NotFound;
