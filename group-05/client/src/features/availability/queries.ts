import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { availabilityService, type AvailabilityExceptionInput, type AvailabilityWindowInput } from "../../services/availability";

export const availabilityKeys = {
  windows: ["availability", "windows"] as const,
  lecturerSlots: (start: string, end: string) => ["availability", "lecturer-slots", start, end] as const,
  supervisors: ["availability", "supervisors"] as const,
  supervisorSlots: (lecturerId: string, start: string, end: string) =>
    ["availability", "supervisor-slots", lecturerId, start, end] as const
};

export const useLecturerAvailabilityWindows = () =>
  useQuery({
    queryKey: availabilityKeys.windows,
    queryFn: availabilityService.lecturerWindows
  });

export const useLecturerSlots = (start: string, end: string) =>
  useQuery({
    queryKey: availabilityKeys.lecturerSlots(start, end),
    queryFn: () => availabilityService.lecturerSlots(start, end)
  });

export const useStudentSupervisors = () =>
  useQuery({
    queryKey: availabilityKeys.supervisors,
    queryFn: availabilityService.studentSupervisors
  });

export const useSupervisorSlots = (lecturerId: string | undefined, start: string, end: string) =>
  useQuery({
    queryKey: availabilityKeys.supervisorSlots(lecturerId ?? "none", start, end),
    queryFn: () => availabilityService.supervisorSlots(lecturerId!, start, end),
    enabled: Boolean(lecturerId)
  });

export const useCreateAvailabilityWindow = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (input: AvailabilityWindowInput) => availabilityService.createWindow(input),
    onSuccess: async () => {
      await queryClient.invalidateQueries({ queryKey: ["availability"] });
      await queryClient.invalidateQueries({ queryKey: ["dashboard"] });
    }
  });
};

export const useDeleteAvailabilityWindow = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (id: string) => availabilityService.deleteWindow(id),
    onSuccess: async () => {
      await queryClient.invalidateQueries({ queryKey: ["availability"] });
      await queryClient.invalidateQueries({ queryKey: ["dashboard"] });
    }
  });
};

export const useCreateAvailabilityException = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: ({ windowId, input }: { windowId: string; input: AvailabilityExceptionInput }) =>
      availabilityService.createException(windowId, input),
    onSuccess: async () => {
      await queryClient.invalidateQueries({ queryKey: ["availability"] });
    }
  });
};
