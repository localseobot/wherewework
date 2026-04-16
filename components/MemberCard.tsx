"use client";

import { useEffect, useState } from "react";
import type { DemoMember } from "@/lib/demo-data";

interface MemberCardProps {
  member: DemoMember;
  isDemo: boolean;
  onClose: () => void;
}

const teamTagColors: Record<string, string> = {
  Engineering: "bg-[rgba(59,130,246,0.18)] text-[#93c5fd]",
  Design: "bg-[rgba(139,92,246,0.18)] text-[#c4b5fd]",
  Marketing: "bg-[rgba(236,72,153,0.18)] text-[#f9a8d4]",
  Product: "bg-[rgba(249,115,22,0.18)] text-[#fdba74]",
  Sales: "bg-[rgba(20,184,166,0.18)] text-[#5eead4]",
  Operations: "bg-[rgba(100,116,139,0.18)] text-[#94a3b8]",
};

function LiveTime({ timezone }: { timezone: string }) {
  const [time, setTime] = useState("");

  useEffect(() => {
    const update = () => {
      try {
        setTime(
          new Date().toLocaleTimeString("en-US", {
            timeZone: timezone,
            hour: "numeric",
            minute: "2-digit",
            second: "2-digit",
            hour12: true,
          })
        );
      } catch {
        setTime("");
      }
    };
    update();
    const interval = setInterval(update, 1000);
    return () => clearInterval(interval);
  }, [timezone]);

  return <span className="text-[#14b8a6] font-mono">{time}</span>;
}

const statusIcons: Record<string, string> = {
  "In a meeting": "📅",
  "Available": "✅",
  "Focus mode": "🎯",
  "On PTO": "🏖️",
  "Away": "💤",
  "Offline": "⚫",
  "In a huddle": "🎧",
  "Do not disturb": "🔴",
  "Commuting": "🚗",
  "On a call": "📞",
};

export default function MemberCard({ member, isDemo, onClose }: MemberCardProps) {
  return (
    <div className="absolute bottom-6 left-1/2 -translate-x-1/2 z-20 bg-[#0e1628]/95 backdrop-blur-lg border border-[rgba(99,179,255,0.25)] rounded-xl p-5 shadow-2xl w-[340px]">
      <button
        onClick={onClose}
        className="absolute top-3 right-3 p-1 hover:bg-[rgba(255,255,255,0.06)] rounded-lg transition-colors"
      >
        <svg className="w-4 h-4 text-[#4a6080]" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
        </svg>
      </button>

      <div className="flex items-start gap-4">
        <div className="relative flex-shrink-0">
          <img
            src={member.avatarUrl || "/default-avatar.svg"}
            alt={member.displayName}
            className="w-14 h-14 rounded-full border-2 object-cover"
            style={{ borderColor: member.isOnline ? "#10b981" : "#64748b" }}
          />
          <div
            className="absolute bottom-0 right-0 w-4 h-4 rounded-full border-2 border-[#0e1628]"
            style={{
              background: member.isOnline ? "#10b981" : "#64748b",
              boxShadow: member.isOnline ? "0 0 6px #10b981" : "none",
            }}
          />
        </div>
        <div className="flex-1 min-w-0">
          <h3 className="text-[#f0f4ff] font-semibold text-base">{member.displayName}</h3>
          <p className="text-[11px] text-[#8ea4c8] font-mono">{member.locationName}</p>
          {member.team && (
            <span className={`inline-block mt-1 text-[10px] px-2 py-0.5 rounded font-semibold ${teamTagColors[member.team] || "bg-[rgba(100,116,139,0.18)] text-[#94a3b8]"}`}>
              {member.team}
            </span>
          )}
        </div>
      </div>

      <div className="mt-4 space-y-2.5">
        {/* Status */}
        <div className="flex items-center gap-2 text-sm">
          <span>{statusIcons[member.status] || "💬"}</span>
          <span className="text-[#8ea4c8]">{member.status}</span>
        </div>

        {/* Local time */}
        {member.timezone && (
          <div className="flex items-center gap-2 text-sm">
            <span>🕐</span>
            <span className="text-[#8ea4c8]">
              Local time: <LiveTime timezone={member.timezone} />
            </span>
          </div>
        )}

        {/* Timezone */}
        {member.timezone && (
          <div className="flex items-center gap-2 text-sm">
            <span>🌍</span>
            <span className="text-[#4a6080] text-xs font-mono">
              {member.timezone.replace(/_/g, " ")}
            </span>
          </div>
        )}
      </div>

      {/* Message button */}
      <button
        onClick={() => {
          if (!isDemo && member.slackUserId) {
            const teamParam = (member as { slackTeamId?: string }).slackTeamId || "";
            window.open(`https://slack.com/app_redirect?channel=${member.slackUserId}${teamParam ? `&team=${teamParam}` : ""}`, "_blank");
          }
        }}
        disabled={isDemo}
        title={isDemo ? "Connect your Slack workspace to message team members" : `Message ${member.displayName} in Slack`}
        className={`mt-4 w-full flex items-center justify-center gap-2 px-4 py-2.5 rounded-md text-sm font-semibold transition-all ${
          isDemo
            ? "bg-[#3b82f6]/40 text-white/50 cursor-not-allowed"
            : "bg-[#3b82f6] hover:bg-[#60a5fa] text-white btn-brand"
        }`}
      >
        <svg className="w-4 h-4" viewBox="0 0 24 24" fill="currentColor">
          <path d="M5.042 15.165a2.528 2.528 0 0 1-2.52 2.523A2.528 2.528 0 0 1 0 15.165a2.527 2.527 0 0 1 2.522-2.52h2.52v2.52zM6.313 15.165a2.527 2.527 0 0 1 2.521-2.52 2.527 2.527 0 0 1 2.521 2.52v6.313A2.528 2.528 0 0 1 8.834 24a2.528 2.528 0 0 1-2.521-2.522v-6.313z" />
        </svg>
        Message in Slack
      </button>
    </div>
  );
}
