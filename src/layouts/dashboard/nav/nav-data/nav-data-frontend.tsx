import { Icon } from "@/components/icon";
import type { NavProps } from "@/components/nav";

export const frontendNavData: NavProps["data"] = [
	// Dashboard section
	{
		name: "sys.nav.dashboard",
		items: [
			{
				title: "sys.nav.workbench",
				path: "/workbench",
				icon: <Icon icon="local:ic-workbench" size="24" />,
			},
			{
				title: "sys.nav.analysis",
				path: "/analysis",
				icon: <Icon icon="local:ic-analysis" size="24" />,
			},
		],
	},

	// IJS VAULT
	{
		name: "IJS VAULT",
		items: [
			{
				title: "User Management",
				path: "/user-management/users",
				icon: <Icon icon="solar:users-group-two-rounded-outline" size="24" />,
			},
			{
				title: "Sessions Management",
				path: "/user-management/sessions",
				icon: <Icon icon="solar:tablet-outline" size="24" />,
			},
			{
				title: "Legal Pages",
				path: "/legal",
				icon: <Icon icon="solar:documents-outline" size="24" />,
				children: [
					{
						title: "Terms of Service",
						path: "/legal/terms",
					},
					{
						title: "Privacy Policy",
						path: "/legal/privacy",
					},
					{
						title: "Cookie Policy",
						path: "/legal/cookies",
					},
				],
			},
		],
	},

	// Admin Profile (at bottom)
	{
		name: "User",
		items: [
			{
				title: "Profile",
				path: "/management/user/profile",
				icon: <Icon icon="solar:user-circle-outline" size="24" />,
			},
			{
				title: "Account",
				path: "/management/user/account",
				icon: <Icon icon="solar:settings-outline" size="24" />,
			},
		],
	},
];
