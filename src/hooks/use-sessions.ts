/**
 * Session Management Hooks
 *
 * React Query hooks for user session operations
 */

import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { toast } from "sonner";

import ijsUserService from "@/api/services/ijsUserService";
import type { BulkLogoutSessionsRequest, GetSessionsParams, LogoutSessionRequest } from "@/types/user-management";

import { userKeys } from "./use-users";

// Query keys
export const sessionKeys = {
	all: ["ijs-sessions"] as const,
	lists: () => [...sessionKeys.all, "list"] as const,
	list: (params: GetSessionsParams) => [...sessionKeys.lists(), params] as const,
	userSessions: (userId: string) => [...sessionKeys.all, "user", userId] as const,
};

/**
 * Fetch all sessions list with pagination and filters
 */
export function useSessionsList(params: GetSessionsParams) {
	return useQuery({
		queryKey: sessionKeys.list(params),
		queryFn: () => ijsUserService.getAllSessions(params),
	});
}

/**
 * Fetch user sessions
 */
export function useUserSessions(userId: string) {
	return useQuery({
		queryKey: sessionKeys.userSessions(userId),
		queryFn: () => ijsUserService.getUserSessions(userId),
		enabled: !!userId,
	});
}

/**
 * Force logout single session
 */
export function useLogoutSession() {
	const queryClient = useQueryClient();

	return useMutation({
		mutationFn: (data: LogoutSessionRequest) => ijsUserService.logoutSession(data),
		onSuccess: (_, variables) => {
			queryClient.invalidateQueries({ queryKey: sessionKeys.userSessions(variables.userId) });
			queryClient.invalidateQueries({ queryKey: userKeys.detail(variables.userId) });
			toast.success("Session terminated successfully");
		},
		onError: () => {
			toast.error("Failed to terminate session");
		},
	});
}

/**
 * Force logout all user sessions
 */
export function useLogoutAllSessions() {
	const queryClient = useQueryClient();

	return useMutation({
		mutationFn: (userId: string) => ijsUserService.logoutAllSessions(userId),
		onSuccess: (_, userId) => {
			queryClient.invalidateQueries({ queryKey: sessionKeys.userSessions(userId) });
			queryClient.invalidateQueries({ queryKey: userKeys.detail(userId) });
			toast.success("All sessions terminated successfully");
		},
		onError: () => {
			toast.error("Failed to terminate sessions");
		},
	});
}

/**
 * Bulk logout sessions
 */
export function useBulkLogoutSessions() {
	const queryClient = useQueryClient();

	return useMutation({
		mutationFn: (data: BulkLogoutSessionsRequest) => ijsUserService.bulkLogoutSessions(data),
		onSuccess: (_, variables) => {
			queryClient.invalidateQueries({ queryKey: sessionKeys.lists() });
			toast.success(`${variables.sessionIds.length} session(s) terminated successfully`);
		},
		onError: () => {
			toast.error("Failed to terminate sessions");
		},
	});
}
