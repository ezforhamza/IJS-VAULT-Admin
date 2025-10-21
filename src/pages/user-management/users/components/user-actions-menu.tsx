/**
 * User Actions Menu Component
 */

import { Icon } from "@/components/icon";
import { useDeleteUser } from "@/hooks/use-users";
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
	const { push } = useRouter();
	const deleteUserMutation = useDeleteUser();

	const handleViewDetail = () => {
		push(`/user-management/users/${user.id}`);
	};

	const handleDelete = () => {
		if (window.confirm(`Are you sure you want to delete user "${user.username}"?`)) {
			deleteUserMutation.mutate(user.id);
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
				<DropdownMenuItem onClick={handleViewDetail}>
					<Icon icon="solar:eye-outline" size={16} className="mr-2" />
					View Details
				</DropdownMenuItem>
				<DropdownMenuSeparator />
				<DropdownMenuItem onClick={handleDelete} className="text-destructive">
					<Icon icon="solar:trash-bin-outline" size={16} className="mr-2" />
					Delete User
				</DropdownMenuItem>
			</DropdownMenuContent>
		</DropdownMenu>
	);
}
