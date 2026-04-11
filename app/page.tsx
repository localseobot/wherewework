import Link from "next/link";

export default function Home() {
  const appUrl = process.env.NEXT_PUBLIC_APP_URL || "http://localhost:3000";
  const slackClientId = process.env.SLACK_CLIENT_ID || "YOUR_CLIENT_ID";
  const slackScopes = "commands,users:read,users.profile:read,team:read";
  const slackInstallUrl = `https://slack.com/oauth/v2/authorize?client_id=${slackClientId}&scope=${slackScopes}&redirect_uri=${encodeURIComponent(
    `${appUrl}/api/slack/oauth`
  )}`;

  return (
    <div className="min-h-screen bg-slate-950 text-white">
      {/* Nav */}
      <nav className="border-b border-slate-800">
        <div className="max-w-6xl mx-auto px-6 py-4 flex items-center justify-between">
          <div className="flex items-center gap-2">
            <div className="w-8 h-8 bg-blue-600 rounded-lg flex items-center justify-center">
              <svg
                className="w-5 h-5 text-white"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M3.055 11H5a2 2 0 012 2v1a2 2 0 002 2 2 2 0 012 2v2.945M8 3.935V5.5A2.5 2.5 0 0010.5 8h.5a2 2 0 012 2 2 2 0 104 0 2 2 0 012-2h1.064M15 20.488V18a2 2 0 012-2h3.064M21 12a9 9 0 11-18 0 9 9 0 0118 0z"
                />
              </svg>
            </div>
            <span className="text-lg font-bold">WhereWeWork</span>
          </div>
          <div className="flex items-center gap-4">
            <Link
              href="/globe"
              className="text-sm text-slate-400 hover:text-white transition-colors"
            >
              Demo
            </Link>
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
      <main className="max-w-6xl mx-auto px-6">
        <div className="pt-24 pb-16 text-center">
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
            world. See who&apos;s online, their local time, and where they&apos;re working
            from.
          </p>

          <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
            <a
              href={slackInstallUrl}
              className="flex items-center gap-3 px-6 py-3 bg-white text-slate-900 rounded-xl font-semibold hover:bg-slate-100 transition-colors shadow-lg shadow-white/10"
            >
              <svg className="w-5 h-5" viewBox="0 0 24 24" fill="currentColor">
                <path d="M5.042 15.165a2.528 2.528 0 0 1-2.52 2.523A2.528 2.528 0 0 1 0 15.165a2.527 2.527 0 0 1 2.522-2.52h2.52v2.52zM6.313 15.165a2.527 2.527 0 0 1 2.521-2.52 2.527 2.527 0 0 1 2.521 2.52v6.313A2.528 2.528 0 0 1 8.834 24a2.528 2.528 0 0 1-2.521-2.522v-6.313zM8.834 5.042a2.528 2.528 0 0 1-2.521-2.52A2.528 2.528 0 0 1 8.834 0a2.528 2.528 0 0 1 2.521 2.522v2.52H8.834zM8.834 6.313a2.528 2.528 0 0 1 2.521 2.521 2.528 2.528 0 0 1-2.521 2.521H2.522A2.528 2.528 0 0 1 0 8.834a2.528 2.528 0 0 1 2.522-2.521h6.312zM18.956 8.834a2.528 2.528 0 0 1 2.522-2.521A2.528 2.528 0 0 1 24 8.834a2.528 2.528 0 0 1-2.522 2.521h-2.522V8.834zM17.688 8.834a2.528 2.528 0 0 1-2.523 2.521 2.527 2.527 0 0 1-2.52-2.521V2.522A2.527 2.527 0 0 1 15.165 0a2.528 2.528 0 0 1 2.523 2.522v6.312zM15.165 18.956a2.528 2.528 0 0 1 2.523 2.522A2.528 2.528 0 0 1 15.165 24a2.527 2.527 0 0 1-2.52-2.522v-2.522h2.52zM15.165 17.688a2.527 2.527 0 0 1-2.52-2.523 2.526 2.526 0 0 1 2.52-2.52h6.313A2.527 2.527 0 0 1 24 15.165a2.528 2.528 0 0 1-2.522 2.523h-6.313z" />
              </svg>
              Add to Slack
            </a>
            <Link
              href="/globe"
              className="px-6 py-3 border border-slate-700 rounded-xl font-semibold text-slate-300 hover:bg-slate-800 transition-colors"
            >
              View Demo Globe
            </Link>
          </div>
        </div>

        {/* Features */}
        <div className="grid md:grid-cols-3 gap-8 py-16 border-t border-slate-800">
          <div className="p-6 bg-slate-900 rounded-2xl border border-slate-800">
            <div className="w-10 h-10 bg-green-600/20 rounded-lg flex items-center justify-center mb-4">
              <div className="w-3 h-3 rounded-full bg-green-500" />
            </div>
            <h3 className="text-lg font-semibold mb-2">Live Presence</h3>
            <p className="text-slate-400 text-sm">
              See who&apos;s online right now with real-time Slack presence syncing.
              Green means active, gray means away.
            </p>
          </div>

          <div className="p-6 bg-slate-900 rounded-2xl border border-slate-800">
            <div className="w-10 h-10 bg-blue-600/20 rounded-lg flex items-center justify-center mb-4">
              <svg
                className="w-5 h-5 text-blue-400"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z"
                />
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M15 11a3 3 0 11-6 0 3 3 0 016 0z"
                />
              </svg>
            </div>
            <h3 className="text-lg font-semibold mb-2">Set Your Location</h3>
            <p className="text-slate-400 text-sm">
              Use the <code className="text-blue-400">/wherewework</code> slash
              command to set your city. Or let it auto-detect from your Slack
              profile.
            </p>
          </div>

          <div className="p-6 bg-slate-900 rounded-2xl border border-slate-800">
            <div className="w-10 h-10 bg-purple-600/20 rounded-lg flex items-center justify-center mb-4">
              <svg
                className="w-5 h-5 text-purple-400"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z"
                />
              </svg>
            </div>
            <h3 className="text-lg font-semibold mb-2">Time Zones</h3>
            <p className="text-slate-400 text-sm">
              Instantly see each team member&apos;s local time. Perfect for
              scheduling across time zones.
            </p>
          </div>
        </div>

        {/* Footer */}
        <footer className="border-t border-slate-800 py-8 text-center text-sm text-slate-500">
          <p>WhereWeWork &mdash; See your team on a globe</p>
        </footer>
      </main>
    </div>
  );
}
