import { http, HttpResponse } from 'msw';

import type { LegalPage } from '@/types/legal';

const legalContent: Record<string, LegalPage> = {
  terms: {
    slug: 'terms',
    title: 'Terms of Service',
    lastUpdated: '2025-01-15',
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
    slug: 'privacy',
    title: 'Privacy Policy',
    lastUpdated: '2025-01-15',
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
  cookies: {
    slug: 'cookies',
    title: 'Cookie Policy',
    lastUpdated: '2025-01-15',
    content: `
      <div class="space-y-6">
        <section>
          <h2 class="text-2xl font-semibold mb-4">1. What Are Cookies</h2>
          <p class="text-muted-foreground leading-relaxed">
            Cookies are small text files that are placed on your device when you visit our website. They are widely used to make websites work more efficiently and provide information to website owners.
          </p>
        </section>

        <section>
          <h2 class="text-2xl font-semibold mb-4">2. How We Use Cookies</h2>
          <p class="text-muted-foreground leading-relaxed mb-3">
            We use cookies for the following purposes:
          </p>
          <ul class="list-disc list-inside space-y-2 text-muted-foreground ml-4">
            <li><strong>Essential Cookies:</strong> Required for the operation of our website (e.g., authentication, security)</li>
            <li><strong>Functionality Cookies:</strong> Remember your preferences and settings</li>
            <li><strong>Analytics Cookies:</strong> Help us understand how visitors interact with our website</li>
            <li><strong>Security Cookies:</strong> Detect and prevent fraudulent activity</li>
          </ul>
        </section>

        <section>
          <h2 class="text-2xl font-semibold mb-4">3. Types of Cookies We Use</h2>

          <div class="space-y-4">
            <div class="border-l-4 border-primary pl-4">
              <h3 class="text-lg font-semibold mb-2">Session Cookies</h3>
              <p class="text-muted-foreground leading-relaxed">
                These are temporary cookies that expire when you close your browser. They help us maintain your session and keep you logged in.
              </p>
            </div>

            <div class="border-l-4 border-primary pl-4">
              <h3 class="text-lg font-semibold mb-2">Persistent Cookies</h3>
              <p class="text-muted-foreground leading-relaxed">
                These cookies remain on your device for a set period or until you delete them. They help us remember your preferences across sessions.
              </p>
            </div>

            <div class="border-l-4 border-primary pl-4">
              <h3 class="text-lg font-semibold mb-2">First-Party Cookies</h3>
              <p class="text-muted-foreground leading-relaxed">
                Set by IJS VAULT directly to provide core functionality and improve your experience.
              </p>
            </div>
          </div>
        </section>

        <section>
          <h2 class="text-2xl font-semibold mb-4">4. Cookie Details</h2>
          <div class="overflow-x-auto">
            <table class="w-full border-collapse">
              <thead>
                <tr class="border-b">
                  <th class="text-left py-3 px-4 font-semibold">Cookie Name</th>
                  <th class="text-left py-3 px-4 font-semibold">Purpose</th>
                  <th class="text-left py-3 px-4 font-semibold">Duration</th>
                </tr>
              </thead>
              <tbody class="text-muted-foreground">
                <tr class="border-b">
                  <td class="py-3 px-4 font-mono text-sm">auth_token</td>
                  <td class="py-3 px-4">Authentication and session management</td>
                  <td class="py-3 px-4">30 days</td>
                </tr>
                <tr class="border-b">
                  <td class="py-3 px-4 font-mono text-sm">user_prefs</td>
                  <td class="py-3 px-4">Store user preferences (theme, language)</td>
                  <td class="py-3 px-4">1 year</td>
                </tr>
                <tr class="border-b">
                  <td class="py-3 px-4 font-mono text-sm">session_id</td>
                  <td class="py-3 px-4">Track user session</td>
                  <td class="py-3 px-4">Session</td>
                </tr>
                <tr class="border-b">
                  <td class="py-3 px-4 font-mono text-sm">analytics</td>
                  <td class="py-3 px-4">Usage analytics and performance monitoring</td>
                  <td class="py-3 px-4">2 years</td>
                </tr>
              </tbody>
            </table>
          </div>
        </section>

        <section>
          <h2 class="text-2xl font-semibold mb-4">5. Managing Cookies</h2>
          <p class="text-muted-foreground leading-relaxed mb-3">
            You can control and manage cookies in several ways:
          </p>
          <ul class="list-disc list-inside space-y-2 text-muted-foreground ml-4">
            <li>Most browsers allow you to refuse or accept cookies</li>
            <li>You can delete cookies that have already been set</li>
            <li>You can set your browser to notify you when cookies are being set</li>
            <li>Browser settings are usually found in the "Options" or "Preferences" menu</li>
          </ul>
          <p class="text-muted-foreground leading-relaxed mt-3">
            Please note that disabling certain cookies may affect the functionality of our Service.
          </p>
        </section>

        <section>
          <h2 class="text-2xl font-semibold mb-4">6. Third-Party Cookies</h2>
          <p class="text-muted-foreground leading-relaxed">
            We do not use third-party cookies for advertising or tracking purposes. Any third-party services we use (such as analytics) are configured to respect your privacy and comply with applicable data protection laws.
          </p>
        </section>

        <section>
          <h2 class="text-2xl font-semibold mb-4">7. Updates to This Policy</h2>
          <p class="text-muted-foreground leading-relaxed">
            We may update this Cookie Policy from time to time to reflect changes in technology, legislation, or our practices. The "Last Updated" date at the top of this policy indicates when it was last revised.
          </p>
        </section>

        <section>
          <h2 class="text-2xl font-semibold mb-4">8. Contact Us</h2>
          <p class="text-muted-foreground leading-relaxed">
            If you have any questions about our use of cookies, please contact us at <a href="mailto:privacy@ijsvault.com" class="text-primary hover:underline">privacy@ijsvault.com</a>
          </p>
        </section>
      </div>
    `,
  },
};

export const getLegalHandlers = [
  http.get('/api/legal/:slug', ({ params }) => {
    const { slug } = params;
    const page = legalContent[slug as string];

    if (!page) {
      return new HttpResponse(null, { status: 404 });
    }

    return HttpResponse.json({
      status: 0,
      message: '',
      data: page,
    });
  }),

  http.put('/api/legal/:slug', async ({ params, request }) => {
    const { slug } = params;
    const page = legalContent[slug as string];

    if (!page) {
      return new HttpResponse(null, { status: 404 });
    }

    const body = await request.json() as { title: string; content: string };

    // Update the mock data
    legalContent[slug as string] = {
      ...page,
      title: body.title,
      content: body.content,
      lastUpdated: new Date().toISOString().split('T')[0],
    };

    return HttpResponse.json({
      status: 0,
      message: 'Legal page updated successfully',
      data: legalContent[slug as string],
    });
  }),
];
