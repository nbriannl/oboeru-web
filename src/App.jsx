import React, { useState } from "react";

import lessonList from "./lessonlist.json";

import NavBar from "./components/NavBar";
import BuildStamp from "./components/BuildStamp";
import HomeScreen from "./screens/HomeScreen";
import QuizScreen from "./screens/QuizScreen";

import { useTheme } from "./hooks/useTheme";
import { useQuizController } from "./hooks/useQuizController";

const lessonNumbers = Object.keys(lessonList);
// .sort() sorting strings logic? standard alphanumeric sort is usually fine, or custom sort if needed
// For now, removing the number cast and sort. The API returns insertion order often, but let's trust Object.keys order or just sort alphanumerically?
// The previous code sorted numbers. Let's do a basic sort to be safe, but keys are strings now.
lessonNumbers.sort((a, b) => {
  // Simple sort to avoid potential localeCompare issues on some environments
  if (a === b) return 0;
  // Try to sort by last number part if possible for better ordering
  const numA = parseInt(a.split("-").pop(), 10);
  const numB = parseInt(b.split("-").pop(), 10);
  if (!isNaN(numA) && !isNaN(numB)) {
    if (numA !== numB) return numA - numB;
  }
  return a < b ? -1 : 1;
});

export default function App() {
  const [lessonNum, setLessonNum] = useState(lessonNumbers[0]);
  const [isOpenEnded, setIsOpenEnded] = useState(false);

  const { isBlueTheme, setIsBlueTheme, themeColor } = useTheme();

  const {
    quiz,
    isInQuiz,
    startLessonQuiz,
    startAllQuiz,
    restartIncorrect,
    endQuiz,
    onPickOption,
    onOpenAnswerChange,
    onOpenAnswerSubmit
  } = useQuizController(lessonNum, isOpenEnded, lessonList);

  return (
    <div className={`min-h-screen flex flex-col ${isBlueTheme ? 'bg-slate-900 text-white' : 'bg-red-50 text-gray-900'}`}>
      <NavBar bg={themeColor} />
      <div className="container mx-auto px-4 py-8 flex-grow">
        {!isInQuiz ? (
          <HomeScreen
            themeColor={themeColor}
            lessonNumbers={lessonNumbers}
            lessonNum={lessonNum}
            setLessonNum={setLessonNum}
            isOpenEnded={isOpenEnded}
            setIsOpenEnded={setIsOpenEnded}
            isBlueTheme={isBlueTheme}
            setIsBlueTheme={setIsBlueTheme}
            startLessonQuiz={startLessonQuiz}
            startAllQuiz={startAllQuiz}
          />
        ) : (
          <QuizScreen
            themeColor={themeColor}
            quiz={quiz}
            endQuiz={endQuiz}
            restartIncorrect={restartIncorrect}
            onPickOption={onPickOption}
            onOpenAnswerChange={onOpenAnswerChange}
            onOpenAnswerSubmit={onOpenAnswerSubmit}
          />
        )}
      </div>
      <BuildStamp />
    </div>
  );
}
