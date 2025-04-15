import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { supabase } from '../lib/supabase';

const schema = 'biz_support_app';
const table = 'settings';

type Setting = {
  key: string;
  value: string;
  updated_at?: string;
};

export function useSettings() {
  const queryClient = useQueryClient();

  const settings = useQuery({
    queryKey: ['settings'],
    queryFn: async (): Promise<Setting[]> => {
      const { data, error } = await supabase
        .from(`${schema}.${table}`)
        .select('*');

      if (error) throw error;
      return data;
    },
  });

  const updateSetting = useMutation({
    mutationFn: async (setting: Setting) => {
      const { data, error } = await supabase
        .from(`${schema}.${table}`)
        .upsert(setting, { onConflict: ['key'] })
        .select()
        .single();

      if (error) throw error;
      return data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['settings'] });
    },
  });

  return { settings, updateSetting };
}
