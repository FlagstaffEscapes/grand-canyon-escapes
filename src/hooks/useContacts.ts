import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { supabase } from '@/integrations/supabase/client';
import type { Database } from '@/integrations/supabase/types';

type ContactSubmission = Database['public']['Tables']['contact_submissions']['Row'];
type ContactInsert = Database['public']['Tables']['contact_submissions']['Insert'];
type OwnerInquiry = Database['public']['Tables']['owner_inquiries']['Row'];
type OwnerInquiryInsert = Database['public']['Tables']['owner_inquiries']['Insert'];

// Admin: Fetch all contact submissions
export const useContactSubmissions = () => {
  return useQuery({
    queryKey: ['contacts'],
    queryFn: async () => {
      const { data, error } = await supabase
        .from('contact_submissions')
        .select('*, properties(name)')
        .order('created_at', { ascending: false });

      if (error) throw error;
      return data;
    },
  });
};

// Admin: Fetch unread contact count
export const useUnreadContactCount = () => {
  return useQuery({
    queryKey: ['contacts', 'unread'],
    queryFn: async () => {
      const { count, error } = await supabase
        .from('contact_submissions')
        .select('*', { count: 'exact', head: true })
        .eq('is_read', false);

      if (error) throw error;
      return count || 0;
    },
  });
};

// Admin: Mark contact as read/unread
export const useToggleContactRead = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async ({ id, is_read }: { id: string; is_read: boolean }) => {
      const { error } = await supabase
        .from('contact_submissions')
        .update({ is_read })
        .eq('id', id);

      if (error) throw error;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['contacts'] });
    },
  });
};

// Admin: Delete contact
export const useDeleteContact = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (id: string) => {
      const { error } = await supabase
        .from('contact_submissions')
        .delete()
        .eq('id', id);

      if (error) throw error;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['contacts'] });
    },
  });
};

// Public: Submit contact form
export const useSubmitContact = () => {
  return useMutation({
    mutationFn: async (contact: ContactInsert) => {
      const { data, error } = await supabase
        .from('contact_submissions')
        .insert(contact)
        .select()
        .single();

      if (error) throw error;
      return data;
    },
  });
};

// Admin: Fetch all owner inquiries
export const useOwnerInquiries = () => {
  return useQuery({
    queryKey: ['owner-inquiries'],
    queryFn: async () => {
      const { data, error } = await supabase
        .from('owner_inquiries')
        .select('*')
        .order('created_at', { ascending: false });

      if (error) throw error;
      return data;
    },
  });
};

// Admin: Fetch unread owner inquiry count
export const useUnreadOwnerInquiryCount = () => {
  return useQuery({
    queryKey: ['owner-inquiries', 'unread'],
    queryFn: async () => {
      const { count, error } = await supabase
        .from('owner_inquiries')
        .select('*', { count: 'exact', head: true })
        .eq('is_read', false);

      if (error) throw error;
      return count || 0;
    },
  });
};

// Admin: Mark owner inquiry as read/unread
export const useToggleOwnerInquiryRead = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async ({ id, is_read }: { id: string; is_read: boolean }) => {
      const { error } = await supabase
        .from('owner_inquiries')
        .update({ is_read })
        .eq('id', id);

      if (error) throw error;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['owner-inquiries'] });
    },
  });
};

// Admin: Delete owner inquiry
export const useDeleteOwnerInquiry = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (id: string) => {
      const { error } = await supabase
        .from('owner_inquiries')
        .delete()
        .eq('id', id);

      if (error) throw error;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['owner-inquiries'] });
    },
  });
};

// Public: Submit owner inquiry
export const useSubmitOwnerInquiry = () => {
  return useMutation({
    mutationFn: async (inquiry: OwnerInquiryInsert) => {
      const { data, error } = await supabase
        .from('owner_inquiries')
        .insert(inquiry)
        .select()
        .single();

      if (error) throw error;
      return data;
    },
  });
};
