/**
 * User Management Hooks
 *
 * React Query hooks for user CRUD operations
 */

import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { toast } from "sonner";

import ijsUserService from "@/api/services/ijsUserService";
import type {
	BulkActivateUsersRequest,
	BulkDeleteUsersRequest,
	BulkSuspendUsersRequest,
	ExportUsersRequest,
	GetUsersParams,
} from "@/types/user-management";

// Query keys
export const userKeys = {
	all: ["ijs-users"] as const,
	lists: () => [...userKeys.all, "list"] as const,
	list: (params: GetUsersParams) => [...userKeys.lists(), params] as const,
	details: () => [...userKeys.all, "detail"] as const,
	detail: (id: string) => [...userKeys.details(), id] as const,
};

/**
 * Fetch users list with pagination and filters
 */
export function useUsersList(params: GetUsersParams) {
	return useQuery({
		queryKey: userKeys.list(params),
		queryFn: () => ijsUserService.getUsersList(params),
	});
}

/**
 * Fetch single user detail
 */
export function useUserDetail(userId: string) {
	return useQuery({
		queryKey: userKeys.detail(userId),
		queryFn: () => ijsUserService.getUserDetail(userId),
		enabled: !!userId,
	});
}

/**
 * Delete single user
 */
export function useDeleteUser() {
	const queryClient = useQueryClient();

	return useMutation({
		mutationFn: ijsUserService.deleteUser,
		onSuccess: () => {
			queryClient.invalidateQueries({ queryKey: userKeys.lists() });
			toast.success("User deleted successfully");
		},
		onError: () => {
			toast.error("Failed to delete user");
		},
	});
}

/**
 * Bulk delete users
 */
export function useBulkDeleteUsers() {
	const queryClient = useQueryClient();

	return useMutation({
		mutationFn: (data: BulkDeleteUsersRequest) => ijsUserService.bulkDeleteUsers(data),
		onSuccess: (_, variables) => {
			queryClient.invalidateQueries({ queryKey: userKeys.lists() });
			toast.success(`${variables.userIds.length} users deleted successfully`);
		},
		onError: () => {
			toast.error("Failed to delete users");
		},
	});
}

/**
 * Bulk suspend users
 */
export function useBulkSuspendUsers() {
	const queryClient = useQueryClient();

	return useMutation({
		mutationFn: (data: BulkSuspendUsersRequest) => ijsUserService.bulkSuspendUsers(data),
		onSuccess: (_, variables) => {
			queryClient.invalidateQueries({ queryKey: userKeys.lists() });
			toast.success(`${variables.userIds.length} user(s) suspended successfully`);
		},
		onError: () => {
			toast.error("Failed to suspend users");
		},
	});
}

/**
 * Bulk activate users
 */
export function useBulkActivateUsers() {
	const queryClient = useQueryClient();

	return useMutation({
		mutationFn: (data: BulkActivateUsersRequest) => ijsUserService.bulkActivateUsers(data),
		onSuccess: (_, variables) => {
			queryClient.invalidateQueries({ queryKey: userKeys.lists() });
			toast.success(`${variables.userIds.length} user(s) activated successfully`);
		},
		onError: () => {
			toast.error("Failed to activate users");
		},
	});
}

/**
 * Suspend single user
 */
export function useSuspendUser() {
	const queryClient = useQueryClient();

	return useMutation({
		mutationFn: ({ userId, reason }: { userId: string; reason?: string }) => ijsUserService.suspendUser(userId, reason),
		onSuccess: () => {
			queryClient.invalidateQueries({ queryKey: userKeys.lists() });
			queryClient.invalidateQueries({ queryKey: userKeys.details() });
			toast.success("User suspended successfully");
		},
		onError: () => {
			toast.error("Failed to suspend user");
		},
	});
}

/**
 * Activate single user
 */
export function useActivateUser() {
	const queryClient = useQueryClient();

	return useMutation({
		mutationFn: (userId: string) => ijsUserService.activateUser(userId),
		onSuccess: () => {
			queryClient.invalidateQueries({ queryKey: userKeys.lists() });
			queryClient.invalidateQueries({ queryKey: userKeys.details() });
			toast.success("User activated successfully");
		},
		onError: () => {
			toast.error("Failed to activate user");
		},
	});
}

/**
 * Update user status
 */
export function useUpdateUserStatus() {
	const queryClient = useQueryClient();

	return useMutation({
		mutationFn: ({ userId, status, reason }: { userId: string; status: string; reason?: string }) =>
			ijsUserService.updateUserStatus(userId, { status, reason }),
		onSuccess: () => {
			queryClient.invalidateQueries({ queryKey: userKeys.lists() });
			queryClient.invalidateQueries({ queryKey: userKeys.details() });
			toast.success("User status updated successfully");
		},
		onError: () => {
			toast.error("Failed to update user status");
		},
	});
}

/**
 * Export users to CSV/Excel
 */
export function useExportUsers() {
	return useMutation({
		mutationFn: (params: ExportUsersRequest) => ijsUserService.exportUsers(params),
		onSuccess: (response) => {
			// Dynamically import export utilities
			import("@/utils/export").then(({ exportUsersToCSV, exportUsersToExcel, downloadBlob }) => {
				const { users, format } = response;

				if (users.length === 0) {
					toast.error("No users to export");
					return;
				}

				const blob = format === "csv" ? exportUsersToCSV(users) : exportUsersToExcel(users);
				const filename = `ijs-vault-users-${new Date().toISOString().split("T")[0]}.${format === "csv" ? "csv" : "xlsx"}`;

				downloadBlob(blob, filename);
				toast.success(`${users.length} users exported successfully`);
			});
		},
		onError: () => {
			toast.error("Failed to export users");
		},
	});
}
