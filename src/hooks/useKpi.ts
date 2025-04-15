import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { supabase } from '../lib/supabase';

const schema = 'biz_support_app';
const table = 'kpis';

type Kpi = {
  id?: string;
  client_id: string;
  name: string;
  value: number;
  recorded_at?: string;
};

export function useKpis(clientId: string) {
  const queryClient = useQueryClient();

  const kpis = useQuery({
    queryKey: ['kpis', clientId],
    queryFn: async (): Promise<Kpi[]> => {
      const { data, error } = await supabase
        .from(`${schema}.${table}`)
        .select('*')
        .eq('client_id', clientId)
        .order('recorded_at', { ascending: false });

      if (error) throw error;
      return data;
    },
    enabled: !!clientId,
  });

  const createKpi = useMutation({
    mutationFn: async (kpi: Kpi) => {
      const { data, error } = await supabase
        .from(`${schema}.${table}`)
        .insert(kpi)
        .select()
        .single();

      if (error) throw error;
      return data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['kpis', clientId] });
    },
  });

  return { kpis, createKpi };
}
