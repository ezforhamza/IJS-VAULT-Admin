/**
 * IJS User Management Store
 *
 * Zustand store for managing user list filters, pagination, and selected users
 */

import type { UserRole, UserStatus } from '@/types/user-management';
import { create } from 'zustand';

interface IJSUserStore {
  // Filters
  filters: {
    search: string;
    status?: UserStatus;
    role?: UserRole;
    page: number;
    pageSize: number;
  };

  // Selected users for bulk actions
  selectedUserIds: string[];

  // Actions
  actions: {
    setSearch: (search: string) => void;
    setStatus: (status?: UserStatus) => void;
    setRole: (role?: UserRole) => void;
    setPage: (page: number) => void;
    setPageSize: (pageSize: number) => void;
    resetFilters: () => void;
    setSelectedUserIds: (ids: string[]) => void;
    toggleUserSelection: (id: string) => void;
    clearSelection: () => void;
  };
}

const DEFAULT_FILTERS = {
  search: '',
  status: undefined,
  role: undefined,
  page: 1,
  pageSize: 10,
};

const useIJSUserStore = create<IJSUserStore>()((set) => ({
  filters: DEFAULT_FILTERS,
  selectedUserIds: [],

  actions: {
    setSearch: (search) =>
      set((state) => ({
        filters: { ...state.filters, search, page: 1 },
      })),

    setStatus: (status) =>
      set((state) => ({
        filters: { ...state.filters, status, page: 1 },
      })),

    setRole: (role) =>
      set((state) => ({
        filters: { ...state.filters, role, page: 1 },
      })),

    setPage: (page) =>
      set((state) => ({
        filters: { ...state.filters, page },
      })),

    setPageSize: (pageSize) =>
      set((state) => ({
        filters: { ...state.filters, pageSize, page: 1 },
      })),

    resetFilters: () =>
      set({
        filters: DEFAULT_FILTERS,
      }),

    setSelectedUserIds: (ids) =>
      set({
        selectedUserIds: ids,
      }),

    toggleUserSelection: (id) =>
      set((state) => {
        const isSelected = state.selectedUserIds.includes(id);
        return {
          selectedUserIds: isSelected
            ? state.selectedUserIds.filter((selectedId) => selectedId !== id)
            : [...state.selectedUserIds, id],
        };
      }),

    clearSelection: () =>
      set({
        selectedUserIds: [],
      }),
  },
}));

// Selectors
export const useIJSUserFilters = () => useIJSUserStore((state) => state.filters);
export const useIJSSelectedUserIds = () => useIJSUserStore((state) => state.selectedUserIds);
export const useIJSUserActions = () => useIJSUserStore((state) => state.actions);

export default useIJSUserStore;
