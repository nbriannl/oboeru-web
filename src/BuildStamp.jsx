import React from "react";

export default function BuildStamp() {
  const sha = (process.env.REACT_APP_BUILD_SHA || "").slice(0, 7);
  const run = process.env.REACT_APP_BUILD_RUN;
  const ref = process.env.REACT_APP_BUILD_REF;

  if (!sha && !run && !ref) return null;

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
      title={`sha=${process.env.REACT_APP_BUILD_SHA}\nref=${ref}\nrun=${run}`}
    >
      build {sha} · {ref} · #{run}
    </div>
  );
}
