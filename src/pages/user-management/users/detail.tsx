/**
 * User Detail Page
 */

import { Icon } from "@/components/icon";
import { UserAvatar } from "@/components/user-avatar";
import { useUserDetail } from "@/hooks/use-users";
import { useParams, useRouter } from "@/routes/hooks";
import { Badge } from "@/ui/badge";
import { Button } from "@/ui/button";
import { Card, CardContent, CardHeader } from "@/ui/card";

import { SessionsSection } from "./components/sessions-section";

export default function UserDetailPage() {
	const { id } = useParams();
	const { push } = useRouter();
	const { data, isLoading, error } = useUserDetail(id || "");

	if (isLoading) {
		return (
			<div className="flex h-64 items-center justify-center">
				<Icon icon="solar:loader-outline" size={32} className="animate-spin text-primary" />
			</div>
		);
	}

	if (error || !data) {
		return (
			<Card>
				<CardContent className="py-8 text-center">
					<Icon icon="solar:user-cross-outline" size={48} className="mx-auto mb-2 opacity-50" />
					<p className="text-text-secondary">User not found</p>
				</CardContent>
			</Card>
		);
	}

	const { user, sessions } = data;

	const getStatusVariant = (status: string) => {
		switch (status) {
			case "active":
				return "default";
			case "inactive":
				return "secondary";
			case "suspended":
				return "destructive";
			default:
				return "outline";
		}
	};

	const formatDate = (date: string) => {
		return new Date(date).toLocaleString();
	};

	return (
		<div className="flex flex-col gap-4">
			<div className="flex items-center gap-2">
				<Button variant="ghost" size="icon" onClick={() => push("/user-management/users")}>
					<Icon icon="solar:arrow-left-outline" size={20} />
				</Button>
				<h1 className="text-2xl font-bold">User Details</h1>
			</div>

			<div className="grid gap-4 lg:grid-cols-3">
				<div className="lg:col-span-2">
					<Card>
						<CardHeader>
							<div className="flex items-center justify-between">
								<h2 className="text-lg font-semibold">Profile Information</h2>
								<Badge variant={getStatusVariant(user.status)}>
									{user.status.charAt(0).toUpperCase() + user.status.slice(1)}
								</Badge>
							</div>
						</CardHeader>
						<CardContent>
							<div className="flex flex-col gap-6 sm:flex-row">
								<UserAvatar
									src={user.image || user.avatar}
									name={user.fullName || user.username}
									email={user.email}
									size="lg"
								/>

								<div className="flex-1 space-y-4">
									<div className="grid gap-4 sm:grid-cols-2">
										<div>
											<p className="text-xs text-text-secondary">Name</p>
											<p className="font-medium">{user.fullName || user.username}</p>
										</div>
										<div>
											<p className="text-xs text-text-secondary">Email</p>
											<p className="font-medium">{user.email}</p>
										</div>
										<div>
											<p className="text-xs text-text-secondary">Phone</p>
											<p className="font-medium">{user.phone}</p>
										</div>
										<div>
											<p className="text-xs text-text-secondary">Role</p>
											<Badge variant={user.role === "group_admin" ? "default" : "secondary"}>
												{user.role === "group_admin" ? "Group Admin" : "User"}
											</Badge>
										</div>
									</div>

									<div className="grid gap-4 sm:grid-cols-2">
										<div>
											<p className="text-xs text-text-secondary">Created At</p>
											<p className="text-sm">{formatDate(user.createdAt)}</p>
										</div>
										<div>
											<p className="text-xs text-text-secondary">Last Login</p>
											<p className="text-sm">{formatDate(user.lastLoginAt || user.lastLogin || user.createdAt)}</p>
										</div>
									</div>
								</div>
							</div>
						</CardContent>
					</Card>

					<div className="mt-4">
						<SessionsSection userId={user.id} sessions={sessions} />
					</div>
				</div>

				<div className="space-y-4">
					<Card>
						<CardHeader>
							<h3 className="font-semibold">Vault Statistics</h3>
						</CardHeader>
						<CardContent className="space-y-4">
							<div className="flex items-center justify-between">
								<div className="flex items-center gap-2">
									<Icon icon="solar:folder-outline" size={20} className="text-text-secondary" />
									<span className="text-sm">Folders</span>
								</div>
								<span className="font-semibold">{data.vaultStats?.folders || user.folders || 0}</span>
							</div>

							<div className="flex items-center justify-between">
								<div className="flex items-center gap-2">
									<Icon icon="solar:document-outline" size={20} className="text-text-secondary" />
									<span className="text-sm">Files</span>
								</div>
								<span className="font-semibold">{data.vaultStats?.files || user.files || 0}</span>
							</div>

							<div className="flex items-center justify-between">
								<div className="flex items-center gap-2">
									<Icon icon="solar:database-outline" size={20} className="text-text-secondary" />
									<span className="text-sm">Storage Used</span>
								</div>
								<span className="font-semibold">
									{data.vaultStats?.storageUsedFormatted || user.storageUsedFormatted || "0 Bytes"}
								</span>
							</div>

							<div className="flex items-center justify-between">
								<div className="flex items-center gap-2">
									<Icon icon="solar:server-outline" size={20} className="text-text-secondary" />
									<span className="text-sm">Storage Limit</span>
								</div>
								<span className="font-semibold">
									{data.vaultStats?.storageLimitFormatted || user.storageLimitFormatted || "0 Bytes"}
								</span>
							</div>

							<div className="flex items-center justify-between">
								<div className="flex items-center gap-2">
									<Icon icon="solar:tablet-outline" size={20} className="text-text-secondary" />
									<span className="text-sm">Active Sessions</span>
								</div>
								<Badge>{user.activeSessionsCount}</Badge>
							</div>
						</CardContent>
					</Card>
				</div>
			</div>
		</div>
	);
}
