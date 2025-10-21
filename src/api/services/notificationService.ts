import { API_ENDPOINTS } from "@/config/api-endpoints";
import type { SendNotificationRequest, SendNotificationResponse } from "@/types/notification";

import apiClient from "../apiClient";

const notificationService = {
	sendNotification: (data: SendNotificationRequest) =>
		apiClient.post<SendNotificationResponse>({
			url: API_ENDPOINTS.NOTIFICATIONS.SEND,
			data,
		}),
};

export default notificationService;
