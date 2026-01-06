/**
 * MSW Handlers for IJS VAULT User Management
 */

import { HttpResponse, http } from "msw";

import { API_ENDPOINTS } from "@/config/api-endpoints";
import { ResultStatus } from "@/types/enum";
import type {
	BulkActivateUsersRequest,
	BulkDeleteUsersRequest,
	BulkLogoutSessionsRequest,
	BulkSuspendUsersRequest,
	GetSessionsResponse,
	GetUserDetailResponse,
	GetUsersResponse,
	SessionWithUser,
} from "@/types/user-management";

import { DB_IJS_SESSIONS, DB_IJS_USERS } from "../assets/ijs-users";

/**
 * GET /api/users - List users with pagination and filters
 */
export const getUsersList = http.get(`/api${API_ENDPOINTS.USERS.LIST}`, ({ request }) => {
	const url = new URL(request.url);
	const page = Number(url.searchParams.get("page")) || 1;
	const pageSize = Number(url.searchParams.get("pageSize")) || 10;
	const search = url.searchParams.get("search") || "";
	const status = url.searchParams.get("status") || "";
	const role = url.searchParams.get("role") || "";

	// Filter users
	let filteredUsers = [...DB_IJS_USERS];

	if (search) {
		const searchLower = search.toLowerCase();
		filteredUsers = filteredUsers.filter(
			(user) =>
				user.username?.toLowerCase().includes(searchLower) ||
				user.email.toLowerCase().includes(searchLower) ||
				user.phone?.includes(searchLower),
		);
	}

	if (status) {
		filteredUsers = filteredUsers.filter((user) => user.status === status);
	}

	if (role) {
		filteredUsers = filteredUsers.filter((user) => user.role === role);
	}

	// Pagination
	const total = filteredUsers.length;
	const start = (page - 1) * pageSize;
	const end = start + pageSize;
	const users = filteredUsers.slice(start, end);

	const response: GetUsersResponse = {
		users,
		total,
		page,
		limit: pageSize,
		totalPages: Math.ceil(total / pageSize),
	};

	return HttpResponse.json({
		status: ResultStatus.SUCCESS,
		message: "",
		data: response,
	});
});

/**
 * GET /api/users/:id - Get user detail with sessions
 */
export const getUserDetail = http.get(`/api${API_ENDPOINTS.USERS.DETAIL}`, ({ params }) => {
	const { id } = params;
	const user = DB_IJS_USERS.find((u) => u.id === id);

	if (!user) {
		return HttpResponse.json(
			{
				status: ResultStatus.ERROR,
				message: "User not found",
				lastActivityAt: "2025-10-17T08:45:00Z",
			},
			{ status: 404 },
		);
	}

	const sessions = DB_IJS_SESSIONS.filter((s) => s.userId === id);

	const response: GetUserDetailResponse = {
		user,
		sessions,
	};

	return HttpResponse.json({
		status: ResultStatus.SUCCESS,
		message: "",
		data: response,
	});
});

/**
 * DELETE /api/users/:id - Delete user
 */
export const deleteUser = http.delete(`/api${API_ENDPOINTS.USERS.DELETE}`, ({ params }) => {
	const { id } = params;
	const userIndex = DB_IJS_USERS.findIndex((u) => u.id === id);

	if (userIndex === -1) {
		return HttpResponse.json(
			{
				status: ResultStatus.ERROR,
				message: "User not found",
				lastActivityAt: "2025-10-17T08:45:00Z",
			},
			{ status: 404 },
		);
	}

	DB_IJS_USERS.splice(userIndex, 1);

	return HttpResponse.json({
		status: ResultStatus.SUCCESS,
		message: "User deleted successfully",
		data: null,
	});
});

/**
 * POST /api/users/bulk-delete - Bulk delete users
 */
export const bulkDeleteUsers = http.post("/api/admin/users/bulk-delete", async ({ request }) => {
	const { userIds } = (await request.json()) as BulkDeleteUsersRequest;

	userIds.forEach((id) => {
		const index = DB_IJS_USERS.findIndex((u) => u.id === id);
		if (index !== -1) {
			DB_IJS_USERS.splice(index, 1);
		}
	});

	return HttpResponse.json({
		status: ResultStatus.SUCCESS,
		message: `${userIds.length} users deleted successfully`,
		data: null,
	});
});

/**
 * POST /api/users/bulk-suspend - Bulk suspend users
 */
export const bulkSuspendUsers = http.post("/api/admin/users/bulk-suspend", async ({ request }) => {
	const { userIds } = (await request.json()) as BulkSuspendUsersRequest;

	userIds.forEach((id) => {
		const user = DB_IJS_USERS.find((u) => u.id === id);
		if (user) {
			user.status = "suspended";
		}
	});

	return HttpResponse.json({
		status: ResultStatus.SUCCESS,
		message: `${userIds.length} users suspended successfully`,
		data: null,
	});
});

/**
 * POST /api/users/bulk-activate - Bulk activate users
 */
export const bulkActivateUsers = http.post("/api/admin/users/bulk-activate", async ({ request }) => {
	const { userIds } = (await request.json()) as BulkActivateUsersRequest;

	userIds.forEach((id) => {
		const user = DB_IJS_USERS.find((u) => u.id === id);
		if (user) {
			user.status = "active";
		}
	});

	return HttpResponse.json({
		status: ResultStatus.SUCCESS,
		message: `${userIds.length} users activated successfully`,
		data: null,
	});
});

/**
 * GET /api/users/:id/sessions - Get user sessions
 */
export const getUserSessions = http.get("/api/admin/users/:id/sessions", ({ params }) => {
	const { id } = params;
	const sessions = DB_IJS_SESSIONS.filter((s) => s.userId === id);

	return HttpResponse.json({
		status: ResultStatus.SUCCESS,
		message: "",
		data: sessions,
	});
});

/**
 * POST /api/users/:id/sessions/:sessionId/logout - Force logout session
 */
export const logoutSession = http.post("/api/admin/users/:id/sessions/:sessionId/logout", ({ params }) => {
	const { id, sessionId } = params;
	const session = DB_IJS_SESSIONS.find((s) => s.id === sessionId && s.userId === id);

	if (!session) {
		return HttpResponse.json(
			{
				status: ResultStatus.ERROR,
				message: "Session not found",
				lastActivityAt: "2025-10-17T08:45:00Z",
			},
			{ status: 404 },
		);
	}

	session.isActive = false;

	return HttpResponse.json({
		status: ResultStatus.SUCCESS,
		message: "Session terminated successfully",
		data: null,
	});
});

/**
 * POST /api/users/:id/sessions/logout-all - Force logout all sessions
 */
export const logoutAllSessions = http.post(`/api${API_ENDPOINTS.USERS.LOGOUT_ALL}`, ({ params }) => {
	const { id } = params;
	const userSessions = DB_IJS_SESSIONS.filter((s) => s.userId === id);

	userSessions.forEach((session) => {
		session.isActive = false;
	});

	return HttpResponse.json({
		status: ResultStatus.SUCCESS,
		message: "All sessions terminated successfully",
		data: null,
	});
});

/**
 * GET /api/users/export - Export users (mock returns CSV text)
 */
export const exportUsers = http.get(`/api${API_ENDPOINTS.USERS.EXPORT}`, ({ request }) => {
	const url = new URL(request.url);
	const format = url.searchParams.get("format") || "csv";

	// Mock CSV data
	const csvHeaders = "Username,Email,Phone,Status,Role,Storage (MB),Categories,Last Login\n";
	const csvRows = DB_IJS_USERS.map(
		(user) =>
			`${user.username},${user.email},${user.phone},${user.status},${user.role},${user.storageUsed},${0},${user.lastLogin}`,
	).join("\n");

	const csvContent = csvHeaders + csvRows;
	const blob = new Blob([csvContent], { type: format === "csv" ? "text/csv" : "application/vnd.ms-excel" });

	return new HttpResponse(blob, {
		headers: {
			"Content-Type": format === "csv" ? "text/csv" : "application/vnd.ms-excel",
			"Content-Disposition": `attachment; filename="ijs-vault-users.${format === "csv" ? "csv" : "xlsx"}"`,
		},
	});
});

/**
 * GET /api/sessions - Get all sessions with pagination and filters
 */
export const getAllSessions = http.get(`/api${API_ENDPOINTS.SESSIONS.LIST}`, ({ request }) => {
	const url = new URL(request.url);
	const page = Number(url.searchParams.get("page")) || 1;
	const pageSize = Number(url.searchParams.get("pageSize")) || 10;
	const search = url.searchParams.get("search") || "";
	const deviceType = url.searchParams.get("deviceType") || "";

	// Get active sessions with user info
	let sessionsWithUser: SessionWithUser[] = DB_IJS_SESSIONS.filter((s) => s.isActive).map((session) => {
		const user = DB_IJS_USERS.find((u) => u.id === session.userId);
		return {
			...session,
			user: {
				id: user?.id || "",
				username: user?.username || "Unknown",
				email: user?.email || "",
				avatar: user?.avatar || "",
			},
		};
	});

	// Filter by search (username/email)
	if (search) {
		const searchLower = search.toLowerCase();
		sessionsWithUser = sessionsWithUser.filter(
			(s) => s.user.username?.toLowerCase().includes(searchLower) || s.user.email.toLowerCase().includes(searchLower),
		);
	}

	// Filter by device type
	if (deviceType) {
		sessionsWithUser = sessionsWithUser.filter((s) => s.deviceType === deviceType);
	}

	// Pagination
	const total = sessionsWithUser.length;
	const start = (page - 1) * pageSize;
	const end = start + pageSize;
	const sessions = sessionsWithUser.slice(start, end);

	const response: GetSessionsResponse = {
		sessions,
		total,
		page,
		limit: pageSize,
		totalPages: Math.ceil(total / pageSize),
	};

	return HttpResponse.json({
		status: ResultStatus.SUCCESS,
		message: "",
		data: response,
	});
});

/**
 * POST /api/sessions/bulk-logout - Bulk logout sessions
 */
export const bulkLogoutSessions = http.post("/api/admin/sessions/bulk-logout", async ({ request }) => {
	const { sessionIds } = (await request.json()) as BulkLogoutSessionsRequest;

	sessionIds.forEach((id) => {
		const session = DB_IJS_SESSIONS.find((s) => s.id === id);
		if (session) {
			session.isActive = false;
		}
	});

	return HttpResponse.json({
		status: ResultStatus.SUCCESS,
		message: `${sessionIds.length} sessions terminated successfully`,
		data: null,
	});
});
