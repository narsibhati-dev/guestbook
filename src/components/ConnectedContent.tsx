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
  onCancelEdit,
}: Props) {
  const signer = useWalletAccountTransactionSigner(account, CHAIN);
  const { createMessage, updateMessage, getOwnMessage, submitting } = useGuestbook(signer);

  const hasMessage = !!getOwnMessage(messages);

  return (
    <MessageForm
      text={text}
      setText={setText}
      focusToken={focusToken}
      isEditing={isEditing}
      onCancelEdit={onCancelEdit}
      hasMessage={hasMessage}
      submitting={submitting}
      onPost={(msg) => {
        const onSuccess = () => {
          onCancelEdit();
          refetch();
        };
        hasMessage ? updateMessage(msg, onSuccess) : createMessage(msg, onSuccess);
      }}
    />
  );
}
