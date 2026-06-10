"use client";

import { useEffect, useRef } from "react";

interface Props {
  text: string;
  setText: (text: string) => void;
  /** Bump this counter to focus the textarea (e.g. when Edit is clicked) */
  focusToken?: number;
  isEditing?: boolean;
  onCancelEdit?: () => void;
  hasMessage?: boolean;
  submitting?: boolean;
  error?: string | null;
  onPost?: (message: string) => void;
}

const MAX = 280;

export default function MessageForm({
  text,
  setText,
  focusToken,
  isEditing,
  onCancelEdit,
  hasMessage,
  submitting,
  error,
  onPost,
}: Props) {
  const textareaRef = useRef<HTMLTextAreaElement>(null);

  // Auto-grow
  useEffect(() => {
    const el = textareaRef.current;
    if (!el) return;
    el.style.height = "auto";
    el.style.height = `${Math.min(el.scrollHeight, 120)}px`;
  }, [text]);

  // Focus when triggered (Edit click)
  useEffect(() => {
    if (focusToken === undefined) return;
    const el = textareaRef.current;
    if (!el) return;
    el.focus();
    // Move cursor to the end of the existing text
    const len = el.value.length;
    el.setSelectionRange(len, len);
  }, [focusToken]);

  function handleSubmit() {
    const trimmed = text.trim();
    if (!trimmed || submitting) return;
    onPost?.(trimmed);
    setText("");
  }

  function handleKeyDown(e: React.KeyboardEvent<HTMLTextAreaElement>) {
    if (e.key === "Enter" && !e.shiftKey) {
      e.preventDefault();
      handleSubmit();
    }
    if (e.key === "Escape" && isEditing) onCancelEdit?.();
  }

  const used = text.length;
  const remaining = MAX - used;
  const disabled = submitting || !text.trim();
  const buttonLabel = submitting
    ? "Sending…"
    : hasMessage
    ? "Update message"
    : "Send message";

  return (
    <div className="w-full flex flex-col gap-1.5">
      {error && (
        <div className="flex items-start gap-2 text-[12px] text-[#c46a6a] bg-[#2a1a1a] border border-[#3d2020] rounded-lg px-3 py-2">
          <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="shrink-0 mt-px">
            <circle cx="12" cy="12" r="10" />
            <line x1="12" y1="8" x2="12" y2="12" />
            <line x1="12" y1="16" x2="12.01" y2="16" />
          </svg>
          <span>{error}</span>
        </div>
      )}

      {isEditing && (
        <div className="flex items-center justify-between bg-[#1a2535] border border-[#243045] rounded-lg px-3 py-1.5 text-[11px] text-[#6b9fd4]">
          <span className="flex items-center gap-2">
            <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
              <path d="M17 3a2.85 2.83 0 1 1 4 4L7.5 20.5 2 22l1.5-5.5z"/>
            </svg>
            Editing your message
          </span>
          <button
            onClick={onCancelEdit}
            className="text-[11px] text-[#8ab8e8] hover:text-white transition-colors cursor-pointer"
          >
            Cancel
          </button>
        </div>
      )}

      <div className="flex items-end gap-2 bg-[#1c1c1c] rounded-2xl px-3 py-2 shadow-[0_0_0_1px_rgba(255,255,255,0.06)] focus-within:shadow-[0_0_0_1px_rgba(255,255,255,0.12)] transition-shadow">
        <textarea
          ref={textareaRef}
          id="guestbook-message"
          name="message"
          rows={1}
          placeholder={hasMessage ? "Update your message…" : "Write a message…"}
          value={text}
          onChange={(e) => setText(e.target.value.slice(0, MAX))}
          onKeyDown={handleKeyDown}
          className="flex-1 bg-transparent border-0 outline-none resize-none text-sm text-[#e0e0e0] placeholder:text-[#5a5a5a] leading-6 py-1.5 px-2 max-h-[120px] font-sans [scrollbar-width:none] [&::-webkit-scrollbar]:hidden"
        />

        <button
          onClick={handleSubmit}
          disabled={disabled}
          aria-label={buttonLabel}
          className="group relative shrink-0 flex items-center gap-2 h-10 w-10 sm:w-auto sm:px-4 overflow-hidden rounded-full text-white text-[13px] font-medium bg-linear-to-b from-[#7050b8]/95 to-[#62439a] border border-[#3d2870] shadow-[0_2px_2px_0_rgba(0,0,0,0.06),0_4px_6px_0_rgba(0,0,0,0.04),inset_0_-2px_4px_0px_rgba(0,0,0,0.06)] active:scale-[0.96] transition-transform disabled:opacity-40 disabled:cursor-not-allowed cursor-pointer justify-center after:absolute after:inset-0 after:pointer-events-none after:rounded-full after:bg-[radial-gradient(ellipse_75%_55%_at_50%_0%,rgba(255,255,255,0.2)_0%,transparent_72%)]"
        >
          <span className="relative max-sm:hidden">{buttonLabel}</span>
          {submitting ? <Spinner /> : <SendIcon />}
        </button>
      </div>

      <div className="flex justify-end px-2">
        <span className={`text-[11px] tabular-nums ${remaining < 20 ? "text-[#c46a6a]" : "text-[#4a4a4a]"}`}>
          {used}/{MAX}
        </span>
      </div>
    </div>
  );
}

function SendIcon() {
  return (
    <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round" className="relative">
      <path d="M22 2 11 13" />
      <path d="m22 2-7 20-4-9-9-4 20-7z" />
    </svg>
  );
}

function Spinner() {
  return (
    <svg width="16" height="16" viewBox="0 0 24 24" className="relative animate-spin">
      <circle cx="12" cy="12" r="9" stroke="currentColor" strokeOpacity="0.25" strokeWidth="2.5" fill="none" />
      <path d="M21 12a9 9 0 0 0-9-9" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" fill="none" />
    </svg>
  );
}
