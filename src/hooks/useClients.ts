import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { getClient, getClients, createClient, updateClient } from '../lib/supabase';

export function useClients() {
  const queryClient = useQueryClient();

  const clients = useQuery({
    queryKey: ['clients'],
    queryFn: getClients,
  });

  const createMutation = useMutation({
    mutationFn: createClient,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['clients'] });
    },
  });

  const updateMutation = useMutation({
    mutationFn: updateClient,
    onSuccess: (data) => {
      queryClient.invalidateQueries({ queryKey: ['clients'] });
      queryClient.invalidateQueries({ queryKey: ['client', data.id] });
    },
  });

  return {
    clients,
    createClient: createMutation,
    updateClient: updateMutation,
  };
}

export function useClient(id: string) {
  return useQuery({
    queryKey: ['client', id],
    queryFn: () => getClient(id),
    enabled: !!id, // prevents query from running if id is undefined
  });
}
