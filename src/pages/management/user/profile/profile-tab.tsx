import { Icon } from "@/components/icon";
import { useUserInfo } from "@/store/userStore";
import { themeVars } from "@/theme/theme.css";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/ui/card";
import { Text } from "@/ui/typography";
import { faker } from "@faker-js/faker";
import { Timeline } from "antd";

export default function ProfileTab() {
	const { username } = useUserInfo();
	const AboutItems = [
		{
			icon: <Icon icon="fa-solid:user" size={18} />,
			label: "Full Name",
			val: username,
		},
		{
			icon: <Icon icon="eos-icons:role-binding" size={18} />,
			label: "Role",
			val: "Developer",
		},
		{
			icon: <Icon icon="tabler:location-filled" size={18} />,
			label: "Country",
			val: "USA",
		},
		{
			icon: <Icon icon="ion:language" size={18} />,
			label: "Language",
			val: "English",
		},
		{
			icon: <Icon icon="ph:phone-fill" size={18} />,
			label: "Contact",
			val: "(123)456-7890",
		},
		{
			icon: <Icon icon="ic:baseline-email" size={18} />,
			label: "Email",
			val: username,
		},
	];

	return (
		<div className="flex flex-col gap-4">
			<div className="grid grid-cols-1 gap-4 md:grid-cols-3">
				<Card className="col-span-1">
					<CardHeader>
						<CardTitle>About</CardTitle>
						<CardDescription>{faker.lorem.paragraph()}</CardDescription>
					</CardHeader>
					<CardContent>
						<div className="flex flex-col gap-4">
							{AboutItems.map((item) => (
								<div className="flex" key={item.label}>
									<div className="mr-2">{item.icon}</div>
									<div className="mr-2">{item.label}:</div>
									<div className="opacity-50">{item.val}</div>
								</div>
							))}
						</div>
					</CardContent>
				</Card>

				<Card className="col-span-1 md:col-span-2">
					<CardHeader>
						<CardTitle>Activity Timeline</CardTitle>
					</CardHeader>
					<CardContent>
						<Timeline
							className="mt-4! w-full"
							items={[
								{
									color: themeVars.colors.palette.success.default,
									children: (
										<div className="flex flex-col">
											<div className="flex items-center justify-between">
												<Text>Logged into admin panel</Text>
												<div className="opacity-50">Today, 09:23 AM</div>
											</div>
											<Text variant="caption" color="secondary">
												Successfully authenticated from Cape Town, South Africa
											</Text>
										</div>
									),
								},
								{
									color: themeVars.colors.palette.primary.default,
									children: (
										<div className="flex flex-col">
											<div className="flex items-center justify-between">
												<Text>Terminated 3 suspicious sessions</Text>
												<div className="opacity-50">Yesterday, 04:15 PM</div>
											</div>
											<Text variant="caption" color="secondary">
												Bulk logout action performed on sessions from unknown devices
											</Text>
										</div>
									),
								},
								{
									color: themeVars.colors.palette.info.default,
									children: (
										<div className="flex flex-col">
											<div className="flex items-center justify-between">
												<Text>Exported user data</Text>
												<div className="opacity-50">2 days ago</div>
											</div>
											<Text variant="caption" color="secondary">
												Generated CSV export of 156 users for compliance report
											</Text>
											<div className="mt-2 flex items-center gap-2">
												<Icon icon="solar:file-text-outline" size={24} />
												<span className="font-medium opacity-60">users_export_2025_10_15.csv</span>
											</div>
										</div>
									),
								},
								{
									color: themeVars.colors.palette.warning.default,
									children: (
										<div className="flex flex-col">
											<div className="flex items-center justify-between">
												<Text>Suspended 2 user accounts</Text>
												<div className="opacity-50">3 days ago</div>
											</div>
											<Text variant="caption" color="secondary">
												Accounts suspended due to suspicious activity
											</Text>
										</div>
									),
								},
							]}
						/>
					</CardContent>
				</Card>
			</div>
		</div>
	);
}
