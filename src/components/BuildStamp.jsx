import React from "react";

export default function BuildStamp() {
  // Vite uses import.meta.env. VITE_ prefix is required for user vars usually,
  // but let's just make it safe for now so it doesn't crash.
  const env = import.meta.env || {};
  const sha = (env.VITE_BUILD_SHA || env.REACT_APP_BUILD_SHA || "").slice(0, 7);
  const date = env.VITE_BUILD_DATE || env.REACT_APP_BUILD_DATE || "";

  if (!sha && !date) return null;

  return (
    <div
      style={{
        position: "fixed",
        right: 10,
        bottom: 10,
        fontSize: 12,
        opacity: 0.65,
        background: "rgba(0,0,0,0.6)",
        color: "white",
        padding: "6px 8px",
        borderRadius: 6,
        zIndex: 9999
      }}
      title={`sha=${sha}\ndate=${date}`}
    >
      {date} · {sha}
    </div>
  );
}
