"use client";

import { useWalletAccountTransactionSigner } from "@solana/react";
import type { UiWalletAccount } from "@wallet-standard/react";
import { useGuestbook } from "@/hooks/useGuestbook";
import { CHAIN, type DecodedMessage } from "@/lib/program";

export interface GuestbookActions {
  signerAddress: string;
  submitting: boolean;
  error: string | null;
  hasMessage: boolean;
  ownAddress: string;
  postMessage: (msg: string, onSuccess: () => void) => void;
  deleteMessage: (onSuccess: () => void) => void;
  isOwn: (author: string) => boolean;
}

interface Props {
  account: UiWalletAccount;
  messages: DecodedMessage[];
  children: (actions: GuestbookActions) => React.ReactNode;
}

export default function ConnectedShell({ account, messages, children }: Props) {
  const signer = useWalletAccountTransactionSigner(account, CHAIN);
  const {
    createMessage,
    updateMessage,
    deleteMessage,
    getOwnMessage,
    submitting,
    error,
  } = useGuestbook(signer);

  const hasMessage = !!getOwnMessage(messages);

  const actions: GuestbookActions = {
    signerAddress: signer.address,
    submitting,
    error,
    hasMessage,
    ownAddress: account.address,
    postMessage: (msg, onSuccess) =>
      hasMessage ? updateMessage(msg, onSuccess) : createMessage(msg, onSuccess),
    deleteMessage: (onSuccess) => deleteMessage(onSuccess),
    isOwn: (author) => author === account.address,
  };

  return <>{children(actions)}</>;
}
