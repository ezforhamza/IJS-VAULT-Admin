export interface SendNotificationRequest {
	target: "all" | "specific";
	userIds?: string[];
	title: string;
	message: string;
}

export interface SendNotificationResponse {
	sent: number;
	failed: number;
}
