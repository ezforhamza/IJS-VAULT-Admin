/**
 * Confirmation Modal Component
 *
 * A custom modal for confirming destructive actions
 */

import { Icon } from "@/components/icon";
import { Button } from "@/ui/button";
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle } from "@/ui/dialog";

interface ConfirmModalProps {
	open: boolean;
	onOpenChange: (open: boolean) => void;
	onConfirm: () => void;
	title: string;
	description: string;
	confirmText?: string;
	cancelText?: string;
	variant?: "danger" | "warning" | "info";
	loading?: boolean;
}

export function ConfirmModal({
	open,
	onOpenChange,
	onConfirm,
	title,
	description,
	confirmText = "Confirm",
	cancelText = "Cancel",
	variant = "danger",
	loading = false,
}: ConfirmModalProps) {
	const iconMap = {
		danger: { icon: "solar:danger-circle-bold", color: "text-red-500" },
		warning: { icon: "solar:danger-triangle-bold", color: "text-orange-500" },
		info: { icon: "solar:info-circle-bold", color: "text-blue-500" },
	};

	const { icon, color } = iconMap[variant];

	const handleConfirm = () => {
		onConfirm();
	};

	return (
		<Dialog open={open} onOpenChange={onOpenChange}>
			<DialogContent className="sm:max-w-[425px]">
				<DialogHeader>
					<div className="flex items-center gap-3">
						<div
							className={`flex h-12 w-12 items-center justify-center rounded-full bg-${variant === "danger" ? "red" : variant === "warning" ? "orange" : "blue"}-100`}
						>
							<Icon icon={icon} size={24} className={color} />
						</div>
						<DialogTitle className="text-lg">{title}</DialogTitle>
					</div>
					<DialogDescription className="pt-2">{description}</DialogDescription>
				</DialogHeader>
				<DialogFooter className="gap-2 sm:gap-0">
					<Button type="button" variant="outline" onClick={() => onOpenChange(false)} disabled={loading}>
						{cancelText}
					</Button>
					<Button
						type="button"
						variant={variant === "danger" ? "destructive" : "default"}
						onClick={handleConfirm}
						disabled={loading}
					>
						{loading && <Icon icon="solar:loader-outline" className="mr-2 animate-spin" size={16} />}
						{confirmText}
					</Button>
				</DialogFooter>
			</DialogContent>
		</Dialog>
	);
}
