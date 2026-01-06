import { Icon } from "@/components/icon";
import { useLegalPage } from "@/hooks/use-legal";
import { useRouter } from "@/routes/hooks";
import { Button } from "@/ui/button";
import { Card, CardContent, CardHeader } from "@/ui/card";
import { Skeleton } from "@/ui/skeleton";
import { Text, Title } from "@/ui/typography";

interface LegalPageProps {
	slug: string;
}

const slugToTypeMap: Record<string, string> = {
	terms: "terms_of_service",
	privacy: "privacy_policy",
};

export default function LegalPage({ slug }: LegalPageProps) {
	const { push } = useRouter();
	const type = slugToTypeMap[slug] || slug;

	const { data, isLoading, error } = useLegalPage(type);
	const pageData = data?.page;

	const handleEdit = () => {
		push(`/legal/${slug}/edit`);
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
							<Skeleton className="h-4 w-full" />
							<Skeleton className="h-4 w-full" />
							<Skeleton className="h-4 w-3/4" />
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

	if (!pageData) {
		const pageTypeNames: Record<string, string> = {
			terms_of_service: "Terms of Service",
			privacy_policy: "Privacy Policy",
			cookie_policy: "Cookie Policy",
			disclaimer: "Disclaimer",
			refund_policy: "Refund Policy",
		};

		return (
			<div className="w-full">
				<Card>
					<CardContent className="flex items-center justify-center p-12">
						<div className="text-center space-y-4">
							<Icon icon="solar:document-add-outline" size={64} className="mx-auto text-muted-foreground opacity-50" />
							<div>
								<Title as="h3" className="mb-2">
									{pageTypeNames[type] || "Legal Page"} Not Created Yet
								</Title>
								<Text variant="body2" className="text-muted-foreground">
									This legal page hasn't been created yet. Click the button below to create it.
								</Text>
							</div>
							<Button onClick={handleEdit}>
								<Icon icon="solar:add-circle-outline" size={20} className="mr-2" />
								Create {pageTypeNames[type] || "Page"}
							</Button>
						</div>
					</CardContent>
				</Card>
			</div>
		);
	}

	return (
		<div className="w-full">
			<Card>
				<CardHeader>
					<div className="flex items-start justify-between">
						<div>
							<Title as="h2" className="text-3xl font-bold">
								{pageData.title}
							</Title>
							<div className="mt-2 flex items-center gap-4">
								<Text variant="body2" className="text-muted-foreground">
									Version: {pageData.version}
								</Text>
								{pageData.publishedAt && (
									<Text variant="body2" className="text-muted-foreground">
										Published:{" "}
										{new Date(pageData.publishedAt).toLocaleDateString("en-US", {
											year: "numeric",
											month: "long",
											day: "numeric",
										})}
									</Text>
								)}
								{pageData.lastUpdatedBy && (
									<Text variant="body2" className="text-muted-foreground">
										By: {pageData.lastUpdatedBy.fullName}
									</Text>
								)}
							</div>
						</div>
						<Button onClick={handleEdit} size="sm">
							<Icon icon="solar:pen-outline" size={16} className="mr-2" />
							Edit
						</Button>
					</div>
				</CardHeader>
				<CardContent>
					<div
						// biome-ignore lint/security/noDangerouslySetInnerHtml: Legal content is controlled and sanitized from backend
						dangerouslySetInnerHTML={{ __html: pageData.content.replace(/&lt;/g, "<").replace(/&gt;/g, ">") }}
						className="prose prose-sm max-w-none dark:prose-invert"
					/>
				</CardContent>
			</Card>
		</div>
	);
}
