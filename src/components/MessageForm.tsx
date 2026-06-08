"use client";

import { useState } from "react";

const BTN =
  "group relative inline-flex items-center px-4 py-2 overflow-hidden shrink-0 text-white justify-center rounded-xl cursor-pointer font-medium text-[13px] bg-linear-to-b from-[#7050b8]/90 to-[#62439a] border border-[#3d2870] shadow-[0_2px_2px_0_rgba(0,0,0,0.04),0_4px_4px_0_rgba(0,0,0,0.06),inset_0_-2px_4px_0px_rgba(0,0,0,0.06),0_1px_2px_0_rgba(0,0,0,0.08),0_2px_4px_0_rgba(0,0,0,0.06),0_4px_6px_0_rgba(0,0,0,0.04),0_6px_8px_0_rgba(0,0,0,0.02)] active:scale-[0.96] transition-transform after:absolute after:inset-0 after:pointer-events-none after:rounded-xl after:bg-[radial-gradient(ellipse_75%_55%_at_50%_0%,rgba(255,255,255,0.18)_0%,transparent_72%)]";

export default function MessageForm({ currentMessage }: { currentMessage?: string }) {
  const [text, setText] = useState("");
  const MAX = 280;

  return (
    <div className="w-full max-w-[540px] rounded-[14px] bg-card shadow-[0_0_0_1px_rgba(255,255,255,0.07),0_1px_2px_-1px_rgba(0,0,0,0.4),0_2px_6px_rgba(0,0,0,0.25)] p-5">

      <p className="text-[11px] font-semibold tracking-[0.1em] uppercase text-muted mb-3">
        Create Message
      </p>

      <textarea
        rows={4}
        placeholder="Write your message... (max 280 chars)"
        value={text}
        onChange={(e) => setText(e.target.value.slice(0, MAX))}
        className="w-full bg-[#212121] border border-[#2b2b2b] rounded-lg px-3 py-2.5 text-sm text-[#e0e0e0] placeholder:text-[#505050] resize-none outline-none focus:border-[#404040] transition-colors leading-relaxed font-sans"
      />

      <div className="flex items-center justify-between mt-2.5">
        <span className="text-xs text-muted">{text.length}/{MAX}</span>
        <button className={BTN}>
          <span className="relative">Post Message</span>
        </button>
      </div>

      {currentMessage && (
        <p className="text-xs italic text-muted mt-2">
          Currently: &quot;{currentMessage}&quot;
        </p>
      )}
    </div>
  );
}
