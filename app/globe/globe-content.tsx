"use client";

import { useEffect, useState, useCallback } from "react";
import { useSearchParams } from "next/navigation";
import Globe from "@/components/Globe";
import MemberList from "@/components/MemberList";
import MemberCard from "@/components/MemberCard";
import TimeOverlap from "@/components/TimeOverlap";
import MeetingFinder from "@/components/MeetingFinder";
import { DEMO_MEMBERS, TEAMS } from "@/lib/demo-data";
import type { DemoMember, Team } from "@/lib/demo-data";

export default function GlobeContent() {
  const searchParams = useSearchParams();
  const forceDemo = searchParams.get("demo") === "true";
  const isEmbed = searchParams.get("embed") === "true";

  const [members, setMembers] = useState<DemoMember[]>(DEMO_MEMBERS);
  const [isDemo, setIsDemo] = useState(forceDemo);
  const [sidebarOpen, setSidebarOpen] = useState(!isEmbed);
  const [selectedMember, setSelectedMember] = useState<DemoMember | null>(null);
  const [showTimeOverlap, setShowTimeOverlap] = useState(false);
  const [showMeetingFinder, setShowMeetingFinder] = useState(false);
  const [selectedTeam, setSelectedTeam] = useState<Team | "All">("All");

  // Fetch live data unless demo=true is explicitly in the URL
  useEffect(() => {
    if (forceDemo) return;

    const fetchMembers = async () => {
      try {
        const res = await fetch("/api/members");
        if (res.ok) {
          const data = await res.json();
          if (data.length > 0) {
            setMembers(data);
            setIsDemo(false);
          }
        }
      } catch {
        // Keep demo data on error
      }
    };

    fetchMembers();
    const interval = setInterval(fetchMembers, 30000);
    return () => clearInterval(interval);
  }, [forceDemo]);

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
      className="w-screen bg-[#080d1a] flex overflow-hidden"
      style={{ height: isEmbed ? "100%" : "100vh", maxHeight: isEmbed ? "100%" : undefined }}
    >
      {/* Sidebar */}
      {!isEmbed && (
      <div
        className={`${
          sidebarOpen ? "w-80" : "w-0"
        } transition-all duration-300 bg-[#0e1628] border-r border-[rgba(255,255,255,0.07)] overflow-hidden flex-shrink-0 flex flex-col`}
      >
        {/* Team filter */}
        <div className="p-4 border-b border-[rgba(255,255,255,0.07)]">
          <label className="text-[10px] font-medium text-[#3b82f6] uppercase tracking-[0.12em] font-mono mb-2 block">
            Filter by team
          </label>
          <select
            value={selectedTeam}
            onChange={(e) => setSelectedTeam(e.target.value as Team | "All")}
            className="w-full px-3 py-2 bg-[rgba(255,255,255,0.04)] border border-[rgba(255,255,255,0.07)] rounded-md text-sm text-[#f0f4ff] focus:outline-none focus:ring-2 focus:ring-[#3b82f6] focus:border-[#3b82f6]"
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

        {/* Action buttons */}
        <div className="p-4 border-t border-[rgba(255,255,255,0.07)] space-y-2">
          <button
            onClick={() => setShowTimeOverlap(!showTimeOverlap)}
            className={`w-full flex items-center justify-center gap-2 px-4 py-2.5 rounded-md text-sm font-semibold transition-all ${
              showTimeOverlap
                ? "bg-[#3b82f6] text-white shadow-[0_0_18px_rgba(59,130,246,0.35)]"
                : "bg-[rgba(255,255,255,0.06)] text-[#8ea4c8] hover:bg-[rgba(255,255,255,0.1)] hover:text-[#f0f4ff]"
            }`}
          >
            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
            </svg>
            Time Overlap
          </button>
          <button
            onClick={() => setShowMeetingFinder(true)}
            className="w-full flex items-center justify-center gap-2 px-4 py-2.5 rounded-md text-sm font-semibold bg-[rgba(20,184,166,0.15)] text-[#14b8a6] hover:bg-[rgba(20,184,166,0.25)] transition-all border border-[rgba(20,184,166,0.2)]"
          >
            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
            </svg>
            Find Meeting Time
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
              className="p-2 bg-[#0e1628]/80 backdrop-blur border border-[rgba(255,255,255,0.07)] rounded-lg hover:border-[rgba(99,179,255,0.25)] transition-colors"
            >
              <svg className="w-5 h-5 text-[#f0f4ff]" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h16" />
              </svg>
            </button>
            <div className="flex items-center gap-2 bg-[#0e1628]/80 backdrop-blur border border-[rgba(255,255,255,0.07)] rounded-lg px-3 py-2">
              <div className="logo-dot" style={{ width: 8, height: 8 }} />
              <span className="text-sm font-bold text-[#f0f4ff]">WhereWeWork</span>
              {isDemo && (
                <span className="text-xs bg-[rgba(245,158,11,0.2)] text-[#f59e0b] border border-[rgba(245,158,11,0.3)] px-2 py-0.5 rounded-full font-semibold">
                  Demo
                </span>
              )}
            </div>
          </div>

          {/* Team filter pills (top bar) */}
          {selectedTeam !== "All" && (
            <div className="flex items-center gap-2">
              <span className="text-xs text-[#4a6080] font-mono">Showing:</span>
              <span className="text-xs bg-[rgba(59,130,246,0.2)] text-[#60a5fa] border border-[rgba(59,130,246,0.3)] px-2 py-1 rounded-full font-semibold">
                {selectedTeam}
              </span>
              <button
                onClick={() => setSelectedTeam("All")}
                className="text-xs text-[#4a6080] hover:text-[#f0f4ff] transition-colors"
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

        {/* Meeting finder modal */}
        {showMeetingFinder && (
          <MeetingFinder
            members={filteredMembers}
            onClose={() => setShowMeetingFinder(false)}
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
