/**
 * Admin Activity Service
 *
 * API service for admin activity tracking and audit logs
 */

import { API_ENDPOINTS } from "@/config/api-endpoints";
import apiClient from "../apiClient";

/**
 * Activity action types
 */
export type ActivityAction =
	| "user_suspended"
	| "user_activated"
	| "user_status_changed"
	| "user_deleted"
	| "users_exported"
	| "session_terminated"
	| "sessions_terminated"
	| "legal_page_created"
	| "legal_page_updated"
	| "notification_sent";

/**
 * Admin profile response
 */
export interface AdminProfile {
	id: string;
	fullName: string;
	email: string;
	phone?: string;
	image?: string | null;
	role: string;
	createdAt: string;
	lastLoginAt: string;
}

/**
 * Activity item
 */
export interface ActivityItem {
	id: string;
	action: ActivityAction;
	description: string;
	details?: Record<string, any>;
	targetUser?: {
		id: string;
		fullName: string;
		email?: string;
	} | null;
	admin?: {
		id: string;
		fullName: string;
		email: string;
	};
	ipAddress?: string;
	createdAt: string;
}

/**
 * Admin profile with recent activity response
 */
export interface GetAdminProfileResponse {
	profile: AdminProfile;
	recentActivity: ActivityItem[];
}

/**
 * Activity timeline/list params
 */
export interface GetActivityParams {
	page?: number;
	limit?: number;
	action?: ActivityAction;
}

/**
 * Activity list response
 */
export interface GetActivityResponse {
	results: ActivityItem[];
	page: number;
	limit: number;
	totalPages: number;
	totalResults: number;
}

/**
 * Activity stats response
 */
export interface ActivityStats {
	today: number;
	last7Days: number;
	last30Days: number;
	byAction: Array<{
		action: ActivityAction;
		count: number;
	}>;
}

/**
 * Update admin profile request
 */
export interface UpdateAdminProfileRequest {
	fullName?: string;
	phone?: string;
	image?: string;
}

/**
 * Get admin profile with recent activity
 */
const getAdminProfile = () =>
	apiClient.get<GetAdminProfileResponse>({
		url: API_ENDPOINTS.ACTIVITY.PROFILE,
	});

/**
 * Update admin profile
 */
const updateAdminProfile = (data: UpdateAdminProfileRequest) =>
	apiClient.put<{ profile: AdminProfile }>({
		url: API_ENDPOINTS.ACTIVITY.PROFILE,
		data,
	});

/**
 * Get activity timeline (current admin's activities)
 */
const getActivityTimeline = async (params?: GetActivityParams): Promise<GetActivityResponse> => {
	const response = await apiClient.get<any>({
		url: API_ENDPOINTS.ACTIVITY.TIMELINE,
		params,
	});

	return {
		results: response.results || [],
		page: response.page || 1,
		limit: response.limit || 20,
		totalPages: response.totalPages || 1,
		totalResults: response.totalResults || 0,
	};
};

/**
 * Get all activities (from all admins)
 */
const getAllActivities = async (params?: GetActivityParams): Promise<GetActivityResponse> => {
	const response = await apiClient.get<any>({
		url: API_ENDPOINTS.ACTIVITY.LIST,
		params,
	});

	return {
		results: response.results || [],
		page: response.page || 1,
		limit: response.limit || 20,
		totalPages: response.totalPages || 1,
		totalResults: response.totalResults || 0,
	};
};

/**
 * Get activity statistics
 */
const getActivityStats = () =>
	apiClient.get<{ stats: ActivityStats }>({
		url: API_ENDPOINTS.ACTIVITY.STATS,
	});

export default {
	getAdminProfile,
	updateAdminProfile,
	getActivityTimeline,
	getAllActivities,
	getActivityStats,
};
