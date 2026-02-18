"use client";

import { useState, useCallback } from "react";
import { AnimatePresence, motion } from "framer-motion";
import {
  Flame,
  MessageCircle,
  User,
  Heart,
  BookOpen,
  Sparkles,
  Zap,
} from "lucide-react";
import { SwipeCard, SwipeButtons } from "@/components/swipe-card";
import { MatchList } from "@/components/match-list";
import { ChatView } from "@/components/chat-view";
import { ProfileView } from "@/components/profile-view";
import { MatchPopup } from "@/components/match-popup";
import { Onboarding } from "@/components/onboarding";
import { TartanCrush } from "@/components/tartan-crush";
import { useAppStore } from "@/lib/store";
import type { SwipeDirection, Match } from "@/lib/types";

type Tab = "discover" | "crush" | "matches" | "profile";

export function ScottyApp() {
  const store = useAppStore();
  const [showOnboarding, setShowOnboarding] = useState(true);
  const [activeTab, setActiveTab] = useState<Tab>("discover");
  const [currentIndex, setCurrentIndex] = useState(0);
  const [newMatch, setNewMatch] = useState<Match | null>(null);
  const [activeChatId, setActiveChatId] = useState<string | null>(null);

  if (showOnboarding) {
    return <Onboarding onComplete={() => setShowOnboarding(false)} />;
  }

  const handleSwipe = useCallback(
    (direction: SwipeDirection) => {
      const match = store.swipe(
        store.availableProfiles[currentIndex]?.id,
        direction
      );
      if (match) {
        setNewMatch(match);
      }
      setTimeout(() => {
        setCurrentIndex((i) => i + 1);
      }, 300);
    },
    [store, currentIndex]
  );

  const totalUnread = store.matches.reduce((sum, m) => sum + m.unread, 0);

  const activeChatMatch = activeChatId
    ? store.matches.find((m) => m.id === activeChatId)
    : null;
  const activeChatProfile = activeChatMatch
    ? store.getProfile(activeChatMatch.profileId)
    : null;

  if (activeChatMatch && activeChatProfile) {
    return (
      <div className="h-full">
        <ChatView
          match={activeChatMatch}
          profile={activeChatProfile}
          messages={store.getMessagesForMatch(activeChatMatch.id)}
          onSendMessage={(text) => store.sendMessage(activeChatMatch.id, text)}
          onBack={() => setActiveChatId(null)}
        />
      </div>
    );
  }

  return (
    <div className="flex flex-col h-full bg-gray-50">
      {newMatch && (
        <MatchPopup
          profile={store.getProfile(newMatch.profileId) || null}
          mode={newMatch.mode}
          onChat={() => {
            setActiveChatId(newMatch.id);
            setNewMatch(null);
          }}
          onClose={() => setNewMatch(null)}
        />
      )}

      <header className="bg-white border-b border-gray-100 px-5 py-3 flex items-center justify-between flex-shrink-0">
        <div className="flex items-center gap-2">
          <div className="w-8 h-8 rounded-lg bg-gradient-to-br from-rose-500 to-pink-600 flex items-center justify-center">
            <Sparkles className="w-4 h-4 text-white" />
          </div>
          <h1 className="text-lg font-bold bg-clip-text text-transparent bg-gradient-to-r from-rose-500 to-pink-600">
            ScottyMeet
          </h1>
        </div>

        {activeTab === "discover" && (
          <div className="flex bg-gray-100 rounded-full p-1">
            <button
              onClick={() => {
                store.setCurrentMode("dating");
                setCurrentIndex(0);
              }}
              className={`flex items-center gap-1.5 text-xs font-semibold px-3 py-1.5 rounded-full transition-all ${
                store.currentMode === "dating"
                  ? "bg-white text-rose-500 shadow-sm"
                  : "text-gray-400 hover:text-gray-600"
              }`}
            >
              <Heart className="w-3 h-3" />
              Dating
            </button>
            <button
              onClick={() => {
                store.setCurrentMode("study");
                setCurrentIndex(0);
              }}
              className={`flex items-center gap-1.5 text-xs font-semibold px-3 py-1.5 rounded-full transition-all ${
                store.currentMode === "study"
                  ? "bg-white text-blue-500 shadow-sm"
                  : "text-gray-400 hover:text-gray-600"
              }`}
            >
              <BookOpen className="w-3 h-3" />
              Study
            </button>
          </div>
        )}

        {activeTab === "crush" && (
          <h2 className="text-sm font-semibold text-amber-500">Tartan Crush</h2>
        )}
        {activeTab === "matches" && (
          <h2 className="text-sm font-semibold text-gray-500">Messages</h2>
        )}
        {activeTab === "profile" && (
          <h2 className="text-sm font-semibold text-gray-500">Profile</h2>
        )}
      </header>

      <main className="flex-1 overflow-hidden relative">
        <AnimatePresence mode="wait">
          {activeTab === "discover" && (
            <motion.div
              key="discover"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="h-full flex flex-col px-5 py-4"
            >
              <div className="relative flex-1 max-h-[520px]">
                {store.availableProfiles.length > 0 &&
                currentIndex < store.availableProfiles.length ? (
                  <>
                    {currentIndex + 1 < store.availableProfiles.length && (
                      <SwipeCard
                        key={store.availableProfiles[currentIndex + 1].id + "-bg"}
                        profile={store.availableProfiles[currentIndex + 1]}
                        onSwipe={() => {}}
                        isTop={false}
                      />
                    )}
                    <SwipeCard
                      key={store.availableProfiles[currentIndex].id}
                      profile={store.availableProfiles[currentIndex]}
                      onSwipe={handleSwipe}
                      isTop={true}
                    />
                  </>
                ) : (
                  <div className="flex flex-col items-center justify-center h-full text-gray-400">
                    <Sparkles className="w-16 h-16 mb-4 opacity-20" />
                    <p className="text-lg font-semibold text-gray-500">
                      No more profiles
                    </p>
                    <p className="text-sm mt-1">
                      Check back later for new Scotties!
                    </p>
                    <button
                      onClick={() => setCurrentIndex(0)}
                      className="mt-4 text-sm text-rose-500 font-medium hover:underline"
                    >
                      Start over
                    </button>
                  </div>
                )}
              </div>

              <SwipeButtons
                onSwipe={handleSwipe}
                disabled={currentIndex >= store.availableProfiles.length}
              />
            </motion.div>
          )}

          {activeTab === "crush" && (
            <motion.div
              key="crush"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="h-full"
            >
              <TartanCrush
                profiles={store.profiles}
                getProfile={store.getProfile}
              />
            </motion.div>
          )}

          {activeTab === "matches" && (
            <motion.div
              key="matches"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="h-full"
            >
              <MatchList
                matches={store.matches}
                getProfile={store.getProfile}
                onSelectMatch={(id) => {
                  const m = store.matches.find((m) => m.id === id);
                  if (m) {
                    store.markRead(id);
                    setActiveChatId(id);
                  }
                }}
              />
            </motion.div>
          )}

          {activeTab === "profile" && (
            <motion.div
              key="profile"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="h-full"
            >
              <ProfileView profile={store.myProfile} />
            </motion.div>
          )}
        </AnimatePresence>
      </main>

      <nav className="bg-white border-t border-gray-100 flex items-center justify-around py-2 flex-shrink-0">
        <button
          onClick={() => setActiveTab("discover")}
          className={`flex flex-col items-center gap-0.5 px-3 py-1.5 rounded-xl transition-colors ${
            activeTab === "discover"
              ? "text-rose-500"
              : "text-gray-400 hover:text-gray-600"
          }`}
        >
          <Flame
            className={`w-6 h-6 ${activeTab === "discover" ? "fill-rose-500" : ""}`}
          />
          <span className="text-[10px] font-semibold">Discover</span>
        </button>

        <button
          onClick={() => setActiveTab("crush")}
          className={`relative flex flex-col items-center gap-0.5 px-3 py-1.5 rounded-xl transition-colors ${
            activeTab === "crush"
              ? "text-amber-500"
              : "text-gray-400 hover:text-gray-600"
          }`}
        >
          <Zap
            className={`w-6 h-6 ${activeTab === "crush" ? "fill-amber-500" : ""}`}
          />
          <span className="absolute -top-0.5 right-1 w-4 h-4 bg-amber-500 text-white text-[9px] font-bold rounded-full flex items-center justify-center">
            2
          </span>
          <span className="text-[10px] font-semibold">Crush</span>
        </button>

        <button
          onClick={() => setActiveTab("matches")}
          className={`relative flex flex-col items-center gap-0.5 px-3 py-1.5 rounded-xl transition-colors ${
            activeTab === "matches"
              ? "text-rose-500"
              : "text-gray-400 hover:text-gray-600"
          }`}
        >
          <MessageCircle
            className={`w-6 h-6 ${activeTab === "matches" ? "fill-rose-500" : ""}`}
          />
          {totalUnread > 0 && (
            <span className="absolute -top-0.5 right-1 w-4 h-4 bg-rose-500 text-white text-[9px] font-bold rounded-full flex items-center justify-center">
              {totalUnread}
            </span>
          )}
          <span className="text-[10px] font-semibold">Matches</span>
        </button>

        <button
          onClick={() => setActiveTab("profile")}
          className={`flex flex-col items-center gap-0.5 px-3 py-1.5 rounded-xl transition-colors ${
            activeTab === "profile"
              ? "text-rose-500"
              : "text-gray-400 hover:text-gray-600"
          }`}
        >
          <User
            className={`w-6 h-6 ${activeTab === "profile" ? "fill-rose-500" : ""}`}
          />
          <span className="text-[10px] font-semibold">Profile</span>
        </button>
      </nav>
    </div>
  );
}
