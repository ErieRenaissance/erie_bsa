import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { getClientAssessments, createAssessment } from '../lib/supabase';

export function useAssessments(clientId: string) {
  const queryClient = useQueryClient();

  const assessments = useQuery({
    queryKey: ['assessments', clientId],
    queryFn: () => getClientAssessments(clientId),
    enabled: !!clientId, // prevents query from firing prematurely
  });

  const createMutation = useMutation({
    mutationFn: createAssessment,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['assessments', clientId] });
    },
  });

  return {
    assessments,
    createAssessment: createMutation,
  };
}
