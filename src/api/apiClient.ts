import axios, { type AxiosError, type AxiosRequestConfig, type AxiosResponse } from "axios";
import { toast } from "sonner";
import type { Result } from "#/api";
import { ResultStatus } from "#/enum";
import { GLOBAL_CONFIG } from "@/global-config";
import { t } from "@/locales/i18n";
import userStore from "@/store/userStore";

const axiosInstance = axios.create({
	baseURL: GLOBAL_CONFIG.apiBaseUrl,
	timeout: 50000,
	headers: { "Content-Type": "application/json;charset=utf-8" },
});

axiosInstance.interceptors.request.use(
	(config) => {
		config.headers.Authorization = "Bearer Token";
		return config;
	},
	(error) => Promise.reject(error),
);

axiosInstance.interceptors.response.use(
	(res: AxiosResponse<Result<any>>) => {
		if (!res.data) throw new Error(t("sys.api.apiRequestFailed"));
		const { status, data, message } = res.data;
		if (status === ResultStatus.SUCCESS) {
			return data;
		}
		throw new Error(message || t("sys.api.apiRequestFailed"));
	},
	(error: AxiosError<Result>) => {
		const { response, message } = error || {};
		const errMsg = response?.data?.message || message || t("sys.api.errorMessage");
		toast.error(errMsg, { position: "top-center" });
		if (response?.status === 401) {
			userStore.getState().actions.clearUserInfoAndToken();
		}
		return Promise.reject(error);
	},
);

class APIClient {
	get<T = unknown>(config: AxiosRequestConfig): Promise<T> {
		return this.request<T>({ ...config, method: "GET" });
	}
	post<T = unknown>(config: AxiosRequestConfig): Promise<T> {
		return this.request<T>({ ...config, method: "POST" });
	}
	put<T = unknown>(config: AxiosRequestConfig): Promise<T> {
		return this.request<T>({ ...config, method: "PUT" });
	}
	delete<T = unknown>(config: AxiosRequestConfig): Promise<T> {
		return this.request<T>({ ...config, method: "DELETE" });
	}
	async request<T = unknown>(config: AxiosRequestConfig): Promise<T> {
		const maxRetries = 3;
		let retryCount = 0;

		while (retryCount < maxRetries) {
			try {
				return await axiosInstance.request<any, T>(config);
			} catch (error: any) {
				// Check if it's a 500 error that might be MSW-related
				if (error?.response?.status === 500 || error?.code === "ERR_BAD_RESPONSE") {
					retryCount++;

					if (retryCount < maxRetries) {
						console.warn(
							`API request failed (attempt ${retryCount}/${maxRetries}), retrying in ${retryCount * 1000}ms...`,
						);

						// Wait before retrying (exponential backoff)
						await new Promise((resolve) => setTimeout(resolve, retryCount * 1000));

						// Try to restart MSW if available
						if (typeof window !== "undefined" && (window as any).mswWorker) {
							try {
								console.log("Attempting to restart MSW...");
								await (window as any).mswWorker.start();
							} catch (mswError) {
								console.warn("Failed to restart MSW:", mswError);
							}
						}

						continue;
					}
				}

				// If we've exhausted retries or it's not a retryable error, throw it
				throw error;
			}
		}

		// This should never be reached, but TypeScript requires it
		throw new Error("Max retries exceeded");
	}
}

export default new APIClient();
