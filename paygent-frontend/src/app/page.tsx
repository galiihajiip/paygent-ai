"use client";

import { useEffect, useRef } from "react";

export default function Home() {
  const iframeRef = useRef<HTMLIFrameElement | null>(null);

  useEffect(() => {
    // Reserved for future postMessage wiring to the OpenClaw WebChat widget.
  }, []);

  return (
    <main className="flex flex-col h-screen bg-[#0F172A]">
      {/* Header */}
      <header className="bg-[#0F172A] border-b border-[#1E293B] px-6 py-4 flex-shrink-0">
        <div className="max-w-4xl mx-auto flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 bg-[#2563EB] rounded-xl flex items-center justify-center shadow-sm">
              <span className="text-white font-bold text-sm tracking-tight">PG</span>
            </div>
            <div>
              <h1 className="text-white font-semibold text-base leading-tight tracking-tight">
                PayGent
              </h1>
              <p className="text-[#64748B] text-xs">
                Auto-Biller AI · Powered by Doku × OpenClaw
              </p>
            </div>
          </div>
          <div className="flex items-center gap-2">
            <span className="w-2 h-2 rounded-full bg-[#22C55E] animate-pulse" />
            <span className="text-[#64748B] text-xs font-medium">Agent Online</span>
          </div>
        </div>
      </header>

      {/* OpenClaw WebChat Embed */}
      <div className="flex-1 relative overflow-hidden">
        <iframe
          ref={iframeRef}
          src="http://localhost:3001"
          className="w-full h-full border-0"
          title="PayGent AI Chat"
          allow="microphone"
          style={{
            colorScheme: "dark",
            backgroundColor: "#0F172A",
          }}
        />
      </div>

      {/* Footer */}
      <footer className="bg-[#0F172A] border-t border-[#1E293B] px-6 py-3 flex-shrink-0">
        <p className="text-center text-[#475569] text-xs">
          PayGent menggunakan enkripsi end-to-end · Transaksi diproses via Doku Sandbox
        </p>
      </footer>
    </main>
  );
}
