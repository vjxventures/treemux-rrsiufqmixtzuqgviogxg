"use client";

import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Badge } from "@/components/ui/badge";
import { Separator } from "@/components/ui/separator";
import {
  GraduationCap,
  MapPin,
  Heart,
  BookOpen,
  Settings,
  LogOut,
  Shield,
} from "lucide-react";
import type { Profile } from "@/lib/types";
import { COLLEGE_NAMES } from "@/lib/types";

interface ProfileViewProps {
  profile: Profile;
}

export function ProfileView({ profile }: ProfileViewProps) {
  return (
    <div className="flex flex-col items-center px-6 py-8 h-full overflow-y-auto">
      {/* Avatar */}
      <div className="relative mb-4">
        <div className="rounded-full p-1 bg-gradient-to-br from-rose-400 via-pink-500 to-purple-500">
          <Avatar className="w-28 h-28 border-4 border-white">
            <AvatarImage src={profile.photos[0]} />
            <AvatarFallback className="text-3xl bg-gray-200 text-gray-600">
              {profile.name[0]}
            </AvatarFallback>
          </Avatar>
        </div>
        <div className="absolute -bottom-1 left-1/2 -translate-x-1/2 bg-emerald-500 text-white text-[10px] font-bold px-2.5 py-0.5 rounded-full">
          VERIFIED
        </div>
      </div>

      <h2 className="text-2xl font-bold text-gray-900">
        {profile.name}, {profile.age}
      </h2>

      <div className="flex items-center gap-2 text-sm text-gray-500 mt-1">
        <GraduationCap className="w-4 h-4" />
        <span>{profile.major}</span>
        <span className="text-gray-300">|</span>
        <span>Class of {profile.gradYear}</span>
      </div>

      <div className="flex items-center gap-1.5 text-xs text-gray-400 mt-1">
        <MapPin className="w-3 h-3" />
        <span>{COLLEGE_NAMES[profile.college]}</span>
      </div>

      {/* Mode badges */}
      <div className="flex gap-2 mt-4">
        {profile.matchMode.includes("dating") && (
          <Badge className="bg-rose-100 text-rose-600 hover:bg-rose-100 gap-1">
            <Heart className="w-3 h-3" />
            Dating
          </Badge>
        )}
        {profile.matchMode.includes("study") && (
          <Badge className="bg-blue-100 text-blue-600 hover:bg-blue-100 gap-1">
            <BookOpen className="w-3 h-3" />
            Study Dates
          </Badge>
        )}
      </div>

      <Separator className="my-6 w-full" />

      {/* Bio */}
      <div className="w-full">
        <h3 className="text-xs font-semibold text-gray-400 uppercase tracking-wider mb-2">
          About Me
        </h3>
        <p className="text-sm text-gray-600 leading-relaxed">{profile.bio}</p>
      </div>

      {/* Interests */}
      <div className="w-full mt-5">
        <h3 className="text-xs font-semibold text-gray-400 uppercase tracking-wider mb-2">
          Interests
        </h3>
        <div className="flex flex-wrap gap-2">
          {profile.interests.map((interest) => (
            <Badge
              key={interest}
              variant="secondary"
              className="bg-gray-100 text-gray-600 hover:bg-gray-100"
            >
              {interest}
            </Badge>
          ))}
        </div>
      </div>

      {/* Looking for */}
      <div className="w-full mt-5">
        <h3 className="text-xs font-semibold text-gray-400 uppercase tracking-wider mb-2">
          Looking For
        </h3>
        <p className="text-sm text-gray-600 italic">{profile.lookingFor}</p>
      </div>

      <Separator className="my-6 w-full" />

      {/* Settings-like buttons */}
      <div className="w-full space-y-1">
        <button className="w-full flex items-center gap-3 p-3 rounded-xl hover:bg-gray-50 transition-colors text-sm text-gray-700">
          <Settings className="w-4 h-4 text-gray-400" />
          Edit Profile
        </button>
        <button className="w-full flex items-center gap-3 p-3 rounded-xl hover:bg-gray-50 transition-colors text-sm text-gray-700">
          <Shield className="w-4 h-4 text-gray-400" />
          Safety & Privacy
        </button>
        <button className="w-full flex items-center gap-3 p-3 rounded-xl hover:bg-gray-50 transition-colors text-sm text-red-500">
          <LogOut className="w-4 h-4" />
          Log Out
        </button>
      </div>

      {/* CMU branding */}
      <div className="mt-auto pt-6 text-center">
        <p className="text-[10px] text-gray-300 uppercase tracking-widest">
          ScottyMeet &middot; CMU Only
        </p>
      </div>
    </div>
  );
}
