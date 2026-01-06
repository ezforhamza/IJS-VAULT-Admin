/**
 * Session Table Columns Definition
 */

import type { ColumnsType } from "antd/es/table";
import { Icon } from "@/components/icon";
import { UserAvatar } from "@/components/user-avatar";
import type { SessionWithUser } from "@/types/user-management";
import { Badge } from "@/ui/badge";
import { Checkbox } from "@/ui/checkbox";
import { formatRelativeTime } from "@/utils/date";

import { SessionActionsMenu } from "./components/session-actions-menu";

interface GetColumnsParams {
	selectedSessionIds: string[];
	onToggleSelect: (id: string) => void;
	onToggleSelectAll: (checked: boolean) => void;
}

const getDeviceIcon = (type: string) => {
	switch (type) {
		case "android":
			return "solar:smartphone-outline";
		case "ios":
			return "solar:iphone-outline";
		case "huawei":
			return "solar:smartphone-outline";
		case "web":
			return "solar:monitor-outline";
		default:
			return "solar:tablet-outline";
	}
};

export function getSessionColumns({
	selectedSessionIds,
	onToggleSelect,
	onToggleSelectAll,
}: GetColumnsParams): ColumnsType<SessionWithUser> {
	return [
		{
			title: (
				<Checkbox
					checked={selectedSessionIds.length > 0}
					onCheckedChange={onToggleSelectAll}
					aria-label="Select all sessions"
				/>
			),
			key: "select",
			width: 50,
			render: (_, record) => (
				<Checkbox
					checked={selectedSessionIds.includes(record.id)}
					onCheckedChange={() => onToggleSelect(record.id)}
					aria-label={`Select session ${record.id}`}
				/>
			),
		},
		{
			title: "User",
			dataIndex: "user",
			key: "user",
			width: 280,
			render: (_, record) => (
				<div className="flex items-center gap-3">
					<UserAvatar
						src={record.user.image || record.user.avatar}
						name={record.user.fullName || record.user.username}
						email={record.user.email}
						size="md"
					/>
					<div className="flex flex-col">
						<span className="text-sm font-medium">{record.user.fullName || record.user.username}</span>
						<span className="text-xs text-text-secondary">{record.user.email}</span>
					</div>
				</div>
			),
		},
		{
			title: "Device",
			dataIndex: "deviceType",
			key: "deviceType",
			width: 120,
			render: (type: string) => (
				<div className="flex items-center gap-2">
					<Icon icon={getDeviceIcon(type)} size={20} className="text-text-secondary" />
					<Badge variant="outline">{type.toUpperCase()}</Badge>
				</div>
			),
		},
		{
			title: "Device Name",
			dataIndex: "deviceName",
			key: "deviceName",
			width: 180,
			render: (name: string, record) => (
				<div className="flex flex-col">
					<span className="text-sm">{name}</span>
					{record.deviceModel && <span className="text-xs text-text-secondary">{record.deviceModel}</span>}
				</div>
			),
		},
		{
			title: "Login Time",
			dataIndex: "loginAt",
			key: "loginAt",
			width: 160,
			render: (date: string) => (
				<span className="text-sm" title={new Date(date).toLocaleString()}>
					{formatRelativeTime(date)}
				</span>
			),
		},
		{
			title: "Last Activity",
			dataIndex: "lastActivityAt",
			key: "lastActivityAt",
			width: 160,
			render: (date: string) => (
				<span className="text-sm" title={new Date(date).toLocaleString()}>
					{formatRelativeTime(date)}
				</span>
			),
		},
		{
			title: "Location",
			dataIndex: "location",
			key: "location",
			width: 200,
			render: (location: any, record) => {
				// Handle location object from API: { city, country, coordinates }
				let locationText = "";
				if (location && typeof location === "object") {
					if (location.city && location.country) {
						locationText = `${location.city}, ${location.country}`;
					} else if (location.city) {
						locationText = location.city;
					} else if (location.country) {
						locationText = location.country;
					}
				} else if (typeof location === "string") {
					locationText = location;
				}

				return (
					<div className="flex flex-col">
						{locationText && <span className="text-sm">{locationText}</span>}
						{record.ipAddress && <span className="text-xs text-text-secondary">{record.ipAddress}</span>}
					</div>
				);
			},
		},
		{
			title: "Action",
			key: "action",
			width: 80,
			align: "center",
			render: (_, record) => <SessionActionsMenu session={record} />,
		},
	];
}
