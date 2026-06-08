"use client";

export interface Message {
  id: number;
  address: string;
  initials: string;
  avatarColor: string;
  message: string;
  isOwn: boolean;
}

export default function MessageCard({ msg }: { msg: Message }) {
  return (
    <div className="rounded-xl bg-card shadow-[0_0_0_1px_rgba(255,255,255,0.07),0_1px_2px_-1px_rgba(0,0,0,0.4),0_2px_6px_rgba(0,0,0,0.25)] p-4 flex flex-col gap-3">

      <div className="flex items-center gap-2">
        <span
          className="w-9 h-9 rounded-[10px] border-2 border-white/10 shadow-[0_0_0_1px_rgba(255,255,255,0.07),0_2px_1px_0_rgba(0,0,0,0.25)] flex items-center justify-center text-xs font-semibold text-white shrink-0"
          style={{ backgroundColor: msg.avatarColor }}
        >
          {msg.initials}
        </span>

        <span className="text-xs font-mono text-[#5e5e5e] tracking-[0.01em]">
          {msg.address}
        </span>

        {msg.isOwn && (
          <span className="text-[10px] font-semibold tracking-[0.06em] bg-[#272727] text-[#616161] rounded px-[7px] py-[2px]">
            YOU
          </span>
        )}
      </div>

      <p className="text-sm text-[#b8b8b8] leading-relaxed m-0">
        {msg.message}
      </p>

      {msg.isOwn && (
        <div className="flex gap-2 mt-0.5">
          <ActionButton label="Edit" variant="edit" />
          <ActionButton label="Delete" variant="delete" />
        </div>
      )}
    </div>
  );
}

const VARIANT_CLASSES = {
  edit:   "bg-[#1a2535] hover:bg-[#1e2d40] text-[#6b9fd4] hover:text-[#8ab8e8] border border-[#243045] hover:border-[#2e4060]",
  delete: "bg-[#2a1a1a] hover:bg-[#321e1e] text-[#c46a6a] hover:text-[#de8888] border border-[#3d2020] hover:border-[#4a2828]",
} as const;

function ActionButton({ label, variant }: { label: string; variant: keyof typeof VARIANT_CLASSES }) {
  return (
    <button className={`flex-1 rounded-lg text-xs font-medium py-[7px] cursor-pointer transition-colors ${VARIANT_CLASSES[variant]}`}>
      {label}
    </button>
  );
}
