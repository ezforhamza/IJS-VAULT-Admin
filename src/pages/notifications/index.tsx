import { useMutation } from "@tanstack/react-query";
import { useMemo, useState } from "react";
import { toast } from "sonner";
import { DB_IJS_USERS } from "@/_mock/assets/ijs-users";
import notificationService from "@/api/services/notificationService";
import { Icon } from "@/components/icon";
import { Button } from "@/ui/button";
import { Card, CardContent, CardHeader } from "@/ui/card";
import { Input } from "@/ui/input";
import { Label } from "@/ui/label";
import { RadioGroup, RadioGroupItem } from "@/ui/radio-group";
import { Textarea } from "@/ui/textarea";
import { Text, Title } from "@/ui/typography";
import { cn } from "@/utils";

const USERS_PER_PAGE = 10;

export default function NotificationsPage() {
	const [target, setTarget] = useState<"all" | "specific">("all");
	const [selectedUserIds, setSelectedUserIds] = useState<string[]>([]);
	const [title, setTitle] = useState("");
	const [message, setMessage] = useState("");
	const [searchQuery, setSearchQuery] = useState("");
	const [currentPage, setCurrentPage] = useState(1);

	const activeUsers = DB_IJS_USERS.filter((u) => u.status === "active");

	// Filter users by search query
	const filteredUsers = useMemo(() => {
		if (!searchQuery.trim()) return activeUsers;
		const query = searchQuery.toLowerCase();
		return activeUsers.filter((u) => u.username.toLowerCase().includes(query) || u.email.toLowerCase().includes(query));
	}, [searchQuery, activeUsers]);

	// Paginate users
	const totalPages = Math.ceil(filteredUsers.length / USERS_PER_PAGE);
	const paginatedUsers = useMemo(() => {
		const start = (currentPage - 1) * USERS_PER_PAGE;
		return filteredUsers.slice(start, start + USERS_PER_PAGE);
	}, [filteredUsers, currentPage]);

	// Reset to page 1 when search changes
	const handleSearchChange = (value: string) => {
		setSearchQuery(value);
		setCurrentPage(1);
	};

	const sendMutation = useMutation({
		mutationFn: notificationService.sendNotification,
		onSuccess: (response) => {
			toast.success(`Notification sent successfully! Sent: ${response.sent}, Failed: ${response.failed}`);
			// Reset form
			setTitle("");
			setMessage("");
			setSelectedUserIds([]);
		},
		onError: (error: any) => {
			toast.error(error?.message || "Failed to send notification");
		},
	});

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

		sendMutation.mutate({
			target,
			userIds: target === "specific" ? selectedUserIds : undefined,
			title,
			message,
		});
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

	const recipientCount = target === "all" ? activeUsers.length : selectedUserIds.length;

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
											Send to all {activeUsers.length} active users
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
													<img src={user.avatar} alt={user.username} className="h-10 w-10 rounded-full" />
													<div className="flex-1">
														<div className="font-medium">{user.username}</div>
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
											Page {currentPage} of {totalPages} ({filteredUsers.length} users)
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

						{/* Footer */}
						<div className="flex items-center justify-between pt-4 border-t">
							<div className="flex items-center gap-2 text-muted-foreground">
								<Icon icon="solar:users-group-rounded-outline" size={20} />
								<Text variant="body2">
									Will be sent to <span className="font-semibold text-foreground">{recipientCount}</span> user
									{recipientCount !== 1 ? "s" : ""}
								</Text>
							</div>
							<Button onClick={handleSend} disabled={sendMutation.isPending} size="lg" className="min-w-32">
								{sendMutation.isPending ? (
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
