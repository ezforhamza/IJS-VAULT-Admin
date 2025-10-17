/**
 * IJS Session Management Store
 *
 * Zustand store for managing session list filters, pagination, and selected sessions
 */

import type { DeviceType } from '@/types/user-management';
import { create } from 'zustand';

interface IJSSessionStore {
  // Filters
  filters: {
    search: string;
    deviceType?: DeviceType;
    page: number;
    pageSize: number;
  };

  // Selected sessions for bulk actions
  selectedSessionIds: string[];

  // Actions
  actions: {
    setSearch: (search: string) => void;
    setDeviceType: (deviceType?: DeviceType) => void;
    setPage: (page: number) => void;
    setPageSize: (pageSize: number) => void;
    resetFilters: () => void;
    setSelectedSessionIds: (ids: string[]) => void;
    toggleSessionSelection: (id: string) => void;
    clearSelection: () => void;
  };
}

const DEFAULT_FILTERS = {
  search: '',
  deviceType: undefined,
  page: 1,
  pageSize: 10,
};

const useIJSSessionStore = create<IJSSessionStore>()((set) => ({
  filters: DEFAULT_FILTERS,
  selectedSessionIds: [],

  actions: {
    setSearch: (search) =>
      set((state) => ({
        filters: { ...state.filters, search, page: 1 },
      })),

    setDeviceType: (deviceType) =>
      set((state) => ({
        filters: { ...state.filters, deviceType, page: 1 },
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

    setSelectedSessionIds: (ids) =>
      set({
        selectedSessionIds: ids,
      }),

    toggleSessionSelection: (id) =>
      set((state) => {
        const isSelected = state.selectedSessionIds.includes(id);
        return {
          selectedSessionIds: isSelected
            ? state.selectedSessionIds.filter((selectedId) => selectedId !== id)
            : [...state.selectedSessionIds, id],
        };
      }),

    clearSelection: () =>
      set({
        selectedSessionIds: [],
      }),
  },
}));

// Selectors
export const useIJSSessionFilters = () => useIJSSessionStore((state) => state.filters);
export const useIJSSelectedSessionIds = () => useIJSSessionStore((state) => state.selectedSessionIds);
export const useIJSSessionActions = () => useIJSSessionStore((state) => state.actions);

export default useIJSSessionStore;
