"use client";

interface Props {
  address: string;
  truncatedAddress: string;
  initials: string;
  avatarColor: string;
  message: string;
  isOwn: boolean;
  submitting?: boolean;
  onDelete?: () => void;
  onStartEdit?: (currentMessage: string) => void;
}

export default function MessageCard({
  truncatedAddress,
  initials,
  avatarColor,
  message,
  isOwn,
  submitting,
  onDelete,
  onStartEdit,
}: Props) {
  const Avatar = (
    <span
      className="w-9 h-9 rounded-[10px] border-2 border-white/10 shadow-[0_0_0_1px_rgba(255,255,255,0.07),0_2px_1px_0_rgba(0,0,0,0.25)] flex items-center justify-center text-xs font-semibold text-white shrink-0"
      style={{ backgroundColor: avatarColor }}
    >
      {initials}
    </span>
  );

  const rowClass = isOwn ? "flex-row-reverse" : "flex-row";
  const bubbleShape = isOwn ? "rounded-2xl rounded-tr-md" : "rounded-2xl rounded-tl-md";
  const bubbleColors = isOwn
    ? "bg-[#5c43a8] text-white"
    : "bg-[#1c1c1c] text-[#d4d4d4] shadow-[0_0_0_1px_rgba(255,255,255,0.06)]";
  const headerAlign = isOwn ? "justify-end" : "justify-start";
  const actionsAlign = isOwn ? "justify-end" : "justify-start";
  const colAlignClass = isOwn ? "items-end" : "items-start";

  return (
    <div className={`flex ${rowClass} items-start gap-3 w-full`}>
      {Avatar}

      <div className={`flex flex-col gap-1.5 max-w-[min(78%,520px)] ${colAlignClass}`}>
        <div className={`flex items-center gap-2 px-1 ${headerAlign}`}>
          <span className="text-[11px] font-mono text-[#6a6a6a] tracking-[0.01em]">
            {truncatedAddress}
          </span>
          {isOwn && (
            <span className="text-[10px] font-semibold tracking-[0.06em] bg-[#272727] text-[#777] rounded px-[6px] py-[1px]">
              YOU
            </span>
          )}
        </div>

        <div className={`${bubbleShape} ${bubbleColors} px-4 py-2.5 text-sm leading-relaxed break-words`}>
          {message}
        </div>

        {isOwn && (
          <div className={`flex gap-2 mt-0.5 ${actionsAlign}`}>
            <button
              onClick={() => onStartEdit?.(message)}
              disabled={submitting}
              className="rounded-md bg-[#1a2535] hover:bg-[#1e2d40] text-[#6b9fd4] hover:text-[#8ab8e8] border border-[#243045] hover:border-[#2e4060] text-[11px] font-medium px-3 py-1 cursor-pointer disabled:opacity-50 transition-colors"
            >
              Edit
            </button>
            <button
              onClick={onDelete}
              disabled={submitting}
              className="rounded-md bg-[#2a1a1a] hover:bg-[#321e1e] text-[#c46a6a] hover:text-[#de8888] border border-[#3d2020] hover:border-[#4a2828] text-[11px] font-medium px-3 py-1 cursor-pointer disabled:opacity-50 transition-colors"
            >
              {submitting ? "Deleting…" : "Delete"}
            </button>
          </div>
        )}
      </div>
    </div>
  );
}
