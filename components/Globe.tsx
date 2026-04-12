"use client";

import { useEffect, useRef, useState } from "react";
import dynamic from "next/dynamic";
import type { DemoMember, Team } from "@/lib/demo-data";

const GlobeGL = dynamic(() => import("react-globe.gl"), { ssr: false });

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
                    src="${d.avatarUrl || "/default-avatar.png"}"
                    alt="${d.displayName}"
                    style="
                      width: 40px;
                      height: 40px;
                      border-radius: 50%;
                      border: 2px solid ${d.isOnline ? "#22c55e" : "#6b7280"};
                      object-fit: cover;
                      background: #1e293b;
                    "
                  />
                  <div style="
                    position: absolute;
                    bottom: 0;
                    right: 0;
                    width: 12px;
                    height: 12px;
                    border-radius: 50%;
                    background: ${d.isOnline ? "#22c55e" : "#6b7280"};
                    border: 2px solid #0f172a;
                  "></div>
                </div>
                <div style="
                  margin-top: 4px;
                  padding: 2px 6px;
                  background: rgba(15, 23, 42, 0.85);
                  border-radius: 4px;
                  font-size: 11px;
                  color: #e2e8f0;
                  white-space: nowrap;
                  font-family: system-ui, -apple-system, sans-serif;
                ">${d.displayName}</div>
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
