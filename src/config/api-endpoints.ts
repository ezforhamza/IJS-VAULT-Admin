/**
 * Centralized API Endpoints Configuration
 *
 * All API endpoints are defined here to avoid hardcoding URLs in service files.
 * This makes it easier to update endpoints and maintain consistency.
 */

export const API_ENDPOINTS = {
	// Authentication
	AUTH: {
		LOGIN: "/auth/login",
		LOGOUT: "/auth/logout",
		REFRESH: "/auth/refresh-tokens",
	},

	// Dashboard
	DASHBOARD: {
		STATS: "/admin/dashboard",
		PLATFORM_STATS: "/admin/stats",
		STORAGE_STATS: "/admin/storage/stats",
	},

	// User Management
	USERS: {
		LIST: "/admin/users",
		DETAIL: "/admin/users/:id",
		UPDATE_STATUS: "/admin/users/:id/status",
		SUSPEND: "/admin/users/:id/suspend",
		ACTIVATE: "/admin/users/:id/activate",
		LOGOUT_ALL: "/admin/users/:id/logout-all",
		DELETE: "/admin/users/:id",
		EXPORT: "/admin/users/export",
	},

	// Session Management
	SESSIONS: {
		LIST: "/admin/sessions",
		STATS: "/admin/sessions/stats",
		TERMINATE: "/admin/sessions/:id",
	},

	// Legal Pages
	LEGAL: {
		LIST: "/admin/legal",
		GET_BY_TYPE: "/admin/legal/:type",
		CREATE: "/admin/legal",
		UPDATE: "/admin/legal/:type",
		PUBLIC: "/legal/:type",
	},

	// Notifications
	NOTIFICATIONS: {
		LIST: "/admin/notifications",
		GET_BY_ID: "/admin/notifications/:id",
		SEND_ALL: "/admin/notifications/send-all",
		SEND: "/admin/notifications/send",
		STATS: "/admin/notifications/stats",
	},

	// Admin Activity
	ACTIVITY: {
		PROFILE: "/admin/profile",
		TIMELINE: "/admin/activity/timeline",
		LIST: "/admin/activity",
		STATS: "/admin/activity/stats",
	},

	// Settings
	SETTINGS: {
		GLOBAL: "/admin/settings",
		REVENUE: "/admin/billing/revenue",
		SUBSCRIPTIONS: "/admin/billing/subscriptions",
	},
} as const;

/**
 * Helper to replace URL parameters
 * Example: replaceParams('/users/:id', { id: '123' }) => '/users/123'
 */
export function replaceUrlParams(url: string, params: Record<string, string | number>): string {
	let result = url;
	Object.entries(params).forEach(([key, value]) => {
		result = result.replace(`:${key}`, String(value));
	});
	return result;
}
