import { useState } from "react";
import { toast } from "sonner";
import { Icon } from "@/components/icon";
import { UserAvatar } from "@/components/user-avatar";
import { useSendNotification, useSendNotificationToAll } from "@/hooks/use-notifications";
import { useUsersList } from "@/hooks/use-users";
import { Button } from "@/ui/button";
import { Card, CardContent, CardHeader } from "@/ui/card";
import { Checkbox } from "@/ui/checkbox";
import { Input } from "@/ui/input";
import { Label } from "@/ui/label";
import { RadioGroup, RadioGroupItem } from "@/ui/radio-group";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/ui/select";
import { Textarea } from "@/ui/textarea";
import { Text, Title } from "@/ui/typography";
import { cn } from "@/utils";

const USERS_PER_PAGE = 10;

export default function NotificationsPage() {
	const [target, setTarget] = useState<"all" | "specific">("all");
	const [selectedUserIds, setSelectedUserIds] = useState<string[]>([]);
	const [title, setTitle] = useState("");
	const [message, setMessage] = useState("");
	const [notificationType, setNotificationType] = useState("info");
	const [sendPush, setSendPush] = useState(false);
	const [searchQuery, setSearchQuery] = useState("");
	const [currentPage, setCurrentPage] = useState(1);
	// const [notificationsPage, setNotificationsPage] = useState(1);

	// Fetch real users from API
	const { data: usersData } = useUsersList({
		page: currentPage,
		limit: USERS_PER_PAGE,
		status: "active",
		search: searchQuery,
	});
	const activeUsers = usersData?.users || [];

	// Fetch notifications history
	// const { data: notificationsData } = useNotifications({ page: notificationsPage, limit: 10 });
	// const { data: statsData } = useNotificationStats();

	const totalPages = usersData?.totalPages || 1;
	const paginatedUsers = activeUsers;

	const handleSearchChange = (value: string) => {
		setSearchQuery(value);
		setCurrentPage(1);
	};

	const sendToSpecificMutation = useSendNotification();
	const sendToAllMutation = useSendNotificationToAll();

	const resetForm = () => {
		setTitle("");
		setMessage("");
		setSelectedUserIds([]);
		setNotificationType("info");
		setSendPush(false);
	};

	const handleSend = () => {
		if (!title.trim()) {
			toast.error("Please enter a title");
			return;
		}
		if (!message.trim()) {
			toast.error("Please enter a message");
			return;
		}
		if (target === "specific" && selectedUserIds.length === 0) {
			toast.error("Please select at least one user");
			return;
		}

		if (target === "all") {
			sendToAllMutation.mutate({ title, message, type: notificationType, sendPush }, { onSuccess: resetForm });
		} else {
			sendToSpecificMutation.mutate(
				{ title, message, type: notificationType, userIds: selectedUserIds, sendPush },
				{ onSuccess: resetForm },
			);
		}
	};

	const handleUserSelection = (userId: string) => {
		setSelectedUserIds((prev) => (prev.includes(userId) ? prev.filter((id) => id !== userId) : [...prev, userId]));
	};

	const handleSelectAllOnPage = () => {
		const pageUserIds = paginatedUsers.map((u) => u.id);
		setSelectedUserIds((prev) => {
			const newSelection = [...prev];
			pageUserIds.forEach((id) => {
				if (!newSelection.includes(id)) {
					newSelection.push(id);
				}
			});
			return newSelection;
		});
	};

	const handleDeselectAllOnPage = () => {
		const pageUserIds = paginatedUsers.map((u) => u.id);
		setSelectedUserIds((prev) => prev.filter((id) => !pageUserIds.includes(id)));
	};

	const areAllPageUsersSelected =
		paginatedUsers.length > 0 && paginatedUsers.every((u) => selectedUserIds.includes(u.id));

	const recipientCount = target === "all" ? usersData?.total || 0 : selectedUserIds.length;
	const isLoading = sendToSpecificMutation.isPending || sendToAllMutation.isPending;

	return (
		<div className="w-full">
			<Card>
				<CardHeader>
					<div className="flex items-start justify-between">
						<div>
							<Title as="h2" className="text-2xl font-bold">
								Send Notification
							</Title>
							<Text variant="body2" className="text-muted-foreground mt-1">
								Send announcements and messages to users
							</Text>
						</div>
						<div className="flex h-12 w-12 items-center justify-center rounded-xl bg-primary/10">
							<Icon icon="solar:bell-bold" size={24} className="text-primary" />
						</div>
					</div>
				</CardHeader>

				<CardContent>
					<div className="space-y-6">
						{/* Target Selection */}
						<div className="space-y-3">
							<Label className="text-base font-semibold">Recipients</Label>
							<RadioGroup
								value={target}
								onValueChange={(value) => {
									setTarget(value as "all" | "specific");
									setSelectedUserIds([]);
								}}
								className="flex flex-col space-y-2"
							>
								<div className="flex items-center space-x-3 rounded-lg border p-4 hover:bg-muted/50 transition-colors">
									<RadioGroupItem value="all" id="all" />
									<Label htmlFor="all" className="flex-1 cursor-pointer">
										<div className="font-medium">All Active Users</div>
										<Text variant="body2" className="text-muted-foreground">
											Send to all {usersData?.total || 0} active users
										</Text>
									</Label>
									<Icon icon="solar:users-group-rounded-bold" size={24} className="text-primary" />
								</div>

								<div className="flex items-center space-x-3 rounded-lg border p-4 hover:bg-muted/50 transition-colors">
									<RadioGroupItem value="specific" id="specific" />
									<Label htmlFor="specific" className="flex-1 cursor-pointer">
										<div className="font-medium">Specific Users</div>
										<Text variant="body2" className="text-muted-foreground">
											Choose specific users to notify
										</Text>
									</Label>
									<Icon icon="solar:user-check-bold" size={24} className="text-blue-500" />
								</div>
							</RadioGroup>
						</div>

						{/* User Selection */}
						{target === "specific" && (
							<div className="space-y-3">
								<div className="flex items-center justify-between">
									<Label className="text-base font-semibold">Select Users ({selectedUserIds.length} selected)</Label>
									<div className="flex gap-2">
										<Button
											type="button"
											variant="outline"
											size="sm"
											onClick={handleSelectAllOnPage}
											disabled={areAllPageUsersSelected}
										>
											<Icon icon="solar:check-square-bold" size={16} className="mr-1" />
											Select Page
										</Button>
										<Button type="button" variant="outline" size="sm" onClick={handleDeselectAllOnPage}>
											<Icon icon="solar:close-square-bold" size={16} className="mr-1" />
											Deselect Page
										</Button>
									</div>
								</div>

								{/* Search */}
								<div className="relative">
									<Icon
										icon="solar:magnifer-outline"
										size={20}
										className="absolute left-3 top-1/2 -translate-y-1/2 text-muted-foreground"
									/>
									<Input
										placeholder="Search users by name or email..."
										value={searchQuery}
										onChange={(e) => handleSearchChange(e.target.value)}
										className="pl-10"
									/>
									{searchQuery && (
										<button
											type="button"
											onClick={() => handleSearchChange("")}
											className="absolute right-3 top-1/2 -translate-y-1/2 text-muted-foreground hover:text-foreground"
										>
											<Icon icon="solar:close-circle-bold" size={20} />
										</button>
									)}
								</div>

								{/* User List */}
								<div className="space-y-2 rounded-lg border p-3">
									{paginatedUsers.length === 0 ? (
										<div className="flex flex-col items-center justify-center py-8 text-muted-foreground">
											<Icon icon="solar:users-group-rounded-outline" size={48} className="mb-2 opacity-50" />
											<Text variant="body2">{searchQuery ? "No users found" : "No users available"}</Text>
										</div>
									) : (
										<div className="space-y-2">
											{paginatedUsers.map((user) => (
												<div
													key={user.id}
													role="button"
													tabIndex={0}
													onClick={() => handleUserSelection(user.id)}
													onKeyDown={(e) => {
														if (e.key === "Enter" || e.key === " ") {
															e.preventDefault();
															handleUserSelection(user.id);
														}
													}}
													className={cn(
														"flex items-center gap-3 p-3 rounded-lg cursor-pointer transition-all",
														selectedUserIds.includes(user.id)
															? "bg-primary/10 border border-primary"
															: "hover:bg-muted/50 border border-transparent",
													)}
												>
													<UserAvatar
														src={user.image || user.avatar}
														name={user.fullName || user.username}
														email={user.email}
														size="md"
													/>
													<div className="flex-1">
														<div className="font-medium">{user.fullName || user.username}</div>
														<Text variant="body2" className="text-muted-foreground">
															{user.email}
														</Text>
													</div>
													{selectedUserIds.includes(user.id) && (
														<Icon icon="solar:check-circle-bold" size={20} className="text-primary" />
													)}
												</div>
											))}
										</div>
									)}
								</div>

								{/* Pagination */}
								{totalPages > 1 && (
									<div className="flex items-center justify-between pt-2">
										<Text variant="body2" className="text-muted-foreground">
											Page {currentPage} of {totalPages}
										</Text>
										<div className="flex gap-2">
											<Button
												type="button"
												variant="outline"
												size="sm"
												onClick={() => setCurrentPage((p) => Math.max(1, p - 1))}
												disabled={currentPage === 1}
											>
												<Icon icon="solar:alt-arrow-left-outline" size={16} />
											</Button>
											<Button
												type="button"
												variant="outline"
												size="sm"
												onClick={() => setCurrentPage((p) => Math.min(totalPages, p + 1))}
												disabled={currentPage === totalPages}
											>
												<Icon icon="solar:alt-arrow-right-outline" size={16} />
											</Button>
										</div>
									</div>
								)}
							</div>
						)}

						{/* Title */}
						<div className="space-y-2">
							<Label htmlFor="title" className="text-base font-semibold">
								Title
							</Label>
							<Input
								id="title"
								placeholder="Enter notification title..."
								value={title}
								onChange={(e) => setTitle(e.target.value)}
								className="text-base"
							/>
						</div>

						{/* Message */}
						<div className="space-y-2">
							<Label htmlFor="message" className="text-base font-semibold">
								Message
							</Label>
							<Textarea
								id="message"
								placeholder="Enter your message..."
								value={message}
								onChange={(e) => setMessage(e.target.value)}
								className="min-h-[200px] text-base resize-none"
							/>
						</div>

						{/* Notification Type */}
						<div className="space-y-2">
							<Label htmlFor="type" className="text-base font-semibold">
								Notification Type
							</Label>
							<Select value={notificationType} onValueChange={setNotificationType}>
								<SelectTrigger id="type">
									<SelectValue />
								</SelectTrigger>
								<SelectContent>
									<SelectItem value="info">Info</SelectItem>
									<SelectItem value="announcement">Announcement</SelectItem>
									<SelectItem value="success">Success</SelectItem>
									<SelectItem value="warning">Warning</SelectItem>
									<SelectItem value="maintenance">Maintenance</SelectItem>
								</SelectContent>
							</Select>
						</div>

						{/* Push Notification */}
						<div className="flex items-center space-x-2">
							<Checkbox id="push" checked={sendPush} onCheckedChange={(checked) => setSendPush(checked as boolean)} />
							<Label htmlFor="push" className="cursor-pointer">
								Send push notification to mobile devices
							</Label>
						</div>

						{/* Footer */}
						<div className="flex items-center justify-between pt-4 border-t">
							<div className="flex items-center gap-2 text-muted-foreground">
								<Icon icon="solar:users-group-rounded-outline" size={20} />
								<Text variant="body2">
									Will be sent to <span className="font-semibold text-foreground">{recipientCount}</span> user
									{recipientCount !== 1 ? "s" : ""}
								</Text>
							</div>
							<Button onClick={handleSend} disabled={isLoading} size="lg" className="min-w-32">
								{isLoading ? (
									<>
										<Icon icon="solar:loader-outline" size={20} className="mr-2 animate-spin" />
										Sending...
									</>
								) : (
									<>
										<Icon icon="solar:plain-bold" size={20} className="mr-2" />
										Send
									</>
								)}
							</Button>
						</div>
					</div>
				</CardContent>
			</Card>
		</div>
	);
}
