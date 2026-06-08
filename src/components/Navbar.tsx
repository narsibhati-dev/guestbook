"use client";

import WalletButton from "@/components/WalletButton";

export default function Navbar() {
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

        {/* Wallet */}
        <WalletButton />
      </div>
    </nav>
  );
}
