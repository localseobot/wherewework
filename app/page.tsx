import Link from "next/link";
import Image from "next/image";

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
  const slackClientId = process.env.SLACK_CLIENT_ID;
  const slackScopes = "commands,users:read,users:read.email,users.profile:read,team:read,chat:write";
  const appUrl = process.env.NEXT_PUBLIC_APP_URL || "https://wherewework-beryl.vercel.app";
  const slackInstallUrl = `https://slack.com/oauth/v2/authorize?client_id=${slackClientId}&scope=${slackScopes}&redirect_uri=${encodeURIComponent(`${appUrl}/api/slack/oauth`)}`;

  return (
    <div className="min-h-screen bg-[#080d1a] text-[#f0f4ff] relative">
      {/* Starfield background */}
      <div className="starfield" />

      {/* Nav */}
      <nav className="border-b border-[rgba(255,255,255,0.07)] sticky top-0 z-50 bg-[#080d1a]/80 backdrop-blur-lg">
        <div className="max-w-6xl mx-auto px-6 py-4 flex items-center justify-between">
          <div className="flex items-center gap-2.5">
            <Image src="/logo.svg" alt="WhereWeWork" width={32} height={32} className="rounded-lg" />
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
            world. See who&apos;s online, find meeting times across time zones, and stay connected.
          </p>

          <div className="flex flex-col sm:flex-row items-center justify-center gap-4 mb-16">
            <a
              href={slackInstallUrl}
              className="flex items-center gap-3 px-6 py-3 bg-white text-[#1a1a1a] rounded-xl font-semibold hover:bg-gray-100 transition-colors shadow-lg"
            >
              <svg className="w-5 h-5" viewBox="0 0 127 127" fill="none" xmlns="http://www.w3.org/2000/svg">
                <path d="M27.2 80c0 7.3-5.9 13.2-13.2 13.2S.8 87.3.8 80s5.9-13.2 13.2-13.2h13.2V80zm6.6 0c0-7.3 5.9-13.2 13.2-13.2s13.2 5.9 13.2 13.2v33c0 7.3-5.9 13.2-13.2 13.2s-13.2-5.9-13.2-13.2V80z" fill="#E01E5A"/>
                <path d="M47 27c-7.3 0-13.2-5.9-13.2-13.2S39.7.6 47 .6s13.2 5.9 13.2 13.2V27H47zm0 6.7c7.3 0 13.2 5.9 13.2 13.2s-5.9 13.2-13.2 13.2H14c-7.3 0-13.2-5.9-13.2-13.2S6.7 33.7 14 33.7h33z" fill="#36C5F0"/>
                <path d="M99.9 46.9c0-7.3 5.9-13.2 13.2-13.2s13.2 5.9 13.2 13.2-5.9 13.2-13.2 13.2H99.9V46.9zm-6.6 0c0 7.3-5.9 13.2-13.2 13.2s-13.2-5.9-13.2-13.2v-33c0-7.3 5.9-13.2 13.2-13.2s13.2 5.9 13.2 13.2v33z" fill="#2EB67D"/>
                <path d="M80.1 99.8c7.3 0 13.2 5.9 13.2 13.2s-5.9 13.2-13.2 13.2-13.2-5.9-13.2-13.2V99.8h13.2zm0-6.6c-7.3 0-13.2-5.9-13.2-13.2s5.9-13.2 13.2-13.2h33c7.3 0 13.2 5.9 13.2 13.2s-5.9 13.2-13.2 13.2h-33z" fill="#ECB22E"/>
              </svg>
              Add to Slack
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
              <span className="ml-2 text-xs text-[#4a6080] font-mono">wherewework-beryl.vercel.app/globe</span>
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

        {/* How it works */}
        <div className="max-w-6xl mx-auto px-6 mb-20">
          <p className="text-center text-[10px] text-[#3b82f6] uppercase tracking-[0.2em] font-mono mb-4">How it works</p>
          <h2 className="text-3xl font-bold text-center mb-12 tracking-tight">Up and running in 3 steps</h2>

          <div className="grid md:grid-cols-3 gap-8">
            {[
              { step: "1", title: "Install to Slack", desc: "One click to add WhereWeWork to your workspace. No config needed." },
              { step: "2", title: "Set your location", desc: "Type /wherewework set London, UK and you're on the globe." },
              { step: "3", title: "Find meeting times", desc: "Type /wherewework meet @Alex @Sarah and get the best time slots instantly." },
            ].map((s) => (
              <div key={s.step} className="text-center">
                <div className="w-12 h-12 rounded-full bg-[rgba(59,130,246,0.15)] border border-[rgba(59,130,246,0.3)] flex items-center justify-center text-[#3b82f6] font-bold text-lg mx-auto mb-4">
                  {s.step}
                </div>
                <h3 className="text-base font-semibold mb-2">{s.title}</h3>
                <p className="text-sm text-[#8ea4c8]">{s.desc}</p>
              </div>
            ))}
          </div>
        </div>

        {/* Slash command showcase */}
        <div className="max-w-4xl mx-auto px-6 mb-20">
          <div className="bg-[#0e1628] rounded-2xl border border-[rgba(255,255,255,0.07)] overflow-hidden">
            <div className="flex items-center gap-1.5 px-4 py-2.5 border-b border-[rgba(255,255,255,0.07)]">
              <div className="w-2.5 h-2.5 rounded-full bg-[#f43f5e]/60" />
              <div className="w-2.5 h-2.5 rounded-full bg-[#f59e0b]/60" />
              <div className="w-2.5 h-2.5 rounded-full bg-[#10b981]/60" />
              <span className="ml-2 text-xs text-[#4a6080] font-mono">#general</span>
            </div>
            <div className="p-6 space-y-4">
              {/* Command input */}
              <div className="flex items-start gap-3">
                <div className="w-8 h-8 rounded bg-[#131d35] flex items-center justify-center text-xs font-bold text-[#8ea4c8] flex-shrink-0">You</div>
                <div>
                  <p className="text-sm text-[#8ea4c8] mb-1 font-mono">/wherewework meet @Alex @Sarah Apr 16-18</p>
                </div>
              </div>
              {/* Bot response */}
              <div className="flex items-start gap-3">
                <div className="w-8 h-8 rounded flex-shrink-0 overflow-hidden">
                  <Image src="/logo.svg" alt="WhereWeWork" width={32} height={32} />
                </div>
                <div className="bg-[#131d35] rounded-lg p-4 border border-[rgba(255,255,255,0.07)] flex-1">
                  <p className="text-sm font-semibold text-[#f0f4ff] mb-2">Best meeting times - Wed Apr 16 — Fri Apr 18</p>
                  <div className="space-y-1.5 text-sm">
                    <p className="text-[#8ea4c8]"><span className="text-[#10b981]">You:</span> America/Edmonton &nbsp; <span className="text-[#10b981]">Alex:</span> Europe/London &nbsp; <span className="text-[#10b981]">Sarah:</span> Asia/Tokyo</p>
                    <div className="border-t border-[rgba(255,255,255,0.07)] my-2" />
                    <p className="text-[#8ea4c8]"><span className="inline-block w-2 h-2 rounded-full bg-[#10b981] mr-1.5" />Ideal &nbsp; You: <span className="text-[#f0f4ff] font-semibold">8:00 AM</span> &nbsp; Alex: <span className="text-[#f0f4ff] font-semibold">3:00 PM</span> &nbsp; Sarah: <span className="text-[#f0f4ff] font-semibold">11:00 PM</span></p>
                    <p className="text-[#8ea4c8]"><span className="inline-block w-2 h-2 rounded-full bg-[#3b82f6] mr-1.5" />Good &nbsp; You: <span className="text-[#f0f4ff] font-semibold">9:00 AM</span> &nbsp; Alex: <span className="text-[#f0f4ff] font-semibold">4:00 PM</span> &nbsp; Sarah: <span className="text-[#f0f4ff] font-semibold">12:00 AM</span></p>
                  </div>
                  <div className="mt-3 flex gap-2">
                    <span className="inline-flex items-center gap-1 px-3 py-1 bg-[rgba(59,130,246,0.15)] border border-[rgba(59,130,246,0.3)] rounded text-xs text-[#60a5fa] font-semibold">Add to Calendar</span>
                  </div>
                </div>
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
              { icon: "location", color: "#3b82f6", title: "Set Your Location", desc: "Use /wherewework set to pin your city on the globe. Or let it auto-detect from your Slack timezone." },
              { icon: "meet", color: "#14b8a6", title: "Meeting Finder", desc: "Type /wherewework meet @Alex @Sarah to find the best overlapping times. Pick a date or range, then add to Google Calendar." },
              { icon: "time", color: "#8b5cf6", title: "Time Overlap", desc: "Visualize working hour overlaps across your team. Instantly find the best meeting windows for everyone." },
              { icon: "team", color: "#f59e0b", title: "Team Filtering", desc: "Filter by department — Engineering, Marketing, Design, and more. See exactly where each team is distributed." },
              { icon: "click", color: "#ec4899", title: "Click to Connect", desc: "Click any team member on the globe to see their profile, status, local time, and DM them directly in Slack." },
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
                  {f.icon === "meet" && (
                    <svg className="w-5 h-5" style={{ color: f.color }} fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
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
                {["Up to 10 team members", "3D globe with live presence", "Timezone display", "Slack slash command", "Meeting finder"].map((f) => (
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
                {["Unlimited team members", "Everything in Free", "Google Calendar integration", "Time overlap visualization", "Team & department filtering", "Click-to-DM in Slack", "Priority email support"].map((f) => (
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
              q="How does the meeting finder work?"
              a="Type /wherewework meet @Alex @Sarah in any Slack channel. You can add a date like 'Apr 16' or a range like 'Apr 16-18' or just say 'next week'. WhereWeWork checks each person's timezone and finds the best overlapping working hours. Each suggested time slot has an 'Add to Calendar' button that opens Google Calendar with the event pre-filled — participants, title, and time — so you can edit and send invites from there."
            />
            <FAQItem
              q="Is my location data private?"
              a="Yes. Location data is only visible to members of your own Slack workspace. We never share location data across workspaces or with third parties. Members can update or remove their location at any time."
            />
            <FAQItem
              q="Does it work with Slack's free plan?"
              a="Absolutely! WhereWeWork works with all Slack plans — Free, Pro, Business+, and Enterprise Grid. The only requirement is that a workspace admin installs the app."
            />
            <FAQItem
              q="How many team members can I have on the globe?"
              a="The Free plan supports up to 10 team members. The Pro plan ($39/mo) supports unlimited members — the globe remains smooth and responsive even with large teams."
            />
            <FAQItem
              q="What Slack permissions does WhereWeWork need?"
              a="We request the minimum permissions needed: read your team list and profiles (to show names, avatars, and timezones on the globe), the slash command, and the ability to post meeting time results. We never read your messages or access private channels."
            />
          </div>
        </div>

        {/* CTA */}
        <div className="max-w-6xl mx-auto px-6 mb-20">
          <div className="bg-gradient-to-br from-[rgba(59,130,246,0.15)] to-[rgba(20,184,166,0.1)] border border-[rgba(99,179,255,0.25)] rounded-2xl p-12 text-center">
            <h2 className="text-3xl font-bold mb-4 tracking-tight">Ready to see your team on the globe?</h2>
            <p className="text-[#8ea4c8] mb-8 max-w-lg mx-auto">
              Install WhereWeWork in under a minute. No credit card required.
            </p>
            <a
              href={slackInstallUrl}
              className="inline-flex items-center gap-3 px-8 py-3 bg-white text-[#1a1a1a] rounded-xl font-semibold hover:bg-gray-100 transition-colors shadow-lg"
            >
              <svg className="w-5 h-5" viewBox="0 0 127 127" fill="none" xmlns="http://www.w3.org/2000/svg">
                <path d="M27.2 80c0 7.3-5.9 13.2-13.2 13.2S.8 87.3.8 80s5.9-13.2 13.2-13.2h13.2V80zm6.6 0c0-7.3 5.9-13.2 13.2-13.2s13.2 5.9 13.2 13.2v33c0 7.3-5.9 13.2-13.2 13.2s-13.2-5.9-13.2-13.2V80z" fill="#E01E5A"/>
                <path d="M47 27c-7.3 0-13.2-5.9-13.2-13.2S39.7.6 47 .6s13.2 5.9 13.2 13.2V27H47zm0 6.7c7.3 0 13.2 5.9 13.2 13.2s-5.9 13.2-13.2 13.2H14c-7.3 0-13.2-5.9-13.2-13.2S6.7 33.7 14 33.7h33z" fill="#36C5F0"/>
                <path d="M99.9 46.9c0-7.3 5.9-13.2 13.2-13.2s13.2 5.9 13.2 13.2-5.9 13.2-13.2 13.2H99.9V46.9zm-6.6 0c0 7.3-5.9 13.2-13.2 13.2s-13.2-5.9-13.2-13.2v-33c0-7.3 5.9-13.2 13.2-13.2s13.2 5.9 13.2 13.2v33z" fill="#2EB67D"/>
                <path d="M80.1 99.8c7.3 0 13.2 5.9 13.2 13.2s-5.9 13.2-13.2 13.2-13.2-5.9-13.2-13.2V99.8h13.2zm0-6.6c-7.3 0-13.2-5.9-13.2-13.2s5.9-13.2 13.2-13.2h33c7.3 0 13.2 5.9 13.2 13.2s-5.9 13.2-13.2 13.2h-33z" fill="#ECB22E"/>
              </svg>
              Add to Slack — It&apos;s Free
            </a>
          </div>
        </div>

        {/* Footer */}
        <footer className="border-t border-[rgba(255,255,255,0.07)] py-10">
          <div className="max-w-6xl mx-auto px-6">
            <div className="flex flex-col md:flex-row items-start justify-between gap-8 mb-8">
              <div className="flex items-center gap-2">
                <Image src="/logo.svg" alt="WhereWeWork" width={24} height={24} className="rounded" />
                <span className="text-sm text-[#f0f4ff] font-semibold">WhereWeWork</span>
              </div>
              <div className="flex flex-wrap gap-x-8 gap-y-3 text-sm">
                <Link href="/privacy" className="text-[#4a6080] hover:text-[#8ea4c8] transition-colors">Privacy Policy</Link>
                <Link href="/terms" className="text-[#4a6080] hover:text-[#8ea4c8] transition-colors">Terms of Service</Link>
                <Link href="/support" className="text-[#4a6080] hover:text-[#8ea4c8] transition-colors">Support</Link>
                <a href="mailto:support@wherewework.io" className="text-[#4a6080] hover:text-[#8ea4c8] transition-colors">support@wherewework.io</a>
              </div>
            </div>
            <div className="border-t border-[rgba(255,255,255,0.05)] pt-6 flex flex-col sm:flex-row items-center justify-between gap-3">
              <p className="text-xs text-[#4a6080] font-mono">&copy; {new Date().getFullYear()} WhereWeWork. All rights reserved.</p>
              <p className="text-xs text-[#4a6080]">Made for distributed teams everywhere.</p>
            </div>
          </div>
        </footer>
      </main>
    </div>
  );
}
