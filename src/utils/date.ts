/**
 * Date utility functions
 */

/**
 * Format date to relative time (e.g., "just now", "5 minutes ago", "2 hours ago")
 */
export function formatRelativeTime(date: string | Date): string {
	const now = new Date();
	const past = new Date(date);
	const diffInSeconds = Math.floor((now.getTime() - past.getTime()) / 1000);

	// Just now (less than 1 minute)
	if (diffInSeconds < 60) {
		return "just now";
	}

	// Minutes ago (1-59 minutes)
	const diffInMinutes = Math.floor(diffInSeconds / 60);
	if (diffInMinutes < 60) {
		return `${diffInMinutes} ${diffInMinutes === 1 ? "minute" : "minutes"} ago`;
	}

	// Hours ago (1-23 hours)
	const diffInHours = Math.floor(diffInMinutes / 60);
	if (diffInHours < 24) {
		return `${diffInHours} ${diffInHours === 1 ? "hour" : "hours"} ago`;
	}

	// Days ago (1-6 days)
	const diffInDays = Math.floor(diffInHours / 24);
	if (diffInDays < 7) {
		return `${diffInDays} ${diffInDays === 1 ? "day" : "days"} ago`;
	}

	// Weeks ago (1-3 weeks)
	const diffInWeeks = Math.floor(diffInDays / 7);
	if (diffInWeeks < 4) {
		return `${diffInWeeks} ${diffInWeeks === 1 ? "week" : "weeks"} ago`;
	}

	// Months ago (1-11 months)
	const diffInMonths = Math.floor(diffInDays / 30);
	if (diffInMonths < 12) {
		return `${diffInMonths} ${diffInMonths === 1 ? "month" : "months"} ago`;
	}

	// Years ago
	const diffInYears = Math.floor(diffInDays / 365);
	return `${diffInYears} ${diffInYears === 1 ? "year" : "years"} ago`;
}

/**
 * Format date to full date/time string
 */
export function formatDateTime(date: string | Date): string {
	return new Date(date).toLocaleString();
}

/**
 * Format date to short date string
 */
export function formatDate(date: string | Date): string {
	return new Date(date).toLocaleDateString();
}
