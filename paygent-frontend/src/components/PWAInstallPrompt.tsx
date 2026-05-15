"use client";

import { useEffect, useMemo, useState, useSyncExternalStore } from "react";
import { Download, Share, X } from "lucide-react";

interface BeforeInstallPromptEvent extends Event {
  prompt(): Promise<void>;
  userChoice: Promise<{ outcome: "accepted" | "dismissed"; platform: string }>;
}

const DISMISS_KEY = "paygent-pwa-install-dismissed-at";
const DISMISS_COOLDOWN_MS = 1000 * 60 * 60 * 24 * 3;

function isStandalone() {
  if (typeof window === "undefined") return false;

  const navigatorWithStandalone = navigator as Navigator & {
    standalone?: boolean;
  };

  return (
    window.matchMedia("(display-mode: standalone)").matches ||
    navigatorWithStandalone.standalone === true
  );
}

function isIOSDevice() {
  if (typeof window === "undefined") return false;
  return /iphone|ipad|ipod/i.test(window.navigator.userAgent);
}

function wasRecentlyDismissed() {
  const dismissedAt = window.localStorage.getItem(DISMISS_KEY);
  if (!dismissedAt) return false;

  const timestamp = Number(dismissedAt);
  if (!Number.isFinite(timestamp)) return false;

  return Date.now() - timestamp < DISMISS_COOLDOWN_MS;
}

function subscribeToDeviceCapability() {
  return () => {};
}

export default function PWAInstallPrompt() {
  const [deferredPrompt, setDeferredPrompt] =
    useState<BeforeInstallPromptEvent | null>(null);
  const [visible, setVisible] = useState(false);
  const isIOS = useSyncExternalStore(
    subscribeToDeviceCapability,
    isIOSDevice,
    () => false,
  );

  const canNativeInstall = deferredPrompt !== null;

  const copy = useMemo(() => {
    if (isIOS && !canNativeInstall) {
      return {
        icon: Share,
        title: "Install PayGent di Home Screen",
        body: "Tap Share, lalu pilih Add to Home Screen agar PayGent bisa dibuka seperti aplikasi.",
        action: "Mengerti",
      };
    }

    return {
      icon: Download,
      title: "Install PayGent",
      body: "Tambahkan PayGent ke perangkat kamu untuk akses cepat tanpa buka browser.",
      action: "Install",
    };
  }, [canNativeInstall, isIOS]);

  useEffect(() => {
    if (isStandalone() || wasRecentlyDismissed()) return;

    const handleBeforeInstallPrompt = (event: Event) => {
      event.preventDefault();
      setDeferredPrompt(event as BeforeInstallPromptEvent);
      setVisible(true);
    };

    window.addEventListener("beforeinstallprompt", handleBeforeInstallPrompt);

    let timeoutId: number | undefined;
    if (isIOS) {
      timeoutId = window.setTimeout(() => setVisible(true), 1200);
    }

    return () => {
      window.removeEventListener(
        "beforeinstallprompt",
        handleBeforeInstallPrompt,
      );
      if (timeoutId) window.clearTimeout(timeoutId);
    };
  }, [isIOS]);

  const dismiss = () => {
    window.localStorage.setItem(DISMISS_KEY, String(Date.now()));
    setVisible(false);
  };

  const install = async () => {
    if (!deferredPrompt) {
      dismiss();
      return;
    }

    await deferredPrompt.prompt();
    await deferredPrompt.userChoice;
    setDeferredPrompt(null);
    dismiss();
  };

  if (!visible || isStandalone()) return null;

  const Icon = copy.icon;

  return (
    <div className="fixed inset-x-3 bottom-3 z-50 sm:inset-x-auto sm:right-5 sm:bottom-5 sm:w-[360px]">
      <div className="bg-white dark:bg-[#0F172A] border border-[#CBD5E1] dark:border-[#334155] shadow-2xl rounded-2xl p-4 text-[#0F172A] dark:text-[#F8FAFC]">
        <div className="flex items-start gap-3">
          <div className="w-10 h-10 rounded-xl bg-[#DBEAFE] dark:bg-[#172554] text-[#2563EB] dark:text-[#93C5FD] flex items-center justify-center flex-shrink-0">
            <Icon size={20} />
          </div>
          <div className="min-w-0 flex-1">
            <p className="text-sm font-semibold leading-tight">{copy.title}</p>
            <p className="mt-1 text-xs leading-relaxed text-[#64748B] dark:text-[#94A3B8]">
              {copy.body}
            </p>
          </div>
          <button
            type="button"
            onClick={dismiss}
            aria-label="Tutup notifikasi install"
            className="w-8 h-8 rounded-lg flex items-center justify-center text-[#64748B] hover:bg-[#F1F5F9] dark:text-[#94A3B8] dark:hover:bg-[#1E293B] transition-colors"
          >
            <X size={16} />
          </button>
        </div>
        <div className="mt-3 flex justify-end">
          <button
            type="button"
            onClick={install}
            className="inline-flex items-center justify-center gap-2 rounded-xl bg-[#2563EB] hover:bg-[#1D4ED8] text-white text-sm font-medium px-4 py-2 transition-colors"
          >
            <Icon size={16} />
            {copy.action}
          </button>
        </div>
      </div>
    </div>
  );
}
