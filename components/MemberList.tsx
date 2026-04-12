"use client";

import type { DemoMember } from "@/lib/demo-data";
import { useState } from "react";

interface MemberListProps {
  members: DemoMember[];
  onMemberClick?: (member: DemoMember) => void;
}

const teamColors: Record<string, string> = {
  Engineering: "bg-[rgba(59,130,246,0.18)] text-[#93c5fd]",
  Design: "bg-[rgba(139,92,246,0.18)] text-[#c4b5fd]",
  Marketing: "bg-[rgba(236,72,153,0.18)] text-[#f9a8d4]",
  Product: "bg-[rgba(249,115,22,0.18)] text-[#fdba74]",
  Sales: "bg-[rgba(20,184,166,0.18)] text-[#5eead4]",
  Operations: "bg-[rgba(100,116,139,0.18)] text-[#94a3b8]",
};

export default function MemberList({ members, onMemberClick }: MemberListProps) {
  const [search, setSearch] = useState("");
  const [filter, setFilter] = useState<"all" | "online" | "offline">("all");

  const filtered = members.filter((m) => {
    const matchesSearch = m.displayName
      .toLowerCase()
      .includes(search.toLowerCase());
    const matchesFilter =
      filter === "all" ||
      (filter === "online" && m.isOnline) ||
      (filter === "offline" && !m.isOnline);
    return matchesSearch && matchesFilter;
  });

  const onlineCount = members.filter((m) => m.isOnline).length;

  return (
    <div className="flex flex-col h-full">
      <div className="p-4 border-b border-[rgba(255,255,255,0.07)]">
        <h2 className="text-lg font-bold text-[#f0f4ff] mb-1">Team</h2>
        <p className="text-sm text-[#4a6080] font-mono mb-3">
          {onlineCount} online &middot; {members.length} total
        </p>

        <input
          type="text"
          placeholder="Search members..."
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          className="w-full px-3 py-2 bg-[rgba(255,255,255,0.04)] border border-[rgba(255,255,255,0.07)] rounded-md text-sm text-[#f0f4ff] placeholder-[#4a6080] focus:outline-none focus:ring-2 focus:ring-[#3b82f6] focus:border-[#3b82f6] mb-2"
        />

        <div className="flex gap-1.5">
          {(["all", "online", "offline"] as const).map((f) => (
            <button
              key={f}
              onClick={() => setFilter(f)}
              className={`px-3 py-1 rounded-full text-xs font-medium transition-colors ${
                filter === f
                  ? "bg-[#3b82f6] text-white"
                  : "bg-[rgba(255,255,255,0.06)] text-[#4a6080] hover:bg-[rgba(255,255,255,0.1)] hover:text-[#8ea4c8]"
              }`}
            >
              {f.charAt(0).toUpperCase() + f.slice(1)}
            </button>
          ))}
        </div>
      </div>

      <div className="flex-1 overflow-y-auto">
        {filtered.map((member) => (
          <button
            key={member.id}
            onClick={() => onMemberClick?.(member)}
            className="w-full flex items-center gap-3 px-4 py-3 hover:bg-[rgba(255,255,255,0.04)] transition-colors text-left border-b border-[rgba(255,255,255,0.03)]"
          >
            <div className="relative flex-shrink-0">
              <img
                src={member.avatarUrl || "/default-avatar.png"}
                alt={member.displayName}
                className="w-10 h-10 rounded-full object-cover border-2"
                style={{
                  borderColor: member.isOnline ? "#10b981" : "#64748b",
                }}
              />
              <div
                className="absolute bottom-0 right-0 w-3 h-3 rounded-full border-2 border-[#0e1628]"
                style={{
                  background: member.isOnline ? "#10b981" : "#64748b",
                  boxShadow: member.isOnline ? "0 0 6px #10b981" : "none",
                }}
              />
            </div>
            <div className="min-w-0 flex-1">
              <p className="text-sm font-semibold text-[#f0f4ff] truncate">
                {member.displayName}
              </p>
              <p className="text-[11px] text-[#4a6080] font-mono truncate">
                {member.locationName || member.timezone || "No location set"}
              </p>
              {member.team && (
                <span
                  className={`inline-block mt-1 text-[10px] px-1.5 py-0.5 rounded font-semibold ${
                    teamColors[member.team] || "bg-[rgba(100,116,139,0.18)] text-[#94a3b8]"
                  }`}
                >
                  {member.team}
                </span>
              )}
            </div>
            {member.timezone && (
              <span className="text-xs text-[#4a6080] font-mono flex-shrink-0">
                {getLocalTime(member.timezone)}
              </span>
            )}
          </button>
        ))}
        {filtered.length === 0 && (
          <p className="p-4 text-sm text-[#4a6080] text-center font-mono">
            No members found
          </p>
        )}
      </div>
    </div>
  );
}

function getLocalTime(timezone: string): string {
  try {
    return new Date().toLocaleTimeString("en-US", {
      timeZone: timezone,
      hour: "numeric",
      minute: "2-digit",
      hour12: true,
    });
  } catch {
    return "";
  }
}
