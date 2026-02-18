"use client";

import { useState } from "react";
import { useAppStore } from "@/lib/store";
import { apiPost, apiPut } from "@/lib/api";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { Badge } from "@/components/ui/badge";
import { GraduationCap, LogOut, Save, BookOpen, MapPin } from "lucide-react";

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

interface ProfileViewProps {
  onLogout: () => void;
}

export function ProfileView({ onLogout }: ProfileViewProps) {
  const { user, setUser } = useAppStore();
  const [bio, setBio] = useState(user?.bio || "");
  const [saving, setSaving] = useState(false);
  const [saved, setSaved] = useState(false);

  if (!user) return null;

  const colorIdx = getColorIndex(user.name);

  const handleSave = async () => {
    setSaving(true);
    await apiPut("/api/profile", { bio });
    setUser({ ...user, bio });
    setSaving(false);
    setSaved(true);
    setTimeout(() => setSaved(false), 2000);
  };

  const handleLogout = async () => {
    await apiPost("/api/auth/logout", {});
    setUser(null);
    onLogout();
  };

  return (
    <div className="flex-1 overflow-y-auto">
      <div className="p-4">
        {/* Header card */}
        <div className="text-center mb-6">
          <div
            className={`w-24 h-24 mx-auto rounded-full bg-gradient-to-br ${INITIALS_COLORS[colorIdx]} flex items-center justify-center mb-3`}
          >
            <span className="text-3xl font-bold text-white">{getInitials(user.name)}</span>
          </div>
          <h2 className="text-xl font-bold text-gray-900">{user.name}, {user.age}</h2>
          <p className="text-sm text-gray-500">{user.email}</p>
          <div className="flex items-center justify-center gap-2 mt-2">
            <Badge variant="outline" className="text-xs">
              <GraduationCap className="w-3 h-3 mr-1" />
              {user.college}
            </Badge>
            <Badge variant="outline" className="text-xs">
              &apos;{String(user.grad_year).slice(2)}
            </Badge>
          </div>
          <p className="text-sm text-gray-600 mt-1">{user.major}</p>
        </div>

        {/* Bio edit */}
        <div className="mb-6">
          <label className="text-sm font-medium text-gray-700 mb-2 block">Bio</label>
          <Textarea
            value={bio}
            onChange={(e) => setBio(e.target.value)}
            placeholder="Tell others about yourself..."
            rows={3}
            maxLength={300}
          />
          <div className="flex items-center justify-between mt-2">
            <span className="text-xs text-gray-400">{bio.length}/300</span>
            <Button
              size="sm"
              onClick={handleSave}
              disabled={saving}
              className="bg-gradient-to-r from-rose-500 to-red-500"
            >
              {saved ? "Saved!" : saving ? "Saving..." : <><Save className="w-3 h-3 mr-1" /> Save</>}
            </Button>
          </div>
        </div>

        {/* Activities */}
        {user.activities.length > 0 && (
          <div className="mb-4">
            <div className="flex items-center gap-1 text-sm font-medium text-gray-700 mb-2">
              <BookOpen className="w-4 h-4" />
              Activities
            </div>
            <div className="flex flex-wrap gap-1.5">
              {user.activities.map((a) => (
                <Badge key={a} variant="secondary" className="text-xs">
                  {a}
                </Badge>
              ))}
            </div>
          </div>
        )}

        {/* Study spots */}
        {user.study_spots.length > 0 && (
          <div className="mb-6">
            <div className="flex items-center gap-1 text-sm font-medium text-gray-700 mb-2">
              <MapPin className="w-4 h-4" />
              Study Spots
            </div>
            <div className="flex flex-wrap gap-1.5">
              {user.study_spots.map((s) => (
                <Badge key={s} variant="secondary" className="text-xs">
                  {s}
                </Badge>
              ))}
            </div>
          </div>
        )}

        {/* Logout */}
        <Button variant="outline" onClick={handleLogout} className="w-full text-red-500 border-red-200 hover:bg-red-50">
          <LogOut className="w-4 h-4 mr-2" />
          Sign Out
        </Button>
      </div>
    </div>
  );
}
