import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { bookingService, type CreateBookingInput } from "../../services/bookings";

export const bookingKeys = {
  list: (page: number, status?: string) => ["bookings", page, status ?? "all"] as const
};

export const useBookings = (page: number, status?: string) =>
  useQuery({
    queryKey: bookingKeys.list(page, status),
    queryFn: () => bookingService.list(page, 20, status)
  });

export const useCreateBooking = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (input: CreateBookingInput) => bookingService.create(input),
    onSuccess: async () => {
      await queryClient.invalidateQueries({ queryKey: ["bookings"] });
      await queryClient.invalidateQueries({ queryKey: ["availability"] });
      await queryClient.invalidateQueries({ queryKey: ["dashboard"] });
    }
  });
};

export const useApproveBooking = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (id: string) => bookingService.approve(id),
    onSuccess: async () => {
      await queryClient.invalidateQueries({ queryKey: ["bookings"] });
      await queryClient.invalidateQueries({ queryKey: ["dashboard"] });
    }
  });
};

export const useRejectBooking = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: ({ id, reason }: { id: string; reason?: string }) => bookingService.reject(id, reason),
    onSuccess: async () => {
      await queryClient.invalidateQueries({ queryKey: ["bookings"] });
      await queryClient.invalidateQueries({ queryKey: ["dashboard"] });
    }
  });
};

export const useCancelBooking = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: ({ id, reason }: { id: string; reason?: string }) => bookingService.cancel(id, reason),
    onSuccess: async () => {
      await queryClient.invalidateQueries({ queryKey: ["bookings"] });
      await queryClient.invalidateQueries({ queryKey: ["availability"] });
      await queryClient.invalidateQueries({ queryKey: ["dashboard"] });
    }
  });
};

export const useCompleteBooking = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (id: string) => bookingService.complete(id),
    onSuccess: async () => {
      await queryClient.invalidateQueries({ queryKey: ["bookings"] });
      await queryClient.invalidateQueries({ queryKey: ["workspaces"] });
      await queryClient.invalidateQueries({ queryKey: ["dashboard"] });
    }
  });
};
