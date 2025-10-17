/**
 * Bulk Logout Bar Component
 */

import { Button } from '@/ui/button';
import { Card } from '@/ui/card';
import { Icon } from '@/components/icon';
import { useBulkLogoutSessions } from '@/hooks/use-sessions';
import { useIJSSelectedSessionIds, useIJSSessionActions } from '@/store/ijsSessionStore';

export function BulkLogoutBar() {
  const selectedSessionIds = useIJSSelectedSessionIds();
  const { clearSelection } = useIJSSessionActions();
  const bulkLogoutMutation = useBulkLogoutSessions();

  if (selectedSessionIds.length === 0) return null;

  const handleBulkLogout = () => {
    if (
      window.confirm(
        `Are you sure you want to terminate ${selectedSessionIds.length} session(s)? Users will be logged out.`,
      )
    ) {
      bulkLogoutMutation.mutate(
        { sessionIds: selectedSessionIds },
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
          <span className="font-medium">{selectedSessionIds.length} session(s) selected</span>
        </div>

        <div className="flex items-center gap-2">
          <Button
            variant="destructive"
            size="sm"
            onClick={handleBulkLogout}
            disabled={bulkLogoutMutation.isPending}
          >
            <Icon icon="solar:logout-2-outline" size={16} className="mr-2" />
            Logout Selected
          </Button>

          <Button variant="ghost" size="sm" onClick={clearSelection}>
            Cancel
          </Button>
        </div>
      </div>
    </Card>
  );
}
