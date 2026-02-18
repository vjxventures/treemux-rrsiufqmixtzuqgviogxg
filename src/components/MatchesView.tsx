"use client";

import { useEffect, useState } from "react";
import { useAppStore, type MatchItem } from "@/lib/store";
import { apiGet } from "@/lib/api";
import { Heart, Loader2, MessageCircle } from "lucide-react";

const INITIALS_COLORS = [
  "from-rose-400 to-pink-500",
  "from-violet-400 to-purple-500",
  "from-blue-400 to-indigo-500",
  "from-emerald-400 to-teal-500",
  "from-amber-400 to-orange-500",
  "from-cyan-400 to-blue-500",
];

function getInitials(name: string) {
  return name.split(" ").map((n) => n[0]).join("").toUpperCase();
}

function getColorIndex(name: string) {
  let hash = 0;
  for (let i = 0; i < name.length; i++) {
    hash = name.charCodeAt(i) + ((hash << 5) - hash);
  }
  return Math.abs(hash) % INITIALS_COLORS.length;
}

export function MatchesView() {
  const { matches, setMatches, setCurrentChat, setTab } = useAppStore();
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    apiGet("/api/matches").then((res) => {
      setMatches(res.matches || []);
      setLoading(false);
    });
  }, [setMatches]);

  const openChat = (match: MatchItem) => {
    setCurrentChat({ matchId: match.matchId, userName: match.user.name });
  };

  if (loading) {
    return (
      <div className="flex-1 flex items-center justify-center">
        <Loader2 className="w-8 h-8 text-rose-400 animate-spin" />
      </div>
    );
  }

  if (matches.length === 0) {
    return (
      <div className="flex-1 flex flex-col items-center justify-center text-center px-4">
        <div className="w-16 h-16 rounded-2xl bg-rose-50 flex items-center justify-center mb-4">
          <Heart className="w-8 h-8 text-rose-300" />
        </div>
        <h3 className="text-lg font-bold text-gray-800 mb-1">No matches yet</h3>
        <p className="text-sm text-gray-400 max-w-[250px]">
          Keep swiping to find your perfect study partner (or more).
        </p>
        <button
          onClick={() => setTab("discover")}
          className="mt-4 text-sm font-semibold text-rose-500 hover:text-rose-600"
        >
          Start swiping
        </button>
      </div>
    );
  }

  return (
    <div className="flex-1 overflow-y-auto">
      <div className="p-4 space-y-2">
        {matches.map((match) => {
          const colorIdx = getColorIndex(match.user.name);
          return (
            <button
              key={match.matchId}
              onClick={() => openChat(match)}
              className="w-full flex items-center gap-3 p-3 rounded-xl hover:bg-gray-50 transition-colors text-left"
            >
              <div
                className={`w-14 h-14 rounded-full bg-gradient-to-br ${INITIALS_COLORS[colorIdx]} flex items-center justify-center flex-shrink-0`}
              >
                <span className="text-lg font-bold text-white">{getInitials(match.user.name)}</span>
              </div>
              <div className="flex-1 min-w-0">
                <div className="flex items-center justify-between">
                  <h3 className="font-semibold text-gray-900 text-sm">{match.user.name}</h3>
                  <span className="text-xs text-gray-400">
                    {new Date(match.matchedAt).toLocaleDateString()}
                  </span>
                </div>
                <p className="text-xs text-gray-500 truncate">{match.user.college}</p>
                {match.lastMessage ? (
                  <p className="text-xs text-gray-400 truncate mt-0.5">
                    {match.lastMessage.isMe ? "You: " : ""}
                    {match.lastMessage.content}
                  </p>
                ) : (
                  <p className="text-xs text-rose-400 mt-0.5 flex items-center gap-1">
                    <MessageCircle className="w-3 h-3" />
                    Say hello!
                  </p>
                )}
              </div>
            </button>
          );
        })}
      </div>
    </div>
  );
}
