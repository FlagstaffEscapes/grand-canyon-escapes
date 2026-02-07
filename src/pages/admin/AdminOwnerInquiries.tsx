import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Mail, MailOpen, Trash2, ChevronDown, ChevronUp, Phone, Calendar, Home, Bed } from 'lucide-react';
import { AdminLayout } from '@/components/admin/AdminLayout';
import { Button } from '@/components/ui/button';
import { 
  useOwnerInquiries, 
  useToggleOwnerInquiryRead, 
  useDeleteOwnerInquiry 
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

const AdminOwnerInquiries = () => {
  const [expandedId, setExpandedId] = useState<string | null>(null);
  const [deleteId, setDeleteId] = useState<string | null>(null);
  const { data: inquiries, isLoading } = useOwnerInquiries();
  const toggleRead = useToggleOwnerInquiryRead();
  const deleteInquiry = useDeleteOwnerInquiry();
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
      await deleteInquiry.mutateAsync(deleteId);
      toast({
        title: 'Inquiry Deleted',
        description: 'The owner inquiry has been deleted.',
      });
      setDeleteId(null);
    } catch (error) {
      toast({
        title: 'Error',
        description: 'Failed to delete inquiry',
        variant: 'destructive',
      });
    }
  };

  return (
    <AdminLayout>
      <div className="space-y-6">
        {/* Header */}
        <div>
          <h1 className="font-serif text-3xl font-semibold">Owner Inquiries</h1>
          <p className="text-muted-foreground mt-1">
            Property owners interested in management services
          </p>
        </div>

        {/* Inquiry List */}
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
          ) : inquiries?.length === 0 ? (
            <div className="bg-card rounded-xl border border-border p-12 text-center">
              <Home className="w-12 h-12 text-muted-foreground mx-auto mb-4" />
              <p className="text-muted-foreground">No owner inquiries yet</p>
            </div>
          ) : (
            inquiries?.map((inquiry) => (
              <motion.div
                key={inquiry.id}
                layout
                className={cn(
                  'bg-card rounded-xl border border-border overflow-hidden transition-colors',
                  !inquiry.is_read && 'border-l-4 border-l-dusty-gold'
                )}
              >
                {/* Header */}
                <button
                  onClick={() => setExpandedId(expandedId === inquiry.id ? null : inquiry.id)}
                  className="w-full p-4 flex items-center gap-4 text-left hover:bg-muted/50 transition-colors"
                >
                  <div className={cn(
                    'w-10 h-10 rounded-full flex items-center justify-center',
                    inquiry.is_read ? 'bg-muted' : 'bg-dusty-gold/10'
                  )}>
                    {inquiry.is_read ? (
                      <MailOpen className="w-5 h-5 text-muted-foreground" />
                    ) : (
                      <Mail className="w-5 h-5 text-dusty-gold" />
                    )}
                  </div>

                  <div className="flex-1 min-w-0">
                    <span className={cn('font-medium', !inquiry.is_read && 'font-semibold')}>
                      {inquiry.name}
                    </span>
                    <p className="text-sm text-muted-foreground truncate">
                      {inquiry.property_address || inquiry.email}
                    </p>
                  </div>

                  <div className="hidden sm:flex items-center gap-2 text-sm text-muted-foreground">
                    <Calendar className="w-4 h-4" />
                    {format(new Date(inquiry.created_at), 'MMM d, yyyy')}
                  </div>

                  {expandedId === inquiry.id ? (
                    <ChevronUp className="w-5 h-5 text-muted-foreground" />
                  ) : (
                    <ChevronDown className="w-5 h-5 text-muted-foreground" />
                  )}
                </button>

                {/* Expanded Content */}
                <AnimatePresence>
                  {expandedId === inquiry.id && (
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
                            <a href={`mailto:${inquiry.email}`} className="ml-2 text-primary hover:underline">
                              {inquiry.email}
                            </a>
                          </div>
                          {inquiry.phone && (
                            <div>
                              <span className="text-muted-foreground">Phone:</span>
                              <a href={`tel:${inquiry.phone}`} className="ml-2 text-primary hover:underline">
                                {inquiry.phone}
                              </a>
                            </div>
                          )}
                          <div>
                            <span className="text-muted-foreground">Submitted:</span>
                            <span className="ml-2">
                              {format(new Date(inquiry.created_at), 'MMMM d, yyyy h:mm a')}
                            </span>
                          </div>
                        </div>

                        {/* Property Details */}
                        <div className="bg-muted/50 rounded-lg p-4 space-y-2">
                          <h4 className="font-medium text-sm">Property Details</h4>
                          <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 text-sm">
                            {inquiry.property_address && (
                              <div className="flex items-center gap-2">
                                <Home className="w-4 h-4 text-muted-foreground" />
                                <span>{inquiry.property_address}</span>
                              </div>
                            )}
                            {inquiry.property_type && (
                              <div>
                                <span className="text-muted-foreground">Type:</span>
                                <span className="ml-2">{inquiry.property_type}</span>
                              </div>
                            )}
                            {inquiry.bedrooms && (
                              <div className="flex items-center gap-2">
                                <Bed className="w-4 h-4 text-muted-foreground" />
                                <span>{inquiry.bedrooms} Bedrooms</span>
                              </div>
                            )}
                            <div>
                              <span className="text-muted-foreground">Currently Renting:</span>
                              <span className="ml-2">{inquiry.currently_renting ? 'Yes' : 'No'}</span>
                            </div>
                          </div>
                        </div>

                        {/* Message */}
                        {inquiry.message && (
                          <div className="bg-muted/50 rounded-lg p-4">
                            <h4 className="font-medium text-sm mb-2">Message</h4>
                            <p className="text-sm whitespace-pre-wrap">{inquiry.message}</p>
                          </div>
                        )}

                        {/* Actions */}
                        <div className="flex items-center gap-2">
                          <Button
                            variant="outline"
                            size="sm"
                            onClick={() => handleToggleRead(inquiry.id, inquiry.is_read || false)}
                          >
                            {inquiry.is_read ? (
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
                            onClick={() => setDeleteId(inquiry.id)}
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
            <AlertDialogTitle>Delete Inquiry?</AlertDialogTitle>
            <AlertDialogDescription>
              This action cannot be undone. The owner inquiry will be permanently deleted.
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

export default AdminOwnerInquiries;
