import { DB_IJS_SESSIONS, DB_IJS_USERS } from "@/_mock/assets/ijs-users";
import { Chart, useChart } from "@/components/chart";
import { Icon } from "@/components/icon";
import { Card, CardContent, CardHeader } from "@/ui/card";
import { Text, Title } from "@/ui/typography";
import { cn } from "@/utils";

interface StatCardProps {
	title: string;
	value: string | number;
	icon: string;
	iconBgColor: string;
	iconColor: string;
}

function StatCard({ title, value, icon, iconBgColor, iconColor }: StatCardProps) {
	return (
		<Card>
			<CardContent className="p-6">
				<div className="flex items-center justify-between">
					<div className="space-y-2">
						<Text variant="body2" className="text-muted-foreground">
							{title}
						</Text>
						<Title as="h3" className="text-3xl font-bold">
							{value}
						</Title>
					</div>
					<div className={cn("flex h-16 w-16 items-center justify-center rounded-2xl", iconBgColor)}>
						<Icon icon={icon} size={32} className={iconColor} />
					</div>
				</div>
			</CardContent>
		</Card>
	);
}

export default function DashboardPage() {
	// Calculate stats from mock data
	const totalUsers = DB_IJS_USERS.length;
	const activeUsers = DB_IJS_USERS.filter((u) => u.status === "active").length;
	const suspendedUsers = DB_IJS_USERS.filter((u) => u.status === "suspended").length;
	const activeSessions = DB_IJS_SESSIONS.filter((s) => s.isActive).length;

	// User status distribution
	const userStatusData = [
		{ label: "Active", value: activeUsers },
		{ label: "Suspended", value: suspendedUsers },
		{ label: "Inactive", value: DB_IJS_USERS.filter((u) => u.status === "inactive").length },
	];

	// Sessions by device type
	const deviceTypes = ["android", "ios", "huawei", "web"];
	const sessionsByDevice = deviceTypes.map((type) => ({
		type: type.charAt(0).toUpperCase() + type.slice(1),
		count: DB_IJS_SESSIONS.filter((s) => s.isActive && s.deviceType === type).length,
	}));

	// Chart options
	const userStatusChartOptions = useChart({
		labels: userStatusData.map((d) => d.label),
		legend: { show: true, position: "bottom" },
		plotOptions: {
			pie: {
				donut: {
					size: "70%",
					labels: {
						show: true,
						total: {
							show: true,
							label: "Users",
						},
					},
				},
			},
		},
	});

	const sessionsByDeviceChartOptions = useChart({
		chart: { type: "bar" },
		xaxis: {
			categories: sessionsByDevice.map((d) => d.type),
		},
		yaxis: {
			title: { text: "Active Sessions" },
		},
		plotOptions: {
			bar: {
				borderRadius: 8,
				columnWidth: "50%",
			},
		},
	});

	return (
		<div className="w-full space-y-6">
			{/* Header */}
			<div>
				<Title as="h2" className="text-2xl font-bold">
					Dashboard
				</Title>
				<Text variant="body2" className="text-muted-foreground mt-1">
					Overview of IJS VAULT users and sessions
				</Text>
			</div>

			{/* Stats Cards */}
			<div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-4">
				<StatCard
					title="Total Users"
					value={totalUsers}
					icon="solar:users-group-rounded-bold"
					iconBgColor="bg-primary/10"
					iconColor="text-primary"
				/>
				<StatCard
					title="Active Users"
					value={activeUsers}
					icon="solar:user-check-bold"
					iconBgColor="bg-green-500/10"
					iconColor="text-green-500"
				/>
				<StatCard
					title="Suspended Users"
					value={suspendedUsers}
					icon="solar:user-block-bold"
					iconBgColor="bg-orange-500/10"
					iconColor="text-orange-500"
				/>
				<StatCard
					title="Active Sessions"
					value={activeSessions}
					icon="solar:devices-bold"
					iconBgColor="bg-blue-500/10"
					iconColor="text-blue-500"
				/>
			</div>

			{/* Charts */}
			<div className="grid grid-cols-1 gap-6 lg:grid-cols-2">
				{/* User Status Distribution */}
				<Card>
					<CardHeader>
						<Title as="h3" className="text-lg font-semibold">
							User Status Distribution
						</Title>
						<Text variant="body2" className="text-muted-foreground">
							Breakdown of users by status
						</Text>
					</CardHeader>
					<CardContent>
						<Chart
							type="donut"
							series={userStatusData.map((d) => d.value)}
							options={userStatusChartOptions}
							height={300}
						/>
					</CardContent>
				</Card>

				{/* Sessions by Device */}
				<Card>
					<CardHeader>
						<Title as="h3" className="text-lg font-semibold">
							Active Sessions by Device
						</Title>
						<Text variant="body2" className="text-muted-foreground">
							Distribution across platforms
						</Text>
					</CardHeader>
					<CardContent>
						<Chart
							type="bar"
							series={[
								{
									name: "Sessions",
									data: sessionsByDevice.map((d) => d.count),
								},
							]}
							options={sessionsByDeviceChartOptions}
							height={300}
						/>
					</CardContent>
				</Card>
			</div>
		</div>
	);
}
