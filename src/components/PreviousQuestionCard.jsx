import React from "react";

export function PreviousQuestionCard({ previousQuestion }) {
  const {
    isCorrect,
    english,
    japanese,
    japaneseAllHiragana
  } = previousQuestion;

  if (isCorrect === null) {
    return (
      <div className="bg-gray-50 text-gray-400 p-4 rounded-lg text-center border-2 border-dashed border-gray-200 mb-4 h-24 flex items-center justify-center">
        <span className="text-sm font-medium">No previous question</span>
      </div>
    );
  }

  const bgStyle = isCorrect ? "bg-green-600" : "bg-red-600";

  return (
    <div className={`${bgStyle} text-white rounded-lg shadow-md overflow-hidden text-center mb-4`}>
      <div className="bg-black/10 p-2 text-xs font-bold uppercase tracking-wider">
        Previous Question
      </div>
      <div className="p-4">
        <h4 className="text-lg font-bold mb-1">{english}</h4>
        <p className="text-base opacity-90">
          {japanese}
          <br />
          <span className="text-sm opacity-75">{japaneseAllHiragana}</span>
        </p>
      </div>
    </div>
  );
}

export function PreviousQuestionCardCompact({ previousQuestion }) {
  const {
    isCorrect,
    english,
    japanese,
    japaneseAllHiragana
  } = previousQuestion;
  const bgStyle = isCorrect ? "bg-green-100 border-green-200 text-green-900" : "bg-red-100 border-red-200 text-red-900";

  return (
    <div className={`${bgStyle} border rounded-lg p-3 text-center mb-2 shadow-sm`}>
      <h5 className="font-bold text-sm">{english}</h5>
      <p className="text-sm">
        {japanese}
        <br />
        <span className="text-xs opacity-75">{japaneseAllHiragana}</span>
      </p>
    </div>
  );
}
