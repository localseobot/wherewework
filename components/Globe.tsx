"use client";

import { useEffect, useRef, useCallback, useState } from "react";
import dynamic from "next/dynamic";
import type { Member } from "@/lib/schema";

// react-globe.gl must be loaded client-side only (Three.js)
const GlobeGL = dynamic(() => import("react-globe.gl"), { ssr: false });

interface GlobeProps {
  members: Member[];
  onMemberClick?: (member: Member) => void;
}

export default function Globe({ members, onMemberClick }: GlobeProps) {
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
      // Auto-rotate
      globeRef.current.controls().autoRotate = true;
      globeRef.current.controls().autoRotateSpeed = 0.5;
      // Initial POV
      globeRef.current.pointOfView({ lat: 20, lng: 0, altitude: 2.5 }, 1000);
    }
  }, [dimensions]);

  const membersWithLocation = members.filter(
    (m) => m.latitude != null && m.longitude != null
  );

  const markerHtml = useCallback(
    (member: Member) => `
    <div style="
      display: flex;
      flex-direction: column;
      align-items: center;
      cursor: pointer;
      transform: translate(-20px, -20px);
    ">
      <div style="
        position: relative;
        width: 40px;
        height: 40px;
      ">
        <img
          src="${member.avatarUrl || "/default-avatar.png"}"
          alt="${member.displayName}"
          style="
            width: 40px;
            height: 40px;
            border-radius: 50%;
            border: 2px solid ${member.isOnline ? "#22c55e" : "#6b7280"};
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
          background: ${member.isOnline ? "#22c55e" : "#6b7280"};
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
      ">${member.displayName}</div>
    </div>
  `,
    []
  );

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
            const el = document.createElement("div");
            el.innerHTML = markerHtml(d);
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
