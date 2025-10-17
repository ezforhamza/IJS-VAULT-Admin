/**
 * Bulk Actions Bar Component
 */

import { Button } from '@/ui/button';
import { Card } from '@/ui/card';
import { Icon } from '@/components/icon';
import { useBulkActivateUsers, useBulkDeleteUsers, useBulkSuspendUsers } from '@/hooks/use-users';
import { useIJSSelectedUserIds, useIJSUserActions } from '@/store/ijsUserStore';

interface BulkActionsBarProps {
  selectedUsers: Array<{ id: string; status: string }>;
}

export function BulkActionsBar({ selectedUsers }: BulkActionsBarProps) {
  const selectedUserIds = useIJSSelectedUserIds();
  const { clearSelection } = useIJSUserActions();
  const bulkDeleteMutation = useBulkDeleteUsers();
  const bulkSuspendMutation = useBulkSuspendUsers();
  const bulkActivateMutation = useBulkActivateUsers();

  if (selectedUserIds.length === 0) return null;

  const hasSuspendedUsers = selectedUsers.some((u) => u.status === 'suspended');

  const handleBulkDelete = () => {
    if (
      window.confirm(`Are you sure you want to delete ${selectedUserIds.length} user(s)? This action cannot be undone.`)
    ) {
      bulkDeleteMutation.mutate(
        { userIds: selectedUserIds },
        {
          onSuccess: () => {
            clearSelection();
          },
        },
      );
    }
  };

  const handleBulkSuspend = () => {
    if (window.confirm(`Are you sure you want to suspend ${selectedUserIds.length} user(s)?`)) {
      bulkSuspendMutation.mutate(
        { userIds: selectedUserIds },
        {
          onSuccess: () => {
            clearSelection();
          },
        },
      );
    }
  };

  const handleBulkActivate = () => {
    if (window.confirm(`Are you sure you want to activate ${selectedUserIds.length} user(s)?`)) {
      bulkActivateMutation.mutate(
        { userIds: selectedUserIds },
        {
          onSuccess: () => {
            clearSelection();
          },
        },
      );
    }
  };

  return (
    <Card className="mb-4 p-4">
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-2">
          <Icon icon="solar:check-circle-bold" size={20} className="text-primary" />
          <span className="font-medium">{selectedUserIds.length} user(s) selected</span>
        </div>

        <div className="flex items-center gap-2">
          {hasSuspendedUsers && (
            <Button
              variant="outline"
              size="sm"
              onClick={handleBulkActivate}
              disabled={bulkActivateMutation.isPending}
            >
              <Icon icon="solar:check-circle-outline" size={16} className="mr-2" />
              Activate
            </Button>
          )}

          <Button
            variant="outline"
            size="sm"
            onClick={handleBulkSuspend}
            disabled={bulkSuspendMutation.isPending}
          >
            <Icon icon="solar:pause-circle-outline" size={16} className="mr-2" />
            Suspend
          </Button>

          <Button
            variant="destructive"
            size="sm"
            onClick={handleBulkDelete}
            disabled={bulkDeleteMutation.isPending}
          >
            <Icon icon="solar:trash-bin-outline" size={16} className="mr-2" />
            Delete
          </Button>

          <Button variant="ghost" size="sm" onClick={clearSelection}>
            Cancel
          </Button>
        </div>
      </div>
    </Card>
  );
}
