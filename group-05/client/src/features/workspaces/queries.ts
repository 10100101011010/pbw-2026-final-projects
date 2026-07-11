import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { workspaceService } from "../../services/workspaces";

export const workspaceKeys = {
  list: ["workspaces"] as const
};

export const useWorkspaces = () =>
  useQuery({
    queryKey: workspaceKeys.list,
    queryFn: workspaceService.list
  });

export const useAddSessionNote = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: ({ id, title, notes }: { id: string; title: string; notes: string }) =>
      workspaceService.addNote(id, { title, notes }),
    onSuccess: async () => queryClient.invalidateQueries({ queryKey: workspaceKeys.list })
  });
};

export const useAddFeedback = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: ({
      id,
      feedback,
      visibility,
      file
    }: {
      id: string;
      feedback: string;
      visibility: "STUDENT_VISIBLE" | "PRIVATE";
      file?: File;
    }) => workspaceService.addFeedback(id, { feedback, visibility, file }),
    onSuccess: async () => queryClient.invalidateQueries({ queryKey: workspaceKeys.list })
  });
};

export const useAddRevision = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: ({ id, title, description, file }: { id: string; title: string; description?: string; file: File }) =>
      workspaceService.addRevision(id, { title, description, file }),
    onSuccess: async () => queryClient.invalidateQueries({ queryKey: workspaceKeys.list })
  });
};
