import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { notificationService } from "../../services/notifications";

export const notificationKeys = {
  list: (page: number) => ["notifications", page] as const
};

export const useNotifications = (page: number) =>
  useQuery({
    queryKey: notificationKeys.list(page),
    queryFn: () => notificationService.list(page, 20)
  });

export const useMarkNotificationRead = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (id: string) => notificationService.markRead(id),
    onSuccess: async () => {
      await queryClient.invalidateQueries({ queryKey: ["notifications"] });
      await queryClient.invalidateQueries({ queryKey: ["dashboard"] });
    }
  });
};

export const useMarkAllNotificationsRead = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: notificationService.markAllRead,
    onSuccess: async () => {
      await queryClient.invalidateQueries({ queryKey: ["notifications"] });
      await queryClient.invalidateQueries({ queryKey: ["dashboard"] });
    }
  });
};
