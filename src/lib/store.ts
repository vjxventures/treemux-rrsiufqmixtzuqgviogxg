"use client";

import { create } from "zustand";

export interface User {
  id: string;
  email: string;
  name: string;
  age: number;
  gender: string;
  interested_in: string;
  college: string;
  major: string;
  grad_year: number;
  bio: string;
  photo_url: string;
  activities: string[];
  study_spots: string[];
}

export interface ProfileCard {
  id: string;
  name: string;
  age: number;
  gender: string;
  college: string;
  major: string;
  grad_year: number;
  bio: string;
  photo_url: string;
  activities: string[];
  study_spots: string[];
  compatibility: number;
}

export interface MatchItem {
  matchId: string;
  matchedAt: string;
  user: {
    id: string;
    name: string;
    college: string;
    major: string;
    grad_year: number;
    photo_url: string;
    bio: string;
  };
  lastMessage: { content: string; isMe: boolean; time: string } | null;
}

export interface Message {
  id: string;
  senderId: string;
  content: string;
  createdAt: string;
  isMe: boolean;
}

interface AppState {
  user: User | null;
  profiles: ProfileCard[];
  matches: MatchItem[];
  currentChat: { matchId: string; userName: string } | null;
  messages: Message[];
  loading: boolean;
  tab: "discover" | "matches" | "profile";

  setUser: (user: User | null) => void;
  setProfiles: (profiles: ProfileCard[]) => void;
  setMatches: (matches: MatchItem[]) => void;
  setCurrentChat: (chat: { matchId: string; userName: string } | null) => void;
  setMessages: (messages: Message[]) => void;
  addMessage: (message: Message) => void;
  setLoading: (loading: boolean) => void;
  setTab: (tab: "discover" | "matches" | "profile") => void;
  removeTopProfile: () => void;
}

export const useAppStore = create<AppState>((set) => ({
  user: null,
  profiles: [],
  matches: [],
  currentChat: null,
  messages: [],
  loading: false,
  tab: "discover",

  setUser: (user) => set({ user }),
  setProfiles: (profiles) => set({ profiles }),
  setMatches: (matches) => set({ matches }),
  setCurrentChat: (chat) => set({ currentChat: chat }),
  setMessages: (messages) => set({ messages }),
  addMessage: (message) => set((s) => ({ messages: [...s.messages, message] })),
  setLoading: (loading) => set({ loading }),
  setTab: (tab) => set({ tab }),
  removeTopProfile: () => set((s) => ({ profiles: s.profiles.slice(1) })),
}));
