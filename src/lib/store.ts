"use client";

import { useState, useCallback, useMemo } from "react";
import type { Profile, Match, Message, MatchMode, SwipeDirection } from "./types";
import { MOCK_PROFILES, INITIAL_MATCHES, INITIAL_MESSAGES, MY_PROFILE } from "./mock-data";

export function useAppStore() {
  const [profiles] = useState<Profile[]>(MOCK_PROFILES);
  const [matches, setMatches] = useState<Match[]>(INITIAL_MATCHES);
  const [messages, setMessages] = useState<Message[]>(INITIAL_MESSAGES);
  const [swipedIds, setSwipedIds] = useState<Set<string>>(
    () => new Set(INITIAL_MATCHES.map((m) => m.profileId))
  );
  const [currentMode, setCurrentMode] = useState<MatchMode>("dating");
  const [myProfile] = useState<Profile>(MY_PROFILE);

  // Get profiles that haven't been swiped yet
  const availableProfiles = useMemo(
    () =>
      profiles.filter(
        (p) => !swipedIds.has(p.id) && p.matchMode.includes(currentMode)
      ),
    [profiles, swipedIds, currentMode]
  );

  const swipe = useCallback(
    (profileId: string, direction: SwipeDirection) => {
      setSwipedIds((prev) => new Set(prev).add(profileId));

      // Right swipe or up (super like) = match
      if (direction === "right" || direction === "up") {
        const newMatch: Match = {
          id: `m-${Date.now()}`,
          profileId,
          matchedAt: Date.now(),
          mode: currentMode,
          unread: 0,
        };
        setMatches((prev) => [newMatch, ...prev]);
        return newMatch;
      }
      return null;
    },
    [currentMode]
  );

  const sendMessage = useCallback(
    (matchId: string, text: string) => {
      const msg: Message = {
        id: `msg-${Date.now()}`,
        matchId,
        senderId: myProfile.id,
        text,
        timestamp: Date.now(),
      };
      setMessages((prev) => [...prev, msg]);
      setMatches((prev) =>
        prev.map((m) =>
          m.id === matchId
            ? { ...m, lastMessage: text, lastMessageAt: Date.now(), unread: 0 }
            : m
        )
      );
      return msg;
    },
    [myProfile.id]
  );

  const getMessagesForMatch = useCallback(
    (matchId: string) => messages.filter((m) => m.matchId === matchId),
    [messages]
  );

  const getProfile = useCallback(
    (id: string): Profile | undefined => {
      if (id === "me") return myProfile;
      return profiles.find((p) => p.id === id);
    },
    [profiles, myProfile]
  );

  const markRead = useCallback((matchId: string) => {
    setMatches((prev) =>
      prev.map((m) => (m.id === matchId ? { ...m, unread: 0 } : m))
    );
  }, []);

  return {
    myProfile,
    profiles,
    matches,
    messages,
    availableProfiles,
    currentMode,
    setCurrentMode,
    swipe,
    sendMessage,
    getMessagesForMatch,
    getProfile,
    markRead,
  };
}
