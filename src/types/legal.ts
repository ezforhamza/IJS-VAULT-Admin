export interface LegalPage {
	slug: string;
	title: string;
	content: string;
	lastUpdated: string;
}

export type LegalPageResponse = LegalPage;

export type LegalPageSlug = "terms" | "privacy";
