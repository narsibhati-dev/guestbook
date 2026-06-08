"use client";

import { SelectedWalletAccountContextProvider } from "@solana/react";

const STATE_SYNC = {
  getSelectedWallet: (): string | null => {
    if (typeof window === "undefined") return null;
    return localStorage.getItem("guestbook:wallet");
  },
  storeSelectedWallet: (key: string) => localStorage.setItem("guestbook:wallet", key),
  deleteSelectedWallet: () => localStorage.removeItem("guestbook:wallet"),
};

const filterWallets = (wallet: { chains: readonly string[] }) =>
  wallet.chains.some((c) => c.startsWith("solana:"));

export default function WalletProvider({ children }: { children: React.ReactNode }) {
  return (
    <SelectedWalletAccountContextProvider filterWallets={filterWallets} stateSync={STATE_SYNC}>
      {children}
    </SelectedWalletAccountContextProvider>
  );
}
