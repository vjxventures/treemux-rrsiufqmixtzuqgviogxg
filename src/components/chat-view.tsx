"use client";

import { useState, useRef, useEffect } from "react";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { ScrollArea } from "@/components/ui/scroll-area";
import { ArrowLeft, Send, Heart, BookOpen } from "lucide-react";
import type { Match, Message, Profile } from "@/lib/types";

interface ChatViewProps {
  match: Match;
  profile: Profile;
  messages: Message[];
  onSendMessage: (text: string) => void;
  onBack: () => void;
}

function formatTimestamp(ts: number): string {
  const date = new Date(ts);
  const now = new Date();
  const isToday = date.toDateString() === now.toDateString();
  if (isToday) {
    return date.toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" });
  }
  return (
    date.toLocaleDateString([], { month: "short", day: "numeric" }) +
    " " +
    date.toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" })
  );
}

export function ChatView({
  match,
  profile,
  messages,
  onSendMessage,
  onBack,
}: ChatViewProps) {
  const [input, setInput] = useState("");
  const scrollRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    // Scroll to bottom on new message
    const el = scrollRef.current;
    if (el) {
      el.scrollTop = el.scrollHeight;
    }
  }, [messages.length]);

  function handleSend() {
    const text = input.trim();
    if (!text) return;
    onSendMessage(text);
    setInput("");
  }

  return (
    <div className="flex flex-col h-full bg-white">
      {/* Header */}
      <div className="flex items-center gap-3 px-4 py-3 border-b border-gray-100 bg-white/80 backdrop-blur-md">
        <button
          onClick={onBack}
          className="p-1 -ml-1 rounded-full hover:bg-gray-100 transition-colors"
        >
          <ArrowLeft className="w-5 h-5 text-gray-600" />
        </button>
        <Avatar className="w-10 h-10">
          <AvatarImage src={profile.photos[0]} />
          <AvatarFallback className="bg-gray-200 text-gray-600 font-semibold">
            {profile.name[0]}
          </AvatarFallback>
        </Avatar>
        <div className="flex-1 min-w-0">
          <h3 className="font-semibold text-sm text-gray-900">
            {profile.name}
          </h3>
          <div className="flex items-center gap-1.5">
            <span className="text-xs text-gray-500">{profile.major}</span>
            <Badge
              variant="secondary"
              className={`text-[9px] px-1.5 py-0 h-4 ${
                match.mode === "dating"
                  ? "bg-rose-100 text-rose-600"
                  : "bg-blue-100 text-blue-600"
              }`}
            >
              {match.mode === "dating" ? (
                <Heart className="w-2.5 h-2.5 mr-0.5" />
              ) : (
                <BookOpen className="w-2.5 h-2.5 mr-0.5" />
              )}
              {match.mode}
            </Badge>
          </div>
        </div>
      </div>

      {/* Messages */}
      <div ref={scrollRef} className="flex-1 overflow-y-auto px-4 py-4">
        {/* Match indicator */}
        <div className="flex flex-col items-center mb-6 mt-2">
          <div
            className={`w-16 h-16 rounded-full flex items-center justify-center mb-2 ${
              match.mode === "dating"
                ? "bg-gradient-to-br from-rose-400 to-pink-500"
                : "bg-gradient-to-br from-blue-400 to-indigo-500"
            }`}
          >
            {match.mode === "dating" ? (
              <Heart className="w-8 h-8 text-white fill-white" />
            ) : (
              <BookOpen className="w-8 h-8 text-white" />
            )}
          </div>
          <p className="text-sm font-medium text-gray-900">
            You matched with {profile.name.split(" ")[0]}!
          </p>
          <p className="text-xs text-gray-400 mt-0.5">
            {match.mode === "dating"
              ? "Start a conversation with your match"
              : "Connect for a study session"}
          </p>
        </div>

        {/* Message bubbles */}
        <div className="space-y-3">
          {messages.map((msg) => {
            const isMe = msg.senderId === "me";
            return (
              <div
                key={msg.id}
                className={`flex ${isMe ? "justify-end" : "justify-start"}`}
              >
                <div
                  className={`max-w-[75%] rounded-2xl px-4 py-2.5 ${
                    isMe
                      ? "bg-gradient-to-r from-rose-500 to-pink-500 text-white rounded-br-md"
                      : "bg-gray-100 text-gray-800 rounded-bl-md"
                  }`}
                >
                  <p className="text-sm">{msg.text}</p>
                  <p
                    className={`text-[10px] mt-1 ${
                      isMe ? "text-white/70" : "text-gray-400"
                    }`}
                  >
                    {formatTimestamp(msg.timestamp)}
                  </p>
                </div>
              </div>
            );
          })}
        </div>
      </div>

      {/* Input */}
      <div className="px-4 py-3 border-t border-gray-100 bg-white">
        <form
          onSubmit={(e) => {
            e.preventDefault();
            handleSend();
          }}
          className="flex items-center gap-2"
        >
          <Input
            value={input}
            onChange={(e) => setInput(e.target.value)}
            placeholder={
              match.mode === "dating"
                ? "Say something charming..."
                : "Suggest a study spot..."
            }
            className="flex-1 rounded-full bg-gray-50 border-gray-200 focus-visible:ring-rose-300"
          />
          <Button
            type="submit"
            size="icon"
            disabled={!input.trim()}
            className="rounded-full bg-gradient-to-r from-rose-500 to-pink-500 hover:from-rose-600 hover:to-pink-600 w-10 h-10 flex-shrink-0"
          >
            <Send className="w-4 h-4" />
          </Button>
        </form>
      </div>
    </div>
  );
}
