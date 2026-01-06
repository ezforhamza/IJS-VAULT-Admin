import { useMutation } from "@tanstack/react-query";
// import { toast } from "sonner"; // Error handled by apiClient
import { create } from "zustand";
import { createJSONStorage, persist } from "zustand/middleware";
import type { UserInfo, UserToken } from "#/entity";
import { StorageEnum } from "#/enum";
import userService, { type SignInReq } from "@/api/services/userService";

type UserStore = {
	userInfo: Partial<UserInfo>;
	userToken: UserToken;

	actions: {
		setUserInfo: (userInfo: UserInfo) => void;
		setUserToken: (token: UserToken) => void;
		clearUserInfoAndToken: () => void;
	};
};

const useUserStore = create<UserStore>()(
	persist(
		(set) => ({
			userInfo: {},
			userToken: {},
			actions: {
				setUserInfo: (userInfo) => {
					set({ userInfo });
				},
				setUserToken: (userToken) => {
					set({ userToken });
				},
				clearUserInfoAndToken() {
					set({ userInfo: {}, userToken: {} });
				},
			},
		}),
		{
			name: "userStore", // name of the item in the storage (must be unique)
			storage: createJSONStorage(() => localStorage), // (optional) by default, 'localStorage' is used
			partialize: (state) => ({
				[StorageEnum.UserInfo]: state.userInfo,
				[StorageEnum.UserToken]: state.userToken,
			}),
		},
	),
);

export const useUserInfo = () => useUserStore((state) => state.userInfo);
export const useUserToken = () => useUserStore((state) => state.userToken);
export const useUserPermissions = () => useUserStore((state) => state.userInfo.permissions || []);
export const useUserRoles = () => useUserStore((state) => state.userInfo.roles || []);
export const useUserActions = () => useUserStore((state) => state.actions);

export const useSignIn = () => {
	const { setUserToken, setUserInfo } = useUserActions();

	const signInMutation = useMutation({
		mutationFn: userService.signin,
	});

	const signIn = async (data: SignInReq) => {
		try {
			const res = await signInMutation.mutateAsync(data);

			// Handle real API response format: { user: {...}, tokens: { access: {...}, refresh: {...} } }
			if (res.tokens) {
				const { user, tokens } = res;
				const accessToken = tokens.access.token;
				const refreshToken = tokens.refresh.token;

				// Store access token in localStorage for apiClient
				localStorage.setItem("accessToken", accessToken);

				setUserToken({ accessToken, refreshToken });
				setUserInfo(user);
			} else {
				// Handle legacy format: { user, accessToken, refreshToken }
				const { user, accessToken, refreshToken } = res;

				// Store access token in localStorage for apiClient
				if (accessToken) {
					localStorage.setItem("accessToken", accessToken);
				}

				setUserToken({ accessToken, refreshToken });
				setUserInfo(user);
			}
		} catch (err) {
			// Error already handled by apiClient interceptor
			throw err;
		}
	};

	return signIn;
};

export default useUserStore;
