import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { supabase } from '../lib/supabase';

const schema = 'biz_support_app';
const table = 'tasks';

type Task = {
  id?: string;
  client_id: string;
  title: string;
  status: 'not_started' | 'in_progress' | 'complete';
  due_date?: string;
  created_at?: string;
};

export function useTasks(clientId: string) {
  const queryClient = useQueryClient();

  const tasks = useQuery({
    queryKey: ['tasks', clientId],
    queryFn: async (): Promise<Task[]> => {
      const { data, error } = await supabase
        .from(`${schema}.${table}`)
        .select('*')
        .eq('client_id', clientId)
        .order('due_date', { ascending: true });

      if (error) throw error;
      return data;
    },
    enabled: !!clientId,
  });

  const createTask = useMutation({
    mutationFn: async (task: Task) => {
      const { data, error } = await supabase
        .from(`${schema}.${table}`)
        .insert(task)
        .select()
        .single();

      if (error) throw error;
      return data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['tasks', clientId] });
    },
  });

  return {
    tasks,
    createTask,
  };
}
