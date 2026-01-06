/**
 * Session Actions Menu Component
 */

import { useState } from "react";
import { ConfirmModal } from "@/components/confirm-modal";
import { Icon } from "@/components/icon";
import { useTerminateSession } from "@/hooks/use-sessions";
import type { SessionWithUser } from "@/types/user-management";
import { Button } from "@/ui/button";
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from "@/ui/dropdown-menu";

interface SessionActionsMenuProps {
	session: SessionWithUser;
}

export function SessionActionsMenu({ session }: SessionActionsMenuProps) {
	const [showConfirm, setShowConfirm] = useState(false);
	const terminateSessionMutation = useTerminateSession();

	const handleTerminate = () => {
		terminateSessionMutation.mutate(session.id, {
			onSuccess: () => {
				setShowConfirm(false);
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
					<DropdownMenuItem onClick={() => setShowConfirm(true)} className="text-destructive">
						<Icon icon="solar:logout-2-outline" size={16} className="mr-2" />
						Terminate Session
					</DropdownMenuItem>
				</DropdownMenuContent>
			</DropdownMenu>

			<ConfirmModal
				open={showConfirm}
				onOpenChange={setShowConfirm}
				onConfirm={handleTerminate}
				title="Terminate Session"
				description={`Are you sure you want to terminate this session for ${session.user.fullName || session.user.email}? The user will be logged out from this device.`}
				confirmText="Terminate"
				variant="danger"
				loading={terminateSessionMutation.isPending}
			/>
		</>
	);
}
