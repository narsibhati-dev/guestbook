"use client";

import { useWalletAccountTransactionSigner } from "@solana/react";
import type { UiWalletAccount } from "@wallet-standard/react";
import { useGuestbook } from "@/hooks/useGuestbook";
import { CHAIN } from "@/lib/program";

export interface GuestbookActions {
  signerAddress: string;
  submitting: boolean;
  error: string | null;
  ownAddress: string;
  isOwn: (author: string) => boolean;
  createMessage: (msg: string, onSuccess: () => void) => void;
  updateMessage: (id: bigint, msg: string, onSuccess: () => void) => void;
  deleteMessage: (id: bigint, onSuccess: () => void) => void;
}

interface Props {
  account: UiWalletAccount;
  children: (actions: GuestbookActions) => React.ReactNode;
}

export default function ConnectedShell({ account, children }: Props) {
  const signer = useWalletAccountTransactionSigner(account, CHAIN);
  const { createMessage, updateMessage, deleteMessage, submitting, error } = useGuestbook(signer);

  const actions: GuestbookActions = {
    signerAddress: signer.address,
    submitting,
    error,
    ownAddress: account.address,
    isOwn: (author) => author === account.address,
    createMessage,
    updateMessage,
    deleteMessage,
  };

  return <>{children(actions)}</>;
}
