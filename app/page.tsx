import Link from "next/link";

function FAQItem({ q, a }: { q: string; a: string }) {
  return (
    <details className="group border border-[rgba(255,255,255,0.07)] rounded-xl">
      <summary className="flex items-center justify-between p-5 cursor-pointer text-[#f0f4ff] font-semibold hover:bg-[#131d35]/50 rounded-xl transition-colors">
        {q}
        <svg
          className="w-5 h-5 text-[#4a6080] group-open:rotate-180 transition-transform"
          fill="none"
          stroke="currentColor"
          viewBox="0 0 24 24"
        >
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
        </svg>
      </summary>
      <p className="px-5 pb-5 text-[#8ea4c8] text-sm leading-relaxed">{a}</p>
    </details>
  );
}

export default function Home() {
  const slackClientId = process.env.SLACK_CLIENT_ID || "7425135970470.10878144460231";
  const slackScopes = "commands,users:read,users.profile:read,team:read,chat:write";
  const slackInstallUrl = `https://slack.com/oauth/v2/authorize?client_id=${slackClientId}&scope=${slackScopes}&redirect_uri=${encodeURIComponent("https://wherewework-beryl.vercel.app/api/slack/oauth")}`;

  return (
    <div className="min-h-screen bg-[#080d1a] text-[#f0f4ff] relative">
      {/* Starfield background */}
      <div className="starfield" />

      {/* Nav */}
      <nav className="border-b border-[rgba(255,255,255,0.07)] sticky top-0 z-50 bg-[#080d1a]/80 backdrop-blur-lg">
        <div className="max-w-6xl mx-auto px-6 py-4 flex items-center justify-between">
          <div className="flex items-center gap-2.5">
            <div className="logo-dot" />
            <span className="text-lg font-bold tracking-tight">WhereWeWork</span>
          </div>
          <div className="flex items-center gap-6">
            <a href="#features" className="text-sm text-[#8ea4c8] hover:text-[#f0f4ff] transition-colors hidden sm:block">Features</a>
            <a href="#pricing" className="text-sm text-[#8ea4c8] hover:text-[#f0f4ff] transition-colors hidden sm:block">Pricing</a>
            <a href="#faq" className="text-sm text-[#8ea4c8] hover:text-[#f0f4ff] transition-colors hidden sm:block">FAQ</a>
            <Link href="/globe?demo=true" className="text-sm text-[#8ea4c8] hover:text-[#f0f4ff] transition-colors">Demo</Link>
            <a
              href={slackInstallUrl}
              className="px-4 py-2 bg-[#3b82f6] text-white rounded-lg text-sm font-semibold hover:bg-[#60a5fa] transition-colors btn-brand"
            >
              Add to Slack
            </a>
          </div>
        </div>
      </nav>

      {/* Hero */}
      <main className="relative z-10">
        <div className="max-w-6xl mx-auto px-6 pt-20 pb-8 text-center">
          <div className="inline-flex items-center gap-2 px-3 py-1 bg-[rgba(59,130,246,0.2)] border border-[rgba(59,130,246,0.3)] rounded-full text-[#60a5fa] text-sm font-semibold mb-6">
            <div className="w-1.5 h-1.5 rounded-full bg-current" />
            Now in beta
          </div>

          <h1 className="text-5xl md:text-7xl font-extrabold tracking-tighter mb-6 leading-[1.08]">
            See where your
            <br />
            <span className="bg-gradient-to-r from-[#f0f4ff] via-[#93c5fd] to-[#60a5fa] bg-clip-text text-transparent">
              team works
            </span>
          </h1>

          <p className="text-xl text-[#8ea4c8] max-w-2xl mx-auto mb-10">
            A beautiful 3D globe that shows your Slack team members around the
            world. See who&apos;s online, their local time, and where they&apos;re working from.
          </p>

          <div className="flex flex-col sm:flex-row items-center justify-center gap-4 mb-16">
            <a
              href={slackInstallUrl}
              className="flex items-center gap-3 px-6 py-3 bg-[#3b82f6] text-white rounded-xl font-semibold hover:bg-[#60a5fa] transition-colors btn-brand"
            >
              <svg className="w-5 h-5" viewBox="0 0 24 24" fill="currentColor">
                <path d="M5.042 15.165a2.528 2.528 0 0 1-2.52 2.523A2.528 2.528 0 0 1 0 15.165a2.527 2.527 0 0 1 2.522-2.52h2.52v2.52zM6.313 15.165a2.527 2.527 0 0 1 2.521-2.52 2.527 2.527 0 0 1 2.521 2.52v6.313A2.528 2.528 0 0 1 8.834 24a2.528 2.528 0 0 1-2.521-2.522v-6.313zM8.834 5.042a2.528 2.528 0 0 1-2.521-2.52A2.528 2.528 0 0 1 8.834 0a2.528 2.528 0 0 1 2.521 2.522v2.52H8.834zM8.834 6.313a2.528 2.528 0 0 1 2.521 2.521 2.528 2.528 0 0 1-2.521 2.521H2.522A2.528 2.528 0 0 1 0 8.834a2.528 2.528 0 0 1 2.522-2.521h6.312zM18.956 8.834a2.528 2.528 0 0 1 2.522-2.521A2.528 2.528 0 0 1 24 8.834a2.528 2.528 0 0 1-2.522 2.521h-2.522V8.834zM17.688 8.834a2.528 2.528 0 0 1-2.523 2.521 2.527 2.527 0 0 1-2.52-2.521V2.522A2.527 2.527 0 0 1 15.165 0a2.528 2.528 0 0 1 2.523 2.522v6.312zM15.165 18.956a2.528 2.528 0 0 1 2.523 2.522A2.528 2.528 0 0 1 15.165 24a2.527 2.527 0 0 1-2.52-2.522v-2.522h2.52zM15.165 17.688a2.527 2.527 0 0 1-2.52-2.523 2.526 2.526 0 0 1 2.52-2.52h6.313A2.527 2.527 0 0 1 24 15.165a2.528 2.528 0 0 1-2.522 2.523h-6.313z" />
              </svg>
              Add to Slack — Free
            </a>
            <Link
              href="/globe?demo=true"
              className="px-6 py-3 border border-[rgba(99,179,255,0.25)] rounded-xl font-semibold text-[#f0f4ff] hover:bg-[rgba(59,130,246,0.08)] hover:border-[#3b82f6] transition-colors"
            >
              View Live Demo
            </Link>
          </div>
        </div>

        {/* Embedded demo globe preview */}
        <div className="max-w-6xl mx-auto px-6 mb-20">
          <div className="relative rounded-2xl overflow-hidden border border-[rgba(99,179,255,0.25)] shadow-2xl shadow-blue-500/10">
            <div className="absolute top-0 left-0 right-0 h-8 bg-[#0e1628] flex items-center px-3 gap-1.5 z-10">
              <div className="w-2.5 h-2.5 rounded-full bg-[#f43f5e]/80" />
              <div className="w-2.5 h-2.5 rounded-full bg-[#f59e0b]/80" />
              <div className="w-2.5 h-2.5 rounded-full bg-[#10b981]/80" />
              <span className="ml-2 text-xs text-[#4a6080] font-mono">wherewework.io/globe</span>
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
              <div className="absolute bottom-0 left-0 right-0 h-16 bg-gradient-to-t from-[#080d1a] to-transparent pointer-events-none" />
            </div>
          </div>
        </div>

        {/* Social proof */}
        <div className="border-y border-[rgba(255,255,255,0.07)] py-12 mb-20">
          <div className="max-w-6xl mx-auto px-6">
            <p className="text-center text-[10px] text-[#4a6080] mb-8 uppercase tracking-[0.2em] font-mono">
              Trusted by distributed teams worldwide
            </p>
            <div className="flex flex-wrap items-center justify-center gap-x-12 gap-y-6">
              {["Acme Corp", "TechFlow", "Distributed Labs", "Remote First Inc", "GlobalSync", "CloudTeam"].map((company) => (
                <span key={company} className="text-[#4a6080] text-lg font-semibold tracking-wide">
                  {company}
                </span>
              ))}
            </div>
            <div className="flex items-center justify-center gap-8 mt-8 text-center">
              <div>
                <p className="text-3xl font-bold text-[#f0f4ff]">500+</p>
                <p className="text-sm text-[#4a6080] font-mono">Teams</p>
              </div>
              <div className="w-px h-10 bg-[rgba(255,255,255,0.07)]" />
              <div>
                <p className="text-3xl font-bold text-[#f0f4ff]">12,000+</p>
                <p className="text-sm text-[#4a6080] font-mono">Members on the globe</p>
              </div>
              <div className="w-px h-10 bg-[rgba(255,255,255,0.07)]" />
              <div>
                <p className="text-3xl font-bold text-[#f0f4ff]">85+</p>
                <p className="text-sm text-[#4a6080] font-mono">Countries</p>
              </div>
            </div>
          </div>
        </div>

        {/* Features */}
        <div id="features" className="max-w-6xl mx-auto px-6 mb-20">
          <p className="text-center text-[10px] text-[#3b82f6] uppercase tracking-[0.2em] font-mono mb-4">Features</p>
          <h2 className="text-3xl font-bold text-center mb-4 tracking-tight">Everything you need to feel connected</h2>
          <p className="text-center text-[#8ea4c8] mb-12 max-w-xl mx-auto">Built for distributed teams who want to stay in sync across time zones.</p>

          <div className="grid md:grid-cols-3 gap-5">
            {[
              { icon: "online", color: "#10b981", title: "Live Presence", desc: "See who's online right now with real-time Slack presence syncing. Green means active, gray means away." },
              { icon: "location", color: "#3b82f6", title: "Set Your Location", desc: "Use the /wherewework slash command to set your city. Or let it auto-detect from your Slack profile." },
              { icon: "time", color: "#8b5cf6", title: "Time Overlap", desc: "Visualize working hour overlaps across your team. Instantly find the best meeting windows for everyone." },
              { icon: "team", color: "#f59e0b", title: "Team Filtering", desc: "Filter by department — Engineering, Marketing, Design, and more. See exactly where each team is distributed." },
              { icon: "click", color: "#ec4899", title: "Click to Connect", desc: "Click any team member on the globe to see their profile, status, local time, and message them directly in Slack." },
              { icon: "bolt", color: "#14b8a6", title: "Instant Setup", desc: "Install in one click. WhereWeWork automatically syncs your team's profiles, timezones, and presence from Slack." },
            ].map((f) => (
              <div key={f.title} className="p-6 bg-[#131d35] rounded-xl border border-[rgba(255,255,255,0.07)] hover:border-[rgba(99,179,255,0.25)] transition-colors">
                <div className="w-10 h-10 rounded-lg flex items-center justify-center mb-4" style={{ background: `${f.color}20` }}>
                  {f.icon === "online" && <div className="w-3 h-3 rounded-full" style={{ background: f.color, boxShadow: `0 0 6px ${f.color}` }} />}
                  {f.icon === "location" && (
                    <svg className="w-5 h-5" style={{ color: f.color }} fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" />
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 11a3 3 0 11-6 0 3 3 0 016 0z" />
                    </svg>
                  )}
                  {f.icon === "time" && (
                    <svg className="w-5 h-5" style={{ color: f.color }} fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
                    </svg>
                  )}
                  {f.icon === "team" && (
                    <svg className="w-5 h-5" style={{ color: f.color }} fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0z" />
                    </svg>
                  )}
                  {f.icon === "click" && (
                    <svg className="w-5 h-5" style={{ color: f.color }} fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 15l-2 5L9 9l11 4-5 2zm0 0l5 5M7.188 2.239l.777 2.897M5.136 7.965l-2.898-.777M13.95 4.05l-2.122 2.122m-5.657 5.656l-2.12 2.122" />
                    </svg>
                  )}
                  {f.icon === "bolt" && (
                    <svg className="w-5 h-5" style={{ color: f.color }} fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 10V3L4 14h7v7l9-11h-7z" />
                    </svg>
                  )}
                </div>
                <h3 className="text-base font-semibold mb-2 text-[#f0f4ff]">{f.title}</h3>
                <p className="text-[#8ea4c8] text-sm leading-relaxed">{f.desc}</p>
              </div>
            ))}
          </div>
        </div>

        {/* Pricing */}
        <div id="pricing" className="max-w-6xl mx-auto px-6 mb-20">
          <p className="text-center text-[10px] text-[#3b82f6] uppercase tracking-[0.2em] font-mono mb-4">Pricing</p>
          <h2 className="text-3xl font-bold text-center mb-4 tracking-tight">Simple, transparent pricing</h2>
          <p className="text-center text-[#8ea4c8] mb-12 max-w-xl mx-auto">Start free, upgrade when your team grows.</p>

          <div className="grid md:grid-cols-3 gap-5">
            {/* Free */}
            <div className="p-6 bg-[#131d35] rounded-xl border border-[rgba(255,255,255,0.07)] flex flex-col">
              <h3 className="text-lg font-semibold mb-1">Free</h3>
              <p className="text-sm text-[#8ea4c8] mb-4">For small teams getting started</p>
              <div className="mb-6">
                <span className="text-4xl font-bold">$0</span>
                <span className="text-[#4a6080] text-sm font-mono">/month</span>
              </div>
              <ul className="space-y-3 mb-8 flex-1">
                {["Up to 10 team members", "3D globe with live presence", "Timezone display", "Slack slash command", "Basic search"].map((f) => (
                  <li key={f} className="flex items-start gap-2 text-sm text-[#8ea4c8]">
                    <svg className="w-4 h-4 text-[#10b981] mt-0.5 flex-shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                    </svg>
                    {f}
                  </li>
                ))}
              </ul>
              <a
                href={slackInstallUrl}
                className="w-full text-center px-4 py-2.5 border border-[rgba(99,179,255,0.25)] rounded-lg text-sm font-semibold hover:bg-[rgba(59,130,246,0.08)] hover:border-[#3b82f6] transition-colors"
              >
                Get Started Free
              </a>
            </div>

            {/* Pro */}
            <div className="p-6 bg-[#131d35] rounded-xl border-2 border-[#3b82f6] flex flex-col relative">
              <div className="absolute -top-3 left-1/2 -translate-x-1/2 px-3 py-0.5 bg-[#3b82f6] rounded-full text-xs font-semibold">
                Most Popular
              </div>
              <h3 className="text-lg font-semibold mb-1">Pro</h3>
              <p className="text-sm text-[#8ea4c8] mb-4">For growing distributed teams</p>
              <div className="mb-6">
                <span className="text-4xl font-bold">$39</span>
                <span className="text-[#4a6080] text-sm font-mono">/mo per workspace</span>
              </div>
              <ul className="space-y-3 mb-8 flex-1">
                {["Unlimited team members", "Everything in Free", "Time overlap visualization", "Team & department filtering", "Click-to-DM in Slack", "Member status & profiles", "Priority email support"].map((f) => (
                  <li key={f} className="flex items-start gap-2 text-sm text-[#8ea4c8]">
                    <svg className="w-4 h-4 text-[#10b981] mt-0.5 flex-shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                    </svg>
                    {f}
                  </li>
                ))}
              </ul>
              <a
                href={slackInstallUrl}
                className="w-full text-center px-4 py-2.5 bg-[#3b82f6] hover:bg-[#60a5fa] rounded-lg text-sm font-semibold transition-colors btn-brand"
              >
                Start Pro Trial
              </a>
            </div>

            {/* Enterprise */}
            <div className="p-6 bg-[#131d35] rounded-xl border border-[rgba(255,255,255,0.07)] flex flex-col">
              <h3 className="text-lg font-semibold mb-1">Enterprise</h3>
              <p className="text-sm text-[#8ea4c8] mb-4">For large organizations</p>
              <div className="mb-6">
                <span className="text-4xl font-bold">$149</span>
                <span className="text-[#4a6080] text-sm font-mono">/mo per workspace</span>
              </div>
              <ul className="space-y-3 mb-8 flex-1">
                {["Everything in Pro", "SSO / SAML authentication", "Multi-workspace support", "Custom branding", "Admin dashboard", "Audit logs", "Dedicated support & SLA"].map((f) => (
                  <li key={f} className="flex items-start gap-2 text-sm text-[#8ea4c8]">
                    <svg className="w-4 h-4 text-[#10b981] mt-0.5 flex-shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                    </svg>
                    {f}
                  </li>
                ))}
              </ul>
              <a
                href="mailto:hello@wherewework.io"
                className="w-full text-center px-4 py-2.5 border border-[rgba(99,179,255,0.25)] rounded-lg text-sm font-semibold hover:bg-[rgba(59,130,246,0.08)] hover:border-[#3b82f6] transition-colors"
              >
                Contact Sales
              </a>
            </div>
          </div>
        </div>

        {/* FAQ */}
        <div id="faq" className="max-w-3xl mx-auto px-6 mb-20">
          <p className="text-center text-[10px] text-[#3b82f6] uppercase tracking-[0.2em] font-mono mb-4">FAQ</p>
          <h2 className="text-3xl font-bold text-center mb-4 tracking-tight">Frequently asked questions</h2>
          <p className="text-center text-[#8ea4c8] mb-10">Everything you need to know about WhereWeWork.</p>

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
          <div className="bg-gradient-to-br from-[rgba(59,130,246,0.15)] to-[rgba(20,184,166,0.1)] border border-[rgba(99,179,255,0.25)] rounded-2xl p-12 text-center">
            <h2 className="text-3xl font-bold mb-4 tracking-tight">Ready to see your team on the globe?</h2>
            <p className="text-[#8ea4c8] mb-8 max-w-lg mx-auto">
              Install WhereWeWork in under a minute. No credit card required for the free plan.
            </p>
            <a
              href={slackInstallUrl}
              className="inline-flex items-center gap-3 px-8 py-3 bg-[#3b82f6] text-white rounded-xl font-semibold hover:bg-[#60a5fa] transition-colors btn-brand"
            >
              <svg className="w-5 h-5" viewBox="0 0 24 24" fill="currentColor">
                <path d="M5.042 15.165a2.528 2.528 0 0 1-2.52 2.523A2.528 2.528 0 0 1 0 15.165a2.527 2.527 0 0 1 2.522-2.52h2.52v2.52zM6.313 15.165a2.527 2.527 0 0 1 2.521-2.52 2.527 2.527 0 0 1 2.521 2.52v6.313A2.528 2.528 0 0 1 8.834 24a2.528 2.528 0 0 1-2.521-2.522v-6.313z" />
              </svg>
              Add to Slack — It&apos;s Free
            </a>
          </div>
        </div>

        {/* Footer */}
        <footer className="border-t border-[rgba(255,255,255,0.07)] py-8">
          <div className="max-w-6xl mx-auto px-6 flex flex-col sm:flex-row items-center justify-between gap-4">
            <div className="flex items-center gap-2">
              <div className="w-2.5 h-2.5 rounded-full bg-[#3b82f6]" style={{ boxShadow: "0 0 10px rgba(59,130,246,0.7)" }} />
              <span className="text-sm text-[#8ea4c8] font-semibold">WhereWeWork</span>
            </div>
            <p className="text-sm text-[#4a6080] font-mono">&copy; {new Date().getFullYear()} WhereWeWork. All rights reserved.</p>
          </div>
        </footer>
      </main>
    </div>
  );
}
