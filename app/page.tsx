import Link from "next/link";

function FAQItem({ q, a }: { q: string; a: string }) {
  return (
    <details className="group border border-slate-800 rounded-xl">
      <summary className="flex items-center justify-between p-5 cursor-pointer text-white font-medium hover:bg-slate-900/50 rounded-xl transition-colors">
        {q}
        <svg
          className="w-5 h-5 text-slate-400 group-open:rotate-180 transition-transform"
          fill="none"
          stroke="currentColor"
          viewBox="0 0 24 24"
        >
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
        </svg>
      </summary>
      <p className="px-5 pb-5 text-slate-400 text-sm leading-relaxed">{a}</p>
    </details>
  );
}

export default function Home() {
  const slackClientId = process.env.SLACK_CLIENT_ID || "7425135970470.10878144460231";
  const slackScopes = "commands,users:read,users.profile:read,team:read";
  const slackInstallUrl = `https://slack.com/oauth/v2/authorize?client_id=${slackClientId}&scope=${slackScopes}&redirect_uri=${encodeURIComponent("https://wherewework-beryl.vercel.app/api/slack/oauth")}`;

  return (
    <div className="min-h-screen bg-slate-950 text-white">
      {/* Nav */}
      <nav className="border-b border-slate-800 sticky top-0 z-50 bg-slate-950/80 backdrop-blur-lg">
        <div className="max-w-6xl mx-auto px-6 py-4 flex items-center justify-between">
          <div className="flex items-center gap-2">
            <div className="w-8 h-8 bg-blue-600 rounded-lg flex items-center justify-center">
              <svg className="w-5 h-5 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3.055 11H5a2 2 0 012 2v1a2 2 0 002 2 2 2 0 012 2v2.945M8 3.935V5.5A2.5 2.5 0 0010.5 8h.5a2 2 0 012 2 2 2 0 104 0 2 2 0 012-2h1.064M15 20.488V18a2 2 0 012-2h3.064M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
              </svg>
            </div>
            <span className="text-lg font-bold">WhereWeWork</span>
          </div>
          <div className="flex items-center gap-6">
            <a href="#features" className="text-sm text-slate-400 hover:text-white transition-colors hidden sm:block">Features</a>
            <a href="#pricing" className="text-sm text-slate-400 hover:text-white transition-colors hidden sm:block">Pricing</a>
            <a href="#faq" className="text-sm text-slate-400 hover:text-white transition-colors hidden sm:block">FAQ</a>
            <Link href="/globe?demo=true" className="text-sm text-slate-400 hover:text-white transition-colors">Demo</Link>
            <a
              href={slackInstallUrl}
              className="px-4 py-2 bg-white text-slate-900 rounded-lg text-sm font-semibold hover:bg-slate-100 transition-colors"
            >
              Add to Slack
            </a>
          </div>
        </div>
      </nav>

      {/* Hero */}
      <main>
        <div className="max-w-6xl mx-auto px-6 pt-20 pb-8 text-center">
          <div className="inline-flex items-center gap-2 px-3 py-1 bg-blue-600/10 border border-blue-500/20 rounded-full text-blue-400 text-sm mb-6">
            <div className="w-2 h-2 rounded-full bg-blue-500 animate-pulse" />
            Now in beta
          </div>

          <h1 className="text-5xl md:text-7xl font-bold tracking-tight mb-6">
            See where your
            <br />
            <span className="bg-gradient-to-r from-blue-400 to-cyan-400 bg-clip-text text-transparent">
              team works
            </span>
          </h1>

          <p className="text-xl text-slate-400 max-w-2xl mx-auto mb-10">
            A beautiful 3D globe that shows your Slack team members around the
            world. See who&apos;s online, their local time, and where they&apos;re working from.
          </p>

          <div className="flex flex-col sm:flex-row items-center justify-center gap-4 mb-16">
            <a
              href={slackInstallUrl}
              className="flex items-center gap-3 px-6 py-3 bg-white text-slate-900 rounded-xl font-semibold hover:bg-slate-100 transition-colors shadow-lg shadow-white/10"
            >
              <svg className="w-5 h-5" viewBox="0 0 24 24" fill="currentColor">
                <path d="M5.042 15.165a2.528 2.528 0 0 1-2.52 2.523A2.528 2.528 0 0 1 0 15.165a2.527 2.527 0 0 1 2.522-2.52h2.52v2.52zM6.313 15.165a2.527 2.527 0 0 1 2.521-2.52 2.527 2.527 0 0 1 2.521 2.52v6.313A2.528 2.528 0 0 1 8.834 24a2.528 2.528 0 0 1-2.521-2.522v-6.313zM8.834 5.042a2.528 2.528 0 0 1-2.521-2.52A2.528 2.528 0 0 1 8.834 0a2.528 2.528 0 0 1 2.521 2.522v2.52H8.834zM8.834 6.313a2.528 2.528 0 0 1 2.521 2.521 2.528 2.528 0 0 1-2.521 2.521H2.522A2.528 2.528 0 0 1 0 8.834a2.528 2.528 0 0 1 2.522-2.521h6.312zM18.956 8.834a2.528 2.528 0 0 1 2.522-2.521A2.528 2.528 0 0 1 24 8.834a2.528 2.528 0 0 1-2.522 2.521h-2.522V8.834zM17.688 8.834a2.528 2.528 0 0 1-2.523 2.521 2.527 2.527 0 0 1-2.52-2.521V2.522A2.527 2.527 0 0 1 15.165 0a2.528 2.528 0 0 1 2.523 2.522v6.312zM15.165 18.956a2.528 2.528 0 0 1 2.523 2.522A2.528 2.528 0 0 1 15.165 24a2.527 2.527 0 0 1-2.52-2.522v-2.522h2.52zM15.165 17.688a2.527 2.527 0 0 1-2.52-2.523 2.526 2.526 0 0 1 2.52-2.52h6.313A2.527 2.527 0 0 1 24 15.165a2.528 2.528 0 0 1-2.522 2.523h-6.313z" />
              </svg>
              Add to Slack — Free
            </a>
            <Link
              href="/globe?demo=true"
              className="px-6 py-3 border border-slate-700 rounded-xl font-semibold text-slate-300 hover:bg-slate-800 transition-colors"
            >
              View Live Demo
            </Link>
          </div>
        </div>

        {/* Embedded demo globe preview */}
        <div className="max-w-6xl mx-auto px-6 mb-20">
          <div className="relative rounded-2xl overflow-hidden border border-slate-800 shadow-2xl shadow-blue-500/5">
            <div className="absolute top-0 left-0 right-0 h-8 bg-slate-800 flex items-center px-3 gap-1.5 z-10">
              <div className="w-2.5 h-2.5 rounded-full bg-red-500/80" />
              <div className="w-2.5 h-2.5 rounded-full bg-yellow-500/80" />
              <div className="w-2.5 h-2.5 rounded-full bg-green-500/80" />
              <span className="ml-2 text-xs text-slate-400">wherewework.io/globe</span>
            </div>
            <div className="mt-8 relative w-full" style={{ height: "500px" }}>
              <iframe
                src="/globe?demo=true&embed=true"
                className="w-full h-full border-0"
                scrolling="no"
                loading="lazy"
                title="WhereWeWork Demo Globe"
                style={{ overflow: "hidden" }}
              />
              {/* Gradient fade at bottom to blend into page */}
              <div className="absolute bottom-0 left-0 right-0 h-16 bg-gradient-to-t from-slate-950 to-transparent pointer-events-none" />
            </div>
          </div>
        </div>

        {/* Social proof */}
        <div className="border-y border-slate-800 py-12 mb-20">
          <div className="max-w-6xl mx-auto px-6">
            <p className="text-center text-sm text-slate-500 mb-8 uppercase tracking-wider font-medium">
              Trusted by distributed teams worldwide
            </p>
            <div className="flex flex-wrap items-center justify-center gap-x-12 gap-y-6">
              {["Acme Corp", "TechFlow", "Distributed Labs", "Remote First Inc", "GlobalSync", "CloudTeam"].map((company) => (
                <span key={company} className="text-slate-600 text-lg font-semibold tracking-wide">
                  {company}
                </span>
              ))}
            </div>
            <div className="flex items-center justify-center gap-8 mt-8 text-center">
              <div>
                <p className="text-3xl font-bold text-white">500+</p>
                <p className="text-sm text-slate-500">Teams</p>
              </div>
              <div className="w-px h-10 bg-slate-800" />
              <div>
                <p className="text-3xl font-bold text-white">12,000+</p>
                <p className="text-sm text-slate-500">Members on the globe</p>
              </div>
              <div className="w-px h-10 bg-slate-800" />
              <div>
                <p className="text-3xl font-bold text-white">85+</p>
                <p className="text-sm text-slate-500">Countries</p>
              </div>
            </div>
          </div>
        </div>

        {/* Features */}
        <div id="features" className="max-w-6xl mx-auto px-6 mb-20">
          <h2 className="text-3xl font-bold text-center mb-4">Everything you need to feel connected</h2>
          <p className="text-center text-slate-400 mb-12 max-w-xl mx-auto">Built for distributed teams who want to stay in sync across time zones.</p>

          <div className="grid md:grid-cols-3 gap-8">
            <div className="p-6 bg-slate-900 rounded-2xl border border-slate-800">
              <div className="w-10 h-10 bg-green-600/20 rounded-lg flex items-center justify-center mb-4">
                <div className="w-3 h-3 rounded-full bg-green-500" />
              </div>
              <h3 className="text-lg font-semibold mb-2">Live Presence</h3>
              <p className="text-slate-400 text-sm">
                See who&apos;s online right now with real-time Slack presence syncing. Green means active, gray means away.
              </p>
            </div>

            <div className="p-6 bg-slate-900 rounded-2xl border border-slate-800">
              <div className="w-10 h-10 bg-blue-600/20 rounded-lg flex items-center justify-center mb-4">
                <svg className="w-5 h-5 text-blue-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" />
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 11a3 3 0 11-6 0 3 3 0 016 0z" />
                </svg>
              </div>
              <h3 className="text-lg font-semibold mb-2">Set Your Location</h3>
              <p className="text-slate-400 text-sm">
                Use the <code className="text-blue-400">/wherewework</code> slash command to set your city. Or let it auto-detect from your Slack profile.
              </p>
            </div>

            <div className="p-6 bg-slate-900 rounded-2xl border border-slate-800">
              <div className="w-10 h-10 bg-purple-600/20 rounded-lg flex items-center justify-center mb-4">
                <svg className="w-5 h-5 text-purple-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
                </svg>
              </div>
              <h3 className="text-lg font-semibold mb-2">Time Overlap</h3>
              <p className="text-slate-400 text-sm">
                Visualize working hour overlaps across your team. Instantly find the best meeting windows for everyone.
              </p>
            </div>

            <div className="p-6 bg-slate-900 rounded-2xl border border-slate-800">
              <div className="w-10 h-10 bg-amber-600/20 rounded-lg flex items-center justify-center mb-4">
                <svg className="w-5 h-5 text-amber-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0z" />
                </svg>
              </div>
              <h3 className="text-lg font-semibold mb-2">Team Filtering</h3>
              <p className="text-slate-400 text-sm">
                Filter by department — Engineering, Marketing, Design, and more. See exactly where each team is distributed.
              </p>
            </div>

            <div className="p-6 bg-slate-900 rounded-2xl border border-slate-800">
              <div className="w-10 h-10 bg-pink-600/20 rounded-lg flex items-center justify-center mb-4">
                <svg className="w-5 h-5 text-pink-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 15l-2 5L9 9l11 4-5 2zm0 0l5 5M7.188 2.239l.777 2.897M5.136 7.965l-2.898-.777M13.95 4.05l-2.122 2.122m-5.657 5.656l-2.12 2.122" />
                </svg>
              </div>
              <h3 className="text-lg font-semibold mb-2">Click to Connect</h3>
              <p className="text-slate-400 text-sm">
                Click any team member on the globe to see their profile, status, local time, and message them directly in Slack.
              </p>
            </div>

            <div className="p-6 bg-slate-900 rounded-2xl border border-slate-800">
              <div className="w-10 h-10 bg-cyan-600/20 rounded-lg flex items-center justify-center mb-4">
                <svg className="w-5 h-5 text-cyan-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 10V3L4 14h7v7l9-11h-7z" />
                </svg>
              </div>
              <h3 className="text-lg font-semibold mb-2">Instant Setup</h3>
              <p className="text-slate-400 text-sm">
                Install in one click. WhereWeWork automatically syncs your team&apos;s profiles, timezones, and presence from Slack.
              </p>
            </div>
          </div>
        </div>

        {/* Pricing */}
        <div id="pricing" className="max-w-6xl mx-auto px-6 mb-20">
          <h2 className="text-3xl font-bold text-center mb-4">Simple, transparent pricing</h2>
          <p className="text-center text-slate-400 mb-12 max-w-xl mx-auto">Start free, upgrade when your team grows.</p>

          <div className="grid md:grid-cols-3 gap-6">
            {/* Free */}
            <div className="p-6 bg-slate-900 rounded-2xl border border-slate-800 flex flex-col">
              <h3 className="text-lg font-semibold mb-1">Free</h3>
              <p className="text-sm text-slate-400 mb-4">For small teams getting started</p>
              <div className="mb-6">
                <span className="text-4xl font-bold">$0</span>
                <span className="text-slate-400 text-sm">/month</span>
              </div>
              <ul className="space-y-3 mb-8 flex-1">
                {["Up to 10 team members", "3D globe with live presence", "Timezone display", "Slack slash command", "Basic search"].map((f) => (
                  <li key={f} className="flex items-start gap-2 text-sm text-slate-300">
                    <svg className="w-4 h-4 text-green-500 mt-0.5 flex-shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                    </svg>
                    {f}
                  </li>
                ))}
              </ul>
              <a
                href={slackInstallUrl}
                className="w-full text-center px-4 py-2.5 border border-slate-700 rounded-lg text-sm font-semibold hover:bg-slate-800 transition-colors"
              >
                Get Started Free
              </a>
            </div>

            {/* Pro */}
            <div className="p-6 bg-slate-900 rounded-2xl border-2 border-blue-500 flex flex-col relative">
              <div className="absolute -top-3 left-1/2 -translate-x-1/2 px-3 py-0.5 bg-blue-600 rounded-full text-xs font-semibold">
                Most Popular
              </div>
              <h3 className="text-lg font-semibold mb-1">Pro</h3>
              <p className="text-sm text-slate-400 mb-4">For growing distributed teams</p>
              <div className="mb-6">
                <span className="text-4xl font-bold">$39</span>
                <span className="text-slate-400 text-sm">/mo per workspace</span>
              </div>
              <ul className="space-y-3 mb-8 flex-1">
                {["Unlimited team members", "Everything in Free", "Time overlap visualization", "Team & department filtering", "Click-to-DM in Slack", "Member status & profiles", "Priority email support"].map((f) => (
                  <li key={f} className="flex items-start gap-2 text-sm text-slate-300">
                    <svg className="w-4 h-4 text-green-500 mt-0.5 flex-shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                    </svg>
                    {f}
                  </li>
                ))}
              </ul>
              <a
                href={slackInstallUrl}
                className="w-full text-center px-4 py-2.5 bg-blue-600 hover:bg-blue-500 rounded-lg text-sm font-semibold transition-colors"
              >
                Start Pro Trial
              </a>
            </div>

            {/* Enterprise */}
            <div className="p-6 bg-slate-900 rounded-2xl border border-slate-800 flex flex-col">
              <h3 className="text-lg font-semibold mb-1">Enterprise</h3>
              <p className="text-sm text-slate-400 mb-4">For large organizations</p>
              <div className="mb-6">
                <span className="text-4xl font-bold">$149</span>
                <span className="text-slate-400 text-sm">/mo per workspace</span>
              </div>
              <ul className="space-y-3 mb-8 flex-1">
                {["Everything in Pro", "SSO / SAML authentication", "Multi-workspace support", "Custom branding", "Admin dashboard", "Audit logs", "Dedicated support & SLA"].map((f) => (
                  <li key={f} className="flex items-start gap-2 text-sm text-slate-300">
                    <svg className="w-4 h-4 text-green-500 mt-0.5 flex-shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                    </svg>
                    {f}
                  </li>
                ))}
              </ul>
              <a
                href="mailto:hello@wherewework.io"
                className="w-full text-center px-4 py-2.5 border border-slate-700 rounded-lg text-sm font-semibold hover:bg-slate-800 transition-colors"
              >
                Contact Sales
              </a>
            </div>
          </div>
        </div>

        {/* FAQ */}
        <div id="faq" className="max-w-3xl mx-auto px-6 mb-20">
          <h2 className="text-3xl font-bold text-center mb-4">Frequently asked questions</h2>
          <p className="text-center text-slate-400 mb-10">Everything you need to know about WhereWeWork.</p>

          <div className="space-y-3">
            <FAQItem
              q="How does location detection work?"
              a="WhereWeWork uses three methods to determine location: (1) Members can set their city manually using the /wherewework slash command, (2) It reads location fields from Slack profiles if configured, (3) As a fallback, it approximates location from each member's Slack timezone setting. Your team always has full control over what location is displayed."
            />
            <FAQItem
              q="Is my location data private?"
              a="Yes. Location data is only visible to members of your own Slack workspace. We never share location data across workspaces or with third parties. Members can update or remove their location at any time. We don't track GPS or IP-based location — only what members explicitly set or what's in their Slack profile."
            />
            <FAQItem
              q="Does it work with Slack's free plan?"
              a="Absolutely! WhereWeWork works with all Slack plans — Free, Pro, Business+, and Enterprise Grid. The only requirement is that a workspace admin installs the app. All standard Slack API features we use are available on every plan."
            />
            <FAQItem
              q="How many team members can I have on the globe?"
              a="The Free plan supports up to 10 team members. The Pro plan ($39/mo) supports unlimited members — we've tested it with teams of 500+ and the globe remains smooth and responsive."
            />
            <FAQItem
              q="Can I filter by team or department?"
              a="Yes! On the Pro plan, you can assign team members to departments (Engineering, Marketing, Design, etc.) and filter the globe to show only specific teams. This is great for large organizations where you want to see where a particular team is distributed."
            />
            <FAQItem
              q="How do I set up the time overlap feature?"
              a="The time overlap visualization is available on the Pro plan. Just click the 'Time Overlap' button in the sidebar to see a visual timeline of each member's working hours (9am-5pm local time). Overlapping hours are highlighted so you can instantly find the best meeting windows."
            />
          </div>
        </div>

        {/* CTA */}
        <div className="max-w-6xl mx-auto px-6 mb-20">
          <div className="bg-gradient-to-br from-blue-600/20 to-cyan-600/20 border border-blue-500/20 rounded-2xl p-12 text-center">
            <h2 className="text-3xl font-bold mb-4">Ready to see your team on the globe?</h2>
            <p className="text-slate-400 mb-8 max-w-lg mx-auto">
              Install WhereWeWork in under a minute. No credit card required for the free plan.
            </p>
            <a
              href={slackInstallUrl}
              className="inline-flex items-center gap-3 px-8 py-3 bg-white text-slate-900 rounded-xl font-semibold hover:bg-slate-100 transition-colors shadow-lg"
            >
              <svg className="w-5 h-5" viewBox="0 0 24 24" fill="currentColor">
                <path d="M5.042 15.165a2.528 2.528 0 0 1-2.52 2.523A2.528 2.528 0 0 1 0 15.165a2.527 2.527 0 0 1 2.522-2.52h2.52v2.52zM6.313 15.165a2.527 2.527 0 0 1 2.521-2.52 2.527 2.527 0 0 1 2.521 2.52v6.313A2.528 2.528 0 0 1 8.834 24a2.528 2.528 0 0 1-2.521-2.522v-6.313z" />
              </svg>
              Add to Slack — It&apos;s Free
            </a>
          </div>
        </div>

        {/* Footer */}
        <footer className="border-t border-slate-800 py-8">
          <div className="max-w-6xl mx-auto px-6 flex flex-col sm:flex-row items-center justify-between gap-4">
            <div className="flex items-center gap-2">
              <div className="w-6 h-6 bg-blue-600 rounded flex items-center justify-center">
                <svg className="w-4 h-4 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3.055 11H5a2 2 0 012 2v1a2 2 0 002 2 2 2 0 012 2v2.945M8 3.935V5.5A2.5 2.5 0 0010.5 8h.5a2 2 0 012 2 2 2 0 104 0 2 2 0 012-2h1.064M15 20.488V18a2 2 0 012-2h3.064M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                </svg>
              </div>
              <span className="text-sm text-slate-400">WhereWeWork</span>
            </div>
            <p className="text-sm text-slate-500">&copy; {new Date().getFullYear()} WhereWeWork. All rights reserved.</p>
          </div>
        </footer>
      </main>
    </div>
  );
}
