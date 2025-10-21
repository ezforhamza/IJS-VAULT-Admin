import { HttpResponse, http } from "msw";

import type { LegalPage } from "@/types/legal";

const legalContent: Record<string, LegalPage> = {
	terms: {
		slug: "terms",
		title: "Terms of Service",
		lastUpdated: "2025-01-15",
		content: `
      <div class="space-y-6">
        <section>
          <h2 class="text-2xl font-semibold mb-4">1. Acceptance of Terms</h2>
          <p class="text-muted-foreground leading-relaxed">
            By accessing and using IJS VAULT ("the Service"), you accept and agree to be bound by the terms and provision of this agreement. If you do not agree to abide by the above, please do not use this service.
          </p>
        </section>

        <section>
          <h2 class="text-2xl font-semibold mb-4">2. Use License</h2>
          <p class="text-muted-foreground leading-relaxed mb-3">
            Permission is granted to temporarily access the materials on IJS VAULT for personal, non-commercial transitory viewing only. This is the grant of a license, not a transfer of title, and under this license you may not:
          </p>
          <ul class="list-disc list-inside space-y-2 text-muted-foreground ml-4">
            <li>Modify or copy the materials</li>
            <li>Use the materials for any commercial purpose or public display</li>
            <li>Attempt to reverse engineer any software contained on IJS VAULT</li>
            <li>Remove any copyright or other proprietary notations from the materials</li>
            <li>Transfer the materials to another person or "mirror" the materials on any other server</li>
          </ul>
        </section>

        <section>
          <h2 class="text-2xl font-semibold mb-4">3. User Accounts</h2>
          <p class="text-muted-foreground leading-relaxed mb-3">
            When you create an account with us, you must provide information that is accurate, complete, and current at all times. Failure to do so constitutes a breach of the Terms, which may result in immediate termination of your account.
          </p>
          <p class="text-muted-foreground leading-relaxed">
            You are responsible for safeguarding the password that you use to access the Service and for any activities or actions under your password.
          </p>
        </section>

        <section>
          <h2 class="text-2xl font-semibold mb-4">4. Data Storage and Security</h2>
          <p class="text-muted-foreground leading-relaxed">
            We employ industry-standard security measures to protect your documents and personal information. However, no method of transmission over the Internet or electronic storage is 100% secure. While we strive to use commercially acceptable means to protect your data, we cannot guarantee its absolute security.
          </p>
        </section>

        <section>
          <h2 class="text-2xl font-semibold mb-4">5. Termination</h2>
          <p class="text-muted-foreground leading-relaxed">
            We may terminate or suspend your account immediately, without prior notice or liability, for any reason whatsoever, including without limitation if you breach the Terms. Upon termination, your right to use the Service will immediately cease.
          </p>
        </section>

        <section>
          <h2 class="text-2xl font-semibold mb-4">6. Changes to Terms</h2>
          <p class="text-muted-foreground leading-relaxed">
            We reserve the right to modify or replace these Terms at any time. If a revision is material, we will try to provide at least 30 days' notice prior to any new terms taking effect.
          </p>
        </section>

        <section>
          <h2 class="text-2xl font-semibold mb-4">7. Contact Information</h2>
          <p class="text-muted-foreground leading-relaxed">
            If you have any questions about these Terms, please contact us at <a href="mailto:support@ijsvault.com" class="text-primary hover:underline">support@ijsvault.com</a>
          </p>
        </section>
      </div>
    `,
	},
	privacy: {
		slug: "privacy",
		title: "Privacy Policy",
		lastUpdated: "2025-01-15",
		content: `
      <div class="space-y-6">
        <section>
          <h2 class="text-2xl font-semibold mb-4">1. Information We Collect</h2>
          <p class="text-muted-foreground leading-relaxed mb-3">
            We collect information that you provide directly to us, including:
          </p>
          <ul class="list-disc list-inside space-y-2 text-muted-foreground ml-4">
            <li>Account information (name, email address, password)</li>
            <li>Profile information (phone number, profile picture)</li>
            <li>Documents and files you upload to the Service</li>
            <li>Communications with us</li>
            <li>Usage data and analytics</li>
          </ul>
        </section>

        <section>
          <h2 class="text-2xl font-semibold mb-4">2. How We Use Your Information</h2>
          <p class="text-muted-foreground leading-relaxed mb-3">
            We use the information we collect to:
          </p>
          <ul class="list-disc list-inside space-y-2 text-muted-foreground ml-4">
            <li>Provide, maintain, and improve our Service</li>
            <li>Process your transactions and send related information</li>
            <li>Send you technical notices, updates, security alerts, and support messages</li>
            <li>Respond to your comments and questions</li>
            <li>Monitor and analyze trends, usage, and activities</li>
            <li>Detect, prevent, and address technical issues and fraudulent activity</li>
          </ul>
        </section>

        <section>
          <h2 class="text-2xl font-semibold mb-4">3. Data Storage and Security</h2>
          <p class="text-muted-foreground leading-relaxed">
            Your documents are encrypted both in transit and at rest. We use industry-standard encryption protocols and secure servers to protect your data. Access to your documents is restricted to authorized personnel only and is logged for security purposes.
          </p>
        </section>

        <section>
          <h2 class="text-2xl font-semibold mb-4">4. Data Retention</h2>
          <p class="text-muted-foreground leading-relaxed">
            We retain your information for as long as your account is active or as needed to provide you services. You may request deletion of your account and associated data at any time through your account settings.
          </p>
        </section>

        <section>
          <h2 class="text-2xl font-semibold mb-4">5. Information Sharing</h2>
          <p class="text-muted-foreground leading-relaxed mb-3">
            We do not sell your personal information. We may share your information only in the following circumstances:
          </p>
          <ul class="list-disc list-inside space-y-2 text-muted-foreground ml-4">
            <li>With your consent</li>
            <li>To comply with legal obligations</li>
            <li>To protect and defend our rights and property</li>
            <li>With service providers who assist in our operations</li>
          </ul>
        </section>

        <section>
          <h2 class="text-2xl font-semibold mb-4">6. Your Rights</h2>
          <p class="text-muted-foreground leading-relaxed mb-3">
            You have the right to:
          </p>
          <ul class="list-disc list-inside space-y-2 text-muted-foreground ml-4">
            <li>Access and receive a copy of your personal data</li>
            <li>Rectify inaccurate personal data</li>
            <li>Request deletion of your personal data</li>
            <li>Object to processing of your personal data</li>
            <li>Request restriction of processing your personal data</li>
            <li>Data portability</li>
          </ul>
        </section>

        <section>
          <h2 class="text-2xl font-semibold mb-4">7. Children's Privacy</h2>
          <p class="text-muted-foreground leading-relaxed">
            Our Service is not intended for children under 18 years of age. We do not knowingly collect personal information from children under 18.
          </p>
        </section>

        <section>
          <h2 class="text-2xl font-semibold mb-4">8. Changes to Privacy Policy</h2>
          <p class="text-muted-foreground leading-relaxed">
            We may update our Privacy Policy from time to time. We will notify you of any changes by posting the new Privacy Policy on this page and updating the "Last Updated" date.
          </p>
        </section>

        <section>
          <h2 class="text-2xl font-semibold mb-4">9. Contact Us</h2>
          <p class="text-muted-foreground leading-relaxed">
            If you have any questions about this Privacy Policy, please contact us at <a href="mailto:privacy@ijsvault.com" class="text-primary hover:underline">privacy@ijsvault.com</a>
          </p>
        </section>
      </div>
    `,
	},
};

export const getLegalHandlers = [
	http.get("/api/legal/:slug", ({ params }) => {
		const { slug } = params;
		const page = legalContent[slug as string];

		if (!page) {
			return new HttpResponse(null, { status: 404 });
		}

		return HttpResponse.json({
			status: 0,
			message: "",
			data: page,
		});
	}),

	http.put("/api/legal/:slug", async ({ params, request }) => {
		const { slug } = params;
		const page = legalContent[slug as string];

		if (!page) {
			return new HttpResponse(null, { status: 404 });
		}

		const body = (await request.json()) as { title: string; content: string };

		// Update the mock data
		legalContent[slug as string] = {
			...page,
			title: body.title,
			content: body.content,
			lastUpdated: new Date().toISOString().split("T")[0],
		};

		return HttpResponse.json({
			status: 0,
			message: "Legal page updated successfully",
			data: legalContent[slug as string],
		});
	}),
];
