import type { RouteObject } from "react-router";
import { Navigate } from "react-router";
import { Component } from "./utils";

export function getFrontendDashboardRoutes(): RouteObject[] {
	const frontendDashboardRoutes: RouteObject[] = [
		// Dashboard routes
		{ path: "dashboard", element: Component("/pages/dashboard") },

		// Management routes
		{
			path: "management",
			children: [
				{ index: true, element: <Navigate to="user" replace /> },
				{
					path: "user",
					children: [
						{ index: true, element: <Navigate to="profile" replace /> },
						{ path: "profile", element: Component("/pages/management/user/profile") },
						{ path: "account", element: Component("/pages/management/user/account") },
					],
				},
				{
					path: "system",
					children: [
						{ index: true, element: <Navigate to="permission" replace /> },
						{ path: "permission", element: Component("/pages/management/system/permission") },
						{ path: "role", element: Component("/pages/management/system/role") },
						{ path: "user", element: Component("/pages/management/system/user") },
						{ path: "user/:id", element: Component("/pages/management/system/user/detail") },
					],
				},
			],
		},

		// Error pages
		{
			path: "error",
			children: [
				{ index: true, element: <Navigate to="403" replace /> },
				{ path: "403", element: Component("/pages/sys/error/Page403") },
				{ path: "404", element: Component("/pages/sys/error/Page404") },
				{ path: "500", element: Component("/pages/sys/error/Page500") },
			],
		},

		// Permission demo (optional - can be removed later if not needed)
		{
			path: "permission",
			children: [
				{ index: true, element: Component("/pages/sys/others/permission") },
				{ path: "page-test", element: Component("/pages/sys/others/permission/page-test") },
			],
		},

		// User Management (IJS VAULT)
		{
			path: "user-management",
			children: [
				{ index: true, element: <Navigate to="users" replace /> },
				{
					path: "users",
					children: [
						{ index: true, element: Component("/pages/user-management/users") },
						{ path: ":id", element: Component("/pages/user-management/users/detail") },
					],
				},
				{
					path: "sessions",
					element: Component("/pages/user-management/sessions"),
				},
			],
		},

		// Notifications
		{ path: "notifications", element: Component("/pages/notifications") },

		// Activity Logs
		{ path: "activity-logs", element: Component("/pages/activity-logs") },

		// Legal Pages
		{
			path: "legal",
			children: [
				{ index: true, element: <Navigate to="terms" replace /> },
				{ path: "terms", element: Component("/pages/legal/terms") },
				{ path: "terms/edit", element: Component("/pages/legal/terms/edit") },
				{ path: "privacy", element: Component("/pages/legal/privacy") },
				{ path: "privacy/edit", element: Component("/pages/legal/privacy/edit") },
			],
		},
	];
	return frontendDashboardRoutes;
}
