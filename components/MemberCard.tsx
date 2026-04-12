"use client";

import { useEffect, useState } from "react";
import type { DemoMember } from "@/lib/demo-data";

interface MemberCardProps {
  member: DemoMember;
  isDemo: boolean;
  onClose: () => void;
}

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

  return <span>{time}</span>;
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
    <div className="absolute bottom-6 left-1/2 -translate-x-1/2 z-20 bg-slate-800/95 backdrop-blur-lg border border-slate-700 rounded-2xl p-5 shadow-2xl w-[340px]">
      <button
        onClick={onClose}
        className="absolute top-3 right-3 p-1 hover:bg-slate-700 rounded-lg transition-colors"
      >
        <svg className="w-4 h-4 text-slate-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
        </svg>
      </button>

      <div className="flex items-start gap-4">
        <div className="relative flex-shrink-0">
          <img
            src={member.avatarUrl || "/default-avatar.png"}
            alt={member.displayName}
            className="w-14 h-14 rounded-full border-2 object-cover"
            style={{ borderColor: member.isOnline ? "#22c55e" : "#6b7280" }}
          />
          <div
            className="absolute bottom-0 right-0 w-4 h-4 rounded-full border-2 border-slate-800"
            style={{ background: member.isOnline ? "#22c55e" : "#6b7280" }}
          />
        </div>
        <div className="flex-1 min-w-0">
          <h3 className="text-white font-semibold text-base">{member.displayName}</h3>
          <p className="text-sm text-slate-400">{member.locationName}</p>
          {member.team && (
            <span className="inline-block mt-1 text-xs bg-slate-700 text-slate-300 px-2 py-0.5 rounded-full">
              {member.team}
            </span>
          )}
        </div>
      </div>

      <div className="mt-4 space-y-2.5">
        {/* Status */}
        <div className="flex items-center gap-2 text-sm">
          <span>{statusIcons[member.status] || "💬"}</span>
          <span className="text-slate-300">{member.status}</span>
        </div>

        {/* Local time */}
        {member.timezone && (
          <div className="flex items-center gap-2 text-sm">
            <span>🕐</span>
            <span className="text-slate-300">
              Local time: <LiveTime timezone={member.timezone} />
            </span>
          </div>
        )}

        {/* Timezone */}
        {member.timezone && (
          <div className="flex items-center gap-2 text-sm">
            <span>🌍</span>
            <span className="text-slate-400 text-xs">
              {member.timezone.replace(/_/g, " ")}
            </span>
          </div>
        )}
      </div>

      {/* Message button */}
      <button
        onClick={() => {
          if (!isDemo && member.slackUserId) {
            window.open(`slack://user?team=&id=${member.slackUserId}`, "_blank");
          }
        }}
        className="mt-4 w-full flex items-center justify-center gap-2 px-4 py-2.5 bg-blue-600 hover:bg-blue-500 text-white rounded-lg text-sm font-medium transition-colors"
      >
        <svg className="w-4 h-4" viewBox="0 0 24 24" fill="currentColor">
          <path d="M5.042 15.165a2.528 2.528 0 0 1-2.52 2.523A2.528 2.528 0 0 1 0 15.165a2.527 2.527 0 0 1 2.522-2.52h2.52v2.52zM6.313 15.165a2.527 2.527 0 0 1 2.521-2.52 2.527 2.527 0 0 1 2.521 2.52v6.313A2.528 2.528 0 0 1 8.834 24a2.528 2.528 0 0 1-2.521-2.522v-6.313z" />
        </svg>
        Message in Slack
      </button>
    </div>
  );
}
