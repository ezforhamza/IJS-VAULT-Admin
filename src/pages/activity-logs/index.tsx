/**
 * Activity Logs Page
 */

import { Table } from "antd";
import type { ColumnsType } from "antd/es/table";
import { useState } from "react";
import type { ActivityAction, ActivityItem } from "@/api/services/activityService";
import { Icon } from "@/components/icon";
import { useActivityStats, useAllActivities } from "@/hooks/use-activity";
import { Badge } from "@/ui/badge";
import { Card, CardContent, CardHeader } from "@/ui/card";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/ui/select";
import { formatRelativeTime } from "@/utils/date";

const ACTION_LABELS: Record<ActivityAction, string> = {
	user_suspended: "User Suspended",
	user_activated: "User Activated",
	user_status_changed: "Status Changed",
	user_deleted: "User Deleted",
	users_exported: "Users Exported",
	session_terminated: "Session Terminated",
	sessions_terminated: "Sessions Terminated",
	legal_page_created: "Legal Page Created",
	legal_page_updated: "Legal Page Updated",
	notification_sent: "Notification Sent",
};

const getActionBadgeVariant = (action: ActivityAction): "default" | "secondary" | "destructive" | "outline" => {
	switch (action) {
		case "user_deleted":
			return "destructive";
		case "user_suspended":
		case "session_terminated":
		case "sessions_terminated":
			return "secondary";
		default:
			return "outline";
	}
};

const columns: ColumnsType<ActivityItem> = [
	{
		title: "Action",
		dataIndex: "action",
		key: "action",
		width: 180,
		render: (action: ActivityAction) => (
			<Badge variant={getActionBadgeVariant(action)} className="text-xs">
				{ACTION_LABELS[action] || action}
			</Badge>
		),
	},
	{
		title: "Description",
		dataIndex: "description",
		key: "description",
		render: (description: string) => <span className="text-sm">{description}</span>,
	},
	{
		title: "Admin",
		dataIndex: "admin",
		key: "admin",
		width: 180,
		render: (admin: ActivityItem["admin"]) =>
			admin ? (
				<span className="text-sm">{admin.fullName}</span>
			) : (
				<span className="text-sm text-muted-foreground">—</span>
			),
	},
	{
		title: "Target User",
		dataIndex: "targetUser",
		key: "targetUser",
		width: 180,
		render: (targetUser: ActivityItem["targetUser"]) =>
			targetUser ? (
				<span className="text-sm">{targetUser.fullName}</span>
			) : (
				<span className="text-sm text-muted-foreground">—</span>
			),
	},
	{
		title: "IP Address",
		dataIndex: "ipAddress",
		key: "ipAddress",
		width: 140,
		render: (ip: string) =>
			ip ? (
				<span className="text-sm text-muted-foreground">{ip}</span>
			) : (
				<span className="text-sm text-muted-foreground">—</span>
			),
	},
	{
		title: "Time",
		dataIndex: "createdAt",
		key: "createdAt",
		width: 140,
		render: (date: string) => (
			<span className="text-sm text-muted-foreground" title={new Date(date).toLocaleString()}>
				{formatRelativeTime(date)}
			</span>
		),
	},
];

export default function ActivityLogsPage() {
	const [page, setPage] = useState(1);
	const [limit, setLimit] = useState(20);
	const [actionFilter, setActionFilter] = useState<ActivityAction | "all">("all");

	const { data: activitiesData, isLoading } = useAllActivities({
		page,
		limit,
		action: actionFilter === "all" ? undefined : actionFilter,
	});

	const { data: statsData } = useActivityStats();

	const activities = activitiesData?.results || [];
	const totalResults = activitiesData?.totalResults || 0;
	const stats = statsData?.stats;

	return (
		<div className="flex flex-col gap-4">
			<Card>
				<CardHeader>
					<div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
						<div>
							<h1 className="text-2xl font-bold">Activity Logs</h1>
							<p className="text-sm text-text-secondary">Track and monitor all admin actions</p>
						</div>
						<div className="flex items-center gap-4 text-sm text-muted-foreground">
							<div className="flex items-center gap-2">
								<Icon icon="solar:calendar-outline" size={16} />
								<span>
									Today: <strong className="text-foreground">{stats?.today || 0}</strong>
								</span>
							</div>
							<div className="flex items-center gap-2">
								<Icon icon="solar:calendar-mark-outline" size={16} />
								<span>
									7 Days: <strong className="text-foreground">{stats?.last7Days || 0}</strong>
								</span>
							</div>
							<div className="flex items-center gap-2">
								<Icon icon="solar:chart-outline" size={16} />
								<span>
									30 Days: <strong className="text-foreground">{stats?.last30Days || 0}</strong>
								</span>
							</div>
						</div>
					</div>
				</CardHeader>

				<CardContent>
					<div className="mb-4 flex items-center gap-4">
						<Select
							value={actionFilter}
							onValueChange={(value) => {
								setActionFilter(value as ActivityAction | "all");
								setPage(1);
							}}
						>
							<SelectTrigger className="w-[200px]">
								<SelectValue placeholder="Filter by action" />
							</SelectTrigger>
							<SelectContent>
								<SelectItem value="all">All Actions</SelectItem>
								{Object.entries(ACTION_LABELS).map(([key, label]) => (
									<SelectItem key={key} value={key}>
										{label}
									</SelectItem>
								))}
							</SelectContent>
						</Select>
						{actionFilter !== "all" && (
							<button
								type="button"
								onClick={() => setActionFilter("all")}
								className="text-sm text-muted-foreground hover:text-foreground"
							>
								Clear filter
							</button>
						)}
					</div>

					<Table
						rowKey="id"
						size="small"
						loading={isLoading}
						columns={columns}
						dataSource={activities}
						pagination={{
							current: page,
							pageSize: limit,
							total: totalResults,
							showSizeChanger: true,
							pageSizeOptions: ["10", "20", "50", "100"],
							showTotal: (total, range) => `${range[0]}-${range[1]} of ${total} activities`,
							onChange: (newPage, newLimit) => {
								setPage(newPage);
								if (newLimit !== limit) {
									setLimit(newLimit);
								}
							},
							onShowSizeChange: (_current, size) => {
								setLimit(size);
								setPage(1);
							},
						}}
						scroll={{ x: 900 }}
					/>
				</CardContent>
			</Card>
		</div>
	);
}
