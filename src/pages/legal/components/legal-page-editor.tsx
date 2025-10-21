import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { useState } from "react";
import { toast } from "sonner";

import legalService from "@/api/services/legalService";
import HtmlEditor from "@/components/html-editor";
import { Icon } from "@/components/icon";
import { useRouter } from "@/routes/hooks";
import { Button } from "@/ui/button";
import { Card, CardContent, CardHeader } from "@/ui/card";
import { Input } from "@/ui/input";
import { Skeleton } from "@/ui/skeleton";
import { Text, Title } from "@/ui/typography";

interface LegalPageEditorProps {
	slug: string;
}

export default function LegalPageEditor({ slug }: LegalPageEditorProps) {
	const { push } = useRouter();
	const queryClient = useQueryClient();

	const { data, isLoading, error } = useQuery({
		queryKey: ["legal", slug],
		queryFn: () => legalService.getLegalPage(slug),
	});

	const [title, setTitle] = useState("");
	const [content, setContent] = useState("");
	const [isInitialized, setIsInitialized] = useState(false);

	// Initialize form when data loads
	if (data && !isInitialized) {
		setTitle(data.title);
		setContent(data.content);
		setIsInitialized(true);
	}

	const updateMutation = useMutation({
		mutationFn: (payload: { title: string; content: string }) => legalService.updateLegalPage(slug, payload),
		onSuccess: () => {
			queryClient.invalidateQueries({ queryKey: ["legal", slug] });
			toast.success("Legal page updated successfully");
			push(`/legal/${slug}`);
		},
		onError: () => {
			toast.error("Failed to update legal page");
		},
	});

	const handleSave = () => {
		if (!title.trim()) {
			toast.error("Title is required");
			return;
		}
		if (!content.trim()) {
			toast.error("Content is required");
			return;
		}
		updateMutation.mutate({ title, content });
	};

	const handleCancel = () => {
		push(`/legal/${slug}`);
	};

	if (isLoading) {
		return (
			<div className="w-full">
				<Card>
					<CardHeader>
						<Skeleton className="h-8 w-64" />
						<Skeleton className="h-4 w-48 mt-2" />
					</CardHeader>
					<CardContent>
						<div className="space-y-4">
							<Skeleton className="h-10 w-full" />
							<Skeleton className="h-64 w-full" />
						</div>
					</CardContent>
				</Card>
			</div>
		);
	}

	if (error) {
		return (
			<div className="w-full">
				<Card>
					<CardContent className="flex items-center justify-center p-12">
						<div className="text-center">
							<Title as="h3" className="text-destructive mb-2">
								Error Loading Page
							</Title>
							<Text variant="body2" className="text-muted-foreground">
								Failed to load the legal page. Please try again later.
							</Text>
						</div>
					</CardContent>
				</Card>
			</div>
		);
	}

	if (!data) {
		return (
			<div className="w-full">
				<Card>
					<CardContent className="flex items-center justify-center p-12">
						<div className="text-center">
							<Title as="h3" className="mb-2">
								Page Not Found
							</Title>
							<Text variant="body2" className="text-muted-foreground">
								The requested legal page could not be found.
							</Text>
						</div>
					</CardContent>
				</Card>
			</div>
		);
	}

	return (
		<div className="w-full">
			<div className="flex items-center gap-2 mb-4">
				<Button variant="ghost" size="icon" onClick={handleCancel}>
					<Icon icon="solar:arrow-left-outline" size={20} />
				</Button>
				<Title as="h2" className="text-2xl font-bold">
					Edit Legal Page
				</Title>
			</div>

			<Card>
				<CardHeader>
					<div className="flex items-center justify-between">
						<div>
							<Title as="h3" className="text-xl font-semibold">
								{data.title}
							</Title>
							<Text variant="body2" className="text-muted-foreground mt-1">
								Last updated:{" "}
								{new Date(data.lastUpdated).toLocaleDateString("en-US", {
									year: "numeric",
									month: "long",
									day: "numeric",
								})}
							</Text>
						</div>
						<div className="flex gap-2">
							<Button variant="outline" onClick={handleCancel} disabled={updateMutation.isPending}>
								Cancel
							</Button>
							<Button onClick={handleSave} disabled={updateMutation.isPending}>
								{updateMutation.isPending && (
									<Icon icon="solar:loader-outline" size={16} className="mr-2 animate-spin" />
								)}
								Save Changes
							</Button>
						</div>
					</div>
				</CardHeader>
				<CardContent>
					<div className="space-y-4">
						<div>
							<Input
								value={title}
								onChange={(e) => setTitle(e.target.value)}
								placeholder="Page Title"
								className="text-lg font-semibold"
							/>
						</div>
						<HtmlEditor value={content} onChange={setContent} />
					</div>
				</CardContent>
			</Card>
		</div>
	);
}
