import React, { useState } from "react";
import { Container } from "react-bootstrap";

import "./App.css";
import lessonList from "./lessonlist.json";

import NavBar from "./components/NavBar";
import BuildStamp from "./components/BuildStamp";
import HomeScreen from "./screens/HomeScreen";
import QuizScreen from "./screens/QuizScreen";

import { useTheme } from "./hooks/useTheme";
import { useQuizController } from "./hooks/useQuizController";

const lessonNumbers = Object.keys(lessonList)
  .map(Number)
  .filter(n => Number.isFinite(n))
  .sort((a, b) => a - b);

export default function App() {
  const [lessonNum, setLessonNum] = useState(lessonNumbers[0] ?? 1);
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
    <div>
      <NavBar bg={themeColor} />
      <Container className="content" fluid>
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
      </Container>
      <BuildStamp />
    </div>
  );
}
