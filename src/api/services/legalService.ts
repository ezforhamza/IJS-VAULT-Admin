import { API_ENDPOINTS, replaceUrlParams } from "@/config/api-endpoints";
import type { LegalPageResponse } from "@/types/legal";
import apiClient from "../apiClient";

const legalService = {
	getLegalPage: (slug: string) =>
		apiClient.get<LegalPageResponse>({
			url: replaceUrlParams(API_ENDPOINTS.LEGAL.PAGE, { slug }),
		}),

	updateLegalPage: (slug: string, data: { title: string; content: string }) =>
		apiClient.put<LegalPageResponse>({
			url: replaceUrlParams(API_ENDPOINTS.LEGAL.PAGE, { slug }),
			data,
		}),
};

export default legalService;
