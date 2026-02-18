"use client";

import { motion, AnimatePresence } from "framer-motion";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Button } from "@/components/ui/button";
import { Heart, BookOpen, MessageCircle, X } from "lucide-react";
import type { Profile, MatchMode } from "@/lib/types";

interface MatchPopupProps {
  profile: Profile | null;
  mode: MatchMode;
  onChat: () => void;
  onClose: () => void;
}

export function MatchPopup({ profile, mode, onChat, onClose }: MatchPopupProps) {
  if (!profile) return null;

  return (
    <AnimatePresence>
      <motion.div
        className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-sm"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        exit={{ opacity: 0 }}
      >
        <motion.div
          className="relative w-80 bg-white rounded-3xl p-8 text-center shadow-2xl"
          initial={{ scale: 0.5, y: 50 }}
          animate={{ scale: 1, y: 0 }}
          exit={{ scale: 0.5, y: 50 }}
          transition={{ type: "spring", damping: 20 }}
        >
          <button
            onClick={onClose}
            className="absolute top-4 right-4 p-1 rounded-full hover:bg-gray-100"
          >
            <X className="w-5 h-5 text-gray-400" />
          </button>

          {/* Animated hearts/books */}
          <motion.div
            className="flex justify-center mb-4"
            initial={{ scale: 0 }}
            animate={{ scale: 1 }}
            transition={{ delay: 0.2, type: "spring" }}
          >
            <div
              className={`w-20 h-20 rounded-full flex items-center justify-center ${
                mode === "dating"
                  ? "bg-gradient-to-br from-rose-400 to-pink-500"
                  : "bg-gradient-to-br from-blue-400 to-indigo-500"
              }`}
            >
              {mode === "dating" ? (
                <Heart className="w-10 h-10 text-white fill-white" />
              ) : (
                <BookOpen className="w-10 h-10 text-white" />
              )}
            </div>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.3 }}
          >
            <h2
              className={`text-2xl font-bold mb-1 bg-clip-text text-transparent ${
                mode === "dating"
                  ? "bg-gradient-to-r from-rose-500 to-pink-500"
                  : "bg-gradient-to-r from-blue-500 to-indigo-500"
              }`}
            >
              {mode === "dating" ? "It's a Match!" : "Study Buddy!"}
            </h2>
            <p className="text-sm text-gray-500 mb-5">
              {mode === "dating"
                ? `You and ${profile.name.split(" ")[0]} liked each other`
                : `You and ${profile.name.split(" ")[0]} want to study together`}
            </p>
          </motion.div>

          <motion.div
            className="flex justify-center mb-6"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.4 }}
          >
            <Avatar className="w-24 h-24 border-4 border-white shadow-lg">
              <AvatarImage src={profile.photos[0]} />
              <AvatarFallback className="text-2xl bg-gray-200 text-gray-600">
                {profile.name[0]}
              </AvatarFallback>
            </Avatar>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.5 }}
            className="space-y-2"
          >
            <Button
              onClick={onChat}
              className={`w-full rounded-full h-12 text-sm font-semibold ${
                mode === "dating"
                  ? "bg-gradient-to-r from-rose-500 to-pink-500 hover:from-rose-600 hover:to-pink-600"
                  : "bg-gradient-to-r from-blue-500 to-indigo-500 hover:from-blue-600 hover:to-indigo-600"
              }`}
            >
              <MessageCircle className="w-4 h-4 mr-2" />
              Send a Message
            </Button>
            <Button
              onClick={onClose}
              variant="ghost"
              className="w-full rounded-full text-sm text-gray-400 hover:text-gray-600"
            >
              Keep Swiping
            </Button>
          </motion.div>
        </motion.div>
      </motion.div>
    </AnimatePresence>
  );
}
