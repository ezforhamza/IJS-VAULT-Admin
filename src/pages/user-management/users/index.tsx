/**
 * Users List Page
 */

import { Table } from "antd";
import { useUsersList } from "@/hooks/use-users";
import { useIJSSelectedUserIds, useIJSUserActions, useIJSUserFilters } from "@/store/ijsUserStore";
import { Card, CardContent, CardHeader } from "@/ui/card";

import { getUserColumns } from "./columns";
import { BulkActionsBar } from "./components/bulk-actions-bar";
import { ExportButton } from "./components/export-button";
import { UserFilters } from "./components/user-filters";

export default function UsersPage() {
	const filters = useIJSUserFilters();
	const selectedUserIds = useIJSSelectedUserIds();
	const { setPage, setPageSize, toggleUserSelection, setSelectedUserIds, clearSelection } = useIJSUserActions();

	const { data, isLoading } = useUsersList(filters);

	const handleToggleSelect = (id: string) => {
		toggleUserSelection(id);
	};

	const handleToggleSelectAll = (checked: boolean) => {
		if (checked) {
			const allIds = data?.users.map((u) => u.id) || [];
			setSelectedUserIds(allIds);
		} else {
			clearSelection();
		}
	};

	const columns = getUserColumns({
		selectedUserIds,
		onToggleSelect: handleToggleSelect,
		onToggleSelectAll: handleToggleSelectAll,
	});

	const selectedUsers = (data?.users || [])
		.filter((user) => selectedUserIds.includes(user.id))
		.map((user) => ({ id: user.id, status: user.status }));

	return (
		<div className="flex flex-col gap-4">
			<Card>
				<CardHeader>
					<div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
						<div>
							<h1 className="text-2xl font-bold">User Management</h1>
							<p className="text-sm text-text-secondary">Manage IJS VAULT users and their sessions</p>
						</div>
						<ExportButton />
					</div>
				</CardHeader>

				<CardContent>
					<div className="mb-4">
						<UserFilters />
					</div>

					<BulkActionsBar selectedUsers={selectedUsers} />

					<Table
						rowKey="id"
						size="small"
						loading={isLoading}
						columns={columns}
						dataSource={data?.users || []}
						pagination={{
							current: filters.page,
							pageSize: filters.pageSize,
							total: data?.total || 0,
							showSizeChanger: true,
							showTotal: (total) => `Total ${total} users`,
							onChange: (page, pageSize) => {
								setPage(page);
								setPageSize(pageSize);
							},
						}}
						scroll={{ x: 1200 }}
					/>
				</CardContent>
			</Card>
		</div>
	);
}
