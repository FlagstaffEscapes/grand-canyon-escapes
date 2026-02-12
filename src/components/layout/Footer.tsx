import { Link } from 'react-router-dom';
import { Phone, Mail, MapPin, Facebook, Instagram, Twitter } from 'lucide-react';

export const Footer = () => {
  return (
    <footer className="bg-primary text-primary-foreground">
      <div className="container mx-auto px-4 lg:px-8 py-16">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-12">
          {/* Brand */}
          <div className="space-y-4">
            <h3 className="font-serif text-2xl font-semibold">Flagstaff Escapes</h3>
            <p className="text-cream/80 text-sm leading-relaxed">
              Flagstaff's premier vacation rental management company. We help property owners maximize revenue with full-service management and a luxury guest experience.
            </p>
            <div className="flex items-center gap-4 pt-2">
              <a
                href="#"
                className="p-2 rounded-full bg-cream-light/10 hover:bg-cream-light/20 transition-colors"
                aria-label="Facebook"
              >
                <Facebook className="w-5 h-5" />
              </a>
              <a
                href="#"
                className="p-2 rounded-full bg-cream-light/10 hover:bg-cream-light/20 transition-colors"
                aria-label="Instagram"
              >
                <Instagram className="w-5 h-5" />
              </a>
              <a
                href="#"
                className="p-2 rounded-full bg-cream-light/10 hover:bg-cream-light/20 transition-colors"
                aria-label="Twitter"
              >
                <Twitter className="w-5 h-5" />
              </a>
            </div>
          </div>

          {/* Quick Links */}
          <div>
            <h4 className="font-serif text-lg font-semibold mb-4">Quick Links</h4>
            <nav className="flex flex-col gap-3">
              <Link to="/owners" className="text-cream/80 hover:text-cream-light transition-colors text-sm">
                Property Owners
              </Link>
              <Link to="/properties" className="text-cream/80 hover:text-cream-light transition-colors text-sm">
                Browse Properties
              </Link>
              <Link to="/experiences" className="text-cream/80 hover:text-cream-light transition-colors text-sm">
                Area Guide
              </Link>
              <Link to="/about" className="text-cream/80 hover:text-cream-light transition-colors text-sm">
                About Us
              </Link>
              <Link to="/about" className="text-cream/80 hover:text-cream-light transition-colors text-sm">
                Contact
              </Link>
            </nav>
          </div>

          {/* Popular Destinations */}
          <div>
            <h4 className="font-serif text-lg font-semibold mb-4">Explore</h4>
            <nav className="flex flex-col gap-3">
              <Link to="/experiences" className="text-cream/80 hover:text-cream-light transition-colors text-sm">
                Grand Canyon
              </Link>
              <Link to="/experiences" className="text-cream/80 hover:text-cream-light transition-colors text-sm">
                Sedona
              </Link>
              <Link to="/experiences" className="text-cream/80 hover:text-cream-light transition-colors text-sm">
                Downtown Flagstaff
              </Link>
              <Link to="/experiences" className="text-cream/80 hover:text-cream-light transition-colors text-sm">
                Arizona Snowbowl
              </Link>
              <Link to="/experiences" className="text-cream/80 hover:text-cream-light transition-colors text-sm">
                Hiking Trails
              </Link>
            </nav>
          </div>

          {/* Contact */}
          <div>
            <h4 className="font-serif text-lg font-semibold mb-4">Contact Us</h4>
            <div className="space-y-4">
              <a
                href="tel:360-775-0592"
                className="flex items-center gap-3 text-cream/80 hover:text-cream-light transition-colors text-sm"
              >
                <Phone className="w-4 h-4 flex-shrink-0" />
                <span>360-775-0592</span>
              </a>
              <a
                href="mailto:info@flagstaffescapes.com"
                className="flex items-center gap-3 text-cream/80 hover:text-cream-light transition-colors text-sm"
              >
                <Mail className="w-4 h-4 flex-shrink-0" />
                <span>info@flagstaffescapes.com</span>
              </a>
              <div className="flex items-start gap-3 text-cream/80 text-sm">
                <MapPin className="w-4 h-4 flex-shrink-0 mt-0.5" />
                <span>Flagstaff, Arizona</span>
              </div>
            </div>
          </div>
        </div>

        {/* Bottom Bar */}
        <div className="border-t border-cream-light/20 mt-12 pt-8 flex flex-col md:flex-row items-center justify-between gap-4 text-sm text-cream/60">
          <p>© {new Date().getFullYear()} Flagstaff Escapes. All rights reserved.</p>
          <div className="flex items-center gap-6">
            <a href="#" className="hover:text-cream-light transition-colors">Privacy Policy</a>
            <a href="#" className="hover:text-cream-light transition-colors">Terms of Service</a>
          </div>
        </div>
      </div>
    </footer>
  );
};
