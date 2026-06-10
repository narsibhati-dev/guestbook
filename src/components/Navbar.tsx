"use client";

import WalletButton from "@/components/WalletButton";

interface Props {
  onRefresh?: () => void;
  refreshing?: boolean;
}

export default function Navbar({ onRefresh, refreshing }: Props) {
  return (
    <nav className="shrink-0 w-full bg-page border-b border-[#2a2a2a]">
      <div className="px-6 py-3 flex items-center justify-between gap-4">

        {/* Brand */}
        <div className="flex items-center gap-3">
          <div className="group relative w-9 h-9 overflow-hidden rounded-[10px] shrink-0 bg-linear-to-b from-[#7050b8]/90 to-[#62439a] border border-[#3d2870] shadow-[0_2px_2px_0_rgba(0,0,0,0.04),0_4px_4px_0_rgba(0,0,0,0.06),inset_0_-2px_4px_0px_rgba(0,0,0,0.06),0_1px_2px_0_rgba(0,0,0,0.08)] after:absolute after:inset-0 after:pointer-events-none after:rounded-[10px] after:bg-[radial-gradient(ellipse_75%_55%_at_50%_0%,rgba(255,255,255,0.18)_0%,transparent_72%)]">
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img src="/icon.svg" alt="Guestbook" width={36} height={36} className="relative" />
          </div>
          <div className="hidden sm:flex flex-col leading-tight">
            <span className="text-[15px] font-semibold tracking-tight text-primary">
              Guestbook
            </span>
            <span className="flex items-center gap-1.5 text-[11px] text-[#6a6a6a] font-medium">
              <span className="relative inline-flex w-1.5 h-1.5">
                <span className="absolute inset-0 rounded-full bg-[#3d7a6e] opacity-60 animate-ping" />
                <span className="relative w-1.5 h-1.5 rounded-full bg-[#4a9b87]" />
              </span>
              Solana devnet
            </span>
          </div>
        </div>

        {/* Right side */}
        <div className="flex items-center gap-2">
          {onRefresh && (
            <button
              onClick={onRefresh}
              disabled={refreshing}
              title="Refresh messages"
              className="w-8 h-8 flex items-center justify-center rounded-lg border border-[#2a2a2a] bg-[#141414] hover:bg-[#1e1e1e] hover:border-[#383838] text-[#6a6a6a] hover:text-[#aaa] disabled:opacity-40 transition-colors cursor-pointer"
            >
              <svg
                width="14"
                height="14"
                viewBox="0 0 24 24"
                fill="none"
                stroke="currentColor"
                strokeWidth="2.2"
                strokeLinecap="round"
                strokeLinejoin="round"
                className={refreshing ? "animate-spin" : ""}
              >
                <path d="M3 12a9 9 0 0 1 15-6.7L21 8" />
                <path d="M21 3v5h-5" />
                <path d="M21 12a9 9 0 0 1-15 6.7L3 16" />
                <path d="M3 21v-5h5" />
              </svg>
            </button>
          )}
          <WalletButton />
        </div>
      </div>
    </nav>
  );
}
