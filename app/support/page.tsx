import Link from "next/link";
import Image from "next/image";
import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Support — WhereWeWork",
  description: "Get help with WhereWeWork. Contact our support team.",
};

export default function Support() {
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
        <h1 className="text-4xl font-extrabold tracking-tight mb-4">Support</h1>
        <p className="text-lg text-[#8ea4c8] mb-12 max-w-2xl">
          Need help with WhereWeWork? We&rsquo;re here for you.
        </p>

        <div className="grid md:grid-cols-2 gap-6 mb-16">
          <div className="p-6 bg-[#131d35] rounded-xl border border-[rgba(255,255,255,0.07)]">
            <div className="w-10 h-10 rounded-lg flex items-center justify-center mb-4 bg-[rgba(59,130,246,0.15)]">
              <svg className="w-5 h-5 text-[#3b82f6]" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
              </svg>
            </div>
            <h3 className="text-base font-semibold mb-2">Email Support</h3>
            <p className="text-sm text-[#8ea4c8] mb-4">
              Send us an email and we&rsquo;ll get back to you within 24 hours on business days.
            </p>
            <a
              href="mailto:support@wherewework.io"
              className="text-[#60a5fa] text-sm font-semibold hover:underline"
            >
              support@wherewework.io
            </a>
          </div>

          <div className="p-6 bg-[#131d35] rounded-xl border border-[rgba(255,255,255,0.07)]">
            <div className="w-10 h-10 rounded-lg flex items-center justify-center mb-4 bg-[rgba(20,184,166,0.15)]">
              <svg className="w-5 h-5 text-[#14b8a6]" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8.228 9c.549-1.165 2.03-2 3.772-2 2.21 0 4 1.343 4 3 0 1.4-1.278 2.575-3.006 2.907-.542.104-.994.54-.994 1.093m0 3h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
              </svg>
            </div>
            <h3 className="text-base font-semibold mb-2">Quick Help</h3>
            <p className="text-sm text-[#8ea4c8] mb-4">
              Check out common commands and tips right in Slack.
            </p>
            <p className="text-sm text-[#4a6080] font-mono">
              Type <code className="text-[#60a5fa] bg-[rgba(59,130,246,0.1)] px-1.5 py-0.5 rounded">/wherewework</code> in Slack
            </p>
          </div>
        </div>

        <div className="mb-16">
          <h2 className="text-2xl font-bold mb-6">Common Questions</h2>
          <div className="space-y-6 text-[#8ea4c8]">
            <div>
              <h3 className="text-base font-semibold text-[#f0f4ff] mb-1">How do I set my location?</h3>
              <p className="text-sm">Type <code className="text-[#60a5fa] bg-[rgba(59,130,246,0.1)] px-1 rounded">/wherewework set London, UK</code> in any Slack channel. Replace with your city.</p>
            </div>
            <div>
              <h3 className="text-base font-semibold text-[#f0f4ff] mb-1">How do I find meeting times?</h3>
              <p className="text-sm">Type <code className="text-[#60a5fa] bg-[rgba(59,130,246,0.1)] px-1 rounded">/wherewework meet @Alex @Sarah Apr 16</code> to find the best times. You can also use date ranges or &ldquo;next week&rdquo;.</p>
            </div>
            <div>
              <h3 className="text-base font-semibold text-[#f0f4ff] mb-1">How do I remove the app?</h3>
              <p className="text-sm">A workspace admin can uninstall WhereWeWork from Slack&rsquo;s App Management page. All data is deleted within 30 days.</p>
            </div>
            <div>
              <h3 className="text-base font-semibold text-[#f0f4ff] mb-1">The globe isn&rsquo;t loading — what do I do?</h3>
              <p className="text-sm">Try refreshing the page or using a different browser. The 3D globe requires WebGL support. If the issue persists, email us.</p>
            </div>
          </div>
        </div>
      </main>
    </div>
  );
}
