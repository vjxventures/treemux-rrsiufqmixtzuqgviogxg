"use client";

import { motion, useMotionValue, useTransform, PanInfo } from "framer-motion";
import { Badge } from "@/components/ui/badge";
import { Heart, X, BookOpen, MapPin, GraduationCap } from "lucide-react";
import type { ProfileCard } from "@/lib/store";

interface SwipeCardProps {
  profile: ProfileCard;
  onSwipe: (direction: "like" | "pass") => void;
  isTop: boolean;
}

const COLLEGE_COLORS: Record<string, string> = {
  "School of Computer Science": "bg-blue-500/15 text-blue-700 border-blue-200",
  "College of Engineering": "bg-orange-500/15 text-orange-700 border-orange-200",
  "Dietrich College": "bg-green-500/15 text-green-700 border-green-200",
  "College of Fine Arts": "bg-purple-500/15 text-purple-700 border-purple-200",
  "Tepper School of Business": "bg-amber-500/15 text-amber-700 border-amber-200",
  "Mellon College of Science": "bg-teal-500/15 text-teal-700 border-teal-200",
};

const INITIALS_COLORS = [
  "from-rose-400 to-pink-500",
  "from-violet-400 to-purple-500",
  "from-blue-400 to-indigo-500",
  "from-emerald-400 to-teal-500",
  "from-amber-400 to-orange-500",
  "from-cyan-400 to-blue-500",
];

function getInitials(name: string) {
  return name
    .split(" ")
    .map((n) => n[0])
    .join("")
    .toUpperCase();
}

function getColorIndex(name: string) {
  let hash = 0;
  for (let i = 0; i < name.length; i++) {
    hash = name.charCodeAt(i) + ((hash << 5) - hash);
  }
  return Math.abs(hash) % INITIALS_COLORS.length;
}

export function SwipeCard({ profile, onSwipe, isTop }: SwipeCardProps) {
  const x = useMotionValue(0);
  const rotate = useTransform(x, [-200, 200], [-15, 15]);
  const likeOpacity = useTransform(x, [0, 100], [0, 1]);
  const passOpacity = useTransform(x, [-100, 0], [1, 0]);

  const handleDragEnd = (_: unknown, info: PanInfo) => {
    if (info.offset.x > 100) {
      onSwipe("like");
    } else if (info.offset.x < -100) {
      onSwipe("pass");
    }
  };

  const collegeColor = COLLEGE_COLORS[profile.college] || "bg-gray-100 text-gray-700 border-gray-200";
  const colorIdx = getColorIndex(profile.name);

  return (
    <motion.div
      className={`absolute inset-0 ${isTop ? "z-10 cursor-grab active:cursor-grabbing" : "z-0"}`}
      style={isTop ? { x, rotate } : {}}
      drag={isTop ? "x" : false}
      dragConstraints={{ left: 0, right: 0 }}
      dragElastic={0.7}
      onDragEnd={handleDragEnd}
      initial={isTop ? { scale: 1 } : { scale: 0.95 }}
      animate={isTop ? { scale: 1 } : { scale: 0.95 }}
      exit={{ x: 300, opacity: 0, transition: { duration: 0.3 } }}
    >
      <div className="h-full rounded-2xl overflow-hidden bg-white border border-gray-100 shadow-xl flex flex-col">
        {/* Avatar / Photo area */}
        <div className="relative h-[45%] min-h-[200px] flex-shrink-0">
          <div className={`w-full h-full bg-gradient-to-br ${INITIALS_COLORS[colorIdx]} flex items-center justify-center`}>
            <span className="text-7xl font-bold text-white/90">{getInitials(profile.name)}</span>
          </div>

          {/* Swipe indicators */}
          {isTop && (
            <>
              <motion.div
                className="absolute top-6 right-6 border-4 border-green-500 rounded-xl px-4 py-2 -rotate-12"
                style={{ opacity: likeOpacity }}
              >
                <span className="text-green-500 text-2xl font-black tracking-wide">LIKE</span>
              </motion.div>
              <motion.div
                className="absolute top-6 left-6 border-4 border-red-500 rounded-xl px-4 py-2 rotate-12"
                style={{ opacity: passOpacity }}
              >
                <span className="text-red-500 text-2xl font-black tracking-wide">NOPE</span>
              </motion.div>
            </>
          )}

          {/* Compatibility badge */}
          <div className="absolute bottom-4 right-4 bg-white/95 backdrop-blur rounded-full px-3 py-1.5 shadow-lg border border-white/50">
            <span className="text-sm font-bold bg-gradient-to-r from-rose-500 to-pink-500 bg-clip-text text-transparent">
              {profile.compatibility}% match
            </span>
          </div>
        </div>

        {/* Info */}
        <div className="flex-1 p-5 overflow-y-auto">
          <div className="flex items-baseline gap-2 mb-1">
            <h2 className="text-2xl font-bold text-gray-900">{profile.name}</h2>
            <span className="text-xl text-gray-400">{profile.age}</span>
          </div>

          <div className="flex items-center gap-1.5 mb-3">
            <Badge variant="outline" className={`text-xs font-medium ${collegeColor}`}>
              <GraduationCap className="w-3 h-3 mr-1" />
              {profile.college.replace("School of ", "").replace("College of ", "")}
            </Badge>
            <Badge variant="outline" className="text-xs text-gray-500">
              '{String(profile.grad_year).slice(2)}
            </Badge>
          </div>

          <p className="text-sm text-gray-500 font-medium mb-1">{profile.major}</p>
          <p className="text-sm text-gray-700 mb-4 leading-relaxed">{profile.bio}</p>

          {profile.activities.length > 0 && (
            <div className="mb-3">
              <div className="flex items-center gap-1 text-xs text-gray-400 font-medium mb-1.5">
                <BookOpen className="w-3 h-3" />
                Activities
              </div>
              <div className="flex flex-wrap gap-1.5">
                {profile.activities.map((a) => (
                  <Badge key={a} variant="secondary" className="text-xs font-normal bg-gray-50">
                    {a}
                  </Badge>
                ))}
              </div>
            </div>
          )}

          {profile.study_spots.length > 0 && (
            <div>
              <div className="flex items-center gap-1 text-xs text-gray-400 font-medium mb-1.5">
                <MapPin className="w-3 h-3" />
                Study spots
              </div>
              <div className="flex flex-wrap gap-1.5">
                {profile.study_spots.map((s) => (
                  <Badge key={s} variant="secondary" className="text-xs font-normal bg-gray-50">
                    {s}
                  </Badge>
                ))}
              </div>
            </div>
          )}
        </div>

        {/* Action buttons */}
        {isTop && (
          <div className="flex justify-center gap-6 p-4 border-t border-gray-50">
            <button
              onClick={() => onSwipe("pass")}
              className="w-14 h-14 rounded-full border-2 border-red-200 flex items-center justify-center hover:bg-red-50 hover:border-red-300 transition-all hover:scale-110 active:scale-95"
            >
              <X className="w-7 h-7 text-red-400" />
            </button>
            <button
              onClick={() => onSwipe("like")}
              className="w-14 h-14 rounded-full border-2 border-green-200 flex items-center justify-center hover:bg-green-50 hover:border-green-300 transition-all hover:scale-110 active:scale-95"
            >
              <Heart className="w-7 h-7 text-green-400" />
            </button>
          </div>
        )}
      </div>
    </motion.div>
  );
}
