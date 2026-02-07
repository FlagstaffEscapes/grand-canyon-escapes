import { ReactNode, useState } from 'react';
import { Link, useLocation, useNavigate } from 'react-router-dom';
import { 
  LayoutDashboard, 
  Home, 
  MessageSquare, 
  Users, 
  LogOut, 
  Menu,
  X,
  ChevronLeft,
  MapPin
} from 'lucide-react';
import { Button } from '@/components/ui/button';
import { useAuth } from '@/hooks/useAuth';
import { useUnreadContactCount, useUnreadOwnerInquiryCount } from '@/hooks/useContacts';
import { cn } from '@/lib/utils';

interface AdminLayoutProps {
  children: ReactNode;
}

const navItems = [
  { name: 'Dashboard', path: '/admin', icon: LayoutDashboard },
  { name: 'Properties', path: '/admin/properties', icon: Home },
  { name: 'Area Guide', path: '/admin/area-guides', icon: MapPin },
  { name: 'Contacts', path: '/admin/contacts', icon: MessageSquare },
  { name: 'Owner Inquiries', path: '/admin/owners', icon: Users },
];

export const AdminLayout = ({ children }: AdminLayoutProps) => {
  const [sidebarOpen, setSidebarOpen] = useState(true);
  const [mobileSidebarOpen, setMobileSidebarOpen] = useState(false);
  const { signOut } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();

  const { data: unreadContacts } = useUnreadContactCount();
  const { data: unreadOwners } = useUnreadOwnerInquiryCount();

  const handleSignOut = async () => {
    await signOut();
    navigate('/admin/login');
  };

  const getBadge = (path: string) => {
    if (path === '/admin/contacts' && unreadContacts) return unreadContacts;
    if (path === '/admin/owners' && unreadOwners) return unreadOwners;
    return null;
  };

  const Sidebar = ({ mobile = false }: { mobile?: boolean }) => (
    <div
      className={cn(
        'bg-charcoal text-cream-light flex flex-col h-full',
        mobile ? 'w-full' : sidebarOpen ? 'w-64' : 'w-16'
      )}
    >
      {/* Header */}
      <div className="p-4 border-b border-cream-light/10">
        <div className="flex items-center justify-between">
          {(sidebarOpen || mobile) && (
            <Link to="/" className="font-serif text-lg font-semibold text-dusty-gold">
              Flagstaff Escapes
            </Link>
          )}
          {!mobile && (
            <button
              onClick={() => setSidebarOpen(!sidebarOpen)}
              className="p-1 hover:bg-cream-light/10 rounded"
            >
              <ChevronLeft className={cn('w-5 h-5 transition-transform', !sidebarOpen && 'rotate-180')} />
            </button>
          )}
        </div>
        {(sidebarOpen || mobile) && (
          <p className="text-xs text-cream-light/60 mt-1">Admin Panel</p>
        )}
      </div>

      {/* Navigation */}
      <nav className="flex-1 p-2 space-y-1">
        {navItems.map((item) => {
          const isActive = location.pathname === item.path || 
            (item.path !== '/admin' && location.pathname.startsWith(item.path));
          const badge = getBadge(item.path);

          return (
            <Link
              key={item.path}
              to={item.path}
              onClick={() => setMobileSidebarOpen(false)}
              className={cn(
                'flex items-center gap-3 px-3 py-2.5 rounded-lg transition-colors relative',
                isActive
                  ? 'bg-primary text-primary-foreground'
                  : 'text-cream-light/70 hover:bg-cream-light/10 hover:text-cream-light'
              )}
            >
              <item.icon className="w-5 h-5 flex-shrink-0" />
              {(sidebarOpen || mobile) && (
                <>
                  <span className="font-medium">{item.name}</span>
                  {badge && badge > 0 && (
                    <span className="ml-auto bg-accent text-accent-foreground text-xs font-bold px-2 py-0.5 rounded-full">
                      {badge}
                    </span>
                  )}
                </>
              )}
              {!sidebarOpen && !mobile && badge && badge > 0 && (
                <span className="absolute -top-1 -right-1 bg-accent text-accent-foreground text-xs font-bold w-5 h-5 flex items-center justify-center rounded-full">
                  {badge}
                </span>
              )}
            </Link>
          );
        })}
      </nav>

      {/* Footer */}
      <div className="p-2 border-t border-cream-light/10">
        <button
          onClick={handleSignOut}
          className="flex items-center gap-3 px-3 py-2.5 rounded-lg w-full text-cream-light/70 hover:bg-cream-light/10 hover:text-cream-light transition-colors"
        >
          <LogOut className="w-5 h-5 flex-shrink-0" />
          {(sidebarOpen || mobile) && <span className="font-medium">Sign Out</span>}
        </button>
      </div>
    </div>
  );

  return (
    <div className="min-h-screen bg-background flex">
      {/* Desktop Sidebar */}
      <aside className="hidden lg:flex h-screen sticky top-0">
        <Sidebar />
      </aside>

      {/* Mobile Sidebar Overlay */}
      {mobileSidebarOpen && (
        <div className="lg:hidden fixed inset-0 z-50">
          <div className="absolute inset-0 bg-black/50" onClick={() => setMobileSidebarOpen(false)} />
          <div className="absolute left-0 top-0 bottom-0 w-64">
            <Sidebar mobile />
          </div>
        </div>
      )}

      {/* Main Content */}
      <div className="flex-1 flex flex-col min-h-screen">
        {/* Mobile Header */}
        <header className="lg:hidden bg-card border-b border-border p-4 flex items-center justify-between sticky top-0 z-40">
          <button
            onClick={() => setMobileSidebarOpen(true)}
            className="p-2 hover:bg-muted rounded-lg"
          >
            <Menu className="w-6 h-6" />
          </button>
          <span className="font-serif text-lg font-semibold">Admin Panel</span>
          <div className="w-10" />
        </header>

        {/* Content */}
        <main className="flex-1 p-4 lg:p-8">
          {children}
        </main>
      </div>
    </div>
  );
};
