"use client";

import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Zap, Send, Heart, Lock, Eye, EyeOff, Check } from "lucide-react";
import type { Profile } from "@/lib/types";

interface TartanCrushProps {
  profiles: Profile[];
  getProfile: (id: string) => Profile | undefined;
}

interface CrushSignal {
  profileId: string;
  sent: boolean;
  revealed: boolean;
}

export function TartanCrush({ profiles, getProfile }: TartanCrushProps) {
  const [signals, setSignals] = useState<CrushSignal[]>([]);
  const [selectedId, setSelectedId] = useState<string | null>(null);
  const [justSent, setJustSent] = useState<string | null>(null);

  // Simulated incoming crushes
  const [incomingCrushes] = useState([
    { hint: "Someone from SCS", college: "SCS", year: 2027 },
    { hint: "A Tepper student", college: "Tepper", year: 2026 },
  ]);

  function sendCrush(profileId: string) {
    setSignals((prev) => [
      ...prev,
      { profileId, sent: true, revealed: false },
    ]);
    setJustSent(profileId);
    setSelectedId(null);
    setTimeout(() => setJustSent(null), 2000);
  }

  const sentIds = new Set(signals.map((s) => s.profileId));

  return (
    <div className="h-full flex flex-col overflow-hidden">
      {/* Header info */}
      <div className="px-5 pt-4 pb-3 flex-shrink-0">
        <div className="bg-gradient-to-r from-amber-50 to-orange-50 rounded-2xl p-4 border border-amber-100">
          <div className="flex items-center gap-2 mb-2">
            <div className="w-8 h-8 rounded-lg bg-gradient-to-br from-amber-400 to-orange-500 flex items-center justify-center">
              <Zap className="w-4 h-4 text-white" />
            </div>
            <div>
              <h3 className="text-sm font-bold text-gray-900">
                Tartan Crush
              </h3>
              <p className="text-[10px] text-gray-500">
                Anonymous until mutual
              </p>
            </div>
          </div>
          <p className="text-xs text-gray-500 leading-relaxed">
            Send a secret signal to your crush. If they signal you back, both
            identities are revealed!
          </p>
        </div>
      </div>

      {/* Incoming crushes */}
      <div className="px-5 mb-4 flex-shrink-0">
        <h4 className="text-xs font-semibold text-gray-400 uppercase tracking-wider mb-2">
          Secret Admirers ({incomingCrushes.length})
        </h4>
        <div className="space-y-2">
          {incomingCrushes.map((crush, i) => (
            <motion.div
              key={i}
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: i * 0.1 }}
              className="flex items-center gap-3 bg-gradient-to-r from-amber-50/50 to-transparent rounded-xl p-3 border border-amber-100/50"
            >
              <div className="w-10 h-10 rounded-full bg-gradient-to-br from-amber-200 to-orange-200 flex items-center justify-center">
                <Lock className="w-4 h-4 text-amber-600" />
              </div>
              <div className="flex-1">
                <p className="text-sm font-medium text-gray-800">
                  {crush.hint}
                </p>
                <p className="text-[10px] text-gray-400">
                  Class of {crush.year} &middot; sent you a signal
                </p>
              </div>
              <Badge className="bg-amber-100 text-amber-600 hover:bg-amber-100 text-[10px]">
                <EyeOff className="w-3 h-3 mr-1" />
                Hidden
              </Badge>
            </motion.div>
          ))}
        </div>
      </div>

      {/* Send a crush */}
      <div className="px-5 flex-1 overflow-y-auto pb-4">
        <h4 className="text-xs font-semibold text-gray-400 uppercase tracking-wider mb-2">
          Send a Signal
        </h4>
        <div className="space-y-2">
          {profiles.slice(0, 8).map((profile) => {
            const isSent = sentIds.has(profile.id);
            const isJustSent = justSent === profile.id;
            const isSelected = selectedId === profile.id;

            return (
              <motion.div
                key={profile.id}
                layout
                className={`relative rounded-xl border transition-all ${
                  isSelected
                    ? "border-amber-300 bg-amber-50"
                    : isSent
                    ? "border-emerald-200 bg-emerald-50/50"
                    : "border-gray-100 bg-white hover:border-gray-200"
                }`}
              >
                <button
                  onClick={() =>
                    !isSent && setSelectedId(isSelected ? null : profile.id)
                  }
                  disabled={isSent}
                  className="w-full flex items-center gap-3 p-3 text-left"
                >
                  <Avatar className="w-10 h-10">
                    <AvatarImage src={profile.photos[0]} />
                    <AvatarFallback className="bg-gray-200 text-gray-600 text-sm font-semibold">
                      {profile.name[0]}
                    </AvatarFallback>
                  </Avatar>
                  <div className="flex-1 min-w-0">
                    <p className="text-sm font-semibold text-gray-900">
                      {profile.name}
                    </p>
                    <p className="text-[10px] text-gray-400 truncate">
                      {profile.major} &middot; {profile.college}
                    </p>
                  </div>
                  {isSent ? (
                    <AnimatePresence>
                      {isJustSent ? (
                        <motion.div
                          initial={{ scale: 0 }}
                          animate={{ scale: 1 }}
                          className="flex items-center gap-1 text-emerald-500"
                        >
                          <Check className="w-4 h-4" />
                          <span className="text-xs font-semibold">Sent!</span>
                        </motion.div>
                      ) : (
                        <Badge className="bg-emerald-100 text-emerald-600 hover:bg-emerald-100 text-[10px]">
                          <Eye className="w-3 h-3 mr-1" />
                          Signal sent
                        </Badge>
                      )}
                    </AnimatePresence>
                  ) : (
                    <Heart
                      className={`w-5 h-5 transition-colors ${
                        isSelected
                          ? "text-amber-500 fill-amber-500"
                          : "text-gray-300"
                      }`}
                    />
                  )}
                </button>

                {/* Send confirmation */}
                <AnimatePresence>
                  {isSelected && (
                    <motion.div
                      initial={{ height: 0, opacity: 0 }}
                      animate={{ height: "auto", opacity: 1 }}
                      exit={{ height: 0, opacity: 0 }}
                      className="overflow-hidden"
                    >
                      <div className="px-3 pb-3 flex items-center gap-2">
                        <p className="text-xs text-gray-500 flex-1">
                          Send an anonymous signal to{" "}
                          {profile.name.split(" ")[0]}?
                        </p>
                        <Button
                          size="sm"
                          onClick={(e) => {
                            e.stopPropagation();
                            sendCrush(profile.id);
                          }}
                          className="rounded-full bg-gradient-to-r from-amber-400 to-orange-500 hover:from-amber-500 hover:to-orange-600 text-white text-xs h-8 px-4"
                        >
                          <Send className="w-3 h-3 mr-1.5" />
                          Signal
                        </Button>
                      </div>
                    </motion.div>
                  )}
                </AnimatePresence>
              </motion.div>
            );
          })}
        </div>
      </div>
    </div>
  );
}
