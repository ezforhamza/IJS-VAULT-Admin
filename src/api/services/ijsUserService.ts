/**
 * IJS VAULT User Management Service
 *
 * API service for user and session management operations
 */

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
  LogoutSessionRequest,
  UserSession,
} from '@/types/user-management';

import { API_ENDPOINTS, replaceUrlParams } from '@/config/api-endpoints';
import apiClient from '../apiClient';

/**
 * Get paginated users list with filters
 */
const getUsersList = (params: GetUsersParams) =>
  apiClient.get<GetUsersResponse>({
    url: API_ENDPOINTS.USERS.LIST,
    params,
  });

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
 * Bulk delete users
 */
const bulkDeleteUsers = (data: BulkDeleteUsersRequest) =>
  apiClient.post<void>({
    url: API_ENDPOINTS.USERS.BULK_DELETE,
    data,
  });

/**
 * Bulk suspend users
 */
const bulkSuspendUsers = (data: BulkSuspendUsersRequest) =>
  apiClient.post<void>({
    url: API_ENDPOINTS.USERS.BULK_SUSPEND,
    data,
  });

/**
 * Bulk activate users
 */
const bulkActivateUsers = (data: BulkActivateUsersRequest) =>
  apiClient.post<void>({
    url: API_ENDPOINTS.USERS.BULK_ACTIVATE,
    data,
  });

/**
 * Get user sessions
 */
const getUserSessions = (userId: string) =>
  apiClient.get<UserSession[]>({
    url: replaceUrlParams(API_ENDPOINTS.USERS.SESSIONS, { id: userId }),
  });

/**
 * Force logout single session
 */
const logoutSession = ({ userId, sessionId }: LogoutSessionRequest) =>
  apiClient.post<void>({
    url: replaceUrlParams(API_ENDPOINTS.USERS.LOGOUT_SESSION, { id: userId, sessionId }),
  });

/**
 * Force logout all user sessions
 */
const logoutAllSessions = (userId: string) =>
  apiClient.post<void>({
    url: replaceUrlParams(API_ENDPOINTS.USERS.LOGOUT_ALL, { id: userId }),
  });

/**
 * Export users to CSV/Excel
 */
const exportUsers = (params: ExportUsersRequest) =>
  apiClient.get<Blob>({
    url: API_ENDPOINTS.USERS.EXPORT,
    params,
    responseType: 'blob',
  });

/**
 * Get all sessions (paginated, filterable)
 */
const getAllSessions = (params: GetSessionsParams) =>
  apiClient.get<GetSessionsResponse>({
    url: API_ENDPOINTS.SESSIONS.LIST,
    params,
  });

/**
 * Bulk logout sessions
 */
const bulkLogoutSessions = (data: BulkLogoutSessionsRequest) =>
  apiClient.post<void>({
    url: API_ENDPOINTS.SESSIONS.BULK_LOGOUT,
    data,
  });

export default {
  getUsersList,
  getUserDetail,
  deleteUser,
  bulkDeleteUsers,
  bulkSuspendUsers,
  bulkActivateUsers,
  getUserSessions,
  logoutSession,
  logoutAllSessions,
  exportUsers,
  getAllSessions,
  bulkLogoutSessions,
};
