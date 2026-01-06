/**
 * Admin Activity Hooks
 *
 * React Query hooks for admin activity operations
 */

import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { toast } from "sonner";

import activityService, {
	type GetActivityParams,
	type UpdateAdminProfileRequest,
} from "@/api/services/activityService";

// Query keys
export const activityKeys = {
	all: ["admin-activity"] as const,
	profile: () => [...activityKeys.all, "profile"] as const,
	timeline: (params?: GetActivityParams) => [...activityKeys.all, "timeline", params] as const,
	list: (params?: GetActivityParams) => [...activityKeys.all, "list", params] as const,
	stats: () => [...activityKeys.all, "stats"] as const,
};

/**
 * Fetch admin profile with recent activity
 */
export function useAdminProfile() {
	return useQuery({
		queryKey: activityKeys.profile(),
		queryFn: () => activityService.getAdminProfile(),
	});
}

/**
 * Update admin profile
 */
export function useUpdateAdminProfile() {
	const queryClient = useQueryClient();

	return useMutation({
		mutationFn: (data: UpdateAdminProfileRequest) => activityService.updateAdminProfile(data),
		onSuccess: () => {
			queryClient.invalidateQueries({ queryKey: activityKeys.profile() });
			toast.success("Profile updated successfully");
		},
		onError: () => {
			toast.error("Failed to update profile");
		},
	});
}

/**
 * Fetch activity timeline (current admin's activities)
 */
export function useActivityTimeline(params?: GetActivityParams) {
	return useQuery({
		queryKey: activityKeys.timeline(params),
		queryFn: () => activityService.getActivityTimeline(params),
	});
}

/**
 * Fetch all activities (from all admins)
 */
export function useAllActivities(params?: GetActivityParams) {
	return useQuery({
		queryKey: activityKeys.list(params),
		queryFn: () => activityService.getAllActivities(params),
	});
}

/**
 * Fetch activity statistics
 */
export function useActivityStats() {
	return useQuery({
		queryKey: activityKeys.stats(),
		queryFn: () => activityService.getActivityStats(),
	});
}
