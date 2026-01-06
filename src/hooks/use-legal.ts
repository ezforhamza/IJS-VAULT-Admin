/**
 * Legal Pages Hooks
 *
 * React Query hooks for legal pages operations
 */

import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { toast } from "sonner";
import type { UpdateLegalPageRequest } from "@/api/services/legalService";
import legalService from "@/api/services/legalService";

// Query keys
export const legalKeys = {
	all: ["legal"] as const,
	lists: () => [...legalKeys.all, "list"] as const,
	detail: (type: string) => [...legalKeys.all, "detail", type] as const,
};

/**
 * Fetch all legal pages
 */
export function useLegalPages() {
	return useQuery({
		queryKey: legalKeys.lists(),
		queryFn: () => legalService.getAllLegalPages(),
	});
}

/**
 * Fetch legal page by type
 */
export function useLegalPage(type: string) {
	return useQuery({
		queryKey: legalKeys.detail(type),
		queryFn: () => legalService.getLegalPageByType(type),
		enabled: !!type,
	});
}

/**
 * Create legal page
 */
export function useCreateLegalPage() {
	const queryClient = useQueryClient();

	return useMutation({
		mutationFn: (data: UpdateLegalPageRequest & { type: string }) => legalService.createLegalPage(data),
		onSuccess: () => {
			queryClient.invalidateQueries({ queryKey: legalKeys.lists() });
			toast.success("Legal page created successfully");
		},
		onError: () => {
			toast.error("Failed to create legal page");
		},
	});
}

/**
 * Update legal page
 */
export function useUpdateLegalPage() {
	const queryClient = useQueryClient();

	return useMutation({
		mutationFn: ({ type, data }: { type: string; data: UpdateLegalPageRequest }) =>
			legalService.updateLegalPage(type, data),
		onSuccess: (_, variables) => {
			queryClient.invalidateQueries({ queryKey: legalKeys.lists() });
			queryClient.invalidateQueries({ queryKey: legalKeys.detail(variables.type) });
			toast.success("Legal page updated successfully");
		},
		onError: () => {
			toast.error("Failed to update legal page");
		},
	});
}
