import { useState, useEffect } from 'react';
import { Link, useLocation } from 'react-router-dom';
import { Menu, X, Phone } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { cn } from '@/lib/utils';

const navLinks = [
  { name: 'Home', path: '/' },
  { name: 'Properties', path: '/properties' },
  { name: 'For Owners', path: '/owners' },
  { name: 'Area Guide', path: '/experiences' },
  { name: 'About', path: '/about' },
];

export const Header = () => {
  const [isScrolled, setIsScrolled] = useState(false);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const location = useLocation();

  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 20);
    };

    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  useEffect(() => {
    setIsMobileMenuOpen(false);
  }, [location]);

  return (
    <header
      className={cn(
        'fixed top-0 left-0 right-0 z-50 transition-all duration-500',
        isScrolled
          ? 'bg-cream-light/95 backdrop-blur-md shadow-lg py-3'
          : 'bg-transparent py-5'
      )}
    >
      <div className="container mx-auto px-4 lg:px-8">
        <div className="flex items-center justify-between">
          {/* Logo */}
          <Link to="/" className="flex items-center gap-2">
            <span
              className={cn(
                'font-serif text-2xl md:text-3xl font-semibold tracking-tight transition-colors duration-300',
                isScrolled ? 'text-primary' : 'text-cream-light'
              )}
            >
              Flagstaff Escapes
            </span>
          </Link>

          {/* Desktop Navigation */}
          <nav className="hidden lg:flex items-center gap-8">
            {navLinks.map((link) => (
              <Link
                key={link.path}
                to={link.path}
                className={cn(
                  'font-medium text-sm uppercase tracking-wider transition-colors duration-300 hover:opacity-80',
                  isScrolled ? 'text-charcoal' : 'text-cream-light',
                  location.pathname === link.path && 'border-b-2 border-current pb-1'
                )}
              >
                {link.name}
              </Link>
            ))}
          </nav>

          {/* CTA & Mobile Toggle */}
          <div className="flex items-center gap-4">
            <a
              href="tel:360-775-0592"
              className={cn(
                'hidden md:flex items-center gap-2 text-sm font-medium transition-colors',
                isScrolled ? 'text-charcoal' : 'text-cream-light'
              )}
            >
              <Phone className="w-4 h-4" />
              <span>360-775-0592</span>
            </a>
            
            <Button
              variant={isScrolled ? 'accent' : 'hero'}
              size="lg"
              className="hidden sm:inline-flex"
              asChild
            >
              <Link to="/properties">View Properties</Link>
            </Button>

            {/* Mobile Menu Button */}
            <button
              onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
              className={cn(
                'lg:hidden p-2 transition-colors',
                isScrolled ? 'text-charcoal' : 'text-cream-light'
              )}
              aria-label="Toggle menu"
            >
              {isMobileMenuOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
            </button>
          </div>
        </div>

        {/* Mobile Menu */}
        <div
          className={cn(
            'lg:hidden overflow-hidden transition-all duration-300',
            isMobileMenuOpen ? 'max-h-96 mt-4' : 'max-h-0'
          )}
        >
          <nav className="flex flex-col gap-2 bg-cream-light rounded-lg p-4 shadow-xl">
            {navLinks.map((link) => (
              <Link
                key={link.path}
                to={link.path}
                className={cn(
                  'font-medium py-2 px-4 rounded-md transition-colors text-charcoal hover:bg-primary hover:text-primary-foreground',
                  location.pathname === link.path && 'bg-primary text-primary-foreground'
                )}
              >
                {link.name}
              </Link>
            ))}
            <a
              href="tel:360-775-0592"
              className="flex items-center gap-2 py-2 px-4 text-charcoal"
            >
              <Phone className="w-4 h-4" />
              <span>360-775-0592</span>
            </a>
            <Button variant="accent" className="mt-2" asChild>
              <Link to="/properties">View Properties</Link>
            </Button>
          </nav>
        </div>
      </div>
    </header>
  );
};
