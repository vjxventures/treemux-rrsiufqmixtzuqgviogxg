"use client";

import { useState } from "react";
import { ScottyApp } from "@/components/scotty-app";
import { LandingPage } from "@/components/landing-page";

export default function Home() {
  const [showApp, setShowApp] = useState(false);

  if (!showApp) {
    return <LandingPage onLaunch={() => setShowApp(true)} />;
  }

  return (
    <div className="flex items-center justify-center min-h-screen bg-gradient-to-br from-rose-50 via-pink-50 to-purple-50">
      {/* Phone frame */}
      <div className="relative w-full max-w-[400px] h-[min(90vh,860px)] bg-white rounded-[2.5rem] shadow-2xl overflow-hidden border border-gray-200/60 mx-auto">
        {/* Notch */}
        <div className="absolute top-0 left-1/2 -translate-x-1/2 w-36 h-7 bg-black rounded-b-2xl z-50" />
        {/* Status bar area */}
        <div className="h-12 bg-white" />
        {/* App content */}
        <div className="h-[calc(100%-3rem)]">
          <ScottyApp />
        </div>
      </div>
    </div>
  );
}
