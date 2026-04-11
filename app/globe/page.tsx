"use client";

import { useEffect, useState, useCallback } from "react";
import Globe from "@/components/Globe";
import MemberList from "@/components/MemberList";
import type { Member } from "@/lib/schema";

// Mock data for development (before Slack integration)
const MOCK_MEMBERS: Member[] = [
  {
    id: 1, workspaceId: 1, slackUserId: "U001", displayName: "Sarah Chen",
    avatarUrl: "https://api.dicebear.com/7.x/avataaars/svg?seed=Sarah",
    locationName: "San Francisco, CA", latitude: 37.7749, longitude: -122.4194,
    timezone: "America/Los_Angeles", isOnline: true, lastUpdated: new Date().toISOString(),
  },
  {
    id: 2, workspaceId: 1, slackUserId: "U002", displayName: "James Wilson",
    avatarUrl: "https://api.dicebear.com/7.x/avataaars/svg?seed=James",
    locationName: "London, UK", latitude: 51.5074, longitude: -0.1278,
    timezone: "Europe/London", isOnline: true, lastUpdated: new Date().toISOString(),
  },
  {
    id: 3, workspaceId: 1, slackUserId: "U003", displayName: "Yuki Tanaka",
    avatarUrl: "https://api.dicebear.com/7.x/avataaars/svg?seed=Yuki",
    locationName: "Tokyo, Japan", latitude: 35.6762, longitude: 139.6503,
    timezone: "Asia/Tokyo", isOnline: false, lastUpdated: new Date().toISOString(),
  },
  {
    id: 4, workspaceId: 1, slackUserId: "U004", displayName: "Priya Sharma",
    avatarUrl: "https://api.dicebear.com/7.x/avataaars/svg?seed=Priya",
    locationName: "Bangalore, India", latitude: 12.9716, longitude: 77.5946,
    timezone: "Asia/Kolkata", isOnline: true, lastUpdated: new Date().toISOString(),
  },
  {
    id: 5, workspaceId: 1, slackUserId: "U005", displayName: "Marcus Santos",
    avatarUrl: "https://api.dicebear.com/7.x/avataaars/svg?seed=Marcus",
    locationName: "São Paulo, Brazil", latitude: -23.5505, longitude: -46.6333,
    timezone: "America/Sao_Paulo", isOnline: false, lastUpdated: new Date().toISOString(),
  },
  {
    id: 6, workspaceId: 1, slackUserId: "U006", displayName: "Emma Johansson",
    avatarUrl: "https://api.dicebear.com/7.x/avataaars/svg?seed=Emma",
    locationName: "Stockholm, Sweden", latitude: 59.3293, longitude: 18.0686,
    timezone: "Europe/Stockholm", isOnline: true, lastUpdated: new Date().toISOString(),
  },
  {
    id: 7, workspaceId: 1, slackUserId: "U007", displayName: "Alex Petrov",
    avatarUrl: "https://api.dicebear.com/7.x/avataaars/svg?seed=Alex",
    locationName: "Berlin, Germany", latitude: 52.52, longitude: 13.405,
    timezone: "Europe/Berlin", isOnline: true, lastUpdated: new Date().toISOString(),
  },
  {
    id: 8, workspaceId: 1, slackUserId: "U008", displayName: "Amara Okafor",
    avatarUrl: "https://api.dicebear.com/7.x/avataaars/svg?seed=Amara",
    locationName: "Lagos, Nigeria", latitude: 6.5244, longitude: 3.3792,
    timezone: "Africa/Lagos", isOnline: false, lastUpdated: new Date().toISOString(),
  },
];

export default function GlobePage() {
  const [members, setMembers] = useState<Member[]>(MOCK_MEMBERS);
  const [sidebarOpen, setSidebarOpen] = useState(true);
  const [selectedMember, setSelectedMember] = useState<Member | null>(null);

  // In production, fetch from API
  useEffect(() => {
    const fetchMembers = async () => {
      try {
        const res = await fetch("/api/members");
        if (res.ok) {
          const data = await res.json();
          if (data.length > 0) setMembers(data);
        }
      } catch {
        // Use mock data on error
      }
    };

    fetchMembers();
    const interval = setInterval(fetchMembers, 30000); // Refresh every 30s
    return () => clearInterval(interval);
  }, []);

  const handleMemberClick = useCallback((member: Member) => {
    setSelectedMember(member);
    setSidebarOpen(true);
  }, []);

  return (
    <div className="h-screen w-screen bg-slate-900 flex overflow-hidden">
      {/* Sidebar */}
      <div
        className={`${
          sidebarOpen ? "w-80" : "w-0"
        } transition-all duration-300 bg-slate-800 border-r border-slate-700 overflow-hidden flex-shrink-0`}
      >
        <MemberList members={members} onMemberClick={handleMemberClick} />
      </div>

      {/* Main globe area */}
      <div className="flex-1 relative">
        {/* Top bar */}
        <div className="absolute top-0 left-0 right-0 z-10 flex items-center justify-between p-4">
          <div className="flex items-center gap-3">
            <button
              onClick={() => setSidebarOpen(!sidebarOpen)}
              className="p-2 bg-slate-800/80 backdrop-blur rounded-lg hover:bg-slate-700 transition-colors"
            >
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
                  d="M4 6h16M4 12h16M4 18h16"
                />
              </svg>
            </button>
            <div className="flex items-center gap-2 bg-slate-800/80 backdrop-blur rounded-lg px-3 py-2">
              <div className="w-2 h-2 rounded-full bg-blue-500 animate-pulse" />
              <span className="text-sm font-medium text-white">
                WhereWeWork
              </span>
            </div>
          </div>
        </div>

        {/* Selected member info card */}
        {selectedMember && (
          <div className="absolute bottom-6 left-1/2 -translate-x-1/2 z-10 bg-slate-800/90 backdrop-blur border border-slate-700 rounded-xl p-4 flex items-center gap-4 shadow-2xl">
            <img
              src={selectedMember.avatarUrl || "/default-avatar.png"}
              alt={selectedMember.displayName}
              className="w-12 h-12 rounded-full border-2"
              style={{
                borderColor: selectedMember.isOnline ? "#22c55e" : "#6b7280",
              }}
            />
            <div>
              <p className="text-white font-semibold">
                {selectedMember.displayName}
              </p>
              <p className="text-sm text-slate-400">
                {selectedMember.locationName || "No location"}
              </p>
              {selectedMember.timezone && (
                <p className="text-xs text-slate-500">
                  Local time:{" "}
                  {new Date().toLocaleTimeString("en-US", {
                    timeZone: selectedMember.timezone,
                    hour: "numeric",
                    minute: "2-digit",
                    hour12: true,
                  })}
                </p>
              )}
            </div>
            <button
              onClick={() => setSelectedMember(null)}
              className="ml-2 p-1 hover:bg-slate-700 rounded"
            >
              <svg
                className="w-4 h-4 text-slate-400"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M6 18L18 6M6 6l12 12"
                />
              </svg>
            </button>
          </div>
        )}

        <Globe members={members} onMemberClick={handleMemberClick} />
      </div>
    </div>
  );
}
