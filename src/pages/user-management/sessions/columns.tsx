/**
 * Session Table Columns Definition
 */

import type { ColumnsType } from 'antd/es/table';

import { Badge } from '@/ui/badge';
import { Checkbox } from '@/ui/checkbox';
import { Icon } from '@/components/icon';
import type { SessionWithUser } from '@/types/user-management';

import { SessionActionsMenu } from './components/session-actions-menu';

interface GetColumnsParams {
  selectedSessionIds: string[];
  onToggleSelect: (id: string) => void;
  onToggleSelectAll: (checked: boolean) => void;
}

const getDeviceIcon = (type: string) => {
  switch (type) {
    case 'android':
      return 'solar:smartphone-outline';
    case 'ios':
      return 'solar:iphone-outline';
    case 'huawei':
      return 'solar:smartphone-outline';
    case 'web':
      return 'solar:monitor-outline';
    default:
      return 'solar:tablet-outline';
  }
};

export function getSessionColumns({
  selectedSessionIds,
  onToggleSelect,
  onToggleSelectAll,
}: GetColumnsParams): ColumnsType<SessionWithUser> {
  return [
    {
      title: (
        <Checkbox
          checked={selectedSessionIds.length > 0}
          onCheckedChange={onToggleSelectAll}
          aria-label="Select all sessions"
        />
      ),
      key: 'select',
      width: 50,
      render: (_, record) => (
        <Checkbox
          checked={selectedSessionIds.includes(record.id)}
          onCheckedChange={() => onToggleSelect(record.id)}
          aria-label={`Select session ${record.id}`}
        />
      ),
    },
    {
      title: 'User',
      dataIndex: 'user',
      key: 'user',
      width: 280,
      render: (_, record) => (
        <div className="flex items-center gap-3">
          <img src={record.user.avatar} alt={record.user.username} className="h-10 w-10 rounded-full" />
          <div className="flex flex-col">
            <span className="text-sm font-medium">{record.user.username}</span>
            <span className="text-xs text-text-secondary">{record.user.email}</span>
          </div>
        </div>
      ),
    },
    {
      title: 'Device',
      dataIndex: 'deviceType',
      key: 'deviceType',
      width: 120,
      render: (type: string) => (
        <div className="flex items-center gap-2">
          <Icon icon={getDeviceIcon(type)} size={20} className="text-text-secondary" />
          <Badge variant="outline">{type.toUpperCase()}</Badge>
        </div>
      ),
    },
    {
      title: 'Device Name',
      dataIndex: 'deviceName',
      key: 'deviceName',
      width: 180,
      render: (name: string, record) => (
        <div className="flex flex-col">
          <span className="text-sm">{name}</span>
          {record.deviceModel && <span className="text-xs text-text-secondary">{record.deviceModel}</span>}
        </div>
      ),
    },
    {
      title: 'Login Time',
      dataIndex: 'loginAt',
      key: 'loginAt',
      width: 160,
      render: (date: string) => <span className="text-sm">{new Date(date).toLocaleString()}</span>,
    },
    {
      title: 'Last Activity',
      dataIndex: 'lastActivity',
      key: 'lastActivity',
      width: 160,
      render: (date: string) => <span className="text-sm">{new Date(date).toLocaleString()}</span>,
    },
    {
      title: 'Location',
      dataIndex: 'location',
      key: 'location',
      width: 200,
      render: (location: string, record) => (
        <div className="flex flex-col">
          {location && <span className="text-sm">{location}</span>}
          <span className="text-xs text-text-secondary">{record.ipAddress}</span>
        </div>
      ),
    },
    {
      title: 'Action',
      key: 'action',
      width: 80,
      align: 'center',
      render: (_, record) => <SessionActionsMenu session={record} />,
    },
  ];
}
