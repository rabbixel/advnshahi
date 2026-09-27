import { ImageResponse } from "next/og";

export const alt = "NanakShahi: Nanakshahi calendar, Gurpurab and Sikh heritage, explained with care";
export const size = { width: 1200, height: 630 };
export const contentType = "image/png";

export default function OpengraphImage() {
  return new ImageResponse(
    (
      <div
        style={{
          width: "100%",
          height: "100%",
          display: "flex",
          flexDirection: "column",
          justifyContent: "space-between",
          background: "#1d2d4a",
          padding: "72px 80px",
          color: "#faf7f1",
        }}
      >
        <div style={{ display: "flex", alignItems: "center", gap: 24 }}>
          <svg width="88" height="88" viewBox="0 0 32 32">
            <rect width="32" height="32" rx="7" fill="#faf7f1" fillOpacity="0.08" />
            <path d="M8 21a8 8 0 0 1 16 0" fill="#e0781f" />
            <path d="M5.5 21h21" stroke="#faf7f1" strokeWidth="1.6" strokeLinecap="round" />
            <path d="M9 25h14" stroke="#faf7f1" strokeWidth="1.6" strokeLinecap="round" opacity=".55" />
            <path d="M16 6.5v3M9.3 9.3l2 2M22.7 9.3l-2 2" stroke="#e0781f" strokeWidth="1.6" strokeLinecap="round" />
          </svg>
          <div style={{ display: "flex", fontSize: 64, fontWeight: 700, letterSpacing: -1 }}>
            <span>Nanak</span>
            <span style={{ color: "#e0781f" }}>Shahi</span>
          </div>
        </div>
        <div style={{ display: "flex", flexDirection: "column", gap: 20 }}>
          <div style={{ fontSize: 58, fontWeight: 700, lineHeight: 1.12, maxWidth: 960 }}>
            The Nanakshahi calendar, Gurpurab and Sikh heritage, explained with care.
          </div>
          <div style={{ fontSize: 28, color: "rgba(250,247,241,0.72)" }}>
            Calendar · Gurpurab · Hukamnama · Harmandir Sahib · Sikh festivals
          </div>
        </div>
        <div style={{ display: "flex", height: 8, width: 160, background: "#e0781f", borderRadius: 4 }} />
      </div>
    ),
    size,
  );
}
