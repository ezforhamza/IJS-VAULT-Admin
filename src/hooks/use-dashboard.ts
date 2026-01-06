/**
 * Dashboard Hooks
 *
 * React Query hooks for dashboard statistics
 */

import { useQuery } from "@tanstack/react-query";
import dashboardService from "@/api/services/dashboardService";

// Query keys
export const dashboardKeys = {
	all: ["dashboard"] as const,
	stats: () => [...dashboardKeys.all, "stats"] as const,
	platformStats: () => [...dashboardKeys.all, "platform-stats"] as const,
	storageStats: () => [...dashboardKeys.all, "storage-stats"] as const,
};

/**
 * Fetch dashboard statistics
 */
export function useDashboardStats() {
	return useQuery({
		queryKey: dashboardKeys.stats(),
		queryFn: () => dashboardService.getDashboardStats(),
	});
}

/**
 * Fetch platform statistics
 */
export function usePlatformStats() {
	return useQuery({
		queryKey: dashboardKeys.platformStats(),
		queryFn: () => dashboardService.getPlatformStats(),
	});
}

/**
 * Fetch storage statistics
 */
export function useStorageStats() {
	return useQuery({
		queryKey: dashboardKeys.storageStats(),
		queryFn: () => dashboardService.getStorageStats(),
	});
}
