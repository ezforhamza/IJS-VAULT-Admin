/**
 * Export utility functions for converting data to different file formats
 */

import type { IJSUser } from "@/types/user-management";

/**
 * Convert array of objects to CSV string
 */
function convertToCSV(data: any[], headers: string[]): string {
	const headerRow = headers.join(",");
	const rows = data.map((item) => {
		return headers
			.map((header) => {
				const value = item[header];
				// Handle values that might contain commas or quotes
				if (value === null || value === undefined) return "";
				const stringValue = String(value);
				if (stringValue.includes(",") || stringValue.includes('"') || stringValue.includes("\n")) {
					return `"${stringValue.replace(/"/g, '""')}"`;
				}
				return stringValue;
			})
			.join(",");
	});
	return [headerRow, ...rows].join("\n");
}

/**
 * Export users to CSV format
 * Handles both IJSUser type and export API response format
 */
export function exportUsersToCSV(users: any[]): Blob {
	const headers = [
		"id",
		"fullName",
		"email",
		"phone",
		"status",
		"isEmailVerified",
		"provider",
		"plan",
		"files",
		"folders",
		"storageUsed",
		"storageLimit",
		"activeSessions",
		"createdAt",
		"lastLoginAt",
	];

	const data = users.map((user) => ({
		id: user.id,
		fullName: user.fullName || user.username || "",
		email: user.email || "",
		phone: user.phone || "",
		status: user.status || "",
		isEmailVerified: user.isEmailVerified ? "Yes" : "No",
		provider: user.provider || "local",
		plan: user.plan || "free",
		files: user.files || 0,
		folders: user.folders || 0,
		storageUsed: user.storageUsed || 0,
		storageLimit: user.storageLimit || 0,
		activeSessions: user.activeSessions || user.activeSessionsCount || 0,
		createdAt: user.createdAt || "",
		lastLoginAt: user.lastLoginAt || "",
	}));

	const csv = convertToCSV(data, headers);
	return new Blob([csv], { type: "text/csv;charset=utf-8;" });
}

/**
 * Export users to Excel format (using CSV with .xlsx extension)
 * For a more advanced Excel export, you would need a library like xlsx or exceljs
 */
export function exportUsersToExcel(users: IJSUser[]): Blob {
	// For now, we'll use CSV format with Excel MIME type
	// In production, consider using a library like 'xlsx' for true Excel format
	const csv = exportUsersToCSV(users);
	return new Blob([csv], {
		type: "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet",
	});
}

/**
 * Download blob as file
 */
export function downloadBlob(blob: Blob, filename: string): void {
	const url = window.URL.createObjectURL(blob);
	const link = document.createElement("a");
	link.href = url;
	link.download = filename;
	document.body.appendChild(link);
	link.click();
	document.body.removeChild(link);
	window.URL.revokeObjectURL(url);
}
