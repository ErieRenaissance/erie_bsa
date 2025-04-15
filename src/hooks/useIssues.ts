import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { supabase } from '../lib/supabase';

const schema = 'biz_support_app';
const table = 'issues';

type Issue = {
  id?: string;
  client_id?: string;
  description: string;
  root_cause?: string;
  created_at?: string;
};

export function useIssues(clientId: string) {
  const queryClient = useQueryClient();

  const issues = useQuery({
    queryKey: ['issues', clientId],
    queryFn: async (): Promise<Issue[]> => {
      const { data, error } = await supabase
        .from(`${schema}.${table}`)
        .select('*')
        .eq('client_id', clientId)
        .order('created_at', { ascending: false });

      if (error) throw error;
      return data;
    },
    enabled: !!clientId,
  });

  const createIssue = useMutation({
    mutationFn: async (issue: Issue) => {
      const { data, error } = await supabase
        .from(`${schema}.${table}`)
        .insert(issue)
        .select()
        .single();

      if (error) throw error;
      return data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['issues', clientId] });
    },
  });

  return { issues, createIssue };
}
