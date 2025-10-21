/**
 * Session Actions Menu Component
 */

import { Icon } from "@/components/icon";
import { useLogoutSession } from "@/hooks/use-sessions";
import type { SessionWithUser } from "@/types/user-management";
import { Button } from "@/ui/button";
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from "@/ui/dropdown-menu";

interface SessionActionsMenuProps {
	session: SessionWithUser;
}

export function SessionActionsMenu({ session }: SessionActionsMenuProps) {
	const logoutSessionMutation = useLogoutSession();

	const handleLogout = () => {
		if (window.confirm(`Are you sure you want to terminate this session?`)) {
			logoutSessionMutation.mutate({
				userId: session.userId,
				sessionId: session.id,
			});
		}
	};

	return (
		<DropdownMenu>
			<DropdownMenuTrigger asChild>
				<Button variant="ghost" size="icon" className="h-8 w-8">
					<Icon icon="solar:menu-dots-bold" size={18} />
				</Button>
			</DropdownMenuTrigger>
			<DropdownMenuContent align="end">
				<DropdownMenuItem onClick={handleLogout} className="text-destructive">
					<Icon icon="solar:logout-2-outline" size={16} className="mr-2" />
					Terminate Session
				</DropdownMenuItem>
			</DropdownMenuContent>
		</DropdownMenu>
	);
}
