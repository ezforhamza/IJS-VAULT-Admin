/**
 * User Filters Component
 */

import { Input } from '@/ui/input';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/ui/select';
import { useIJSUserActions, useIJSUserFilters } from '@/store/ijsUserStore';

export function UserFilters() {
  const filters = useIJSUserFilters();
  const { setSearch, setStatus, setRole, resetFilters } = useIJSUserActions();

  return (
    <div className="flex flex-wrap items-center gap-4">
      <div className="w-full sm:w-64">
        <Input
          placeholder="Search by username, email, or phone..."
          value={filters.search}
          onChange={(e) => setSearch(e.target.value)}
          className="h-9"
        />
      </div>

      <Select value={filters.status || 'all'} onValueChange={(val) => setStatus(val === 'all' ? undefined : val as any)}>
        <SelectTrigger className="h-9 w-[140px]">
          <SelectValue placeholder="Status" />
        </SelectTrigger>
        <SelectContent>
          <SelectItem value="all">All Status</SelectItem>
          <SelectItem value="active">Active</SelectItem>
          <SelectItem value="inactive">Inactive</SelectItem>
          <SelectItem value="suspended">Suspended</SelectItem>
        </SelectContent>
      </Select>

      <Select value={filters.role || 'all'} onValueChange={(val) => setRole(val === 'all' ? undefined : val as any)}>
        <SelectTrigger className="h-9 w-[140px]">
          <SelectValue placeholder="Role" />
        </SelectTrigger>
        <SelectContent>
          <SelectItem value="all">All Roles</SelectItem>
          <SelectItem value="user">User</SelectItem>
          <SelectItem value="group_admin">Group Admin</SelectItem>
        </SelectContent>
      </Select>

      {(filters.search || filters.status || filters.role) && (
        <button
          onClick={resetFilters}
          className="text-sm text-primary hover:underline"
        >
          Reset Filters
        </button>
      )}
    </div>
  );
}
