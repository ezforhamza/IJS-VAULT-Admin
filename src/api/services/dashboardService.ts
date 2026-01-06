/**
 * Dashboard Service
 *
 * API service for dashboard statistics
 */

import { API_ENDPOINTS } from "@/config/api-endpoints";
import apiClient from "../apiClient";

export interface DashboardStats {
	totalUsers: number;
	activeUsers: number;
	inactiveUsers: number;
	suspendedUsers: number;
	activeSessions: number;
	userStatusDistribution: Array<{ status: string; count: number }>;
	sessionsByDevice: Array<{ device: string; count: number }>;
}

export interface PlatformStats {
	users: {
		total: number;
		active: number;
		inactive: number;
		suspended: number;
	};
	sessions: {
		active: number;
	};
	items: {
		total: number;
		folders: number;
		files: number;
	};
	storage: {
		totalUsed: number;
		totalLimit: number;
		usagePercentage: string;
	};
	plans: {
		free: number;
		basic: number;
		premium: number;
		enterprise: number;
	};
}

export interface StorageStats {
	topUsers: Array<{
		id: string;
		name: string;
		email: string;
		storageUsed: number;
		storageLimit: number;
		usagePercentage: string;
		plan: string;
	}>;
	byPlan: Array<{
		_id: string;
		totalUsed: number;
		totalLimit: number;
		userCount: number;
	}>;
}

/**
 * Get dashboard statistics
 */
const getDashboardStats = async (): Promise<DashboardStats> => {
	const response = await apiClient.get<any>({
		url: API_ENDPOINTS.DASHBOARD.STATS,
	});
	return response.stats || response;
};

/**
 * Get platform statistics
 */
const getPlatformStats = async (): Promise<PlatformStats> => {
	const response = await apiClient.get<any>({
		url: API_ENDPOINTS.DASHBOARD.PLATFORM_STATS,
	});
	return response.stats || response;
};

/**
 * Get storage statistics
 */
const getStorageStats = async (): Promise<StorageStats> => {
	const response = await apiClient.get<any>({
		url: API_ENDPOINTS.DASHBOARD.STORAGE_STATS,
	});
	return response.stats || response;
};

export default {
	getDashboardStats,
	getPlatformStats,
	getStorageStats,
};
