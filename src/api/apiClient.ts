import axios, { type AxiosError, type AxiosRequestConfig, type AxiosResponse } from "axios";
import { toast } from "sonner";
// import type { Result } from "#/api"; // Not needed for real API
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
		// Get token from localStorage or userStore
		const token = localStorage.getItem("accessToken") || userStore.getState().userToken?.accessToken;
		if (token) {
			config.headers.Authorization = `Bearer ${token}`;
		}
		return config;
	},
	(error) => Promise.reject(error),
);

axiosInstance.interceptors.response.use(
	(res: AxiosResponse<any>) => {
		if (!res.data) throw new Error(t("sys.api.apiRequestFailed"));

		// Handle real API response format: { success: true, data: {...}, message: "..." }
		if (res.data.success !== undefined) {
			if (res.data.success) {
				return res.data.data || res.data;
			}
			throw new Error(res.data.message || t("sys.api.apiRequestFailed"));
		}

		// Handle legacy format: { status: 0, data: {...}, message: "..." }
		const { status, data, message } = res.data;
		if (status === ResultStatus.SUCCESS) {
			return data;
		}
		throw new Error(message || t("sys.api.apiRequestFailed"));
	},
	(error: AxiosError<any>) => {
		const { response, message } = error || {};

		// Handle real API error format: { success: false, error: { code, message, hint } }
		let errMsg = t("sys.api.errorMessage");

		if (response?.data?.error) {
			const { message: errorMessage, hint } = response.data.error;
			errMsg = errorMessage || hint || errMsg;
		} else if (response?.data?.message) {
			errMsg = response.data.message;
		} else if (message) {
			errMsg = message;
		}

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
		return await axiosInstance.request<any, T>(config);
	}
}

export default new APIClient();
