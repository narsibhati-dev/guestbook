"use client";

import { useSelectedWalletAccount } from "@solana/react";
import { useConnect } from "@wallet-standard/react-core";
import { useState, useRef, useEffect } from "react";
import type { UiWallet, UiWalletAccount } from "@wallet-standard/react";

const BTN =
  "group relative inline-flex items-center gap-2 px-5 py-2.5 overflow-hidden shrink-0 text-white justify-center rounded-xl cursor-pointer font-medium text-[13px] bg-linear-to-b from-[#7050b8]/90 to-[#62439a] border border-[#3d2870] shadow-[0_2px_2px_0_rgba(0,0,0,0.04),0_4px_4px_0_rgba(0,0,0,0.06),inset_0_-2px_4px_0px_rgba(0,0,0,0.06),0_1px_2px_0_rgba(0,0,0,0.08),0_2px_4px_0_rgba(0,0,0,0.06),0_4px_6px_0_rgba(0,0,0,0.04),0_6px_8px_0_rgba(0,0,0,0.02)] active:scale-[0.96] transition-transform after:absolute after:inset-0 after:pointer-events-none after:rounded-xl after:bg-[radial-gradient(ellipse_75%_55%_at_50%_0%,rgba(255,255,255,0.18)_0%,transparent_72%)]";

function truncateAddress(addr: string) {
  return `${addr.slice(0, 4)}..${addr.slice(-4)}`;
}

function WalletOption({
  wallet,
  onConnect,
}: {
  wallet: UiWallet;
  onConnect: (accounts: readonly UiWalletAccount[]) => void;
}) {
  const [isConnecting, connect] = useConnect(wallet);

  async function handleClick() {
    const accounts = await connect();
    if (accounts.length > 0) onConnect(accounts);
  }

  return (
    <button
      onClick={handleClick}
      disabled={isConnecting}
      className="w-full flex items-center gap-2.5 px-3 py-2 rounded-lg text-[13px] font-medium text-[#e0e0e0] hover:bg-[#272727] cursor-pointer disabled:opacity-60 disabled:cursor-wait transition-colors text-left"
    >
      {wallet.icon && (
        // eslint-disable-next-line @next/next/no-img-element
        <img src={wallet.icon} alt={wallet.name} width={22} height={22} className="rounded-[6px] shrink-0" />
      )}
      <span>{isConnecting ? "Connecting…" : wallet.name}</span>
    </button>
  );
}

export default function WalletButton() {
  const [account, setAccount, wallets] = useSelectedWalletAccount();
  const [open, setOpen] = useState(false);
  const ref = useRef<HTMLDivElement>(null);

  const walletIcon = account
    ? wallets.find((w) => w.accounts.some((a) => a.address === account.address))?.icon
    : undefined;

  useEffect(() => {
    function onClickOutside(e: MouseEvent) {
      if (ref.current && !ref.current.contains(e.target as Node)) setOpen(false);
    }
    document.addEventListener("mousedown", onClickOutside);
    return () => document.removeEventListener("mousedown", onClickOutside);
  }, []);

  function handleConnected(accounts: readonly UiWalletAccount[]) {
    setAccount(accounts[0]);
    setOpen(false);
  }

  return (
    <div ref={ref} className="relative inline-flex">
      <button onClick={() => setOpen((o) => !o)} className={BTN}>
        <span className="relative flex items-center gap-2">
          {account && walletIcon && (
            // eslint-disable-next-line @next/next/no-img-element
            <img src={walletIcon} alt="" width={22} height={22} className="rounded-[6px]" />
          )}
          {account ? truncateAddress(account.address) : "Connect Wallet"}
        </span>
      </button>

      {open && (
        <div className="absolute top-full left-1/2 -translate-x-1/2 mt-2 z-50 bg-[#1c1c1c] rounded-xl p-1.5 min-w-[200px] shadow-[0_0_0_1px_rgba(255,255,255,0.08),0_8px_24px_rgba(0,0,0,0.4)]">
          {account ? (
            <button
              onClick={() => { setAccount(undefined); setOpen(false); }}
              className="w-full px-3 py-2 rounded-lg text-[13px] font-medium text-[#c46a6a] hover:bg-[#2a1a1a] transition-colors text-left"
            >
              Disconnect
            </button>
          ) : wallets.length === 0 ? (
            <p className="px-3 py-2.5 text-sm text-muted">No wallets detected.</p>
          ) : (
            wallets.map((wallet) => (
              <WalletOption key={wallet.name} wallet={wallet} onConnect={handleConnected} />
            ))
          )}
        </div>
      )}
    </div>
  );
}
