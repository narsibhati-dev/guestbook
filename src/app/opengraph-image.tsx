import { ImageResponse } from "next/og";

export const size = { width: 1200, height: 630 };
export const contentType = "image/png";

export default function Image() {
  return new ImageResponse(
    (
      <div
        style={{
          width: "100%",
          height: "100%",
          display: "flex",
          flexDirection: "column",
          alignItems: "center",
          justifyContent: "center",
          background: "#141414",
          fontFamily: "system-ui, sans-serif",
          position: "relative",
          overflow: "hidden",
        }}
      >
        {/* Purple glow blob */}
        <div
          style={{
            position: "absolute",
            top: "-120px",
            left: "50%",
            transform: "translateX(-50%)",
            width: "700px",
            height: "500px",
            borderRadius: "50%",
            background:
              "radial-gradient(ellipse at center, rgba(98,67,154,0.35) 0%, transparent 70%)",
          }}
        />

        {/* Grid lines */}
        <div
          style={{
            position: "absolute",
            inset: 0,
            backgroundImage:
              "linear-gradient(rgba(255,255,255,0.03) 1px, transparent 1px), linear-gradient(90deg, rgba(255,255,255,0.03) 1px, transparent 1px)",
            backgroundSize: "60px 60px",
          }}
        />

        {/* Card */}
        <div
          style={{
            display: "flex",
            flexDirection: "column",
            alignItems: "center",
            gap: "28px",
            padding: "56px 72px",
            background: "rgba(28,28,28,0.8)",
            border: "1px solid rgba(255,255,255,0.08)",
            borderRadius: "24px",
            boxShadow: "0 0 0 1px rgba(98,67,154,0.2), 0 32px 64px rgba(0,0,0,0.5)",
            zIndex: 1,
          }}
        >
          {/* Icon */}
          <div
            style={{
              width: "80px",
              height: "80px",
              borderRadius: "20px",
              background: "linear-gradient(180deg, rgba(112,80,184,0.9), #62439a)",
              border: "1px solid #3d2870",
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              boxShadow: "0 8px 24px rgba(98,67,154,0.4)",
            }}
          >
            {/* Chat bubble icon */}
            <svg width="40" height="40" viewBox="0 0 24 24" fill="none">
              <path
                d="M21 15a2 2 0 0 1-2 2H7l-4 4V5a2 2 0 0 1 2-2h14a2 2 0 0 1 2 2z"
                stroke="white"
                strokeWidth="1.8"
                strokeLinecap="round"
                strokeLinejoin="round"
              />
            </svg>
          </div>

          {/* Title */}
          <div
            style={{
              display: "flex",
              flexDirection: "column",
              alignItems: "center",
              gap: "12px",
            }}
          >
            <span
              style={{
                fontSize: "72px",
                fontWeight: 700,
                color: "#e0e0e0",
                letterSpacing: "-2px",
                lineHeight: 1,
              }}
            >
              Guestbook
            </span>
            <span
              style={{
                fontSize: "26px",
                color: "#6a6a6a",
                fontWeight: 400,
                letterSpacing: "-0.3px",
              }}
            >
              Leave your mark on Solana devnet
            </span>
          </div>

          {/* Solana badge */}
          <div
            style={{
              display: "flex",
              alignItems: "center",
              gap: "8px",
              background: "rgba(255,255,255,0.04)",
              border: "1px solid rgba(255,255,255,0.08)",
              borderRadius: "100px",
              padding: "8px 20px",
            }}
          >
            <div
              style={{
                width: "8px",
                height: "8px",
                borderRadius: "50%",
                background: "#4a9b87",
              }}
            />
            <span style={{ fontSize: "18px", color: "#6a6a6a", fontWeight: 500 }}>
              Solana devnet
            </span>
          </div>
        </div>
      </div>
    ),
    { ...size }
  );
}
