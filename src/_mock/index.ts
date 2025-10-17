import { setupWorker } from "msw/browser";
import { mockTokenExpired } from "./handlers/_demo";
import { menuList } from "./handlers/_menu";
import { signIn, userList } from "./handlers/_user";
import {
	bulkActivateUsers,
	bulkDeleteUsers,
	bulkLogoutSessions,
	bulkSuspendUsers,
	deleteUser,
	exportUsers,
	getAllSessions,
	getUserDetail,
	getUserSessions,
	getUsersList,
	logoutAllSessions,
	logoutSession,
} from "./handlers/_ijsUsers";
import { getLegalHandlers } from "./handlers/_legal";

const handlers = [
	signIn,
	userList,
	mockTokenExpired,
	menuList,
	// IJS VAULT User Management
	getUsersList,
	getUserDetail,
	deleteUser,
	bulkDeleteUsers,
	bulkSuspendUsers,
	bulkActivateUsers,
	getUserSessions,
	logoutSession,
	logoutAllSessions,
	exportUsers,
	// IJS VAULT Session Management
	getAllSessions,
	bulkLogoutSessions,
	// Legal Pages
	...getLegalHandlers,
];
const worker = setupWorker(...handlers);

export { worker };
