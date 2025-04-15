import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { supabase } from '../lib/supabase';

const schema = 'biz_support_app';
const table = 'resources';

type Resource = {
  id?: string;
  name: string;
  category?: string;
  url?: string;
  created_at?: string;
};

export function useResources() {
  const queryClient = useQueryClient();

  const resources = useQuery({
    queryKey: ['resources'],
    queryFn: async (): Promise<Resource[]> => {
      const { data, error } = await supabase
        .from(`${schema}.${table}`)
        .select('*')
        .order('created_at', { ascending: false });

      if (error) throw error;
      return data;
    },
  });

  const createResource = useMutation({
    mutationFn: async (resource: Resource) => {
      const { data, error } = await supabase
        .from(`${schema}.${table}`)
        .insert(resource)
        .select()
        .single();

      if (error) throw error;
      return data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['resources'] });
    },
  });

  return { resources, createResource };
}
