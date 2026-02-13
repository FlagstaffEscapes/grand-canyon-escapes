import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { supabase } from '@/integrations/supabase/client';

export interface Booking {
  id: string;
  property_id: string;
  start_date: string;
  end_date: string;
  guest_name: string | null;
  notes: string | null;
  created_at: string;
  updated_at: string;
}

// Fetch bookings for a property
export const usePropertyBookings = (propertyId: string) => {
  return useQuery({
    queryKey: ['bookings', propertyId],
    queryFn: async () => {
      const { data, error } = await supabase
        .from('property_bookings')
        .select('*')
        .eq('property_id', propertyId)
        .gte('end_date', new Date().toISOString().split('T')[0])
        .order('start_date', { ascending: true });

      if (error) throw error;
      return data as Booking[];
    },
    enabled: !!propertyId,
  });
};

// Admin: Create booking
export const useCreateBooking = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (booking: { property_id: string; start_date: string; end_date: string; guest_name?: string; notes?: string }) => {
      const { data, error } = await supabase
        .from('property_bookings')
        .insert(booking)
        .select()
        .single();

      if (error) throw error;
      return data;
    },
    onSuccess: (data) => {
      queryClient.invalidateQueries({ queryKey: ['bookings', data.property_id] });
    },
  });
};

// Admin: Delete booking
export const useDeleteBooking = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async ({ id, propertyId }: { id: string; propertyId: string }) => {
      const { error } = await supabase
        .from('property_bookings')
        .delete()
        .eq('id', id);

      if (error) throw error;
      return propertyId;
    },
    onSuccess: (propertyId) => {
      queryClient.invalidateQueries({ queryKey: ['bookings', propertyId] });
    },
  });
};

// Check if dates are available
export const isDateBooked = (date: Date, bookings: Booking[]): boolean => {
  const dateStr = date.toISOString().split('T')[0];
  return bookings.some(b => dateStr >= b.start_date && dateStr <= b.end_date);
};
