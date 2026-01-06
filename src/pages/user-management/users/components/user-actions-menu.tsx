/**
 * User Actions Menu Component
 */

import { useState } from "react";
import { ConfirmModal } from "@/components/confirm-modal";
import { Icon } from "@/components/icon";
import { useActivateUser, useDeleteUser, useSuspendUser } from "@/hooks/use-users";
import { useRouter } from "@/routes/hooks";
import type { IJSUser } from "@/types/user-management";
import { Button } from "@/ui/button";
import {
	DropdownMenu,
	DropdownMenuContent,
	DropdownMenuItem,
	DropdownMenuSeparator,
	DropdownMenuTrigger,
} from "@/ui/dropdown-menu";

interface UserActionsMenuProps {
	user: IJSUser;
}

export function UserActionsMenu({ user }: UserActionsMenuProps) {
	const [showDeleteConfirm, setShowDeleteConfirm] = useState(false);
	const [showSuspendConfirm, setShowSuspendConfirm] = useState(false);
	const [showActivateConfirm, setShowActivateConfirm] = useState(false);
	const { push } = useRouter();
	const deleteUserMutation = useDeleteUser();
	const suspendUserMutation = useSuspendUser();
	const activateUserMutation = useActivateUser();

	const handleViewDetail = () => {
		push(`/user-management/users/${user.id}`);
	};

	const handleDelete = () => {
		deleteUserMutation.mutate(user.id, {
			onSuccess: () => {
				setShowDeleteConfirm(false);
			},
		});
	};

	const handleSuspend = () => {
		suspendUserMutation.mutate(
			{ userId: user.id, reason: "Suspended by admin" },
			{
				onSuccess: () => {
					setShowSuspendConfirm(false);
				},
			},
		);
	};

	const handleActivate = () => {
		activateUserMutation.mutate(user.id, {
			onSuccess: () => {
				setShowActivateConfirm(false);
			},
		});
	};

	return (
		<>
			<DropdownMenu>
				<DropdownMenuTrigger asChild>
					<Button variant="ghost" size="icon" className="h-8 w-8">
						<Icon icon="solar:menu-dots-bold" size={18} />
					</Button>
				</DropdownMenuTrigger>
				<DropdownMenuContent align="end">
					<DropdownMenuItem onClick={handleViewDetail}>
						<Icon icon="solar:eye-outline" size={16} className="mr-2" />
						View Details
					</DropdownMenuItem>
					<DropdownMenuSeparator />
					{user.status === "suspended" ? (
						<DropdownMenuItem onClick={() => setShowActivateConfirm(true)} className="text-green-600">
							<Icon icon="solar:check-circle-outline" size={16} className="mr-2" />
							Activate User
						</DropdownMenuItem>
					) : user.status === "active" ? (
						<DropdownMenuItem onClick={() => setShowSuspendConfirm(true)} className="text-amber-600">
							<Icon icon="solar:forbidden-circle-outline" size={16} className="mr-2" />
							Suspend User
						</DropdownMenuItem>
					) : (
						<DropdownMenuItem onClick={() => setShowActivateConfirm(true)} className="text-green-600">
							<Icon icon="solar:check-circle-outline" size={16} className="mr-2" />
							Activate User
						</DropdownMenuItem>
					)}
					<DropdownMenuSeparator />
					<DropdownMenuItem onClick={() => setShowDeleteConfirm(true)} className="text-destructive">
						<Icon icon="solar:trash-bin-outline" size={16} className="mr-2" />
						Delete User
					</DropdownMenuItem>
				</DropdownMenuContent>
			</DropdownMenu>

			<ConfirmModal
				open={showDeleteConfirm}
				onOpenChange={setShowDeleteConfirm}
				onConfirm={handleDelete}
				title="Delete User"
				description={`Are you sure you want to delete ${user.fullName || user.username}? This action cannot be undone and will permanently remove all user data.`}
				confirmText="Delete"
				variant="danger"
				loading={deleteUserMutation.isPending}
			/>

			<ConfirmModal
				open={showSuspendConfirm}
				onOpenChange={setShowSuspendConfirm}
				onConfirm={handleSuspend}
				title="Suspend User"
				description={`Are you sure you want to suspend ${user.fullName || user.username}? The user will not be able to login until activated.`}
				confirmText="Suspend"
				variant="warning"
				loading={suspendUserMutation.isPending}
			/>

			<ConfirmModal
				open={showActivateConfirm}
				onOpenChange={setShowActivateConfirm}
				onConfirm={handleActivate}
				title="Activate User"
				description={`Are you sure you want to activate ${user.fullName || user.username}? The user will be able to login again.`}
				confirmText="Activate"
				loading={activateUserMutation.isPending}
			/>
		</>
	);
}
