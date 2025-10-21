/**
 * Centralized API Endpoints Configuration
 *
 * All API endpoints are defined here to avoid hardcoding URLs in service files.
 * This makes it easier to update endpoints and maintain consistency.
 */

export const API_ENDPOINTS = {
	// User Management
	USERS: {
		LIST: "/users",
		DETAIL: "/users/:id",
		CREATE: "/users",
		UPDATE: "/users/:id",
		DELETE: "/users/:id",
		BULK_DELETE: "/users/bulk-delete",
		BULK_SUSPEND: "/users/bulk-suspend",
		BULK_ACTIVATE: "/users/bulk-activate",
		SESSIONS: "/users/:id/sessions",
		LOGOUT_SESSION: "/users/:id/sessions/:sessionId/logout",
		LOGOUT_ALL: "/users/:id/sessions/logout-all",
		EXPORT: "/users/export",
	},

	// Session Management
	SESSIONS: {
		LIST: "/sessions",
		ACTIVE: "/sessions/active",
		TERMINATE: "/sessions/:id/terminate",
		BULK_LOGOUT: "/sessions/bulk-logout",
	},

	// Legal Pages
	LEGAL: {
		PAGE: "/legal/:slug",
	},

	// Notifications
	NOTIFICATIONS: {
		SEND: "/notifications/send",
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
