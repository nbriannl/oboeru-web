import React, { useEffect, useReducer, useState } from "react";
import BuildStamp from "./components/BuildStamp";
import { Container } from "react-bootstrap";

import "./App.css";
import lessonList from "./lessonlist.json";

import NavBar from "./components/NavBar";
import HomeScreen from "./screens/HomeScreen";
import QuizScreen from "./screens/QuizScreen";

import {
  QUIZ_PHASE,
  allWordIndices,
  initialQuizState,
  quizReducer
} from "./quiz/quizReducer";

const THEME = {
  red: "#DC3545",
  blue: "#007BFF"
};

function setBrowserThemeColor(color) {
  const meta = document.querySelector('meta[name="theme-color"]');
  if (meta) meta.setAttribute("content", color);
}

const lessonNumbers = Object.keys(lessonList)
  .map(Number)
  .filter(n => Number.isFinite(n))
  .sort((a, b) => a - b);

export default function App() {
  const [lessonNum, setLessonNum] = useState(lessonNumbers[0] ?? 1);
  const [isBlueTheme, setIsBlueTheme] = useState(false);
  const [isOpenEnded, setIsOpenEnded] = useState(false);

  const [quiz, dispatch] = useReducer(quizReducer, undefined, initialQuizState);

  useEffect(() => {
    setBrowserThemeColor(isBlueTheme ? THEME.blue : THEME.red);
  }, [isBlueTheme]);

  const themeColor = isBlueTheme ? "primary" : "danger";
  const isInQuiz = quiz.phase !== QUIZ_PHASE.IDLE;

  const startLessonQuiz = () => {
    dispatch({
      type: "START",
      wordIndices: lessonList[lessonNum] ?? [],
      isOpenEnded
    });
  };

  const startAllQuiz = () => {
    dispatch({
      type: "START",
      wordIndices: allWordIndices(),
      isOpenEnded
    });
  };

  const restartIncorrect = () => {
    dispatch({
      type: "START",
      wordIndices: quiz.incorrectQuestions,
      isOpenEnded: quiz.isOpenEnded
    });
  };

  const endQuiz = () => dispatch({ type: "END" });

  const onPickOption = e =>
    dispatch({ type: "ANSWER_MCQ", pickedIndex: Number(e.target.value) });

  const onOpenAnswerChange = e =>
    dispatch({ type: "SET_OPEN_ANSWER", value: e.target.value });

  const onOpenAnswerSubmit = e => {
    e.preventDefault();
    dispatch({ type: "ANSWER_OPEN", answer: quiz.answerFormValue });
  };

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
