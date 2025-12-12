import React from "react";

export default function BuildStamp() {
  const sha = (process.env.REACT_APP_BUILD_SHA || "").slice(0, 7);
  const date = process.env.REACT_APP_BUILD_DATE || "";

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
      title={`sha=${process.env.REACT_APP_BUILD_SHA}\ndate=${date}`}
    >
      {date} · {sha}
    </div>
  );
}
