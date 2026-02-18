"use client";

import { useState, useRef } from "react";
import {
  motion,
  useMotionValue,
  useTransform,
  type PanInfo,
} from "framer-motion";
import { Badge } from "@/components/ui/badge";
import { Heart, X, BookOpen, MapPin, GraduationCap } from "lucide-react";
import type { Profile, SwipeDirection } from "@/lib/types";
import { COLLEGE_NAMES } from "@/lib/types";

interface SwipeCardProps {
  profile: Profile;
  onSwipe: (direction: SwipeDirection) => void;
  isTop: boolean;
}

export function SwipeCard({ profile, onSwipe, isTop }: SwipeCardProps) {
  const [photoIndex, setPhotoIndex] = useState(0);
  const [exitDirection, setExitDirection] = useState<SwipeDirection | null>(null);
  const cardRef = useRef<HTMLDivElement>(null);

  const x = useMotionValue(0);
  const y = useMotionValue(0);
  const rotate = useTransform(x, [-300, 0, 300], [-25, 0, 25]);
  const likeOpacity = useTransform(x, [0, 100], [0, 1]);
  const nopeOpacity = useTransform(x, [-100, 0], [1, 0]);
  const superLikeOpacity = useTransform(y, [-100, 0], [1, 0]);

  function handleDragEnd(_: unknown, info: PanInfo) {
    const threshold = 100;
    const velocityThreshold = 500;

    if (
      info.offset.x > threshold ||
      info.velocity.x > velocityThreshold
    ) {
      setExitDirection("right");
      onSwipe("right");
    } else if (
      info.offset.x < -threshold ||
      info.velocity.x < -velocityThreshold
    ) {
      setExitDirection("left");
      onSwipe("left");
    } else if (
      info.offset.y < -threshold ||
      info.velocity.y < -velocityThreshold
    ) {
      setExitDirection("up");
      onSwipe("up");
    }
  }

  function cyclePhoto(e: React.MouseEvent) {
    e.stopPropagation();
    const rect = (e.target as HTMLElement).getBoundingClientRect();
    const clickX = e.clientX - rect.left;
    if (clickX > rect.width / 2) {
      setPhotoIndex((i) => (i + 1) % profile.photos.length);
    } else {
      setPhotoIndex((i) =>
        i === 0 ? profile.photos.length - 1 : i - 1
      );
    }
  }

  if (!isTop) {
    return (
      <div className="absolute inset-0 rounded-3xl bg-gradient-to-b from-white to-gray-50 border border-gray-200 shadow-md scale-[0.95] opacity-60" />
    );
  }

  return (
    <motion.div
      ref={cardRef}
      className="absolute inset-0 cursor-grab active:cursor-grabbing touch-none select-none"
      style={{ x, y, rotate }}
      drag
      dragConstraints={{ left: 0, right: 0, top: 0, bottom: 0 }}
      dragElastic={0.9}
      onDragEnd={handleDragEnd}
      animate={
        exitDirection === "right"
          ? { x: 500, opacity: 0, transition: { duration: 0.3 } }
          : exitDirection === "left"
          ? { x: -500, opacity: 0, transition: { duration: 0.3 } }
          : exitDirection === "up"
          ? { y: -500, opacity: 0, transition: { duration: 0.3 } }
          : {}
      }
      initial={{ scale: 0.95, opacity: 0 }}
      whileInView={{ scale: 1, opacity: 1 }}
      transition={{ type: "spring", stiffness: 300, damping: 25 }}
    >
      <div className="relative w-full h-full rounded-3xl overflow-hidden bg-white border border-gray-200 shadow-xl">
        {/* Photo area */}
        <div
          className="relative w-full h-[60%] bg-gradient-to-br from-rose-100 to-purple-100 cursor-pointer"
          onClick={cyclePhoto}
        >
          <img
            src={profile.photos[photoIndex]}
            alt={profile.name}
            className="w-full h-full object-cover"
          />

          {/* Photo indicators */}
          <div className="absolute top-3 left-0 right-0 flex justify-center gap-1.5 px-4">
            {profile.photos.map((_, i) => (
              <div
                key={i}
                className={`h-1 flex-1 rounded-full transition-colors ${
                  i === photoIndex ? "bg-white" : "bg-white/40"
                }`}
              />
            ))}
          </div>

          {/* Swipe indicators */}
          <motion.div
            className="absolute top-16 left-6 border-4 border-emerald-500 rounded-xl px-4 py-2 -rotate-12"
            style={{ opacity: likeOpacity }}
          >
            <span className="text-emerald-500 font-black text-3xl tracking-wider">
              LIKE
            </span>
          </motion.div>
          <motion.div
            className="absolute top-16 right-6 border-4 border-red-500 rounded-xl px-4 py-2 rotate-12"
            style={{ opacity: nopeOpacity }}
          >
            <span className="text-red-500 font-black text-3xl tracking-wider">
              NOPE
            </span>
          </motion.div>
          <motion.div
            className="absolute top-16 left-1/2 -translate-x-1/2 border-4 border-blue-500 rounded-xl px-4 py-2"
            style={{ opacity: superLikeOpacity }}
          >
            <span className="text-blue-500 font-black text-2xl tracking-wider">
              STUDY DATE
            </span>
          </motion.div>

          {/* Match mode badges */}
          <div className="absolute bottom-3 left-3 flex gap-1.5">
            {profile.matchMode.map((mode) => (
              <span
                key={mode}
                className={`text-xs font-semibold px-2.5 py-1 rounded-full backdrop-blur-md ${
                  mode === "dating"
                    ? "bg-rose-500/80 text-white"
                    : "bg-blue-500/80 text-white"
                }`}
              >
                {mode === "dating" ? "💕 Dating" : "📚 Study"}
              </span>
            ))}
          </div>
        </div>

        {/* Profile info */}
        <div className="p-5 h-[40%] flex flex-col justify-between">
          <div>
            <div className="flex items-baseline gap-2 mb-1">
              <h2 className="text-2xl font-bold text-gray-900">
                {profile.name}
              </h2>
              <span className="text-xl text-gray-500">{profile.age}</span>
            </div>

            <div className="flex items-center gap-3 text-sm text-gray-500 mb-3">
              <span className="flex items-center gap-1">
                <GraduationCap className="w-3.5 h-3.5" />
                {profile.major}
              </span>
              <span className="flex items-center gap-1">
                <MapPin className="w-3.5 h-3.5" />
                {COLLEGE_NAMES[profile.college]}
              </span>
            </div>

            <p className="text-sm text-gray-600 leading-relaxed line-clamp-2 mb-3">
              {profile.bio}
            </p>

            <div className="flex flex-wrap gap-1.5">
              {profile.interests.slice(0, 4).map((interest) => (
                <Badge
                  key={interest}
                  variant="secondary"
                  className="text-xs bg-gray-100 text-gray-600 hover:bg-gray-100"
                >
                  {interest}
                </Badge>
              ))}
            </div>
          </div>

          <p className="text-xs text-gray-400 italic">{profile.lookingFor}</p>
        </div>
      </div>
    </motion.div>
  );
}

interface SwipeButtonsProps {
  onSwipe: (direction: SwipeDirection) => void;
  disabled: boolean;
}

export function SwipeButtons({ onSwipe, disabled }: SwipeButtonsProps) {
  return (
    <div className="flex items-center justify-center gap-5 mt-6">
      <button
        onClick={() => onSwipe("left")}
        disabled={disabled}
        className="w-14 h-14 rounded-full bg-white border-2 border-red-200 flex items-center justify-center shadow-lg hover:shadow-xl hover:scale-110 transition-all disabled:opacity-40 disabled:hover:scale-100"
      >
        <X className="w-7 h-7 text-red-500" />
      </button>
      <button
        onClick={() => onSwipe("up")}
        disabled={disabled}
        className="w-12 h-12 rounded-full bg-white border-2 border-blue-200 flex items-center justify-center shadow-lg hover:shadow-xl hover:scale-110 transition-all disabled:opacity-40 disabled:hover:scale-100"
      >
        <BookOpen className="w-5 h-5 text-blue-500" />
      </button>
      <button
        onClick={() => onSwipe("right")}
        disabled={disabled}
        className="w-14 h-14 rounded-full bg-white border-2 border-emerald-200 flex items-center justify-center shadow-lg hover:shadow-xl hover:scale-110 transition-all disabled:opacity-40 disabled:hover:scale-100"
      >
        <Heart className="w-7 h-7 text-emerald-500" />
      </button>
    </div>
  );
}
