/**
 * User Detail Page
 */

import { useParams } from 'react-router-dom';

import { Button } from '@/ui/button';
import { Card, CardContent, CardHeader } from '@/ui/card';
import { Badge } from '@/ui/badge';
import { Icon } from '@/components/icon';
import { useUserDetail } from '@/hooks/use-users';
import { fNumber } from '@/utils/format-number';
import { useRouter } from '@/routes/hooks';

import { SessionsSection } from './components/sessions-section';

export default function UserDetailPage() {
  const { id } = useParams<{ id: string }>();
  const { push } = useRouter();
  const { data, isLoading, error } = useUserDetail(id!);

  if (isLoading) {
    return (
      <div className="flex h-64 items-center justify-center">
        <Icon icon="solar:loader-outline" size={32} className="animate-spin text-primary" />
      </div>
    );
  }

  if (error || !data) {
    return (
      <Card>
        <CardContent className="py-8 text-center">
          <Icon icon="solar:user-cross-outline" size={48} className="mx-auto mb-2 opacity-50" />
          <p className="text-text-secondary">User not found</p>
        </CardContent>
      </Card>
    );
  }

  const { user, sessions } = data;

  const getStatusVariant = (status: string) => {
    switch (status) {
      case 'active':
        return 'default';
      case 'inactive':
        return 'secondary';
      case 'suspended':
        return 'destructive';
      default:
        return 'outline';
    }
  };

  const formatDate = (date: string) => {
    return new Date(date).toLocaleString();
  };

  return (
    <div className="flex flex-col gap-4">
      <div className="flex items-center gap-2">
        <Button variant="ghost" size="icon" onClick={() => push('/user-management/users')}>
          <Icon icon="solar:arrow-left-outline" size={20} />
        </Button>
        <h1 className="text-2xl font-bold">User Details</h1>
      </div>

      <div className="grid gap-4 lg:grid-cols-3">
        <div className="lg:col-span-2">
          <Card>
            <CardHeader>
              <div className="flex items-center justify-between">
                <h2 className="text-lg font-semibold">Profile Information</h2>
                <Badge variant={getStatusVariant(user.status)}>
                  {user.status.charAt(0).toUpperCase() + user.status.slice(1)}
                </Badge>
              </div>
            </CardHeader>
            <CardContent>
              <div className="flex flex-col gap-6 sm:flex-row">
                <img src={user.avatar} alt={user.username} className="h-24 w-24 rounded-full" />

                <div className="flex-1 space-y-4">
                  <div className="grid gap-4 sm:grid-cols-2">
                    <div>
                      <p className="text-xs text-text-secondary">Username</p>
                      <p className="font-medium">{user.username}</p>
                    </div>
                    <div>
                      <p className="text-xs text-text-secondary">Email</p>
                      <p className="font-medium">{user.email}</p>
                    </div>
                    <div>
                      <p className="text-xs text-text-secondary">Phone</p>
                      <p className="font-medium">{user.phone}</p>
                    </div>
                    <div>
                      <p className="text-xs text-text-secondary">Role</p>
                      <Badge variant={user.role === 'group_admin' ? 'default' : 'secondary'}>
                        {user.role === 'group_admin' ? 'Group Admin' : 'User'}
                      </Badge>
                    </div>
                  </div>

                  <div className="grid gap-4 sm:grid-cols-2">
                    <div>
                      <p className="text-xs text-text-secondary">Created At</p>
                      <p className="text-sm">{formatDate(user.createdAt)}</p>
                    </div>
                    <div>
                      <p className="text-xs text-text-secondary">Last Login</p>
                      <p className="text-sm">{formatDate(user.lastLogin)}</p>
                    </div>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>

          <div className="mt-4">
            <SessionsSection userId={user.id} sessions={sessions} />
          </div>
        </div>

        <div className="space-y-4">
          <Card>
            <CardHeader>
              <h3 className="font-semibold">Vault Statistics</h3>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <Icon icon="solar:folder-outline" size={20} className="text-text-secondary" />
                  <span className="text-sm">Categories</span>
                </div>
                <span className="font-semibold">{user.categoriesCount}</span>
              </div>

              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <Icon icon="solar:folder-2-outline" size={20} className="text-text-secondary" />
                  <span className="text-sm">Subcategories</span>
                </div>
                <span className="font-semibold">{user.subcategoriesCount}</span>
              </div>

              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <Icon icon="solar:database-outline" size={20} className="text-text-secondary" />
                  <span className="text-sm">Storage Used</span>
                </div>
                <span className="font-semibold">{fNumber(user.storageUsed)} MB</span>
              </div>

              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <Icon icon="solar:tablet-outline" size={20} className="text-text-secondary" />
                  <span className="text-sm">Active Sessions</span>
                </div>
                <Badge>{user.activeSessionsCount}</Badge>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
}
