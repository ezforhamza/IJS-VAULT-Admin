/**
 * Session Filters Component
 */

import { useIJSSessionActions, useIJSSessionFilters } from "@/store/ijsSessionStore";
import { Input } from "@/ui/input";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/ui/select";

export function SessionFilters() {
	const filters = useIJSSessionFilters();
	const { setSearch, setDeviceType, resetFilters } = useIJSSessionActions();

	return (
		<div className="flex flex-wrap items-center gap-4">
			<div className="w-full sm:w-64">
				<Input
					placeholder="Search by username or email..."
					value={filters.search}
					onChange={(e) => setSearch(e.target.value)}
					className="h-9"
				/>
			</div>

			<Select
				value={filters.deviceType || "all"}
				onValueChange={(val) => setDeviceType(val === "all" ? undefined : (val as any))}
			>
				<SelectTrigger className="h-9 w-[140px]">
					<SelectValue placeholder="Device Type" />
				</SelectTrigger>
				<SelectContent>
					<SelectItem value="all">All Devices</SelectItem>
					<SelectItem value="android">Android</SelectItem>
					<SelectItem value="ios">iOS</SelectItem>
					<SelectItem value="huawei">Huawei</SelectItem>
					<SelectItem value="web">Web</SelectItem>
				</SelectContent>
			</Select>

			{(filters.search || filters.deviceType) && (
				<button type="button" onClick={resetFilters} className="text-sm text-primary hover:underline">
					Reset Filters
				</button>
			)}
		</div>
	);
}
