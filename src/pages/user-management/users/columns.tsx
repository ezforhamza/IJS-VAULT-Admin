/**
 * User Table Columns Definition
 */

import type { ColumnsType } from "antd/es/table";
import { UserAvatar } from "@/components/user-avatar";
import type { IJSUser } from "@/types/user-management";
import { Badge } from "@/ui/badge";
import { Checkbox } from "@/ui/checkbox";

import { UserActionsMenu } from "./components/user-actions-menu";

interface GetColumnsParams {
	selectedUserIds: string[];
	onToggleSelect: (id: string) => void;
	onToggleSelectAll: (checked: boolean) => void;
}

export function getUserColumns({
	selectedUserIds,
	onToggleSelect,
	onToggleSelectAll,
}: GetColumnsParams): ColumnsType<IJSUser> {
	return [
		{
			title: (
				<Checkbox
					checked={selectedUserIds.length > 0}
					onCheckedChange={onToggleSelectAll}
					aria-label="Select all users"
				/>
			),
			key: "select",
			width: 50,
			render: (_, record) => (
				<Checkbox
					checked={selectedUserIds.includes(record.id)}
					onCheckedChange={() => onToggleSelect(record.id)}
					aria-label={`Select ${record.username}`}
				/>
			),
		},
		{
			title: "User",
			dataIndex: "username",
			key: "username",
			width: 280,
			render: (_, record) => (
				<div className="flex items-center gap-3">
					<UserAvatar
						src={record.image || record.avatar}
						name={record.fullName || record.username}
						email={record.email}
						size="md"
					/>
					<div className="flex flex-col">
						<span className="text-sm font-medium">{record.fullName || record.username}</span>
						<span className="text-xs text-text-secondary">{record.email}</span>
					</div>
				</div>
			),
		},
		{
			title: "Phone",
			dataIndex: "phone",
			key: "phone",
			width: 140,
		},
		{
			title: "Role",
			dataIndex: "role",
			key: "role",
			width: 120,
			render: (role: string) => (
				<Badge variant={role === "group_admin" ? "default" : "secondary"}>
					{role === "group_admin" ? "Group Admin" : "User"}
				</Badge>
			),
		},
		{
			title: "Status",
			dataIndex: "status",
			key: "status",
			width: 120,
			render: (status: string) => {
				const variants = {
					active: "default" as const,
					inactive: "secondary" as const,
					suspended: "destructive" as const,
				};
				return (
					<Badge variant={variants[status as keyof typeof variants]}>
						{status.charAt(0).toUpperCase() + status.slice(1)}
					</Badge>
				);
			},
		},
		{
			title: "Files",
			dataIndex: "files",
			key: "files",
			width: 100,
			align: "center",
			render: (count: number) => <span className="text-sm">{count}</span>,
		},
		{
			title: "Sessions",
			dataIndex: "activeSessionsCount",
			key: "activeSessionsCount",
			width: 100,
			align: "center",
			render: (count: number) => <Badge variant={count > 0 ? "default" : "outline"}>{count}</Badge>,
		},
		{
			title: "Action",
			key: "action",
			width: 80,
			align: "center",
			render: (_, record) => <UserActionsMenu user={record} />,
		},
	];
}
