"use client";

import React, { useEffect, useRef, useState } from "react";
import { Mic, MicOff } from "lucide-react";

interface InputBarProps {
  onSendMessage: (message: string) => void;
  isLoading: boolean;
}

// Minimal Web Speech API typing (TS lib doesn't ship these by default).
interface SpeechRecognitionEvent extends Event {
  readonly results: {
    readonly length: number;
    item(index: number): {
      readonly length: number;
      item(index: number): { readonly transcript: string };
      readonly isFinal: boolean;
    };
    [index: number]: {
      readonly length: number;
      item(index: number): { readonly transcript: string };
      readonly isFinal: boolean;
      [index: number]: { readonly transcript: string };
    };
  };
}

interface SpeechRecognitionLike extends EventTarget {
  lang: string;
  continuous: boolean;
  interimResults: boolean;
  start(): void;
  stop(): void;
  onresult: ((event: SpeechRecognitionEvent) => void) | null;
  onerror: ((event: Event) => void) | null;
  onend: (() => void) | null;
}

type SpeechRecognitionCtor = new () => SpeechRecognitionLike;

function getRecognitionCtor(): SpeechRecognitionCtor | null {
  if (typeof window === "undefined") return null;
  const w = window as unknown as {
    SpeechRecognition?: SpeechRecognitionCtor;
    webkitSpeechRecognition?: SpeechRecognitionCtor;
  };
  return w.SpeechRecognition ?? w.webkitSpeechRecognition ?? null;
}

export default function InputBar({ onSendMessage, isLoading }: InputBarProps) {
  const [inputValue, setInputValue] = useState<string>("");
  const [isListening, setIsListening] = useState<boolean>(false);
  const [voiceSupported, setVoiceSupported] = useState<boolean>(false);
  const recognitionRef = useRef<SpeechRecognitionLike | null>(null);

  useEffect(() => {
    setVoiceSupported(getRecognitionCtor() !== null);
    return () => {
      try {
        recognitionRef.current?.stop();
      } catch {
        // ignore
      }
    };
  }, []);

  const handleSend = () => {
    const trimmed = inputValue.trim();
    if (trimmed && !isLoading) {
      onSendMessage(trimmed);
      setInputValue("");
    }
  };

  const handleKeyDown = (event: React.KeyboardEvent<HTMLTextAreaElement>) => {
    if (event.key === "Enter" && !event.shiftKey) {
      event.preventDefault();
      handleSend();
    }
  };

  const startListening = () => {
    const Ctor = getRecognitionCtor();
    if (!Ctor) return;

    try {
      const rec = new Ctor();
      rec.lang = "id-ID";
      rec.continuous = false;
      rec.interimResults = true;

      rec.onresult = (event) => {
        let transcript = "";
        for (let i = 0; i < event.results.length; i++) {
          const result = event.results[i];
          if (result && result[0]) {
            transcript += result[0].transcript;
          }
        }
        setInputValue(transcript);
      };

      rec.onerror = () => {
        setIsListening(false);
      };

      rec.onend = () => {
        setIsListening(false);
      };

      recognitionRef.current = rec;
      rec.start();
      setIsListening(true);
    } catch {
      setIsListening(false);
    }
  };

  const stopListening = () => {
    try {
      recognitionRef.current?.stop();
    } catch {
      // ignore
    }
    setIsListening(false);
  };

  const toggleVoice = () => {
    if (isListening) {
      stopListening();
    } else {
      startListening();
    }
  };

  return (
    <div className="border-t border-[#E2E8F0] dark:border-[#1E293B] bg-white dark:bg-[#0F172A] px-4 py-4 transition-colors duration-200">
      <div className="flex items-end gap-2 sm:gap-3 max-w-3xl mx-auto">
        <textarea
          value={inputValue}
          onChange={(e) => setInputValue(e.target.value)}
          onKeyDown={handleKeyDown}
          placeholder="Contoh: Tagihkan PT Maju Bersama 2.5 juta untuk jasa konsultasi..."
          rows={1}
          disabled={isLoading}
          className="flex-1 resize-none bg-white dark:bg-[#1E293B] border border-[#E2E8F0] dark:border-[#334155] rounded-2xl px-4 py-3 text-sm text-[#0F172A] dark:text-[#F1F5F9] placeholder-[#94A3B8] dark:placeholder-[#64748B] focus:outline-none focus:ring-2 focus:ring-[#2563EB] dark:focus:ring-[#3B82F6] focus:border-transparent disabled:opacity-50 disabled:cursor-not-allowed transition-all max-h-32"
        />

        {voiceSupported && (
          <button
            onClick={toggleVoice}
            disabled={isLoading}
            aria-label={isListening ? "Stop voice input" : "Start voice input"}
            title={
              isListening
                ? "Berhenti mendengarkan"
                : "Bicara dalam Bahasa Indonesia"
            }
            className={
              "w-11 h-11 rounded-2xl flex items-center justify-center transition-all duration-200 flex-shrink-0 shadow-sm " +
              (isListening
                ? "bg-[#EF4444] hover:bg-[#DC2626] text-white animate-pulse"
                : "bg-[#F1F5F9] hover:bg-[#E2E8F0] dark:bg-[#1E293B] dark:hover:bg-[#334155] text-[#64748B] dark:text-[#94A3B8] disabled:opacity-50 disabled:cursor-not-allowed")
            }
          >
            {isListening ? <MicOff size={18} /> : <Mic size={18} />}
          </button>
        )}

        <button
          onClick={handleSend}
          disabled={isLoading || inputValue.trim() === ""}
          aria-label="Kirim pesan"
          className="w-11 h-11 bg-[#2563EB] hover:bg-[#1D4ED8] dark:bg-[#3B82F6] dark:hover:bg-[#2563EB] disabled:bg-[#93C5FD] dark:disabled:bg-[#1E40AF] disabled:cursor-not-allowed text-white rounded-2xl flex items-center justify-center transition-all duration-200 flex-shrink-0 shadow-sm"
        >
          {isLoading ? (
            <svg
              className="animate-spin w-5 h-5"
              xmlns="http://www.w3.org/2000/svg"
              fill="none"
              viewBox="0 0 24 24"
            >
              <circle
                className="opacity-25"
                cx="12"
                cy="12"
                r="10"
                stroke="currentColor"
                strokeWidth="4"
              />
              <path
                className="opacity-75"
                fill="currentColor"
                d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4z"
              />
            </svg>
          ) : (
            <svg
              xmlns="http://www.w3.org/2000/svg"
              className="w-5 h-5"
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              strokeWidth="2"
              strokeLinecap="round"
              strokeLinejoin="round"
            >
              <line x1="22" y1="2" x2="11" y2="13" />
              <polygon points="22 2 15 22 11 13 2 9 22 2" />
            </svg>
          )}
        </button>
      </div>
      <p className="text-center text-[#94A3B8] dark:text-[#64748B] text-xs mt-2">
        Tekan Enter untuk kirim · Shift+Enter untuk baris baru
        {voiceSupported ? " · 🎤 Klik mic untuk bicara" : ""}
      </p>
    </div>
  );
}
