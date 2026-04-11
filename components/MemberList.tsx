"use client";

import type { Member } from "@/lib/schema";
import { useState } from "react";

interface MemberListProps {
  members: Member[];
  onMemberClick?: (member: Member) => void;
}

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
      <div className="p-4 border-b border-slate-700">
        <h2 className="text-lg font-semibold text-white mb-1">Team</h2>
        <p className="text-sm text-slate-400 mb-3">
          {onlineCount} online &middot; {members.length} total
        </p>

        <input
          type="text"
          placeholder="Search members..."
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          className="w-full px-3 py-2 bg-slate-700 border border-slate-600 rounded-lg text-sm text-white placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-blue-500 mb-2"
        />

        <div className="flex gap-1">
          {(["all", "online", "offline"] as const).map((f) => (
            <button
              key={f}
              onClick={() => setFilter(f)}
              className={`px-3 py-1 rounded-full text-xs font-medium transition-colors ${
                filter === f
                  ? "bg-blue-600 text-white"
                  : "bg-slate-700 text-slate-300 hover:bg-slate-600"
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
            className="w-full flex items-center gap-3 px-4 py-3 hover:bg-slate-700/50 transition-colors text-left"
          >
            <div className="relative flex-shrink-0">
              <img
                src={member.avatarUrl || "/default-avatar.png"}
                alt={member.displayName}
                className="w-10 h-10 rounded-full object-cover border-2"
                style={{
                  borderColor: member.isOnline ? "#22c55e" : "#6b7280",
                }}
              />
              <div
                className="absolute bottom-0 right-0 w-3 h-3 rounded-full border-2 border-slate-800"
                style={{
                  background: member.isOnline ? "#22c55e" : "#6b7280",
                }}
              />
            </div>
            <div className="min-w-0 flex-1">
              <p className="text-sm font-medium text-white truncate">
                {member.displayName}
              </p>
              <p className="text-xs text-slate-400 truncate">
                {member.locationName || member.timezone || "No location set"}
              </p>
            </div>
            {member.timezone && (
              <span className="text-xs text-slate-500 flex-shrink-0">
                {getLocalTime(member.timezone)}
              </span>
            )}
          </button>
        ))}
        {filtered.length === 0 && (
          <p className="p-4 text-sm text-slate-500 text-center">
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
