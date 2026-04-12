import { Suspense } from "react";
import GlobeContent from "./globe-content";

export default function GlobePage() {
  return (
    <Suspense fallback={<div className="h-screen w-screen bg-slate-900" />}>
      <GlobeContent />
    </Suspense>
  );
}
