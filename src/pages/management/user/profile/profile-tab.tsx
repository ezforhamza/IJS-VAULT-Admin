import { Timeline } from "antd";
import type { ActivityAction } from "@/api/services/activityService";
import { Icon } from "@/components/icon";
import { UserAvatar } from "@/components/user-avatar";
import { useActivityTimeline, useAdminProfile } from "@/hooks/use-activity";
import { themeVars } from "@/theme/theme.css";
import { Card, CardContent, CardHeader, CardTitle } from "@/ui/card";
import { Skeleton } from "@/ui/skeleton";
import { Text } from "@/ui/typography";
import { formatRelativeTime } from "@/utils/date";

const getActionColor = (action: ActivityAction): string => {
	switch (action) {
		case "user_suspended":
			return themeVars.colors.palette.warning.default;
		case "user_activated":
			return themeVars.colors.palette.success.default;
		case "user_deleted":
			return themeVars.colors.palette.error.default;
		case "users_exported":
			return themeVars.colors.palette.info.default;
		case "session_terminated":
		case "sessions_terminated":
			return themeVars.colors.palette.primary.default;
		case "notification_sent":
			return themeVars.colors.palette.info.default;
		case "legal_page_created":
		case "legal_page_updated":
			return themeVars.colors.palette.success.default;
		default:
			return themeVars.colors.palette.primary.default;
	}
};

const getActionIcon = (action: ActivityAction): string => {
	switch (action) {
		case "user_suspended":
			return "solar:forbidden-circle-outline";
		case "user_activated":
			return "solar:check-circle-outline";
		case "user_deleted":
			return "solar:trash-bin-outline";
		case "users_exported":
			return "solar:download-outline";
		case "session_terminated":
		case "sessions_terminated":
			return "solar:logout-outline";
		case "notification_sent":
			return "solar:bell-outline";
		case "legal_page_created":
		case "legal_page_updated":
			return "solar:document-text-outline";
		default:
			return "solar:history-outline";
	}
};

export default function ProfileTab() {
	const { data: profileData, isLoading: profileLoading } = useAdminProfile();
	const { data: timelineData, isLoading: timelineLoading } = useActivityTimeline({ limit: 10 });

	const profile = profileData?.profile;
	const activities = timelineData?.results || [];

	const AboutItems = [
		{
			icon: <Icon icon="solar:user-bold" size={18} />,
			label: "Full Name",
			val: profile?.fullName || "—",
		},
		{
			icon: <Icon icon="solar:shield-user-bold" size={18} />,
			label: "Role",
			val: profile?.role ? profile.role.charAt(0).toUpperCase() + profile.role.slice(1) : "—",
		},
		{
			icon: <Icon icon="solar:phone-bold" size={18} />,
			label: "Phone",
			val: profile?.phone || "Not set",
		},
		{
			icon: <Icon icon="solar:letter-bold" size={18} />,
			label: "Email",
			val: profile?.email || "—",
		},
		{
			icon: <Icon icon="solar:calendar-bold" size={18} />,
			label: "Member Since",
			val: profile?.createdAt ? new Date(profile.createdAt).toLocaleDateString() : "—",
		},
		{
			icon: <Icon icon="solar:login-bold" size={18} />,
			label: "Last Login",
			val: profile?.lastLoginAt ? formatRelativeTime(profile.lastLoginAt) : "—",
		},
	];

	return (
		<div className="flex flex-col gap-6">
			<div className="grid grid-cols-1 gap-6 lg:grid-cols-3">
				{/* Profile Card */}
				<Card className="col-span-1">
					<CardHeader className="pb-4">
						<CardTitle className="text-lg">Admin Profile</CardTitle>
					</CardHeader>
					<CardContent>
						{profileLoading ? (
							<div className="flex flex-col items-center gap-4">
								<Skeleton className="h-20 w-20 rounded-full" />
								<Skeleton className="h-6 w-32" />
								<div className="w-full space-y-3">
									{[1, 2, 3, 4, 5, 6].map((i) => (
										<Skeleton key={i} className="h-5 w-full" />
									))}
								</div>
							</div>
						) : (
							<div className="flex flex-col">
								{/* Avatar and Name */}
								<div className="mb-6 flex flex-col items-center">
									<UserAvatar
										src={profile?.image}
										name={profile?.fullName || "Admin"}
										email={profile?.email}
										size="xl"
									/>
									<h3 className="mt-3 text-xl font-semibold">{profile?.fullName}</h3>
									<span className="text-sm text-muted-foreground">{profile?.email}</span>
								</div>

								{/* Info Items */}
								<div className="space-y-4">
									{AboutItems.map((item) => (
										<div className="flex items-center gap-3" key={item.label}>
											<div className="flex h-9 w-9 items-center justify-center rounded-lg bg-primary/10 text-primary">
												{item.icon}
											</div>
											<div className="flex flex-col">
												<span className="text-xs text-muted-foreground">{item.label}</span>
												<span className="text-sm font-medium">{item.val}</span>
											</div>
										</div>
									))}
								</div>
							</div>
						)}
					</CardContent>
				</Card>

				{/* Activity Timeline Card */}
				<Card className="col-span-1 lg:col-span-2">
					<CardHeader className="pb-4">
						<div className="flex items-center justify-between">
							<CardTitle className="text-lg">Recent Activity</CardTitle>
							<span className="text-sm text-muted-foreground">{timelineData?.totalResults || 0} total activities</span>
						</div>
					</CardHeader>
					<CardContent>
						{timelineLoading ? (
							<div className="space-y-4">
								{[1, 2, 3, 4].map((i) => (
									<div key={i} className="flex gap-4">
										<Skeleton className="h-10 w-10 rounded-full" />
										<div className="flex-1 space-y-2">
											<Skeleton className="h-4 w-3/4" />
											<Skeleton className="h-3 w-1/2" />
										</div>
									</div>
								))}
							</div>
						) : activities.length === 0 ? (
							<div className="flex flex-col items-center justify-center py-12 text-center">
								<Icon icon="solar:history-outline" size={48} className="mb-4 text-muted-foreground/50" />
								<Text className="text-muted-foreground">No activity recorded yet</Text>
							</div>
						) : (
							<Timeline
								className="mt-2"
								items={activities.map((activity) => ({
									color: getActionColor(activity.action),
									dot: (
										<div
											className="flex h-8 w-8 items-center justify-center rounded-full"
											style={{ backgroundColor: `${getActionColor(activity.action)}20` }}
										>
											<Icon
												icon={getActionIcon(activity.action)}
												size={16}
												style={{ color: getActionColor(activity.action) }}
											/>
										</div>
									),
									children: (
										<div className="ml-2 flex flex-col pb-2">
											<div className="flex items-start justify-between gap-4">
												<Text className="font-medium">{activity.description}</Text>
												<span className="shrink-0 text-xs text-muted-foreground">
													{formatRelativeTime(activity.createdAt)}
												</span>
											</div>
											{activity.targetUser && (
												<div className="mt-1 flex items-center gap-2">
													<Icon icon="solar:user-outline" size={14} className="text-muted-foreground" />
													<Text variant="caption" color="secondary">
														{activity.targetUser.fullName}
														{activity.targetUser.email && ` (${activity.targetUser.email})`}
													</Text>
												</div>
											)}
											{activity.ipAddress && (
												<div className="mt-1 flex items-center gap-2">
													<Icon icon="solar:global-outline" size={14} className="text-muted-foreground" />
													<Text variant="caption" color="secondary">
														IP: {activity.ipAddress}
													</Text>
												</div>
											)}
										</div>
									),
								}))}
							/>
						)}
					</CardContent>
				</Card>
			</div>
		</div>
	);
}
