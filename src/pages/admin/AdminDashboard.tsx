import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import { Home, MessageSquare, Users, Eye, EyeOff, TrendingUp } from 'lucide-react';
import { AdminLayout } from '@/components/admin/AdminLayout';
import { useAllProperties } from '@/hooks/useProperties';
import { useUnreadContactCount, useUnreadOwnerInquiryCount, useContactSubmissions, useOwnerInquiries } from '@/hooks/useContacts';
import { Skeleton } from '@/components/ui/skeleton';
import { format } from 'date-fns';

const fadeInUp = {
  hidden: { opacity: 0, y: 20 },
  visible: { opacity: 1, y: 0 },
};

const AdminDashboard = () => {
  const { data: properties, isLoading: propertiesLoading } = useAllProperties();
  const { data: unreadContacts } = useUnreadContactCount();
  const { data: unreadOwners } = useUnreadOwnerInquiryCount();
  const { data: contacts } = useContactSubmissions();
  const { data: ownerInquiries } = useOwnerInquiries();

  const activeProperties = properties?.filter(p => p.is_active).length || 0;
  const draftProperties = properties?.filter(p => !p.is_active).length || 0;

  const recentActivity = [
    ...(contacts?.slice(0, 3).map(c => ({
      type: 'contact' as const,
      message: `New contact from ${c.name}`,
      time: c.created_at,
    })) || []),
    ...(ownerInquiries?.slice(0, 3).map(o => ({
      type: 'owner' as const,
      message: `Owner inquiry from ${o.name}`,
      time: o.created_at,
    })) || []),
  ].sort((a, b) => new Date(b.time).getTime() - new Date(a.time).getTime()).slice(0, 5);

  const stats = [
    {
      label: 'Active Properties',
      value: activeProperties,
      icon: Eye,
      color: 'bg-primary/10 text-primary',
      link: '/admin/properties',
    },
    {
      label: 'Draft Properties',
      value: draftProperties,
      icon: EyeOff,
      color: 'bg-muted text-muted-foreground',
      link: '/admin/properties',
    },
    {
      label: 'Unread Contacts',
      value: unreadContacts || 0,
      icon: MessageSquare,
      color: 'bg-accent/10 text-accent',
      link: '/admin/contacts',
    },
    {
      label: 'Owner Inquiries',
      value: unreadOwners || 0,
      icon: Users,
      color: 'bg-dusty-gold/10 text-dusty-gold',
      link: '/admin/owners',
    },
  ];

  return (
    <AdminLayout>
      <div className="space-y-8">
        {/* Header */}
        <div>
          <h1 className="font-serif text-3xl font-semibold">Dashboard</h1>
          <p className="text-muted-foreground mt-1">Welcome back! Here's an overview of your property management.</p>
        </div>

        {/* Stats Grid */}
        <motion.div
          initial="hidden"
          animate="visible"
          variants={{ visible: { transition: { staggerChildren: 0.1 } } }}
          className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4"
        >
          {stats.map((stat, index) => (
            <motion.div key={stat.label} variants={fadeInUp}>
              <Link
                to={stat.link}
                className="block p-6 bg-card rounded-xl border border-border hover:shadow-lg transition-shadow"
              >
                <div className="flex items-center gap-4">
                  <div className={`p-3 rounded-lg ${stat.color}`}>
                    <stat.icon className="w-6 h-6" />
                  </div>
                  <div>
                    {propertiesLoading ? (
                      <Skeleton className="h-8 w-12" />
                    ) : (
                      <p className="text-3xl font-bold">{stat.value}</p>
                    )}
                    <p className="text-sm text-muted-foreground">{stat.label}</p>
                  </div>
                </div>
              </Link>
            </motion.div>
          ))}
        </motion.div>

        {/* Quick Actions & Recent Activity */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          {/* Quick Actions */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.4 }}
            className="bg-card rounded-xl border border-border p-6"
          >
            <h2 className="font-serif text-xl font-semibold mb-4">Quick Actions</h2>
            <div className="space-y-3">
              <Link
                to="/admin/properties/new"
                className="flex items-center gap-3 p-4 rounded-lg bg-primary text-primary-foreground hover:bg-primary/90 transition-colors"
              >
                <Home className="w-5 h-5" />
                <span className="font-medium">Add New Property</span>
              </Link>
              <Link
                to="/admin/contacts"
                className="flex items-center gap-3 p-4 rounded-lg bg-muted hover:bg-muted/80 transition-colors"
              >
                <MessageSquare className="w-5 h-5" />
                <span className="font-medium">View Contact Messages</span>
                {unreadContacts && unreadContacts > 0 && (
                  <span className="ml-auto bg-accent text-accent-foreground text-xs font-bold px-2 py-0.5 rounded-full">
                    {unreadContacts} new
                  </span>
                )}
              </Link>
              <Link
                to="/admin/owners"
                className="flex items-center gap-3 p-4 rounded-lg bg-muted hover:bg-muted/80 transition-colors"
              >
                <Users className="w-5 h-5" />
                <span className="font-medium">View Owner Inquiries</span>
                {unreadOwners && unreadOwners > 0 && (
                  <span className="ml-auto bg-accent text-accent-foreground text-xs font-bold px-2 py-0.5 rounded-full">
                    {unreadOwners} new
                  </span>
                )}
              </Link>
            </div>
          </motion.div>

          {/* Recent Activity */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.5 }}
            className="bg-card rounded-xl border border-border p-6"
          >
            <h2 className="font-serif text-xl font-semibold mb-4">Recent Activity</h2>
            {recentActivity.length > 0 ? (
              <div className="space-y-3">
                {recentActivity.map((activity, index) => (
                  <div key={index} className="flex items-start gap-3 p-3 rounded-lg bg-muted/50">
                    <div className={`p-2 rounded-full ${activity.type === 'contact' ? 'bg-accent/10' : 'bg-dusty-gold/10'}`}>
                      {activity.type === 'contact' ? (
                        <MessageSquare className="w-4 h-4 text-accent" />
                      ) : (
                        <Users className="w-4 h-4 text-dusty-gold" />
                      )}
                    </div>
                    <div className="flex-1 min-w-0">
                      <p className="text-sm font-medium truncate">{activity.message}</p>
                      <p className="text-xs text-muted-foreground">
                        {format(new Date(activity.time), 'MMM d, yyyy h:mm a')}
                      </p>
                    </div>
                  </div>
                ))}
              </div>
            ) : (
              <p className="text-muted-foreground text-center py-8">No recent activity</p>
            )}
          </motion.div>
        </div>
      </div>
    </AdminLayout>
  );
};

export default AdminDashboard;
