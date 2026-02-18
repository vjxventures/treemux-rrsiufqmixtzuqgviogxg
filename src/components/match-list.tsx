"use client";

import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Badge } from "@/components/ui/badge";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Heart, BookOpen } from "lucide-react";
import type { Match, Profile } from "@/lib/types";

interface MatchListProps {
  matches: Match[];
  getProfile: (id: string) => Profile | undefined;
  onSelectMatch: (matchId: string) => void;
  selectedMatchId?: string;
}

function formatTime(timestamp: number): string {
  const diff = Date.now() - timestamp;
  const mins = Math.floor(diff / 60000);
  const hours = Math.floor(diff / 3600000);
  const days = Math.floor(diff / 86400000);

  if (mins < 1) return "Just now";
  if (mins < 60) return `${mins}m ago`;
  if (hours < 24) return `${hours}h ago`;
  return `${days}d ago`;
}

export function MatchList({
  matches,
  getProfile,
  onSelectMatch,
  selectedMatchId,
}: MatchListProps) {
  if (matches.length === 0) {
    return (
      <div className="flex flex-col items-center justify-center h-64 text-gray-400">
        <Heart className="w-12 h-12 mb-3 opacity-30" />
        <p className="text-sm font-medium">No matches yet</p>
        <p className="text-xs mt-1">Start swiping to find your match!</p>
      </div>
    );
  }

  // New matches (no messages)
  const newMatches = matches.filter((m) => !m.lastMessage);
  const conversations = matches.filter((m) => m.lastMessage);

  return (
    <ScrollArea className="h-full">
      {/* New matches row */}
      {newMatches.length > 0 && (
        <div className="px-4 pt-4 pb-2">
          <h3 className="text-xs font-semibold text-gray-400 uppercase tracking-wider mb-3">
            New Matches
          </h3>
          <div className="flex gap-3 overflow-x-auto pb-2">
            {newMatches.map((match) => {
              const profile = getProfile(match.profileId);
              if (!profile) return null;
              return (
                <button
                  key={match.id}
                  onClick={() => onSelectMatch(match.id)}
                  className="flex flex-col items-center gap-1.5 flex-shrink-0"
                >
                  <div
                    className={`relative rounded-full p-0.5 ${
                      match.mode === "dating"
                        ? "bg-gradient-to-br from-rose-400 to-pink-600"
                        : "bg-gradient-to-br from-blue-400 to-indigo-600"
                    }`}
                  >
                    <Avatar className="w-16 h-16 border-2 border-white">
                      <AvatarImage src={profile.photos[0]} />
                      <AvatarFallback className="bg-gray-200 text-gray-600 text-lg font-semibold">
                        {profile.name[0]}
                      </AvatarFallback>
                    </Avatar>
                  </div>
                  <span className="text-xs font-medium text-gray-700 max-w-[70px] truncate">
                    {profile.name.split(" ")[0]}
                  </span>
                </button>
              );
            })}
          </div>
        </div>
      )}

      {/* Conversations */}
      {conversations.length > 0 && (
        <div className="px-2 pt-2">
          <h3 className="text-xs font-semibold text-gray-400 uppercase tracking-wider mb-2 px-2">
            Messages
          </h3>
          {conversations.map((match) => {
            const profile = getProfile(match.profileId);
            if (!profile) return null;
            return (
              <button
                key={match.id}
                onClick={() => onSelectMatch(match.id)}
                className={`w-full flex items-center gap-3 p-3 rounded-xl transition-colors ${
                  selectedMatchId === match.id
                    ? "bg-rose-50"
                    : "hover:bg-gray-50"
                }`}
              >
                <div className="relative">
                  <Avatar className="w-14 h-14">
                    <AvatarImage src={profile.photos[0]} />
                    <AvatarFallback className="bg-gray-200 text-gray-600 font-semibold">
                      {profile.name[0]}
                    </AvatarFallback>
                  </Avatar>
                  {match.unread > 0 && (
                    <span className="absolute -top-0.5 -right-0.5 w-5 h-5 bg-rose-500 text-white text-[10px] font-bold rounded-full flex items-center justify-center">
                      {match.unread}
                    </span>
                  )}
                </div>
                <div className="flex-1 min-w-0 text-left">
                  <div className="flex items-center justify-between mb-0.5">
                    <span className="font-semibold text-sm text-gray-900">
                      {profile.name}
                    </span>
                    <span className="text-[10px] text-gray-400">
                      {match.lastMessageAt && formatTime(match.lastMessageAt)}
                    </span>
                  </div>
                  <div className="flex items-center gap-1.5">
                    <Badge
                      variant="secondary"
                      className={`text-[9px] px-1.5 py-0 h-4 ${
                        match.mode === "dating"
                          ? "bg-rose-100 text-rose-600"
                          : "bg-blue-100 text-blue-600"
                      }`}
                    >
                      {match.mode === "dating" ? (
                        <Heart className="w-2.5 h-2.5 mr-0.5" />
                      ) : (
                        <BookOpen className="w-2.5 h-2.5 mr-0.5" />
                      )}
                      {match.mode}
                    </Badge>
                    <p
                      className={`text-xs truncate ${
                        match.unread > 0
                          ? "font-semibold text-gray-800"
                          : "text-gray-500"
                      }`}
                    >
                      {match.lastMessage}
                    </p>
                  </div>
                </div>
              </button>
            );
          })}
        </div>
      )}
    </ScrollArea>
  );
}
