import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { supabase } from '@/integrations/supabase/client';
import type { Database } from '@/integrations/supabase/types';

type Property = Database['public']['Tables']['properties']['Row'];
type PropertyInsert = Database['public']['Tables']['properties']['Insert'];
type PropertyUpdate = Database['public']['Tables']['properties']['Update'];
type PropertyImage = Database['public']['Tables']['property_images']['Row'];

export interface PropertyWithImages extends Property {
  property_images: PropertyImage[];
}

// Fetch all active properties (public)
export const useActiveProperties = () => {
  return useQuery({
    queryKey: ['properties', 'active'],
    queryFn: async () => {
      const { data, error } = await supabase
        .from('properties')
        .select('*, property_images(*)')
        .eq('is_active', true)
        .order('created_at', { ascending: false });

      if (error) throw error;
      return data as PropertyWithImages[];
    },
  });
};

// Fetch featured properties (public)
export const useFeaturedProperties = () => {
  return useQuery({
    queryKey: ['properties', 'featured'],
    queryFn: async () => {
      const { data, error } = await supabase
        .from('properties')
        .select('*, property_images(*)')
        .eq('is_active', true)
        .eq('is_featured', true)
        .order('created_at', { ascending: false })
        .limit(4);

      if (error) throw error;
      return data as PropertyWithImages[];
    },
  });
};

// Fetch single property by slug (public)
export const usePropertyBySlug = (slug: string) => {
  return useQuery({
    queryKey: ['property', slug],
    queryFn: async () => {
      const { data, error } = await supabase
        .from('properties')
        .select('*, property_images(*)')
        .eq('slug', slug)
        .eq('is_active', true)
        .single();

      if (error) throw error;
      return data as PropertyWithImages;
    },
    enabled: !!slug,
  });
};

// Admin: Fetch all properties
export const useAllProperties = () => {
  return useQuery({
    queryKey: ['properties', 'all'],
    queryFn: async () => {
      const { data, error } = await supabase
        .from('properties')
        .select('*, property_images(*)')
        .order('created_at', { ascending: false });

      if (error) throw error;
      return data as PropertyWithImages[];
    },
  });
};

// Admin: Fetch single property by ID
export const usePropertyById = (id: string) => {
  return useQuery({
    queryKey: ['property', 'id', id],
    queryFn: async () => {
      const { data, error } = await supabase
        .from('properties')
        .select('*, property_images(*)')
        .eq('id', id)
        .single();

      if (error) throw error;
      return data as PropertyWithImages;
    },
    enabled: !!id,
  });
};

// Admin: Create property
export const useCreateProperty = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (property: PropertyInsert) => {
      const { data, error } = await supabase
        .from('properties')
        .insert(property)
        .select()
        .single();

      if (error) throw error;
      return data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['properties'] });
    },
  });
};

// Admin: Update property
export const useUpdateProperty = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async ({ id, ...updates }: PropertyUpdate & { id: string }) => {
      const { data, error } = await supabase
        .from('properties')
        .update(updates)
        .eq('id', id)
        .select()
        .single();

      if (error) throw error;
      return data;
    },
    onSuccess: (data) => {
      queryClient.invalidateQueries({ queryKey: ['properties'] });
      queryClient.invalidateQueries({ queryKey: ['property', 'id', data.id] });
      queryClient.invalidateQueries({ queryKey: ['property', data.slug] });
    },
  });
};

// Admin: Delete property
export const useDeleteProperty = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (id: string) => {
      const { error } = await supabase
        .from('properties')
        .delete()
        .eq('id', id);

      if (error) throw error;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['properties'] });
    },
  });
};

// Admin: Toggle property status
export const useTogglePropertyStatus = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async ({ id, is_active }: { id: string; is_active: boolean }) => {
      const { data, error } = await supabase
        .from('properties')
        .update({ is_active })
        .eq('id', id)
        .select()
        .single();

      if (error) throw error;
      return data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['properties'] });
    },
  });
};

// Admin: Add property image
export const useAddPropertyImage = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (image: Database['public']['Tables']['property_images']['Insert']) => {
      const { data, error } = await supabase
        .from('property_images')
        .insert(image)
        .select()
        .single();

      if (error) throw error;
      return data;
    },
    onSuccess: (data) => {
      queryClient.invalidateQueries({ queryKey: ['properties'] });
      queryClient.invalidateQueries({ queryKey: ['property', 'id', data.property_id] });
    },
  });
};

// Admin: Delete property image
export const useDeletePropertyImage = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (id: string) => {
      const { error } = await supabase
        .from('property_images')
        .delete()
        .eq('id', id);

      if (error) throw error;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['properties'] });
    },
  });
};

// Admin: Update property image
export const useUpdatePropertyImage = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async ({ id, ...updates }: { id: string; display_order?: number; is_primary?: boolean; alt_text?: string }) => {
      const { data, error } = await supabase
        .from('property_images')
        .update(updates)
        .eq('id', id)
        .select()
        .single();

      if (error) throw error;
      return data;
    },
    onSuccess: (data) => {
      queryClient.invalidateQueries({ queryKey: ['properties'] });
      queryClient.invalidateQueries({ queryKey: ['property', 'id', data.property_id] });
    },
  });
};
