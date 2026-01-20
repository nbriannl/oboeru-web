import React, { useState } from "react";

export default function OpenEndedAnswerForm({
  themeColor,
  value,
  handleAnswerSubmit,
  handleAnswerChange
}) {
  const isDark = themeColor === "dark";
  const btnClass = isDark
    ? "bg-slate-700 hover:bg-slate-600 text-white"
    : "bg-red-600 hover:bg-red-500 text-white";
  const inputBorder = isDark ? "border-slate-600 bg-slate-700 text-white placeholder-slate-400" : "border-gray-300 bg-white text-gray-900";

  return (
    <form onSubmit={handleAnswerSubmit} className="space-y-4 w-full">
      <div className="space-y-2">
        <label htmlFor="formAnswer" className="block text-sm font-medium opacity-80">
          Answer
        </label>
        <input
          id="formAnswer"
          type="text"
          className={`block w-full rounded-md shadow-sm focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm p-3 border ${inputBorder}`}
          placeholder="Enter answer here"
          value={value}
          onChange={handleAnswerChange}
          autoComplete="off"
        />
        <p className="text-xs text-gray-500 italic">
          If your answer includes kanji, you must type exactly the same as the textbook's entry.
        </p>
      </div>

      <button
        type="submit"
        className={`w-full py-2 px-4 border border-transparent rounded-md shadow-sm text-sm font-medium focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500 ${btnClass}`}
      >
        Submit
      </button>
    </form>
  );
}
