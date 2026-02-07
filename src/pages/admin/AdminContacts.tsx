import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Mail, MailOpen, Trash2, ChevronDown, ChevronUp, Phone, Calendar, Tag } from 'lucide-react';
import { AdminLayout } from '@/components/admin/AdminLayout';
import { Button } from '@/components/ui/button';
import { 
  useContactSubmissions, 
  useToggleContactRead, 
  useDeleteContact 
} from '@/hooks/useContacts';
import { Skeleton } from '@/components/ui/skeleton';
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from '@/components/ui/alert-dialog';
import { useToast } from '@/hooks/use-toast';
import { format } from 'date-fns';
import { cn } from '@/lib/utils';

const AdminContacts = () => {
  const [expandedId, setExpandedId] = useState<string | null>(null);
  const [deleteId, setDeleteId] = useState<string | null>(null);
  const { data: contacts, isLoading } = useContactSubmissions();
  const toggleRead = useToggleContactRead();
  const deleteContact = useDeleteContact();
  const { toast } = useToast();

  const handleToggleRead = async (id: string, currentStatus: boolean) => {
    try {
      await toggleRead.mutateAsync({ id, is_read: !currentStatus });
    } catch (error) {
      toast({
        title: 'Error',
        description: 'Failed to update status',
        variant: 'destructive',
      });
    }
  };

  const handleDelete = async () => {
    if (!deleteId) return;
    try {
      await deleteContact.mutateAsync(deleteId);
      toast({
        title: 'Contact Deleted',
        description: 'The message has been deleted.',
      });
      setDeleteId(null);
    } catch (error) {
      toast({
        title: 'Error',
        description: 'Failed to delete contact',
        variant: 'destructive',
      });
    }
  };

  const getTypeLabel = (type: string) => {
    switch (type) {
      case 'booking': return 'Booking Inquiry';
      case 'owner': return 'Owner Inquiry';
      default: return 'General';
    }
  };

  const getTypeColor = (type: string) => {
    switch (type) {
      case 'booking': return 'bg-primary/10 text-primary';
      case 'owner': return 'bg-dusty-gold/10 text-dusty-gold';
      default: return 'bg-muted text-muted-foreground';
    }
  };

  return (
    <AdminLayout>
      <div className="space-y-6">
        {/* Header */}
        <div>
          <h1 className="font-serif text-3xl font-semibold">Contact Submissions</h1>
          <p className="text-muted-foreground mt-1">
            Messages from website visitors
          </p>
        </div>

        {/* Contact List */}
        <div className="space-y-3">
          {isLoading ? (
            [...Array(5)].map((_, i) => (
              <div key={i} className="bg-card rounded-xl border border-border p-4">
                <div className="flex items-center gap-4">
                  <Skeleton className="w-10 h-10 rounded-full" />
                  <div className="flex-1">
                    <Skeleton className="h-5 w-40 mb-2" />
                    <Skeleton className="h-4 w-60" />
                  </div>
                </div>
              </div>
            ))
          ) : contacts?.length === 0 ? (
            <div className="bg-card rounded-xl border border-border p-12 text-center">
              <Mail className="w-12 h-12 text-muted-foreground mx-auto mb-4" />
              <p className="text-muted-foreground">No contact submissions yet</p>
            </div>
          ) : (
            contacts?.map((contact) => (
              <motion.div
                key={contact.id}
                layout
                className={cn(
                  'bg-card rounded-xl border border-border overflow-hidden transition-colors',
                  !contact.is_read && 'border-l-4 border-l-primary'
                )}
              >
                {/* Header */}
                <button
                  onClick={() => setExpandedId(expandedId === contact.id ? null : contact.id)}
                  className="w-full p-4 flex items-center gap-4 text-left hover:bg-muted/50 transition-colors"
                >
                  <div className={cn(
                    'w-10 h-10 rounded-full flex items-center justify-center',
                    contact.is_read ? 'bg-muted' : 'bg-primary/10'
                  )}>
                    {contact.is_read ? (
                      <MailOpen className="w-5 h-5 text-muted-foreground" />
                    ) : (
                      <Mail className="w-5 h-5 text-primary" />
                    )}
                  </div>

                  <div className="flex-1 min-w-0">
                    <div className="flex items-center gap-2 flex-wrap">
                      <span className={cn('font-medium', !contact.is_read && 'font-semibold')}>
                        {contact.name}
                      </span>
                      <span className={cn('text-xs px-2 py-0.5 rounded-full', getTypeColor(contact.submission_type || 'general'))}>
                        {getTypeLabel(contact.submission_type || 'general')}
                      </span>
                    </div>
                    <p className="text-sm text-muted-foreground truncate">
                      {contact.email}
                    </p>
                  </div>

                  <div className="hidden sm:flex items-center gap-2 text-sm text-muted-foreground">
                    <Calendar className="w-4 h-4" />
                    {format(new Date(contact.created_at), 'MMM d, yyyy')}
                  </div>

                  {expandedId === contact.id ? (
                    <ChevronUp className="w-5 h-5 text-muted-foreground" />
                  ) : (
                    <ChevronDown className="w-5 h-5 text-muted-foreground" />
                  )}
                </button>

                {/* Expanded Content */}
                <AnimatePresence>
                  {expandedId === contact.id && (
                    <motion.div
                      initial={{ height: 0, opacity: 0 }}
                      animate={{ height: 'auto', opacity: 1 }}
                      exit={{ height: 0, opacity: 0 }}
                      className="border-t border-border"
                    >
                      <div className="p-4 space-y-4">
                        {/* Contact Info */}
                        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 text-sm">
                          <div>
                            <span className="text-muted-foreground">Email:</span>
                            <a href={`mailto:${contact.email}`} className="ml-2 text-primary hover:underline">
                              {contact.email}
                            </a>
                          </div>
                          {contact.phone && (
                            <div>
                              <span className="text-muted-foreground">Phone:</span>
                              <a href={`tel:${contact.phone}`} className="ml-2 text-primary hover:underline">
                                {contact.phone}
                              </a>
                            </div>
                          )}
                          <div>
                            <span className="text-muted-foreground">Submitted:</span>
                            <span className="ml-2">
                              {format(new Date(contact.created_at), 'MMMM d, yyyy h:mm a')}
                            </span>
                          </div>
                          {(contact as any).properties?.name && (
                            <div>
                              <span className="text-muted-foreground">Property:</span>
                              <span className="ml-2">{(contact as any).properties.name}</span>
                            </div>
                          )}
                        </div>

                        {/* Message */}
                        {contact.message && (
                          <div className="bg-muted/50 rounded-lg p-4">
                            <p className="text-sm whitespace-pre-wrap">{contact.message}</p>
                          </div>
                        )}

                        {/* Actions */}
                        <div className="flex items-center gap-2">
                          <Button
                            variant="outline"
                            size="sm"
                            onClick={() => handleToggleRead(contact.id, contact.is_read || false)}
                          >
                            {contact.is_read ? (
                              <>
                                <Mail className="w-4 h-4 mr-2" />
                                Mark Unread
                              </>
                            ) : (
                              <>
                                <MailOpen className="w-4 h-4 mr-2" />
                                Mark Read
                              </>
                            )}
                          </Button>
                          <Button
                            variant="outline"
                            size="sm"
                            className="text-destructive hover:text-destructive"
                            onClick={() => setDeleteId(contact.id)}
                          >
                            <Trash2 className="w-4 h-4 mr-2" />
                            Delete
                          </Button>
                        </div>
                      </div>
                    </motion.div>
                  )}
                </AnimatePresence>
              </motion.div>
            ))
          )}
        </div>
      </div>

      {/* Delete Confirmation */}
      <AlertDialog open={!!deleteId} onOpenChange={() => setDeleteId(null)}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Delete Message?</AlertDialogTitle>
            <AlertDialogDescription>
              This action cannot be undone. The contact submission will be permanently deleted.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>Cancel</AlertDialogCancel>
            <AlertDialogAction
              onClick={handleDelete}
              className="bg-destructive text-destructive-foreground hover:bg-destructive/90"
            >
              Delete
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </AdminLayout>
  );
};

export default AdminContacts;
