/**
 * MSW Handlers for Notifications
 */

import { HttpResponse, http } from "msw";

import { API_ENDPOINTS } from "@/config/api-endpoints";
import { ResultStatus } from "@/types/enum";
import type { SendNotificationRequest, SendNotificationResponse } from "@/types/notification";

import { DB_IJS_USERS } from "../assets/ijs-users";

/**
 * POST /api/notifications/send - Send notification to users
 */
export const sendNotification = http.post(`/api${API_ENDPOINTS.NOTIFICATIONS.SEND}`, async ({ request }) => {
	const body = (await request.json()) as SendNotificationRequest;
	const { target, userIds, title, message } = body;

	// Validate
	if (!title || !message) {
		return HttpResponse.json(
			{
				status: ResultStatus.ERROR,
				message: "Title and message are required",
			},
			{ status: 400 },
		);
	}

	if (target === "specific" && (!userIds || userIds.length === 0)) {
		return HttpResponse.json(
			{
				status: ResultStatus.ERROR,
				message: "Please select at least one user",
			},
			{ status: 400 },
		);
	}

	// Calculate sent count
	let sent = 0;
	if (target === "all") {
		sent = DB_IJS_USERS.filter((u) => u.status === "active").length;
	} else {
		sent =
			userIds?.filter((id) => {
				const user = DB_IJS_USERS.find((u) => u.id === id);
				return user && user.status === "active";
			}).length || 0;
	}

	const response: SendNotificationResponse = {
		sent,
		failed: 0,
	};

	// Simulate delay
	await new Promise((resolve) => setTimeout(resolve, 800));

	return HttpResponse.json({
		status: ResultStatus.SUCCESS,
		message: `Notification sent to ${sent} user${sent !== 1 ? "s" : ""} successfully`,
		data: response,
	});
});

export const getNotificationHandlers = [sendNotification];
