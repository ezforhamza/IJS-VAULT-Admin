/**
 * Sessions List Page
 */

import { Table } from "antd";
import { useSessionsList } from "@/hooks/use-sessions";
import { useIJSSelectedSessionIds, useIJSSessionActions, useIJSSessionFilters } from "@/store/ijsSessionStore";
import type { SessionWithUser } from "@/types/user-management";
import { Card, CardContent, CardHeader } from "@/ui/card";

import { getSessionColumns } from "./columns";
import { BulkLogoutBar } from "./components/bulk-logout-bar";
import { SessionFilters } from "./components/session-filters";

export default function SessionsPage() {
	const filters = useIJSSessionFilters();
	const selectedSessionIds = useIJSSelectedSessionIds();
	const { setPage, setPageSize, toggleSessionSelection, setSelectedSessionIds, clearSelection } =
		useIJSSessionActions();

	const { data, isLoading } = useSessionsList(filters);

	const handleToggleSelect = (id: string) => {
		toggleSessionSelection(id);
	};

	const handleToggleSelectAll = (checked: boolean) => {
		if (checked) {
			const allIds = data?.sessions.map((s) => s.id) || [];
			setSelectedSessionIds(allIds);
		} else {
			clearSelection();
		}
	};

	const columns = getSessionColumns({
		selectedSessionIds,
		onToggleSelect: handleToggleSelect,
		onToggleSelectAll: handleToggleSelectAll,
	});

	return (
		<div className="flex flex-col gap-4">
			<Card>
				<CardHeader>
					<div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
						<div>
							<h1 className="text-2xl font-bold">Sessions Management</h1>
							<p className="text-sm text-text-secondary">Monitor and manage active user sessions</p>
						</div>
					</div>
				</CardHeader>

				<CardContent>
					<div className="mb-4">
						<SessionFilters />
					</div>

					<BulkLogoutBar />

					<Table<SessionWithUser>
						rowKey="id"
						size="small"
						loading={isLoading}
						columns={columns}
						dataSource={data?.sessions || []}
						pagination={{
							current: filters.page,
							pageSize: filters.pageSize,
							total: data?.total || 0,
							showSizeChanger: true,
							showTotal: (total) => `Total ${total} active sessions`,
							onChange: (page, pageSize) => {
								setPage(page);
								setPageSize(pageSize);
							},
						}}
						scroll={{ x: 1400 }}
					/>
				</CardContent>
			</Card>
		</div>
	);
}
