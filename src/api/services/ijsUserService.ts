/**
 * IJS VAULT User Management Service
 *
 * API service for user and session management operations
 */

import { API_ENDPOINTS, replaceUrlParams } from "@/config/api-endpoints";
import type {
	BulkActivateUsersRequest,
	BulkDeleteUsersRequest,
	BulkLogoutSessionsRequest,
	BulkSuspendUsersRequest,
	ExportUsersRequest,
	GetSessionsParams,
	GetSessionsResponse,
	GetUserDetailResponse,
	GetUsersParams,
	GetUsersResponse,
} from "@/types/user-management";
import apiClient from "../apiClient";

/**
 * Get paginated users list with filters
 * Transforms API response to match frontend expected format
 */
const getUsersList = async (params: GetUsersParams): Promise<GetUsersResponse> => {
	const response = await apiClient.get<any>({
		url: API_ENDPOINTS.USERS.LIST,
		params,
	});

	// Transform API response to frontend format
	return {
		users: response.results || [],
		total: response.totalResults || 0,
		page: response.page || 1,
		limit: response.limit || 10,
		totalPages: response.totalPages || 1,
	};
};

/**
 * Get single user detail with sessions
 */
const getUserDetail = (userId: string) =>
	apiClient.get<GetUserDetailResponse>({
		url: replaceUrlParams(API_ENDPOINTS.USERS.DETAIL, { id: userId }),
	});

/**
 * Delete single user
 */
const deleteUser = (userId: string) =>
	apiClient.delete<void>({
		url: replaceUrlParams(API_ENDPOINTS.USERS.DELETE, { id: userId }),
	});

/**
 * Update user status
 */
const updateUserStatus = (userId: string, data: { status: string; reason?: string }) =>
	apiClient.put<any>({
		url: replaceUrlParams(API_ENDPOINTS.USERS.UPDATE_STATUS, { id: userId }),
		data,
	});

/**
 * Suspend user
 */
const suspendUser = (userId: string, reason?: string) =>
	apiClient.post<any>({
		url: replaceUrlParams(API_ENDPOINTS.USERS.SUSPEND, { id: userId }),
		data: { reason },
	});

/**
 * Activate user
 */
const activateUser = (userId: string) =>
	apiClient.post<any>({
		url: replaceUrlParams(API_ENDPOINTS.USERS.ACTIVATE, { id: userId }),
	});

/**
 * Bulk delete users (not in real API - keeping for compatibility)
 */
const bulkDeleteUsers = (data: BulkDeleteUsersRequest) => Promise.all(data.userIds.map((id) => deleteUser(id)));

/**
 * Bulk suspend users (not in real API - keeping for compatibility)
 */
const bulkSuspendUsers = (data: BulkSuspendUsersRequest) => Promise.all(data.userIds.map((id) => suspendUser(id)));

/**
 * Bulk activate users (not in real API - keeping for compatibility)
 */
const bulkActivateUsers = (data: BulkActivateUsersRequest) => Promise.all(data.userIds.map((id) => activateUser(id)));

/**
 * Get user sessions
 */
const getUserSessions = (userId: string) =>
	apiClient
		.get<any>({
			url: replaceUrlParams(API_ENDPOINTS.USERS.DETAIL, { id: userId }),
		})
		.then((response) => response.sessions || []);

/**
 * Force logout single session (legacy method for user detail page)
 */
const logoutSession = ({ sessionId }: { userId: string; sessionId: string }) => terminateSession(sessionId);

/**
 * Force logout all user sessions
 */
const logoutAllSessions = (userId: string) =>
	apiClient.post<void>({
		url: replaceUrlParams(API_ENDPOINTS.USERS.LOGOUT_ALL, { id: userId }),
	});

/**
 * Terminate single session
 */
const terminateSession = (sessionId: string) =>
	apiClient.delete<void>({
		url: replaceUrlParams(API_ENDPOINTS.SESSIONS.TERMINATE, { id: sessionId }),
	});

/**
 * Export users to CSV/Excel
 * Uses dedicated export endpoint that returns all users
 */
const exportUsers = async (params: ExportUsersRequest) => {
	const response = await apiClient.get<any>({
		url: API_ENDPOINTS.USERS.EXPORT,
		params: params.filters?.status ? { status: params.filters.status } : undefined,
	});

	return {
		users: response.users || [],
		count: response.count || 0,
		format: params.format,
	};
};

/**
 * Get all sessions (paginated, filterable)
 * Transforms API response to match frontend expected format
 */
const getAllSessions = async (params: GetSessionsParams): Promise<GetSessionsResponse> => {
	const response = await apiClient.get<any>({
		url: API_ENDPOINTS.SESSIONS.LIST,
		params,
	});

	// Transform API response to frontend format
	return {
		sessions: response.results || [],
		total: response.totalResults || 0,
		page: response.page || 1,
		limit: response.limit || 10,
		totalPages: response.totalPages || 1,
	};
};

/**
 * Bulk logout sessions (not in real API - keeping for compatibility)
 */
const bulkLogoutSessions = (data: BulkLogoutSessionsRequest) =>
	Promise.all(data.sessionIds.map((id) => terminateSession(id)));

/**
 * Get session statistics
 */
const getSessionStats = () =>
	apiClient.get<any>({
		url: API_ENDPOINTS.SESSIONS.STATS,
	});

export default {
	getUsersList,
	getUserDetail,
	deleteUser,
	updateUserStatus,
	suspendUser,
	activateUser,
	bulkDeleteUsers,
	bulkSuspendUsers,
	bulkActivateUsers,
	getUserSessions,
	logoutSession,
	logoutAllSessions,
	terminateSession,
	exportUsers,
	getAllSessions,
	getSessionStats,
	bulkLogoutSessions,
};
