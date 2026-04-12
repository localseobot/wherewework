"use client";

import { useMemo } from "react";
import type { DemoMember } from "@/lib/demo-data";

interface TimeOverlapProps {
  members: DemoMember[];
  onClose: () => void;
}

function getUtcOffsetHours(timezone: string): number {
  try {
    const now = new Date();
    const formatter = new Intl.DateTimeFormat("en-US", {
      timeZone: timezone,
      timeZoneName: "shortOffset",
    });
    const parts = formatter.formatToParts(now);
    const tzPart = parts.find((p) => p.type === "timeZoneName");
    if (!tzPart) return 0;
    // Format: "GMT+5:30" or "GMT-8" or "GMT"
    const match = tzPart.value.match(/GMT([+-]?)(\d+)?(?::(\d+))?/);
    if (!match) return 0;
    const sign = match[1] === "-" ? -1 : 1;
    const hours = parseInt(match[2] || "0", 10);
    const minutes = parseInt(match[3] || "0", 10);
    return sign * (hours + minutes / 60);
  } catch {
    return 0;
  }
}

export default function TimeOverlap({ members, onClose }: TimeOverlapProps) {
  const hours = Array.from({ length: 24 }, (_, i) => i);

  const memberWorkHours = useMemo(() => {
    return members.map((m) => {
      const offset = getUtcOffsetHours(m.timezone);
      // Working hours: 9am-5pm local = convert to UTC
      const startUtc = ((9 - offset) % 24 + 24) % 24;
      const endUtc = ((17 - offset) % 24 + 24) % 24;
      return { member: m, startUtc, endUtc, offset };
    });
  }, [members]);

  // Count how many people are working each hour (in UTC)
  const overlapCounts = useMemo(() => {
    return hours.map((hour) => {
      let count = 0;
      for (const mw of memberWorkHours) {
        const { startUtc, endUtc } = mw;
        if (startUtc < endUtc) {
          if (hour >= startUtc && hour < endUtc) count++;
        } else {
          // Wraps around midnight
          if (hour >= startUtc || hour < endUtc) count++;
        }
      }
      return count;
    });
  }, [memberWorkHours, hours]);

  const maxOverlap = Math.max(...overlapCounts, 1);

  // Current UTC hour
  const currentUtcHour = new Date().getUTCHours();

  return (
    <div className="absolute bottom-0 left-0 right-0 z-10 bg-slate-800/95 backdrop-blur-lg border-t border-slate-700 p-4 max-h-[50vh] overflow-y-auto">
      <div className="flex items-center justify-between mb-4">
        <div>
          <h3 className="text-white font-semibold text-sm">Working Hours Overlap</h3>
          <p className="text-xs text-slate-400 mt-0.5">
            Showing 9am–5pm local time for each member (UTC timeline)
          </p>
        </div>
        <button
          onClick={onClose}
          className="p-1.5 hover:bg-slate-700 rounded-lg transition-colors"
        >
          <svg className="w-4 h-4 text-slate-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
          </svg>
        </button>
      </div>

      {/* Overlap heat bar */}
      <div className="mb-4">
        <div className="flex items-center gap-1 mb-1">
          <span className="text-xs text-slate-400 w-28 flex-shrink-0">Team overlap</span>
          <div className="flex-1 flex gap-px">
            {hours.map((hour) => {
              const count = overlapCounts[hour];
              const intensity = count / maxOverlap;
              const isNow = hour === currentUtcHour;
              return (
                <div
                  key={hour}
                  className={`flex-1 h-6 rounded-sm relative ${isNow ? "ring-1 ring-white" : ""}`}
                  style={{
                    background:
                      count === 0
                        ? "#1e293b"
                        : `rgba(59, 130, 246, ${0.2 + intensity * 0.8})`,
                  }}
                  title={`${hour}:00 UTC — ${count} people working`}
                >
                  {count > 0 && (
                    <span className="absolute inset-0 flex items-center justify-center text-[9px] text-white/80">
                      {count}
                    </span>
                  )}
                </div>
              );
            })}
          </div>
        </div>
        {/* Hour labels */}
        <div className="flex items-center gap-1">
          <span className="w-28 flex-shrink-0" />
          <div className="flex-1 flex gap-px">
            {hours.map((hour) => (
              <div key={hour} className="flex-1 text-center">
                {hour % 6 === 0 && (
                  <span className="text-[9px] text-slate-500">{hour}:00</span>
                )}
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Per-member bars */}
      <div className="space-y-1">
        {memberWorkHours.map(({ member, startUtc, endUtc }) => (
          <div key={member.id} className="flex items-center gap-1">
            <div className="w-28 flex-shrink-0 flex items-center gap-2">
              <img
                src={member.avatarUrl}
                alt={member.displayName}
                className="w-5 h-5 rounded-full"
              />
              <span className="text-xs text-slate-300 truncate">{member.displayName}</span>
            </div>
            <div className="flex-1 flex gap-px">
              {hours.map((hour) => {
                let isWorking = false;
                if (startUtc < endUtc) {
                  isWorking = hour >= startUtc && hour < endUtc;
                } else {
                  isWorking = hour >= startUtc || hour < endUtc;
                }
                const isNow = hour === currentUtcHour;
                return (
                  <div
                    key={hour}
                    className={`flex-1 h-3 rounded-sm ${isNow ? "ring-1 ring-white/50" : ""}`}
                    style={{
                      background: isWorking
                        ? member.isOnline
                          ? "#22c55e"
                          : "#3b82f6"
                        : "#1e293b",
                    }}
                  />
                );
              })}
            </div>
          </div>
        ))}
      </div>

      {/* Legend */}
      <div className="flex items-center gap-4 mt-3 text-xs text-slate-400">
        <div className="flex items-center gap-1">
          <div className="w-3 h-3 rounded-sm bg-green-500" />
          <span>Online & working</span>
        </div>
        <div className="flex items-center gap-1">
          <div className="w-3 h-3 rounded-sm bg-blue-500" />
          <span>Working hours</span>
        </div>
        <div className="flex items-center gap-1">
          <div className="w-3 h-3 rounded-sm bg-slate-800" />
          <span>Off hours</span>
        </div>
        <div className="flex items-center gap-1">
          <div className="w-3 h-3 rounded-sm ring-1 ring-white" />
          <span>Current hour</span>
        </div>
      </div>
    </div>
  );
}
