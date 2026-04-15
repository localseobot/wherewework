"use client";

import { useEffect, useRef, useState } from "react";
import dynamic from "next/dynamic";
import type { DemoMember, Team } from "@/lib/demo-data";

const GlobeGL = dynamic(() => import("react-globe.gl"), { ssr: false });

function escapeHtml(str: string): string {
  return str.replace(/&/g, "&amp;").replace(/</g, "&lt;").replace(/>/g, "&gt;").replace(/"/g, "&quot;").replace(/'/g, "&#39;");
}

interface GlobeProps {
  members: DemoMember[];
  allMembers: DemoMember[];
  selectedTeam: Team | "All";
  onMemberClick?: (member: DemoMember) => void;
}

export default function Globe({ members, allMembers, selectedTeam, onMemberClick }: GlobeProps) {
  const globeRef = useRef<any>(null);
  const [dimensions, setDimensions] = useState({ width: 0, height: 0 });
  const containerRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const updateDimensions = () => {
      if (containerRef.current) {
        setDimensions({
          width: containerRef.current.clientWidth,
          height: containerRef.current.clientHeight,
        });
      }
    };
    updateDimensions();
    window.addEventListener("resize", updateDimensions);
    return () => window.removeEventListener("resize", updateDimensions);
  }, []);

  useEffect(() => {
    if (globeRef.current) {
      globeRef.current.controls().autoRotate = true;
      globeRef.current.controls().autoRotateSpeed = 0.5;
      globeRef.current.pointOfView({ lat: 20, lng: 0, altitude: 2.5 }, 1000);
    }
  }, [dimensions]);

  const membersWithLocation = allMembers.filter(
    (m) => m.latitude != null && m.longitude != null
  );

  const filteredIds = new Set(members.map((m) => m.id));

  return (
    <div ref={containerRef} className="w-full h-full">
      {dimensions.width > 0 && (
        <GlobeGL
          ref={globeRef}
          width={dimensions.width}
          height={dimensions.height}
          globeImageUrl="//unpkg.com/three-globe/example/img/earth-night.jpg"
          backgroundImageUrl="//unpkg.com/three-globe/example/img/night-sky.png"
          atmosphereColor="#3b82f6"
          atmosphereAltitude={0.25}
          htmlElementsData={membersWithLocation}
          htmlLat={(d: any) => d.latitude}
          htmlLng={(d: any) => d.longitude}
          htmlElement={(d: any) => {
            const isFiltered = selectedTeam !== "All" && !filteredIds.has(d.id);
            const el = document.createElement("div");
            el.innerHTML = `
              <div style="
                display: flex;
                flex-direction: column;
                align-items: center;
                cursor: pointer;
                transform: translate(-20px, -20px);
                opacity: ${isFiltered ? "0.2" : "1"};
                transition: opacity 0.3s ease;
                pointer-events: ${isFiltered ? "none" : "auto"};
              ">
                <div style="position: relative; width: 40px; height: 40px;">
                  <img
                    src="${escapeHtml(d.avatarUrl || "/default-avatar.svg")}"
                    alt="${escapeHtml(d.displayName)}"
                    style="
                      width: 40px;
                      height: 40px;
                      border-radius: 50%;
                      border: 2px solid ${d.isOnline ? "#10b981" : "#64748b"};
                      object-fit: cover;
                      background: #0e1628;
                    "
                  />
                  <div style="
                    position: absolute;
                    bottom: 0;
                    right: 0;
                    width: 12px;
                    height: 12px;
                    border-radius: 50%;
                    background: ${d.isOnline ? "#10b981" : "#64748b"};
                    border: 2px solid #080d1a;
                    ${d.isOnline ? "box-shadow: 0 0 6px #10b981;" : ""}
                  "></div>
                </div>
                <div style="
                  margin-top: 4px;
                  padding: 2px 8px;
                  background: rgba(14, 22, 40, 0.9);
                  border: 1px solid rgba(255,255,255,0.07);
                  border-radius: 4px;
                  font-size: 11px;
                  color: #f0f4ff;
                  white-space: nowrap;
                  font-family: 'Syne', system-ui, sans-serif;
                  font-weight: 600;
                  letter-spacing: -0.2px;
                ">${escapeHtml(d.displayName)}</div>
              </div>
            `;
            el.style.cursor = "pointer";
            el.onclick = () => onMemberClick?.(d);
            return el;
          }}
          htmlAltitude={0.01}
        />
      )}
    </div>
  );
}
