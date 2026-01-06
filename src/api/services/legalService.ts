import { API_ENDPOINTS, replaceUrlParams } from "@/config/api-endpoints";
import apiClient from "../apiClient";

export interface LegalPage {
	id: string;
	type: string;
	title: string;
	content: string;
	version: string;
	isPublished: boolean;
	lastUpdatedBy: {
		id: string;
		fullName: string;
		email: string;
	};
	publishedAt: string;
}

export interface GetAllLegalPagesResponse {
	pages: LegalPage[];
}

export interface UpdateLegalPageRequest {
	title: string;
	content: string;
	version?: string;
	isPublished?: boolean;
}

const getAllLegalPages = () =>
	apiClient.get<GetAllLegalPagesResponse>({
		url: API_ENDPOINTS.LEGAL.LIST,
	});

const getLegalPageByType = (type: string) =>
	apiClient.get<{ page: LegalPage }>({
		url: replaceUrlParams(API_ENDPOINTS.LEGAL.GET_BY_TYPE, { type }),
	});

const createLegalPage = (data: UpdateLegalPageRequest & { type: string }) =>
	apiClient.post<any>({
		url: API_ENDPOINTS.LEGAL.CREATE,
		data,
	});

const updateLegalPage = (type: string, data: UpdateLegalPageRequest) =>
	apiClient.put<any>({
		url: replaceUrlParams(API_ENDPOINTS.LEGAL.UPDATE, { type }),
		data,
	});

const getPublicLegalPage = (type: string) =>
	apiClient.get<{ page: LegalPage }>({
		url: replaceUrlParams(API_ENDPOINTS.LEGAL.PUBLIC, { type }),
	});

export default {
	getAllLegalPages,
	getLegalPageByType,
	createLegalPage,
	updateLegalPage,
	getPublicLegalPage,
};
