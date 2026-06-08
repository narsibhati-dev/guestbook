"use client";

import { useState, useCallback } from "react";
import { useSelectedWalletAccount } from "@solana/react";
import Navbar from "@/components/Navbar";
import ConnectedShell, { type GuestbookActions } from "@/components/ConnectedShell";
import MessageForm from "@/components/MessageForm";
import MessageCard from "@/components/MessageCard";
import { useMessages } from "@/hooks/useMessages";
import type { DecodedMessage } from "@/lib/program";

function truncate(addr: string) {
  return `${addr.slice(0, 4)}..${addr.slice(-4)}`;
}

function avatarColor(addr: string): string {
  const COLORS = [
    "#4a6fa5","#6b4f8a","#3d7a6e","#9a6b3e",
    "#3e7a5e","#7a3e6b","#5a7a3e","#3e5a7a",
  ];
  let hash = 0;
  for (let i = 0; i < addr.length; i++) hash = addr.charCodeAt(i) + ((hash << 5) - hash);
  return COLORS[Math.abs(hash) % COLORS.length];
}

// ── Inner layout rendered only when wallet is connected ───────────────────
function ConnectedLayout({
  actions,
  messages,
  refetch,
}: {
  actions: GuestbookActions;
  messages: DecodedMessage[];
  refetch: () => void;
}) {
  const [inputText, setInputText]   = useState("");
  const [isEditing, setIsEditing]   = useState(false);
  const [focusToken, setFocusToken] = useState(0);

  const handleStartEdit = useCallback((message: string) => {
    setInputText(message);
    setIsEditing(true);
    setFocusToken((t) => t + 1);
  }, []);

  const handleCancelEdit = useCallback(() => {
    setIsEditing(false);
    setInputText("");
  }, []);

  return (
    <>
      {/* Chat area */}
      <div className="flex-1 overflow-y-auto">
        <div className="px-6 py-8 min-h-full flex flex-col justify-end gap-5">
          {messages.length === 0 ? (
            <div className="flex flex-col items-center justify-center py-24 text-center">
              <div className="w-14 h-14 rounded-2xl bg-[#1c1c1c] shadow-[0_0_0_1px_rgba(255,255,255,0.06)] flex items-center justify-center mb-4">
                <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="#5a5a5a" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                  <path d="M21 15a2 2 0 0 1-2 2H7l-4 4V5a2 2 0 0 1 2-2h14a2 2 0 0 1 2 2z" />
                </svg>
              </div>
              <p className="text-sm text-[#808080]">No messages yet.</p>
              <p className="text-xs text-[#505050] mt-1">Be the first to leave one.</p>
            </div>
          ) : (
            messages.map((msg) => (
              <MessageCard
                key={msg.accountAddress}
                address={msg.author}
                truncatedAddress={truncate(msg.author)}
                initials={msg.author[0].toUpperCase()}
                avatarColor={avatarColor(msg.author)}
                message={msg.message}
                isOwn={actions.isOwn(msg.author)}
                submitting={actions.submitting}
                onDelete={() => actions.deleteMessage(refetch)}
                onStartEdit={handleStartEdit}
              />
            ))
          )}
        </div>
      </div>

      {/* Input bar */}
      <div className="border-t border-[#2a2a2a] bg-page/95 backdrop-blur-md">
        <div className="px-6 py-4">
          <MessageForm
            text={inputText}
            setText={setInputText}
            focusToken={focusToken}
            isEditing={isEditing}
            onCancelEdit={handleCancelEdit}
            hasMessage={actions.hasMessage}
            submitting={actions.submitting}
            error={actions.error}
            onPost={(msg) =>
              actions.postMessage(msg, () => {
                handleCancelEdit();
                refetch();
              })
            }
          />
        </div>
      </div>
    </>
  );
}

// ── Page ──────────────────────────────────────────────────────────────────
export default function Home() {
  const [account] = useSelectedWalletAccount();
  const { messages, loading, error: fetchError, refetch } = useMessages();

  return (
    <div className="h-screen flex justify-center bg-page">
      <div className="h-full w-6xl flex flex-col border-x border-[#2a2a2a]">
        <Navbar />

        {fetchError && (
          <p className="text-sm text-[#c46a6a] bg-[#2a1a1a] border border-[#3d2020] mx-6 mt-4 rounded-lg px-4 py-2 text-center">
            {fetchError}
          </p>
        )}

        {loading ? (
          <div className="flex-1 overflow-y-auto">
            <div className="px-6 py-8 flex flex-col justify-end gap-5 min-h-full">
              {[...Array(4)].map((_, i) => (
                <div key={i} className={`flex gap-3 items-start ${i % 2 ? "flex-row-reverse" : ""}`}>
                  <div className="w-9 h-9 rounded-[10px] bg-[#1c1c1c] animate-pulse shrink-0" />
                  <div className="rounded-2xl bg-[#1c1c1c] h-12 animate-pulse w-1/2" />
                </div>
              ))}
            </div>
          </div>
        ) : account ? (
          /* Single ConnectedShell instance — one signer, one hook */
          <ConnectedShell account={account} messages={messages}>
            {(actions) => (
              <ConnectedLayout
                actions={actions}
                messages={messages}
                refetch={refetch}
              />
            )}
          </ConnectedShell>
        ) : (
          <>
            <div className="flex-1 overflow-y-auto">
              <div className="px-6 py-8 min-h-full flex flex-col justify-end gap-5">
                {messages.length === 0 ? (
                  <div className="flex flex-col items-center justify-center py-24 text-center">
                    <div className="w-14 h-14 rounded-2xl bg-[#1c1c1c] shadow-[0_0_0_1px_rgba(255,255,255,0.06)] flex items-center justify-center mb-4">
                      <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="#5a5a5a" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                        <path d="M21 15a2 2 0 0 1-2 2H7l-4 4V5a2 2 0 0 1 2-2h14a2 2 0 0 1 2 2z" />
                      </svg>
                    </div>
                    <p className="text-sm text-[#808080]">No messages yet.</p>
                    <p className="text-xs text-[#505050] mt-1">Connect your wallet to leave the first one.</p>
                  </div>
                ) : (
                  messages.map((msg) => (
                    <MessageCard
                      key={msg.accountAddress}
                      address={msg.author}
                      truncatedAddress={truncate(msg.author)}
                      initials={msg.author[0].toUpperCase()}
                      avatarColor={avatarColor(msg.author)}
                      message={msg.message}
                      isOwn={false}
                    />
                  ))
                )}
              </div>
            </div>
            <div className="border-t border-[#2a2a2a]">
              <p className="text-center text-sm text-[#5a5a5a] py-4">
                Connect your wallet to leave a message.
              </p>
            </div>
          </>
        )}
      </div>
    </div>
  );
}
