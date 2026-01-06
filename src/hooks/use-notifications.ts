/**
 * Notifications Hooks
 *
 * React Query hooks for notification operations
 */

import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { toast } from "sonner";
import type { GetNotificationsParams, SendNotificationRequest } from "@/api/services/notificationService";
import notificationService from "@/api/services/notificationService";

// Query keys
export const notificationKeys = {
	all: ["notifications"] as const,
	lists: () => [...notificationKeys.all, "list"] as const,
	list: (params: GetNotificationsParams) => [...notificationKeys.lists(), params] as const,
	stats: () => [...notificationKeys.all, "stats"] as const,
};

/**
 * Fetch notifications list with pagination
 */
export function useNotifications(params: GetNotificationsParams) {
	return useQuery({
		queryKey: notificationKeys.list(params),
		queryFn: () => notificationService.getNotifications(params),
	});
}

/**
 * Get notification statistics
 */
export function useNotificationStats() {
	return useQuery({
		queryKey: notificationKeys.stats(),
		queryFn: () => notificationService.getNotificationStats(),
	});
}

/**
 * Send notification to specific users
 */
export function useSendNotification() {
	const queryClient = useQueryClient();

	return useMutation({
		mutationFn: (data: SendNotificationRequest) => notificationService.sendNotification(data),
		onSuccess: (response) => {
			queryClient.invalidateQueries({ queryKey: notificationKeys.lists() });
			queryClient.invalidateQueries({ queryKey: notificationKeys.stats() });
			toast.success(`Notification sent to ${response.recipientCount} user(s)`);
		},
		onError: () => {
			toast.error("Failed to send notification");
		},
	});
}

/**
 * Send notification to all users
 */
export function useSendNotificationToAll() {
	const queryClient = useQueryClient();

	return useMutation({
		mutationFn: (data: Omit<SendNotificationRequest, "userIds">) => notificationService.sendNotificationToAll(data),
		onSuccess: (response) => {
			queryClient.invalidateQueries({ queryKey: notificationKeys.lists() });
			queryClient.invalidateQueries({ queryKey: notificationKeys.stats() });
			toast.success(`Notification sent to ${response.recipientCount} user(s)`);
		},
		onError: () => {
			toast.error("Failed to send notification");
		},
	});
}
