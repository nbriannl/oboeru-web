import { useReducer } from "react";
import {
  QUIZ_PHASE,
  allWordIndices,
  initialQuizState,
  quizReducer
} from "../quiz/quizReducer";

export function useQuizController(lessonNum, isOpenEnded, lessonList) {
  const [quiz, dispatch] = useReducer(quizReducer, undefined, initialQuizState);

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

  const isInQuiz = quiz.phase !== QUIZ_PHASE.IDLE;

  return {
    quiz,
    isInQuiz,
    startLessonQuiz,
    startAllQuiz,
    restartIncorrect,
    endQuiz,
    onPickOption,
    onOpenAnswerChange,
    onOpenAnswerSubmit
  };
}
