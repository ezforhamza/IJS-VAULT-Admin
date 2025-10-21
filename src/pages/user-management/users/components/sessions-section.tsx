/**
 * User Sessions Section Component
 */

import { Icon } from "@/components/icon";
import { useLogoutAllSessions, useLogoutSession } from "@/hooks/use-sessions";
import type { UserSession } from "@/types/user-management";
import { Badge } from "@/ui/badge";
import { Button } from "@/ui/button";
import { Card, CardContent, CardHeader } from "@/ui/card";

interface SessionsSectionProps {
	userId: string;
	sessions: UserSession[];
}

export function SessionsSection({ userId, sessions }: SessionsSectionProps) {
	const logoutSessionMutation = useLogoutSession();
	const logoutAllMutation = useLogoutAllSessions();

	const activeSessions = sessions.filter((s) => s.isActive);

	const getDeviceIcon = (type: string) => {
		switch (type) {
			case "android":
				return "solar:smartphone-outline";
			case "ios":
				return "solar:iphone-outline";
			case "huawei":
				return "solar:smartphone-outline";
			case "web":
				return "solar:monitor-outline";
			default:
				return "solar:tablet-outline";
		}
	};

	const handleLogoutSession = (sessionId: string) => {
		if (window.confirm("Are you sure you want to terminate this session?")) {
			logoutSessionMutation.mutate({ userId, sessionId });
		}
	};

	const handleLogoutAll = () => {
		if (window.confirm(`Are you sure you want to terminate all ${activeSessions.length} active sessions?`)) {
			logoutAllMutation.mutate(userId);
		}
	};

	const formatDate = (date: string) => {
		return new Date(date).toLocaleString();
	};

	return (
		<Card>
			<CardHeader>
				<div className="flex items-center justify-between">
					<div>
						<h3 className="text-lg font-semibold">Active Sessions</h3>
						<p className="text-sm text-text-secondary">
							{activeSessions.length} active session{activeSessions.length !== 1 ? "s" : ""}
						</p>
					</div>
					{activeSessions.length > 0 && (
						<Button variant="destructive" size="sm" onClick={handleLogoutAll} disabled={logoutAllMutation.isPending}>
							<Icon icon="solar:logout-2-outline" size={16} className="mr-2" />
							Logout All
						</Button>
					)}
				</div>
			</CardHeader>
			<CardContent>
				{activeSessions.length === 0 ? (
					<div className="py-8 text-center text-text-secondary">
						<Icon icon="solar:wifi-router-minimalistic-outline" size={48} className="mx-auto mb-2 opacity-50" />
						<p>No active sessions</p>
					</div>
				) : (
					<div className="space-y-3">
						{activeSessions.map((session) => (
							<div key={session.id} className="flex items-start justify-between rounded-lg border p-4">
								<div className="flex items-start gap-3">
									<div className="mt-1">
										<Icon icon={getDeviceIcon(session.deviceType)} size={24} className="text-text-secondary" />
									</div>
									<div className="flex-1">
										<div className="flex items-center gap-2">
											<span className="font-medium">{session.deviceName}</span>
											<Badge variant="outline" className="text-xs">
												{session.deviceType.toUpperCase()}
											</Badge>
										</div>
										{session.deviceModel && <p className="text-xs text-text-secondary">{session.deviceModel}</p>}
										<div className="mt-2 space-y-1 text-xs text-text-secondary">
											<div className="flex items-center gap-1">
												<Icon icon="solar:map-point-outline" size={14} />
												<span>{session.location || session.ipAddress}</span>
											</div>
											<div className="flex items-center gap-1">
												<Icon icon="solar:clock-circle-outline" size={14} />
												<span>Last active: {formatDate(session.lastActivity)}</span>
											</div>
										</div>
									</div>
								</div>
								<Button
									variant="ghost"
									size="sm"
									onClick={() => handleLogoutSession(session.id)}
									disabled={logoutSessionMutation.isPending}
								>
									<Icon icon="solar:logout-2-outline" size={16} />
								</Button>
							</div>
						))}
					</div>
				)}
			</CardContent>
		</Card>
	);
}
