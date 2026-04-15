import Link from "next/link";
import Image from "next/image";
import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Privacy Policy — WhereWeWork",
  description: "How WhereWeWork handles your data, what we collect, and your rights.",
};

export default function PrivacyPolicy() {
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
        <h1 className="text-4xl font-extrabold tracking-tight mb-2">Privacy Policy</h1>
        <p className="text-sm text-[#4a6080] font-mono mb-12">Last updated: April 14, 2026</p>

        <div className="space-y-10 text-[#8ea4c8] leading-relaxed">
          <section>
            <h2 className="text-xl font-semibold text-[#f0f4ff] mb-3">1. Overview</h2>
            <p>
              WhereWeWork (&ldquo;we&rdquo;, &ldquo;us&rdquo;, &ldquo;our&rdquo;) is a Slack application that displays team members on a 3D globe.
              This policy explains what data we collect, how we use it, and your rights regarding that data.
            </p>
          </section>

          <section>
            <h2 className="text-xl font-semibold text-[#f0f4ff] mb-3">2. Data We Collect</h2>
            <p className="mb-3">When your workspace installs WhereWeWork, we access the following from Slack:</p>
            <ul className="list-disc pl-6 space-y-2">
              <li><strong className="text-[#f0f4ff]">Workspace member profiles</strong> — display names, avatars, and timezone settings. We do not access private messages, channels, or files.</li>
              <li><strong className="text-[#f0f4ff]">Presence status</strong> — whether a member is &ldquo;active&rdquo; or &ldquo;away&rdquo; in Slack.</li>
              <li><strong className="text-[#f0f4ff]">Email addresses</strong> — used only to pre-fill Google Calendar invites when using the meeting finder. We do not store emails.</li>
              <li><strong className="text-[#f0f4ff]">User-set locations</strong> — when a member uses the <code className="text-[#60a5fa] bg-[rgba(59,130,246,0.1)] px-1 rounded">/wherewework set</code> command, we store the city name and coordinates they provide.</li>
            </ul>
          </section>

          <section>
            <h2 className="text-xl font-semibold text-[#f0f4ff] mb-3">3. How We Use Your Data</h2>
            <ul className="list-disc pl-6 space-y-2">
              <li>Display team member locations, avatars, and presence on the globe</li>
              <li>Calculate timezone overlaps and meeting time suggestions</li>
              <li>Pre-fill Google Calendar event details when you click &ldquo;Add to Calendar&rdquo;</li>
            </ul>
            <p className="mt-3">We do not sell, share, or transfer your data to third parties for advertising or marketing purposes.</p>
          </section>

          <section>
            <h2 className="text-xl font-semibold text-[#f0f4ff] mb-3">4. Data Storage &amp; Security</h2>
            <p>
              Data is stored securely using industry-standard encryption. Workspace data is isolated — members of one workspace cannot see data from another.
              We use HTTPS for all data transmission. OAuth tokens are encrypted at rest.
            </p>
          </section>

          <section>
            <h2 className="text-xl font-semibold text-[#f0f4ff] mb-3">5. Third-Party Services</h2>
            <ul className="list-disc pl-6 space-y-2">
              <li><strong className="text-[#f0f4ff]">Slack</strong> — for authentication, member profiles, and presence data</li>
              <li><strong className="text-[#f0f4ff]">Google Calendar</strong> — only when you choose to add a meeting. We redirect you to Google&rsquo;s calendar interface; we do not store your calendar data</li>
              <li><strong className="text-[#f0f4ff]">OpenStreetMap Nominatim</strong> — for geocoding city names to coordinates. Only the city name is sent; no personal data</li>
              <li><strong className="text-[#f0f4ff]">Vercel</strong> — for hosting and infrastructure</li>
            </ul>
          </section>

          <section>
            <h2 className="text-xl font-semibold text-[#f0f4ff] mb-3">6. Data Retention</h2>
            <p>
              We retain workspace data for as long as the app is installed. When the app is uninstalled from a workspace,
              all associated data (member locations, tokens) is deleted within 30 days.
              Individual members can remove their location at any time using <code className="text-[#60a5fa] bg-[rgba(59,130,246,0.1)] px-1 rounded">/wherewework set</code>.
            </p>
          </section>

          <section>
            <h2 className="text-xl font-semibold text-[#f0f4ff] mb-3">7. Your Rights</h2>
            <p>You have the right to:</p>
            <ul className="list-disc pl-6 space-y-2 mt-2">
              <li>Request a copy of your data</li>
              <li>Request deletion of your data</li>
              <li>Update or remove your location at any time</li>
              <li>Uninstall the app to stop all data collection</li>
            </ul>
          </section>

          <section>
            <h2 className="text-xl font-semibold text-[#f0f4ff] mb-3">8. Changes to This Policy</h2>
            <p>
              We may update this policy from time to time. Changes will be posted on this page with an updated &ldquo;Last updated&rdquo; date.
              Continued use of WhereWeWork after changes constitutes acceptance of the updated policy.
            </p>
          </section>

          <section>
            <h2 className="text-xl font-semibold text-[#f0f4ff] mb-3">9. Contact</h2>
            <p>
              For privacy-related questions or data requests, contact us at{" "}
              <a href="mailto:support@wherewework.io" className="text-[#60a5fa] hover:underline">support@wherewework.io</a>.
            </p>
          </section>
        </div>

        <div className="mt-16 pt-8 border-t border-[rgba(255,255,255,0.07)] flex flex-wrap gap-x-6 gap-y-2 text-sm text-[#4a6080]">
          <Link href="/terms" className="hover:text-[#8ea4c8] transition-colors">Terms of Service</Link>
          <Link href="/support" className="hover:text-[#8ea4c8] transition-colors">Support</Link>
          <a href="mailto:support@wherewework.io" className="hover:text-[#8ea4c8] transition-colors">support@wherewework.io</a>
        </div>
      </main>
    </div>
  );
}
