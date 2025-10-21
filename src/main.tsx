import "./global.css";
import "./theme/theme.css";
import "./locales/i18n";
import ReactDOM from "react-dom/client";
import { createBrowserRouter, Outlet, RouterProvider } from "react-router";
import { worker } from "./_mock";
import App from "./App";
import menuService from "./api/services/menuService";
import { registerLocalIcons } from "./components/icon";
import { GLOBAL_CONFIG } from "./global-config";
import ErrorBoundary from "./routes/components/error-boundary";
import { routesSection } from "./routes/sections";
import { urlJoin } from "./utils";

await registerLocalIcons();

// Enhanced MSW startup with better error handling and recovery
try {
	await worker.start({
		onUnhandledRequest: "bypass",
		serviceWorker: {
			url: urlJoin(GLOBAL_CONFIG.publicPath, "mockServiceWorker.js"),
			options: {
				scope: "/",
			},
		},
		quiet: false, // Enable logging to help debug issues
	});

	// Make worker globally available for restart attempts
	(window as any).mswWorker = worker;

	// Add periodic health check to ensure MSW stays active
	setInterval(() => {
		if (!worker.listHandlers().length) {
			console.warn("MSW handlers lost, attempting restart...");
			worker.start({
				onUnhandledRequest: "bypass",
				serviceWorker: { url: urlJoin(GLOBAL_CONFIG.publicPath, "mockServiceWorker.js") },
			});
		}
	}, 30000); // Check every 30 seconds

	// Add visibility change handler to restart MSW when tab becomes active
	document.addEventListener("visibilitychange", () => {
		if (!document.hidden) {
			// Tab became visible, check if MSW is still working
			setTimeout(() => {
				if (!worker.listHandlers().length) {
					console.log("Tab became active, restarting MSW...");
					worker.start({
						onUnhandledRequest: "bypass",
						serviceWorker: { url: urlJoin(GLOBAL_CONFIG.publicPath, "mockServiceWorker.js") },
					});
				}
			}, 1000);
		}
	});

	console.log("MSW started successfully");
} catch (error) {
	console.error("Failed to start MSW:", error);
}
if (GLOBAL_CONFIG.routerMode === "backend") {
	await menuService.getMenuList();
}

const router = createBrowserRouter(
	[
		{
			Component: () => (
				<App>
					<Outlet />
				</App>
			),
			errorElement: <ErrorBoundary />,
			children: routesSection,
		},
	],
	{
		basename: GLOBAL_CONFIG.publicPath,
	},
);

const root = ReactDOM.createRoot(document.getElementById("root") as HTMLElement);
root.render(<RouterProvider router={router} />);
