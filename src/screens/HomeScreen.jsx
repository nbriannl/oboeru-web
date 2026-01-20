import React from "react";
import lessonMetadata from "../lessonMetadata.json";

export default function HomeScreen({
  themeColor,
  lessonNumbers,
  lessonNum,
  setLessonNum,
  isOpenEnded,
  setIsOpenEnded,
  isBlueTheme,
  setIsBlueTheme,
  startLessonQuiz,
  startAllQuiz
}) {
  const isDark = themeColor === "dark";
  const primaryColor = isDark ? "bg-slate-700 hover:bg-slate-600" : "bg-red-600 hover:bg-red-500";
  const textColor = isDark ? "text-slate-200" : "text-gray-700";
  
  // Grouping logic
  const groups = lessonMetadata.map(meta => ({
    ...meta,
    lessons: []
  }));
  const others = [];

  lessonNumbers.forEach(n => {
    // Check if 'n' belongs to a group
    const group = groups.find(g => g.ids.includes(n));
    if (group) {
      group.lessons.push(n);
    } else {
      others.push(n);
    }
  });

  return (
    <div className="flex flex-col items-center justify-center space-y-8 max-w-2xl mx-auto w-full">
      <div className={`p-8 rounded-2xl shadow-xl w-full ${isDark ? 'bg-slate-800' : 'bg-white'}`}>
        <h1 className={`text-3xl font-bold mb-6 text-center ${isDark ? 'text-white' : 'text-gray-800'}`}>
          Start Quiz
        </h1>

        <div className="space-y-6">
          <div className="flex flex-col space-y-2">
            <label className={`text-sm font-semibold uppercase tracking-wider ${textColor}`}>
              Select Lesson
            </label>
            <div className="relative">
              <select
                className={`w-full p-3 rounded-lg border appearance-none focus:ring-2 focus:ring-opacity-50 transition-all cursor-pointer ${
                  isDark 
                    ? 'bg-slate-700 border-slate-600 text-white focus:ring-blue-500 focus:border-blue-500' 
                    : 'bg-gray-50 border-gray-200 text-gray-900 focus:ring-red-500 focus:border-red-500'
                }`}
                value={lessonNum}
                onChange={e => setLessonNum(e.target.value)}
              >
                {groups.map(g =>
                  g.lessons.length > 0 ? (
                    <optgroup key={g.title} label={g.title}>
                      {g.lessons.map(id => {
                        // Extract lesson number from ID "textbookId-lessonNum"
                        const parts = String(id).split("-");
                        const displayNum = parts.length > 1 ? parts.slice(1).join("-") : id;
                        return (
                          <option key={id} value={id}>
                            {displayNum}
                          </option>
                        );
                      })}
                    </optgroup>
                  ) : null
                )}
                {others.length > 0 && (
                  <optgroup label="Others">
                    {others.map(n => (
                      <option key={n} value={n}>
                        {n}
                      </option>
                    ))}
                  </optgroup>
                )}
              </select>
            </div>
          </div>

          <div className="flex items-center space-x-3 p-3 rounded-lg border border-transparent hover:bg-opacity-50 transition-colors">
            <input
              id="open-ended-checkbox"
              type="checkbox"
              className={`w-5 h-5 rounded focus:ring-offset-0 cursor-pointer ${isDark ? 'text-blue-500 bg-slate-700 border-slate-600' : 'text-red-600 border-gray-300'}`}
              checked={isOpenEnded}
              onChange={e => setIsOpenEnded(e.target.checked)}
            />
            <label htmlFor="open-ended-checkbox" className={`flex-grow cursor-pointer ${textColor}`}>
              <span className="font-medium">Open Ended Mode</span>
              <span className="block text-xs opacity-70">Type the answer instead of multiple choice</span>
            </label>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 pt-4">
            <button
              onClick={startLessonQuiz}
              className={`w-full py-4 px-6 rounded-xl text-white font-bold text-lg shadow-lg transform transition-all hover:scale-105 active:scale-95 ${primaryColor}`}
            >
              Start Lesson {String(lessonNum).split('-').pop()}
            </button>
            <button
              onClick={startAllQuiz}
              className={`w-full py-4 px-6 rounded-xl text-white font-bold text-lg shadow-lg transform transition-all hover:scale-105 active:scale-95 ${isDark ? 'bg-sky-600 hover:bg-sky-500' : 'bg-orange-500 hover:bg-orange-400'}`}
            >
              Start All Lessons
            </button>
          </div>
        </div>
      </div>

      <div className={`p-6 rounded-xl shadow-lg w-full flex items-center justify-between ${isDark ? 'bg-slate-800' : 'bg-white'}`}>
        <span className={`font-medium ${textColor}`}>Theme</span>
        <button
          onClick={() => setIsBlueTheme(!isBlueTheme)}
          className={`px-4 py-2 rounded-lg font-medium transition-colors ${
            isBlueTheme 
              ? 'bg-red-100 text-red-700 hover:bg-red-200' 
              : 'bg-slate-200 text-slate-700 hover:bg-slate-300'
          }`}
        >
          Switch to {isBlueTheme ? "Light" : "Dark"} Mode
        </button>
      </div>
    </div>
  );
}
