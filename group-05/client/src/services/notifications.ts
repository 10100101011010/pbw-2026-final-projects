import { apiRequest } from "./api";
import type { AppNotification, NotificationListResponse } from "./types";

export const notificationService = {
  list: (page = 1, pageSize = 20) =>
    apiRequest<NotificationListResponse>(`/notifications?page=${page}&pageSize=${pageSize}`),
  markRead: (id: string) => apiRequest<AppNotification>(`/notifications/${id}/read`, { method: "PATCH", body: {} }),
  markAllRead: () => apiRequest<{ updated: boolean }>("/notifications/read-all", { method: "PATCH", body: {} })
};
