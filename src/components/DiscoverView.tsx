"use client";

import { useEffect, useState, useCallback } from "react";
import { AnimatePresence, motion } from "framer-motion";
import { SwipeCard } from "./SwipeCard";
import { useAppStore } from "@/lib/store";
import { apiGet, apiPost } from "@/lib/api";
import { Heart, Loader2, SearchX } from "lucide-react";

export function DiscoverView() {
  const { profiles, setProfiles, removeTopProfile } = useAppStore();
  const [loading, setLoading] = useState(true);
  const [matchPopup, setMatchPopup] = useState<string | null>(null);

  useEffect(() => {
    apiGet("/api/discover").then((res) => {
      setProfiles(res.profiles || []);
      setLoading(false);
    });
  }, [setProfiles]);

  const handleSwipe = useCallback(
    async (direction: "like" | "pass") => {
      const profile = profiles[0];
      if (!profile) return;

      removeTopProfile();

      const res = await apiPost("/api/swipe", { targetId: profile.id, direction });
      if (res.matched) {
        setMatchPopup(profile.name);
        setTimeout(() => setMatchPopup(null), 2500);
      }
    },
    [profiles, removeTopProfile]
  );

  if (loading) {
    return (
      <div className="flex-1 flex items-center justify-center">
        <Loader2 className="w-8 h-8 text-rose-400 animate-spin" />
      </div>
    );
  }

  return (
    <div className="flex-1 flex flex-col relative overflow-hidden">
      {/* Match popup */}
      <AnimatePresence>
        {matchPopup && (
          <motion.div
            initial={{ opacity: 0, scale: 0.8 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={{ opacity: 0, scale: 0.8 }}
            className="absolute inset-0 z-50 flex items-center justify-center bg-black/50 backdrop-blur-sm"
          >
            <div className="bg-white rounded-3xl p-8 text-center shadow-2xl mx-4">
              <div className="w-20 h-20 mx-auto mb-4 rounded-full bg-gradient-to-br from-rose-400 to-pink-500 flex items-center justify-center">
                <Heart className="w-10 h-10 text-white" fill="white" />
              </div>
              <h2 className="text-2xl font-black text-gray-900 mb-1">It&apos;s a Match!</h2>
              <p className="text-gray-500">You and {matchPopup} liked each other</p>
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Cards */}
      <div className="flex-1 relative p-4">
        {profiles.length === 0 ? (
          <div className="h-full flex flex-col items-center justify-center text-center px-4">
            <div className="w-16 h-16 rounded-2xl bg-gray-100 flex items-center justify-center mb-4">
              <SearchX className="w-8 h-8 text-gray-300" />
            </div>
            <h3 className="text-lg font-bold text-gray-800 mb-1">No more profiles</h3>
            <p className="text-sm text-gray-400 max-w-[250px]">
              You&apos;ve seen everyone for now. Check back later or update your preferences.
            </p>
          </div>
        ) : (
          <AnimatePresence>
            {profiles.slice(0, 2).map((profile, i) => (
              <SwipeCard
                key={profile.id}
                profile={profile}
                onSwipe={handleSwipe}
                isTop={i === 0}
              />
            ))}
          </AnimatePresence>
        )}
      </div>
    </div>
  );
}
