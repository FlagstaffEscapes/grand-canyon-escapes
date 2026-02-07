import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { supabase } from '@/integrations/supabase/client';
import { useToast } from '@/hooks/use-toast';

export interface AreaGuide {
  id: string;
  created_at: string;
  updated_at: string;
  title: string;
  slug: string;
  description: string | null;
  distance: string | null;
  drive_time: string | null;
  image_url: string | null;
  highlights: string[];
  display_order: number;
  is_active: boolean;
}

export interface AreaGuideActivity {
  id: string;
  created_at: string;
  category: string;
  items: string[];
  display_order: number;
  is_active: boolean;
}

// Fetch all area guides (admin - all, public - only active)
export const useAreaGuides = (adminView = false) => {
  return useQuery({
    queryKey: ['area-guides', adminView],
    queryFn: async () => {
      let query = supabase
        .from('area_guides')
        .select('*')
        .order('display_order', { ascending: true });
      
      // For public view, RLS will automatically filter to active only
      const { data, error } = await query;
      
      if (error) throw error;
      return data as AreaGuide[];
    },
  });
};

// Fetch single area guide by ID
export const useAreaGuideById = (id: string | undefined) => {
  return useQuery({
    queryKey: ['area-guide', id],
    queryFn: async () => {
      if (!id || id === 'new') return null;
      
      const { data, error } = await supabase
        .from('area_guides')
        .select('*')
        .eq('id', id)
        .single();
      
      if (error) throw error;
      return data as AreaGuide;
    },
    enabled: !!id && id !== 'new',
  });
};

// Fetch all activities
export const useAreaGuideActivities = (adminView = false) => {
  return useQuery({
    queryKey: ['area-guide-activities', adminView],
    queryFn: async () => {
      const { data, error } = await supabase
        .from('area_guide_activities')
        .select('*')
        .order('display_order', { ascending: true });
      
      if (error) throw error;
      return data as AreaGuideActivity[];
    },
  });
};

// Create area guide
export const useCreateAreaGuide = () => {
  const queryClient = useQueryClient();
  const { toast } = useToast();

  return useMutation({
    mutationFn: async (guide: Omit<AreaGuide, 'id' | 'created_at' | 'updated_at'>) => {
      const { data, error } = await supabase
        .from('area_guides')
        .insert([guide])
        .select()
        .single();
      
      if (error) throw error;
      return data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['area-guides'] });
      toast({ title: 'Destination created successfully' });
    },
    onError: (error: Error) => {
      toast({ title: 'Error creating destination', description: error.message, variant: 'destructive' });
    },
  });
};

// Update area guide
export const useUpdateAreaGuide = () => {
  const queryClient = useQueryClient();
  const { toast } = useToast();

  return useMutation({
    mutationFn: async ({ id, ...updates }: Partial<AreaGuide> & { id: string }) => {
      const { data, error } = await supabase
        .from('area_guides')
        .update(updates)
        .eq('id', id)
        .select()
        .single();
      
      if (error) throw error;
      return data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['area-guides'] });
      queryClient.invalidateQueries({ queryKey: ['area-guide'] });
      toast({ title: 'Destination updated successfully' });
    },
    onError: (error: Error) => {
      toast({ title: 'Error updating destination', description: error.message, variant: 'destructive' });
    },
  });
};

// Delete area guide
export const useDeleteAreaGuide = () => {
  const queryClient = useQueryClient();
  const { toast } = useToast();

  return useMutation({
    mutationFn: async (id: string) => {
      const { error } = await supabase
        .from('area_guides')
        .delete()
        .eq('id', id);
      
      if (error) throw error;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['area-guides'] });
      toast({ title: 'Destination deleted successfully' });
    },
    onError: (error: Error) => {
      toast({ title: 'Error deleting destination', description: error.message, variant: 'destructive' });
    },
  });
};

// Create activity
export const useCreateActivity = () => {
  const queryClient = useQueryClient();
  const { toast } = useToast();

  return useMutation({
    mutationFn: async (activity: Omit<AreaGuideActivity, 'id' | 'created_at'>) => {
      const { data, error } = await supabase
        .from('area_guide_activities')
        .insert([activity])
        .select()
        .single();
      
      if (error) throw error;
      return data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['area-guide-activities'] });
      toast({ title: 'Activity category created successfully' });
    },
    onError: (error: Error) => {
      toast({ title: 'Error creating activity', description: error.message, variant: 'destructive' });
    },
  });
};

// Update activity
export const useUpdateActivity = () => {
  const queryClient = useQueryClient();
  const { toast } = useToast();

  return useMutation({
    mutationFn: async ({ id, ...updates }: Partial<AreaGuideActivity> & { id: string }) => {
      const { data, error } = await supabase
        .from('area_guide_activities')
        .update(updates)
        .eq('id', id)
        .select()
        .single();
      
      if (error) throw error;
      return data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['area-guide-activities'] });
      toast({ title: 'Activity category updated successfully' });
    },
    onError: (error: Error) => {
      toast({ title: 'Error updating activity', description: error.message, variant: 'destructive' });
    },
  });
};

// Delete activity
export const useDeleteActivity = () => {
  const queryClient = useQueryClient();
  const { toast } = useToast();

  return useMutation({
    mutationFn: async (id: string) => {
      const { error } = await supabase
        .from('area_guide_activities')
        .delete()
        .eq('id', id);
      
      if (error) throw error;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['area-guide-activities'] });
      toast({ title: 'Activity category deleted successfully' });
    },
    onError: (error: Error) => {
      toast({ title: 'Error deleting activity', description: error.message, variant: 'destructive' });
    },
  });
};
