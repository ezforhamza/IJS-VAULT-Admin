/**
 * User Management Types
 *
 * Type definitions for IJS VAULT user management and session tracking
 */

// User status enum
export type UserStatus = 'active' | 'inactive' | 'suspended';

// User role enum
export type UserRole = 'user' | 'group_admin';

// Device type enum
export type DeviceType = 'android' | 'ios' | 'huawei' | 'web';

/**
 * IJS VAULT User
 */
export interface IJSUser {
  id: string;
  username: string;
  email: string;
  phone: string;
  avatar: string;
  status: UserStatus;
  role: UserRole;
  createdAt: string;
  lastLogin: string;
  storageUsed: number; // in MB
  categoriesCount: number;
  subcategoriesCount: number;
  activeSessionsCount: number;
}

/**
 * User Session
 */
export interface UserSession {
  id: string;
  userId: string;
  deviceType: DeviceType;
  deviceName: string;
  deviceModel?: string;
  ipAddress: string;
  location?: string;
  loginAt: string;
  lastActivity: string;
  isActive: boolean;
}

/**
 * Get Users Request Parameters
 */
export interface GetUsersParams {
  page: number;
  pageSize: number;
  search?: string;
  status?: UserStatus;
  role?: UserRole;
  sortBy?: 'username' | 'email' | 'createdAt' | 'lastLogin' | 'storageUsed';
  sortOrder?: 'asc' | 'desc';
}

/**
 * Get Users Response
 */
export interface GetUsersResponse {
  users: IJSUser[];
  total: number;
  page: number;
  pageSize: number;
}

/**
 * Get User Detail Response
 */
export interface GetUserDetailResponse {
  user: IJSUser;
  sessions: UserSession[];
}

/**
 * Bulk Delete Request
 */
export interface BulkDeleteUsersRequest {
  userIds: string[];
}

/**
 * Bulk Suspend Request
 */
export interface BulkSuspendUsersRequest {
  userIds: string[];
}

/**
 * Bulk Activate Request
 */
export interface BulkActivateUsersRequest {
  userIds: string[];
}

/**
 * Logout Session Request
 */
export interface LogoutSessionRequest {
  userId: string;
  sessionId: string;
}

/**
 * Export Users Request
 */
export interface ExportUsersRequest {
  format: 'csv' | 'excel';
  filters?: Omit<GetUsersParams, 'page' | 'pageSize'>;
}

/**
 * Session with User Info (for sessions list)
 */
export interface SessionWithUser extends UserSession {
  user: {
    id: string;
    username: string;
    email: string;
    avatar: string;
  };
}

/**
 * Get Sessions Request Parameters
 */
export interface GetSessionsParams {
  page: number;
  pageSize: number;
  search?: string;
  deviceType?: DeviceType;
}

/**
 * Get Sessions Response
 */
export interface GetSessionsResponse {
  sessions: SessionWithUser[];
  total: number;
  page: number;
  pageSize: number;
}

/**
 * Bulk Logout Sessions Request
 */
export interface BulkLogoutSessionsRequest {
  sessionIds: string[];
}
