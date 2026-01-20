import React from "react";

export default function MCQOptions({
  themeColor,
  handleOptionSelect,
  options
}) {
  const isDark = themeColor === "dark";
  const btnClass = isDark
    ? "bg-slate-700 text-white hover:bg-slate-600 border-slate-600"
    : "bg-white text-red-600 border-red-200 hover:bg-red-50";

  return (
    <div className="flex flex-col space-y-3 w-full">
      {options.map((opt, idx) => (
        <button
          key={`${idx}-${opt}`}
          value={idx}
          className={`py-3 px-4 rounded-lg border-2 font-medium transition-all duration-200 shadow-sm hover:shadow-md active:scale-98 ${btnClass}`}
          onClick={handleOptionSelect}
        >
          {opt}
        </button>
      ))}
    </div>
  );
}
