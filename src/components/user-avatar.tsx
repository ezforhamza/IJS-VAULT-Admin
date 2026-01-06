/**
 * User Avatar Component
 *
 * Displays user profile picture or initials with random background color
 */

import { cn } from "@/utils";

interface UserAvatarProps {
	src?: string | null;
	name?: string;
	email?: string;
	size?: "sm" | "md" | "lg" | "xl";
	className?: string;
}

const sizeClasses = {
	sm: "h-8 w-8 text-xs",
	md: "h-10 w-10 text-sm",
	lg: "h-12 w-12 text-base",
	xl: "h-32 w-32 text-2xl",
};

// Generate consistent color based on string
function stringToColor(str: string): string {
	const colors = [
		"bg-blue-500",
		"bg-green-500",
		"bg-yellow-500",
		"bg-red-500",
		"bg-purple-500",
		"bg-pink-500",
		"bg-indigo-500",
		"bg-teal-500",
		"bg-orange-500",
		"bg-cyan-500",
	];

	let hash = 0;
	for (let i = 0; i < str.length; i++) {
		hash = str.charCodeAt(i) + ((hash << 5) - hash);
	}

	return colors[Math.abs(hash) % colors.length];
}

// Get initials from name or email
function getInitials(name?: string, email?: string): string {
	if (name) {
		const parts = name.trim().split(/\s+/);
		if (parts.length >= 2) {
			return (parts[0][0] + parts[parts.length - 1][0]).toUpperCase();
		}
		return name.substring(0, 2).toUpperCase();
	}

	if (email) {
		return email.substring(0, 2).toUpperCase();
	}

	return "??";
}

export function UserAvatar({ src, name, email, size = "md", className }: UserAvatarProps) {
	const displayName = name || email || "User";
	const initials = getInitials(displayName);
	const bgColor = stringToColor(displayName);

	// If image exists and is valid, show image
	if (src) {
		return (
			<div className={cn("relative overflow-hidden rounded-full", sizeClasses[size], className)}>
				<img
					src={src}
					alt={name || email || "User"}
					className="h-full w-full object-cover"
					onError={(e) => {
						// Hide image on error and show initials fallback
						e.currentTarget.style.display = "none";
						const parent = e.currentTarget.parentElement;
						if (parent) {
							parent.innerHTML = `<div class="flex h-full w-full items-center justify-center ${bgColor} text-white font-semibold">${initials}</div>`;
						}
					}}
				/>
			</div>
		);
	}

	// Show initials with random background color
	return (
		<div
			className={cn(
				"flex items-center justify-center rounded-full text-white font-semibold",
				sizeClasses[size],
				bgColor,
				className,
			)}
		>
			{initials}
		</div>
	);
}
