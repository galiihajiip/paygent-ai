"use client";

import { useState, useRef, useEffect, useCallback } from "react";
import MessageBubble from "./MessageBubble";
import InputBar from "./InputBar";
import Logo from "./Logo";
import ThemeToggle from "./ThemeToggle";

interface Message {
  id: string;
  role: "user" | "assistant";
  content: string;
}

const welcomeMessage: Message = {
  id: "welcome-0",
  role: "assistant",
  content:
    'Halo! 👋 Saya PayGent, asisten penagihan AI Anda. Cukup beritahu saya siapa yang ingin Anda tagih, untuk apa, dan berapa nominalnya. Contoh: "Tagihkan CV Sentosa Digital 3 juta untuk jasa pembuatan website."',
};

export default function ChatWindow() {
  const [messages, setMessages] = useState<Message[]>([welcomeMessage]);
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [error, setError] = useState<string | null>(null);

  const bottomRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    bottomRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages, isLoading]);

  const handleSendMessage = useCallback(
    async (userMessage: string) => {
      const newUserMessage: Message = {
        id: `user-${Date.now()}`,
        role: "user",
        content: userMessage,
      };

      // Snapshot the prior conversation BEFORE the optimistic UI update.
      // We send this to the bridge so the agent remembers context.
      // - Skip the synthetic "welcome-0" UI greeting (it's not part of the real chat).
      // - Skip earlier error placeholders (id starts with "error-").
      const historyForServer = messages
        .filter((m) => m.id !== "welcome-0" && !m.id.startsWith("error-"))
        .map((m) => ({ role: m.role, content: m.content }));

      setMessages((prev) => [...prev, newUserMessage]);
      setIsLoading(true);
      setError(null);

      try {
        const response = await fetch("http://localhost:3001/api/message", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            message: userMessage,
            history: historyForServer,
          }),
        });

        if (!response.ok) {
          throw new Error(`Server error: ${response.status}`);
        }

        const data = await response.json();
        // OpenClaw Gateway format: { message: string } atau { content: [{ text: string }] }
        const assistantReply =
          data.message ??
          data.content?.[0]?.text ??
          data.reply ??
          "Maaf, format respons tidak dikenali.";

        const assistantMessage: Message = {
          id: `assistant-${Date.now()}`,
          role: "assistant",
          content: assistantReply,
        };

        setMessages((prev) => [...prev, assistantMessage]);
      } catch {
        setError(
          "Gagal terhubung ke server. Pastikan PayGent bridge berjalan di port 3001."
        );
        const errorMessage: Message = {
          id: `error-${Date.now()}`,
          role: "assistant",
          content:
            "⚠️ Maaf, saya tidak dapat terhubung ke server saat ini. Silakan coba beberapa saat lagi.",
        };
        setMessages((prev) => [...prev, errorMessage]);
      } finally {
        setIsLoading(false);
      }
    },
    [messages],
  );

  return (
    <div className="flex flex-col h-[100dvh] bg-[#F8FAFC] dark:bg-[#0B1120] transition-colors duration-200">
      {/* Header — Responsive */}
      <header
        className="
          bg-white dark:bg-[#0F172A]
          border-b border-[#E2E8F0] dark:border-[#1E293B]
          px-4 sm:px-6 py-3 sm:py-4
          flex-shrink-0
          shadow-sm
        "
      >
        <div className="max-w-3xl mx-auto flex items-center justify-between">
          <Logo size={36} showText={true} />
          <div className="flex items-center gap-2 sm:gap-3">
            {/* Status badge — sembunyikan di mobile kecil */}
            <div className="hidden sm:flex items-center gap-1.5 bg-[#F0FDF4] dark:bg-[#052e16] px-3 py-1.5 rounded-full border border-[#BBF7D0] dark:border-[#166534]">
              <span className="w-1.5 h-1.5 rounded-full bg-[#22C55E] animate-pulse" />
              <span className="text-[#16A34A] dark:text-[#4ade80] text-xs font-medium">
                Agent Online
              </span>
            </div>
            {/* Status dot — hanya di mobile */}
            <span className="sm:hidden w-2 h-2 rounded-full bg-[#22C55E] animate-pulse" />
            <ThemeToggle />
          </div>
        </div>
      </header>

      {/* Error Banner */}
      {error && (
        <div className="bg-[#FEF2F2] dark:bg-[#450a0a] border-b border-[#FECACA] dark:border-[#7f1d1d] px-4 py-2.5 flex-shrink-0">
          <p className="text-[#DC2626] dark:text-[#fca5a5] text-sm text-center max-w-3xl mx-auto">
            ⚠️ {error}
          </p>
        </div>
      )}

      {/* Messages Area — Responsive padding */}
      <main className="flex-1 overflow-y-auto">
        <div className="max-w-3xl mx-auto px-3 sm:px-4 lg:px-6 py-4 sm:py-6">
          {messages.map((msg) => (
            <MessageBubble key={msg.id} role={msg.role} content={msg.content} />
          ))}

          {/* Loading dots */}
          {isLoading && (
            <div className="flex justify-start items-start gap-2 sm:gap-3 mb-4">
              <div className="w-7 h-7 sm:w-8 sm:h-8 rounded-full bg-[#2563EB] flex items-center justify-center text-white text-[10px] sm:text-xs font-bold flex-shrink-0 mt-1">
                PG
              </div>
              <div className="bg-white dark:bg-[#1E293B] border border-[#E2E8F0] dark:border-[#334155] px-4 py-3 rounded-2xl rounded-bl-sm shadow-sm">
                <div className="flex items-center gap-1.5">
                  <span className="w-2 h-2 rounded-full bg-[#2563EB] dark:bg-[#3B82F6] animate-bounce [animation-delay:0ms]" />
                  <span className="w-2 h-2 rounded-full bg-[#2563EB] dark:bg-[#3B82F6] animate-bounce [animation-delay:150ms]" />
                  <span className="w-2 h-2 rounded-full bg-[#2563EB] dark:bg-[#3B82F6] animate-bounce [animation-delay:300ms]" />
                </div>
              </div>
            </div>
          )}

          <div ref={bottomRef} />
        </div>
      </main>

      {/* Input Bar */}
      <InputBar onSendMessage={handleSendMessage} isLoading={isLoading} />
    </div>
  );
}
