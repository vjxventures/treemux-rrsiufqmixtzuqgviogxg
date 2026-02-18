"use client";

import { useEffect, useRef, useState } from "react";
import { useAppStore } from "@/lib/store";
import { apiGet, apiPost } from "@/lib/api";
import { ArrowLeft, Send, Loader2 } from "lucide-react";
import { Input } from "@/components/ui/input";

export function ChatView() {
  const { currentChat, setCurrentChat, messages, setMessages, addMessage } = useAppStore();
  const [input, setInput] = useState("");
  const [loading, setLoading] = useState(true);
  const [sending, setSending] = useState(false);
  const scrollRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (!currentChat) return;
    setLoading(true);
    apiGet(`/api/messages?matchId=${currentChat.matchId}`).then((res) => {
      setMessages(res.messages || []);
      setLoading(false);
    });
  }, [currentChat, setMessages]);

  useEffect(() => {
    scrollRef.current?.scrollTo({ top: scrollRef.current.scrollHeight, behavior: "smooth" });
  }, [messages]);

  // Poll for new messages
  useEffect(() => {
    if (!currentChat) return;
    const interval = setInterval(async () => {
      const res = await apiGet(`/api/messages?matchId=${currentChat.matchId}`);
      if (res.messages) setMessages(res.messages);
    }, 3000);
    return () => clearInterval(interval);
  }, [currentChat, setMessages]);

  const handleSend = async () => {
    if (!input.trim() || !currentChat || sending) return;
    const content = input.trim();
    setInput("");
    setSending(true);

    const res = await apiPost("/api/messages", { matchId: currentChat.matchId, content });
    if (res.message) {
      addMessage(res.message);
    }
    setSending(false);
  };

  if (!currentChat) return null;

  return (
    <div className="flex-1 flex flex-col bg-white">
      {/* Header */}
      <div className="flex items-center gap-3 px-4 py-3 border-b border-gray-100">
        <button
          onClick={() => setCurrentChat(null)}
          className="text-gray-400 hover:text-gray-600 transition-colors"
        >
          <ArrowLeft className="w-5 h-5" />
        </button>
        <h2 className="font-semibold text-gray-900">{currentChat.userName}</h2>
      </div>

      {/* Messages */}
      <div ref={scrollRef} className="flex-1 overflow-y-auto p-4 space-y-3">
        {loading ? (
          <div className="flex justify-center py-8">
            <Loader2 className="w-6 h-6 text-rose-400 animate-spin" />
          </div>
        ) : messages.length === 0 ? (
          <div className="text-center py-12">
            <p className="text-sm text-gray-400">No messages yet. Say something!</p>
          </div>
        ) : (
          messages.map((msg) => (
            <div
              key={msg.id}
              className={`flex ${msg.isMe ? "justify-end" : "justify-start"}`}
            >
              <div
                className={`max-w-[75%] px-4 py-2.5 rounded-2xl text-sm ${
                  msg.isMe
                    ? "bg-gradient-to-r from-rose-500 to-red-500 text-white rounded-br-md"
                    : "bg-gray-100 text-gray-800 rounded-bl-md"
                }`}
              >
                {msg.content}
              </div>
            </div>
          ))
        )}
      </div>

      {/* Input */}
      <div className="p-3 border-t border-gray-100">
        <div className="flex gap-2">
          <Input
            value={input}
            onChange={(e) => setInput(e.target.value)}
            placeholder="Type a message..."
            onKeyDown={(e) => e.key === "Enter" && handleSend()}
            className="flex-1 rounded-full"
          />
          <button
            onClick={handleSend}
            disabled={!input.trim() || sending}
            className="w-10 h-10 rounded-full bg-gradient-to-r from-rose-500 to-red-500 flex items-center justify-center text-white disabled:opacity-50 hover:shadow-lg transition-all"
          >
            <Send className="w-4 h-4" />
          </button>
        </div>
      </div>
    </div>
  );
}
