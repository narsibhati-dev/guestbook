"use client";

import { useWalletAccountTransactionSigner } from "@solana/react";
import type { UiWalletAccount } from "@wallet-standard/react";
import MessageForm from "@/components/MessageForm";
import { useGuestbook } from "@/hooks/useGuestbook";
import { CHAIN, type DecodedMessage } from "@/lib/program";

interface Props {
  account: UiWalletAccount;
  messages: DecodedMessage[];
  refetch: () => void;
  text: string;
  setText: (text: string) => void;
  focusToken?: number;
  isEditing: boolean;
  editingId: bigint | null;
  onCancelEdit: () => void;
}

export default function ConnectedContent({
  account,
  messages,
  refetch,
  text,
  setText,
  focusToken,
  isEditing,
  editingId,
  onCancelEdit,
}: Props) {
  const signer = useWalletAccountTransactionSigner(account, CHAIN);
  const { createMessage, updateMessage } = useGuestbook(signer);

  return (
    <MessageForm
      text={text}
      setText={setText}
      focusToken={focusToken}
      isEditing={isEditing}
      onCancelEdit={onCancelEdit}
      hasMessage={isEditing}
      submitting={false}
      onPost={(msg) => {
        const onSuccess = () => { onCancelEdit(); refetch(); };
        editingId !== null
          ? updateMessage(editingId, msg, onSuccess)
          : createMessage(msg, onSuccess);
      }}
    />
  );
}
