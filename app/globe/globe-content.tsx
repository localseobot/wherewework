"use client";

import { useEffect, useState, useCallback } from "react";
import { useSearchParams } from "next/navigation";
import Globe from "@/components/Globe";
import MemberList from "@/components/MemberList";
import MemberCard from "@/components/MemberCard";
import TimeOverlap from "@/components/TimeOverlap";
import { DEMO_MEMBERS, TEAMS } from "@/lib/demo-data";
import type { DemoMember, Team } from "@/lib/demo-data";

export default function GlobeContent() {
  const searchParams = useSearchParams();
  const isDemo = searchParams.get("demo") === "true" || !process.env.NEXT_PUBLIC_SLACK_CONNECTED;
  const isEmbed = searchParams.get("embed") === "true";

  const [members, setMembers] = useState<DemoMember[]>(DEMO_MEMBERS);
  const [sidebarOpen, setSidebarOpen] = useState(!isEmbed);
  const [selectedMember, setSelectedMember] = useState<DemoMember | null>(null);
  const [showTimeOverlap, setShowTimeOverlap] = useState(false);
  const [selectedTeam, setSelectedTeam] = useState<Team | "All">("All");

  // In production, fetch from API
  useEffect(() => {
    if (isDemo) return;

    const fetchMembers = async () => {
      try {
        const res = await fetch("/api/members");
        if (res.ok) {
          const data = await res.json();
          if (data.length > 0) setMembers(data);
        }
      } catch {
        // Use demo data on error
      }
    };

    fetchMembers();
    const interval = setInterval(fetchMembers, 30000);
    return () => clearInterval(interval);
  }, [isDemo]);

  const handleMemberClick = useCallback((member: DemoMember) => {
    setSelectedMember(member);
    setSidebarOpen(true);
  }, []);

  const filteredMembers =
    selectedTeam === "All"
      ? members
      : members.filter((m) => m.team === selectedTeam);

  return (
    <div
      className="w-screen bg-slate-900 flex overflow-hidden"
      style={{ height: isEmbed ? "100%" : "100vh", maxHeight: isEmbed ? "100%" : undefined }}
    >
      {/* Sidebar */}
      {!isEmbed && (
      <div
        className={`${
          sidebarOpen ? "w-80" : "w-0"
        } transition-all duration-300 bg-slate-800 border-r border-slate-700 overflow-hidden flex-shrink-0 flex flex-col`}
      >
        {/* Team filter */}
        <div className="p-4 border-b border-slate-700">
          <label className="text-xs font-medium text-slate-400 uppercase tracking-wider mb-2 block">
            Filter by team
          </label>
          <select
            value={selectedTeam}
            onChange={(e) => setSelectedTeam(e.target.value as Team | "All")}
            className="w-full px-3 py-2 bg-slate-700 border border-slate-600 rounded-lg text-sm text-white focus:outline-none focus:ring-2 focus:ring-blue-500"
          >
            <option value="All">All Teams</option>
            {TEAMS.map((t) => (
              <option key={t} value={t}>
                {t}
              </option>
            ))}
          </select>
        </div>

        <div className="flex-1 overflow-hidden">
          <MemberList members={filteredMembers} onMemberClick={handleMemberClick} />
        </div>

        {/* Time overlap toggle */}
        <div className="p-4 border-t border-slate-700">
          <button
            onClick={() => setShowTimeOverlap(!showTimeOverlap)}
            className={`w-full flex items-center justify-center gap-2 px-4 py-2.5 rounded-lg text-sm font-medium transition-colors ${
              showTimeOverlap
                ? "bg-blue-600 text-white"
                : "bg-slate-700 text-slate-300 hover:bg-slate-600"
            }`}
          >
            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
            </svg>
            Time Overlap
          </button>
        </div>
      </div>
      )}

      {/* Main globe area */}
      <div className="flex-1 relative">
        {/* Top bar */}
        {!isEmbed && (
        <div className="absolute top-0 left-0 right-0 z-10 flex items-center justify-between p-4">
          <div className="flex items-center gap-3">
            <button
              onClick={() => setSidebarOpen(!sidebarOpen)}
              className="p-2 bg-slate-800/80 backdrop-blur rounded-lg hover:bg-slate-700 transition-colors"
            >
              <svg className="w-5 h-5 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h16" />
              </svg>
            </button>
            <div className="flex items-center gap-2 bg-slate-800/80 backdrop-blur rounded-lg px-3 py-2">
              <div className="w-2 h-2 rounded-full bg-blue-500 animate-pulse" />
              <span className="text-sm font-medium text-white">WhereWeWork</span>
              {isDemo && (
                <span className="text-xs bg-amber-500/20 text-amber-400 px-2 py-0.5 rounded-full">
                  Demo
                </span>
              )}
            </div>
          </div>

          {/* Team filter pills (top bar) */}
          {selectedTeam !== "All" && (
            <div className="flex items-center gap-2">
              <span className="text-xs text-slate-400">Showing:</span>
              <span className="text-xs bg-blue-600/80 text-white px-2 py-1 rounded-full">
                {selectedTeam}
              </span>
              <button
                onClick={() => setSelectedTeam("All")}
                className="text-xs text-slate-400 hover:text-white"
              >
                Clear
              </button>
            </div>
          )}
        </div>
        )}

        {/* Member info card */}
        {selectedMember && (
          <MemberCard
            member={selectedMember}
            isDemo={isDemo}
            onClose={() => setSelectedMember(null)}
          />
        )}

        {/* Time overlap panel */}
        {showTimeOverlap && (
          <TimeOverlap
            members={filteredMembers}
            onClose={() => setShowTimeOverlap(false)}
          />
        )}

        <Globe
          members={filteredMembers}
          allMembers={members}
          selectedTeam={selectedTeam}
          onMemberClick={handleMemberClick}
        />
      </div>
    </div>
  );
}
