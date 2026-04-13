"use client";

import { useState } from "react";
import type { DemoMember } from "@/lib/demo-data";

interface MeetingFinderProps {
  members: DemoMember[];
  onClose: () => void;
}

interface TimeSlot {
  start: string;
  end: string;
  score: number;
}

interface FindResult {
  date: string;
  durationMinutes: number;
  participants: number;
  calendarConnected: number;
  slots: TimeSlot[];
}

export default function MeetingFinder({ members, onClose }: MeetingFinderProps) {
  const [selectedMembers, setSelectedMembers] = useState<Set<number>>(new Set());
  const [date, setDate] = useState(() => {
    const tomorrow = new Date();
    tomorrow.setDate(tomorrow.getDate() + 1);
    return tomorrow.toISOString().split("T")[0];
  });
  const [duration, setDuration] = useState(30);
  const [loading, setLoading] = useState(false);
  const [result, setResult] = useState<FindResult | null>(null);
  const [error, setError] = useState("");

  const toggleMember = (id: number) => {
    setSelectedMembers((prev) => {
      const next = new Set(prev);
      if (next.has(id)) next.delete(id);
      else next.add(id);
      return next;
    });
  };

  const selectAll = () => {
    setSelectedMembers(new Set(members.map((m) => m.id)));
  };

  const findMeetingTimes = async () => {
    if (selectedMembers.size < 2) {
      setError("Select at least 2 members");
      return;
    }
    setLoading(true);
    setError("");
    setResult(null);

    const slackUserIds = members
      .filter((m) => selectedMembers.has(m.id))
      .map((m) => m.slackUserId)
      .filter(Boolean);

    try {
      const res = await fetch("/api/meetings/find", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          slackUserIds,
          date,
          durationMinutes: duration,
        }),
      });
      if (!res.ok) throw new Error("Failed to find meeting times");
      const data = await res.json();
      setResult(data);
    } catch {
      setError("Failed to find meeting times. Try again.");
    } finally {
      setLoading(false);
    }
  };

  const formatTime = (iso: string) => {
    const d = new Date(iso);
    return d.toLocaleTimeString("en-US", {
      hour: "numeric",
      minute: "2-digit",
      hour12: true,
      timeZone: "UTC",
    });
  };

  const formatLocalTime = (iso: string, timezone: string) => {
    try {
      const d = new Date(iso);
      return d.toLocaleTimeString("en-US", {
        hour: "numeric",
        minute: "2-digit",
        hour12: true,
        timeZone: timezone,
      });
    } catch {
      return "";
    }
  };

  const scoreLabel = (score: number, total: number) => {
    const ratio = score / (total * 2);
    if (ratio >= 0.8) return { text: "Ideal", color: "#10b981" };
    if (ratio >= 0.5) return { text: "Good", color: "#3b82f6" };
    return { text: "Possible", color: "#f59e0b" };
  };

  return (
    <div className="absolute inset-0 z-20 bg-[#080d1a]/90 backdrop-blur-sm flex items-center justify-center p-4">
      <div className="bg-[#0e1628] border border-[rgba(99,179,255,0.25)] rounded-xl w-full max-w-2xl max-h-[85vh] overflow-y-auto">
        {/* Header */}
        <div className="flex items-center justify-between p-5 border-b border-[rgba(255,255,255,0.07)]">
          <div>
            <h2 className="text-lg font-bold text-[#f0f4ff]">Find Meeting Time</h2>
            <p className="text-[11px] text-[#4a6080] font-mono mt-0.5">
              Select participants and find the best time for everyone
            </p>
          </div>
          <button
            onClick={onClose}
            className="p-2 hover:bg-[rgba(255,255,255,0.06)] rounded-lg transition-colors"
          >
            <svg className="w-5 h-5 text-[#4a6080]" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
            </svg>
          </button>
        </div>

        <div className="p-5 space-y-5">
          {/* Select participants */}
          <div>
            <div className="flex items-center justify-between mb-2">
              <label className="text-[10px] font-mono text-[#3b82f6] uppercase tracking-[0.12em]">
                Participants ({selectedMembers.size})
              </label>
              <button
                onClick={selectAll}
                className="text-[10px] font-mono text-[#8ea4c8] hover:text-[#f0f4ff] transition-colors"
              >
                Select all
              </button>
            </div>
            <div className="flex flex-wrap gap-2 max-h-32 overflow-y-auto">
              {members.map((m) => {
                const selected = selectedMembers.has(m.id);
                return (
                  <button
                    key={m.id}
                    onClick={() => toggleMember(m.id)}
                    className={`flex items-center gap-1.5 px-2.5 py-1.5 rounded-md text-xs font-medium transition-all ${
                      selected
                        ? "bg-[rgba(59,130,246,0.2)] text-[#60a5fa] border border-[rgba(59,130,246,0.3)]"
                        : "bg-[rgba(255,255,255,0.04)] text-[#4a6080] border border-[rgba(255,255,255,0.07)] hover:border-[rgba(99,179,255,0.25)]"
                    }`}
                  >
                    <img src={m.avatarUrl} alt="" className="w-4 h-4 rounded-full" />
                    {m.displayName}
                  </button>
                );
              })}
            </div>
          </div>

          {/* Date and duration */}
          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="text-[10px] font-mono text-[#3b82f6] uppercase tracking-[0.12em] block mb-2">
                Date
              </label>
              <input
                type="date"
                value={date}
                onChange={(e) => setDate(e.target.value)}
                className="w-full px-3 py-2 bg-[rgba(255,255,255,0.04)] border border-[rgba(255,255,255,0.07)] rounded-md text-sm text-[#f0f4ff] focus:outline-none focus:ring-2 focus:ring-[#3b82f6] focus:border-[#3b82f6]"
              />
            </div>
            <div>
              <label className="text-[10px] font-mono text-[#3b82f6] uppercase tracking-[0.12em] block mb-2">
                Duration
              </label>
              <select
                value={duration}
                onChange={(e) => setDuration(Number(e.target.value))}
                className="w-full px-3 py-2 bg-[rgba(255,255,255,0.04)] border border-[rgba(255,255,255,0.07)] rounded-md text-sm text-[#f0f4ff] focus:outline-none focus:ring-2 focus:ring-[#3b82f6] focus:border-[#3b82f6]"
              >
                <option value={15}>15 min</option>
                <option value={30}>30 min</option>
                <option value={45}>45 min</option>
                <option value={60}>1 hour</option>
                <option value={90}>1.5 hours</option>
              </select>
            </div>
          </div>

          {/* Find button */}
          <button
            onClick={findMeetingTimes}
            disabled={loading || selectedMembers.size < 2}
            className="w-full py-2.5 bg-[#3b82f6] hover:bg-[#60a5fa] disabled:opacity-40 disabled:hover:bg-[#3b82f6] text-white rounded-md text-sm font-semibold transition-all btn-brand"
          >
            {loading ? "Finding best times..." : "Find Meeting Times"}
          </button>

          {error && (
            <p className="text-sm text-[#f43f5e] text-center">{error}</p>
          )}

          {/* Results */}
          {result && (
            <div>
              <div className="flex items-center justify-between mb-3">
                <h3 className="text-sm font-semibold text-[#f0f4ff]">
                  Best times for {result.date}
                </h3>
                {result.calendarConnected > 0 && (
                  <span className="text-[10px] font-mono text-[#14b8a6] bg-[rgba(20,184,166,0.2)] px-2 py-0.5 rounded-full">
                    {result.calendarConnected} calendar{result.calendarConnected !== 1 ? "s" : ""} checked
                  </span>
                )}
              </div>

              {result.slots.length === 0 ? (
                <p className="text-sm text-[#4a6080] text-center py-4">
                  No overlapping working hours found. Try a different date.
                </p>
              ) : (
                <div className="space-y-2">
                  {result.slots.map((slot, i) => {
                    const label = scoreLabel(slot.score, selectedMembers.size);
                    const selectedMembersList = members.filter((m) =>
                      selectedMembers.has(m.id)
                    );
                    return (
                      <div
                        key={i}
                        className="flex items-center gap-3 p-3 bg-[#131d35] border border-[rgba(255,255,255,0.07)] rounded-lg hover:border-[rgba(99,179,255,0.25)] transition-colors"
                      >
                        <div className="flex-shrink-0 text-center min-w-[90px]">
                          <div className="text-sm font-semibold text-[#f0f4ff] font-mono">
                            {formatTime(slot.start)}
                          </div>
                          <div className="text-[10px] text-[#4a6080] font-mono">
                            UTC
                          </div>
                        </div>
                        <div className="flex-1">
                          <div className="flex flex-wrap gap-1">
                            {selectedMembersList.map((m) => (
                              <span
                                key={m.id}
                                className="text-[10px] text-[#8ea4c8] font-mono"
                                title={`${m.displayName}: ${formatLocalTime(slot.start, m.timezone)}`}
                              >
                                {m.displayName.split(" ")[0]} {formatLocalTime(slot.start, m.timezone)}
                              </span>
                            )).reduce((prev: React.ReactNode[], curr, i) => {
                              if (i > 0) prev.push(<span key={`sep-${i}`} className="text-[#4a6080]">·</span>);
                              prev.push(curr);
                              return prev;
                            }, [])}
                          </div>
                        </div>
                        <span
                          className="text-[10px] font-mono font-semibold px-2 py-0.5 rounded"
                          style={{ color: label.color, background: `${label.color}20` }}
                        >
                          {label.text}
                        </span>
                      </div>
                    );
                  })}
                </div>
              )}

              {result.calendarConnected === 0 && (
                <div className="mt-3 p-3 bg-[rgba(245,158,11,0.1)] border border-[rgba(245,158,11,0.2)] rounded-lg">
                  <p className="text-xs text-[#f59e0b]">
                    No calendars connected — results are based on timezone working hours only.
                    Connect your Google Calendar for more accurate availability.
                  </p>
                  <a
                    href="/api/auth/google"
                    className="inline-block mt-2 text-xs font-semibold text-[#f59e0b] underline hover:text-[#fbbf24]"
                  >
                    Connect Google Calendar
                  </a>
                </div>
              )}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
