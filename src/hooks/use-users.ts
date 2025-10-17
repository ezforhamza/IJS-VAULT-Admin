/**
 * User Management Hooks
 *
 * React Query hooks for user CRUD operations
 */

import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import { toast } from 'sonner';

import ijsUserService from '@/api/services/ijsUserService';
import type {
  BulkActivateUsersRequest,
  BulkDeleteUsersRequest,
  BulkSuspendUsersRequest,
  ExportUsersRequest,
  GetUsersParams,
} from '@/types/user-management';

// Query keys
export const userKeys = {
  all: ['ijs-users'] as const,
  lists: () => [...userKeys.all, 'list'] as const,
  list: (params: GetUsersParams) => [...userKeys.lists(), params] as const,
  details: () => [...userKeys.all, 'detail'] as const,
  detail: (id: string) => [...userKeys.details(), id] as const,
};

/**
 * Fetch users list with pagination and filters
 */
export function useUsersList(params: GetUsersParams) {
  return useQuery({
    queryKey: userKeys.list(params),
    queryFn: () => ijsUserService.getUsersList(params),
  });
}

/**
 * Fetch single user detail
 */
export function useUserDetail(userId: string) {
  return useQuery({
    queryKey: userKeys.detail(userId),
    queryFn: () => ijsUserService.getUserDetail(userId),
    enabled: !!userId,
  });
}

/**
 * Delete single user
 */
export function useDeleteUser() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: ijsUserService.deleteUser,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: userKeys.lists() });
      toast.success('User deleted successfully');
    },
    onError: () => {
      toast.error('Failed to delete user');
    },
  });
}

/**
 * Bulk delete users
 */
export function useBulkDeleteUsers() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (data: BulkDeleteUsersRequest) => ijsUserService.bulkDeleteUsers(data),
    onSuccess: (_, variables) => {
      queryClient.invalidateQueries({ queryKey: userKeys.lists() });
      toast.success(`${variables.userIds.length} users deleted successfully`);
    },
    onError: () => {
      toast.error('Failed to delete users');
    },
  });
}

/**
 * Bulk suspend users
 */
export function useBulkSuspendUsers() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (data: BulkSuspendUsersRequest) => ijsUserService.bulkSuspendUsers(data),
    onSuccess: (_, variables) => {
      queryClient.invalidateQueries({ queryKey: userKeys.lists() });
      toast.success(`${variables.userIds.length} user(s) suspended successfully`);
    },
    onError: () => {
      toast.error('Failed to suspend users');
    },
  });
}

/**
 * Bulk activate users
 */
export function useBulkActivateUsers() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (data: BulkActivateUsersRequest) => ijsUserService.bulkActivateUsers(data),
    onSuccess: (_, variables) => {
      queryClient.invalidateQueries({ queryKey: userKeys.lists() });
      toast.success(`${variables.userIds.length} user(s) activated successfully`);
    },
    onError: () => {
      toast.error('Failed to activate users');
    },
  });
}

/**
 * Export users to CSV/Excel
 */
export function useExportUsers() {
  return useMutation({
    mutationFn: (params: ExportUsersRequest) => ijsUserService.exportUsers(params),
    onSuccess: (blob, variables) => {
      // Create download link
      const url = window.URL.createObjectURL(blob);
      const link = document.createElement('a');
      link.href = url;
      link.download = `ijs-vault-users.${variables.format === 'csv' ? 'csv' : 'xlsx'}`;
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
      window.URL.revokeObjectURL(url);

      toast.success('Users exported successfully');
    },
    onError: () => {
      toast.error('Failed to export users');
    },
  });
}
