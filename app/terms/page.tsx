import Link from "next/link";
import Image from "next/image";
import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Terms of Service — WhereWeWork",
  description: "Terms of Service for using WhereWeWork.",
};

export default function TermsOfService() {
  return (
    <div className="min-h-screen bg-[#080d1a] text-[#f0f4ff] relative">
      <div className="starfield" />

      <nav className="border-b border-[rgba(255,255,255,0.07)] sticky top-0 z-50 bg-[#080d1a]/80 backdrop-blur-lg">
        <div className="max-w-4xl mx-auto px-6 py-4 flex items-center justify-between">
          <Link href="/" className="flex items-center gap-2.5">
            <Image src="/logo.svg" alt="WhereWeWork" width={32} height={32} className="rounded-lg" />
            <span className="text-lg font-bold tracking-tight">WhereWeWork</span>
          </Link>
        </div>
      </nav>

      <main className="relative z-10 max-w-4xl mx-auto px-6 py-16">
        <h1 className="text-4xl font-extrabold tracking-tight mb-2">Terms of Service</h1>
        <p className="text-sm text-[#4a6080] font-mono mb-12">Last updated: April 14, 2026</p>

        <div className="space-y-10 text-[#8ea4c8] leading-relaxed">
          <section>
            <h2 className="text-xl font-semibold text-[#f0f4ff] mb-3">1. Acceptance of Terms</h2>
            <p>
              By installing or using WhereWeWork (&ldquo;the Service&rdquo;), you agree to be bound by these Terms of Service.
              If you are installing the Service on behalf of an organization, you represent that you have authority to bind that organization to these terms.
            </p>
          </section>

          <section>
            <h2 className="text-xl font-semibold text-[#f0f4ff] mb-3">2. Description of Service</h2>
            <p>
              WhereWeWork is a Slack application that displays workspace members on an interactive 3D globe,
              shows presence status, and helps distributed teams find meeting times across time zones.
            </p>
          </section>

          <section>
            <h2 className="text-xl font-semibold text-[#f0f4ff] mb-3">3. Account &amp; Access</h2>
            <ul className="list-disc pl-6 space-y-2">
              <li>Access to WhereWeWork requires a Slack workspace and installation by a workspace administrator.</li>
              <li>You are responsible for maintaining the security of your Slack workspace and any associated credentials.</li>
              <li>You must not use the Service for any unlawful purpose or in violation of Slack&rsquo;s terms of service.</li>
            </ul>
          </section>

          <section>
            <h2 className="text-xl font-semibold text-[#f0f4ff] mb-3">4. Free &amp; Paid Plans</h2>
            <p>
              The Service offers free and paid tiers. Features and limits for each tier are described on our pricing page.
              Paid subscriptions are billed monthly per workspace. You may cancel at any time; access continues until the end of the billing period.
              We reserve the right to change pricing with 30 days&rsquo; notice.
            </p>
          </section>

          <section>
            <h2 className="text-xl font-semibold text-[#f0f4ff] mb-3">5. User Content &amp; Data</h2>
            <p>
              You retain ownership of all data you provide (locations, profile information).
              By using the Service, you grant us a limited license to process this data solely to provide the Service.
              See our <Link href="/privacy" className="text-[#60a5fa] hover:underline">Privacy Policy</Link> for details on data handling.
            </p>
          </section>

          <section>
            <h2 className="text-xl font-semibold text-[#f0f4ff] mb-3">6. Acceptable Use</h2>
            <p>You agree not to:</p>
            <ul className="list-disc pl-6 space-y-2 mt-2">
              <li>Reverse engineer, decompile, or attempt to extract the source code of the Service</li>
              <li>Use the Service to harass, stalk, or track individuals without their consent</li>
              <li>Attempt to access data from workspaces you are not a member of</li>
              <li>Use automated means to scrape or extract data from the Service</li>
              <li>Resell or redistribute the Service without written permission</li>
            </ul>
          </section>

          <section>
            <h2 className="text-xl font-semibold text-[#f0f4ff] mb-3">7. Availability &amp; Support</h2>
            <p>
              We strive to maintain high availability but do not guarantee uninterrupted service.
              Scheduled maintenance will be communicated in advance when possible.
              Support is available via email at <a href="mailto:support@wherewework.io" className="text-[#60a5fa] hover:underline">support@wherewework.io</a>.
            </p>
          </section>

          <section>
            <h2 className="text-xl font-semibold text-[#f0f4ff] mb-3">8. Limitation of Liability</h2>
            <p>
              To the maximum extent permitted by law, WhereWeWork and its operators shall not be liable for any indirect,
              incidental, special, consequential, or punitive damages, or any loss of data, revenue, or profits,
              arising from your use of the Service.
            </p>
          </section>

          <section>
            <h2 className="text-xl font-semibold text-[#f0f4ff] mb-3">9. Termination</h2>
            <p>
              Either party may terminate this agreement at any time. You can terminate by uninstalling the app from your Slack workspace.
              We may suspend or terminate access if you violate these terms, with notice when practical.
              Upon termination, your data will be deleted in accordance with our Privacy Policy.
            </p>
          </section>

          <section>
            <h2 className="text-xl font-semibold text-[#f0f4ff] mb-3">10. Changes to Terms</h2>
            <p>
              We may update these terms from time to time. Material changes will be communicated via the Service or email.
              Continued use after changes constitutes acceptance.
            </p>
          </section>

          <section>
            <h2 className="text-xl font-semibold text-[#f0f4ff] mb-3">11. Contact</h2>
            <p>
              Questions about these terms? Contact us at{" "}
              <a href="mailto:support@wherewework.io" className="text-[#60a5fa] hover:underline">support@wherewework.io</a>.
            </p>
          </section>
        </div>

        <div className="mt-16 pt-8 border-t border-[rgba(255,255,255,0.07)] flex flex-wrap gap-x-6 gap-y-2 text-sm text-[#4a6080]">
          <Link href="/privacy" className="hover:text-[#8ea4c8] transition-colors">Privacy Policy</Link>
          <Link href="/support" className="hover:text-[#8ea4c8] transition-colors">Support</Link>
          <a href="mailto:support@wherewework.io" className="hover:text-[#8ea4c8] transition-colors">support@wherewework.io</a>
        </div>
      </main>
    </div>
  );
}
