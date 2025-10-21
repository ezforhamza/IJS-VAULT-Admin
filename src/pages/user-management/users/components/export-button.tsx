/**
 * Export Users Button Component
 */

import { Icon } from "@/components/icon";
import { useExportUsers } from "@/hooks/use-users";
import { useIJSUserFilters } from "@/store/ijsUserStore";
import { Button } from "@/ui/button";
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from "@/ui/dropdown-menu";

export function ExportButton() {
	const filters = useIJSUserFilters();
	const exportMutation = useExportUsers();

	const handleExport = (format: "csv" | "excel") => {
		const { page: _page, pageSize: _pageSize, ...filterParams } = filters;
		exportMutation.mutate({
			format,
			filters: filterParams,
		});
	};

	return (
		<DropdownMenu>
			<DropdownMenuTrigger asChild>
				<Button variant="outline" size="sm" disabled={exportMutation.isPending}>
					<Icon icon="solar:download-outline" size={16} className="mr-2" />
					{exportMutation.isPending ? "Exporting..." : "Export"}
				</Button>
			</DropdownMenuTrigger>
			<DropdownMenuContent align="end">
				<DropdownMenuItem onClick={() => handleExport("csv")}>
					<Icon icon="solar:document-text-outline" size={16} className="mr-2" />
					Export as CSV
				</DropdownMenuItem>
				<DropdownMenuItem onClick={() => handleExport("excel")}>
					<Icon icon="solar:document-outline" size={16} className="mr-2" />
					Export as Excel
				</DropdownMenuItem>
			</DropdownMenuContent>
		</DropdownMenu>
	);
}
