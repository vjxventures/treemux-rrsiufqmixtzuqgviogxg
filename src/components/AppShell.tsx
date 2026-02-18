"use client";

import { useEffect, useState } from "react";
import { useAppStore } from "@/lib/store";
import { apiGet } from "@/lib/api";
import { AuthScreen } from "./AuthScreen";
import { DiscoverView } from "./DiscoverView";
import { MatchesView } from "./MatchesView";
import { ChatView } from "./ChatView";
import { ProfileView } from "./ProfileView";
import { Heart, MessageCircle, User, Flame, Loader2 } from "lucide-react";

export function AppShell() {
  const { user, setUser, tab, setTab, currentChat } = useAppStore();
  const [checking, setChecking] = useState(true);

  useEffect(() => {
    apiGet("/api/auth/me").then((res) => {
      if (res.user) setUser(res.user);
      setChecking(false);
    });
  }, [setUser]);

  const handleAuth = () => {
    apiGet("/api/auth/me").then((res) => {
      if (res.user) setUser(res.user);
    });
  };

  const handleLogout = () => {
    setUser(null);
  };

  if (checking) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-rose-50 via-white to-pink-50">
        <div className="text-center">
          <Loader2 className="w-8 h-8 text-rose-400 animate-spin mx-auto mb-3" />
          <p className="text-sm text-gray-400">Loading TartanMatch...</p>
        </div>
      </div>
    );
  }

  if (!user) {
    return <AuthScreen onAuth={handleAuth} />;
  }

  // If chat is open, show chat view
  if (currentChat) {
    return (
      <div className="h-screen flex flex-col bg-white max-w-lg mx-auto border-x border-gray-100">
        <ChatView />
      </div>
    );
  }

  return (
    <div className="h-screen flex flex-col bg-white max-w-lg mx-auto border-x border-gray-100">
      {/* Top bar */}
      <div className="flex items-center justify-between px-4 py-3 border-b border-gray-100 bg-white">
        <div className="flex items-center gap-2">
          <div className="w-8 h-8 rounded-lg bg-gradient-to-br from-rose-500 to-red-500 flex items-center justify-center">
            <Flame className="w-4 h-4 text-white" />
          </div>
          <h1 className="text-lg font-black text-gray-900">
            Tartan<span className="text-rose-500">Match</span>
          </h1>
        </div>
        <p className="text-xs text-gray-400 font-medium">
          {tab === "discover" ? "Discover" : tab === "matches" ? "Matches" : "Profile"}
        </p>
      </div>

      {/* Content */}
      {tab === "discover" && <DiscoverView />}
      {tab === "matches" && <MatchesView />}
      {tab === "profile" && <ProfileView onLogout={handleLogout} />}

      {/* Bottom nav */}
      <div className="flex border-t border-gray-100 bg-white">
        <button
          onClick={() => setTab("discover")}
          className={`flex-1 py-3 flex flex-col items-center gap-0.5 transition-colors ${
            tab === "discover" ? "text-rose-500" : "text-gray-400 hover:text-gray-600"
          }`}
        >
          <Heart className="w-5 h-5" fill={tab === "discover" ? "currentColor" : "none"} />
          <span className="text-[10px] font-medium">Discover</span>
        </button>
        <button
          onClick={() => setTab("matches")}
          className={`flex-1 py-3 flex flex-col items-center gap-0.5 transition-colors ${
            tab === "matches" ? "text-rose-500" : "text-gray-400 hover:text-gray-600"
          }`}
        >
          <MessageCircle className="w-5 h-5" fill={tab === "matches" ? "currentColor" : "none"} />
          <span className="text-[10px] font-medium">Matches</span>
        </button>
        <button
          onClick={() => setTab("profile")}
          className={`flex-1 py-3 flex flex-col items-center gap-0.5 transition-colors ${
            tab === "profile" ? "text-rose-500" : "text-gray-400 hover:text-gray-600"
          }`}
        >
          <User className="w-5 h-5" fill={tab === "profile" ? "currentColor" : "none"} />
          <span className="text-[10px] font-medium">Profile</span>
        </button>
      </div>
    </div>
  );
}
