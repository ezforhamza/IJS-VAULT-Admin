import { API_ENDPOINTS } from "@/config/api-endpoints";
import apiClient from "../apiClient";

export interface Notification {
	id: string;
	title: string;
	message: string;
	type: string;
	targetType: string;
	targetUsers: any[];
	sentBy: {
		id: string;
		fullName: string;
		email: string;
	};
	sentAt: string;
	sendPush: boolean;
	pushSent: boolean;
	readCount: number;
}

export interface GetNotificationsParams {
	page: number;
	limit: number;
	type?: string;
}

export interface GetNotificationsResponse {
	notifications: Notification[];
	total: number;
	page: number;
	limit: number;
	totalPages: number;
}

export interface SendNotificationRequest {
	title: string;
	message: string;
	type: string;
	userIds?: string[];
	sendPush?: boolean;
}

const getNotifications = async (params: GetNotificationsParams): Promise<GetNotificationsResponse> => {
	const response = await apiClient.get<any>({
		url: API_ENDPOINTS.NOTIFICATIONS.LIST,
		params,
	});

	return {
		notifications: response.results || [],
		total: response.totalResults || 0,
		page: response.page || 1,
		limit: response.limit || 10,
		totalPages: response.totalPages || 1,
	};
};

const sendNotification = (data: SendNotificationRequest) =>
	apiClient.post<any>({
		url: API_ENDPOINTS.NOTIFICATIONS.SEND,
		data,
	});

const sendNotificationToAll = (data: Omit<SendNotificationRequest, "userIds">) =>
	apiClient.post<any>({
		url: API_ENDPOINTS.NOTIFICATIONS.SEND_ALL,
		data,
	});

const getNotificationStats = () =>
	apiClient.get<any>({
		url: API_ENDPOINTS.NOTIFICATIONS.STATS,
	});

export default {
	getNotifications,
	sendNotification,
	sendNotificationToAll,
	getNotificationStats,
};
