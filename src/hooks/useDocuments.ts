import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { getClientDocuments, createDocument, uploadDocument } from '../lib/supabase';

export function useDocuments(clientId: string) {
  const queryClient = useQueryClient();

  const documents = useQuery({
    queryKey: ['documents', clientId],
    queryFn: () => getClientDocuments(clientId),
    enabled: !!clientId, // only run if clientId is available
  });

  const uploadMutation = useMutation({
    mutationFn: async ({
      file,
      name,
      type,
      description,
      status,
    }: {
      file: File;
      name: string;
      type: string;
      description?: string;
      status: string;
    }) => {
      const path = `${clientId}/${Date.now()}-${file.name}`;
      await uploadDocument(file, path);

      return createDocument({
        client_id: clientId,
        name,
        type,
        description,
        status,
        file_path: path,
      });
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['documents', clientId] });
    },
  });

  return {
    documents,
    uploadDocument: uploadMutation,
  };
}
