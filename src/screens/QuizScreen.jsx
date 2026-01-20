import React, { useMemo } from "react";

import { QUIZ_PHASE } from "../quiz/quizReducer";
import { getQuestionAndAnswers } from "../quiz/quizEngine";

import { PreviousQuestionCard } from "../components/PreviousQuestionCard";
import QuestionCard from "../components/QuestionCard";
import MCQOptions from "../components/MCQOptions";
import OpenEndedAnswerForm from "../components/OpenEndedAnswerForm";
import SummaryTable from "../components/SummaryTable";

export default function QuizScreen({
  themeColor,
  quiz,
  endQuiz,
  restartIncorrect,
  onPickOption,
  onOpenAnswerChange,
  onOpenAnswerSubmit
}) {
  const numTotal = quiz.questionsIndices.length;
  const currentQnNum0 = quiz.currentQnNum;
  const isQuizEnd = quiz.phase === QUIZ_PHASE.DONE || currentQnNum0 >= numTotal;

  const numCorrect = quiz.numCorrect;
  const numWrong = currentQnNum0 - numCorrect;

  const qa = useMemo(() => {
    if (isQuizEnd) return null;
    const idx = quiz.questionsIndices[currentQnNum0];
    return getQuestionAndAnswers(idx);
  }, [isQuizEnd, quiz.questionsIndices, currentQnNum0]);

  const isDark = themeColor === "dark";

  if (isQuizEnd) {
    const showRestart = numWrong !== 0;

    return (
      <div className="max-w-2xl mx-auto w-full space-y-6">
        <div className="flex justify-end">
          <button 
            onClick={endQuiz}
            className={`px-4 py-2 rounded border transition-colors ${isDark ? 'border-slate-600 text-slate-300 hover:bg-slate-700' : 'border-red-200 text-red-600 hover:bg-red-50'}`}
          >
            Quit
          </button>
        </div>

        <PreviousQuestionCard previousQuestion={quiz.previousQuestion} />

        <QuestionCard
          title="Quiz Over"
          text="Good job!"
          currentQnNum={currentQnNum0}
          numTotal={numTotal}
          numCorrect={numCorrect}
          numWrong={numWrong}
        />

        {showRestart && (
           <button 
             onClick={restartIncorrect}
             className={`w-full py-4 px-6 rounded-xl text-white font-bold text-lg shadow-lg transform transition-all hover:scale-105 active:scale-95 ${isDark ? 'bg-slate-700 hover:bg-slate-600' : 'bg-red-600 hover:bg-red-500'}`}
           >
             Test Incorrect Questions
           </button>
        )}

        <SummaryTable questions={quiz.answeredQuestions} />
        
        {/* Spacer for bottom padding */}
        <div className="h-12"></div>
      </div>
    );
  }

  let answerContent = null;

  if (quiz.isOpenEnded) {
    answerContent = (
      <OpenEndedAnswerForm
        themeColor={themeColor}
        value={quiz.answerFormValue}
        handleAnswerSubmit={onOpenAnswerSubmit}
        handleAnswerChange={onOpenAnswerChange}
      />
    );
  } else {
    const options = [...qa.incorrectJapaneseOptions];
    options.splice(quiz.correctOptionIndex, 0, qa.correctJapaneseOption);

    answerContent = (
      <MCQOptions
        themeColor={themeColor}
        handleOptionSelect={onPickOption}
        options={options}
      />
    );
  }

  return (
    <div className="max-w-2xl mx-auto w-full space-y-6">
      <div className="flex justify-end">
        <button 
          onClick={endQuiz}
          className={`px-4 py-2 rounded border transition-colors ${isDark ? 'border-slate-600 text-slate-300 hover:bg-slate-700' : 'border-red-200 text-red-600 hover:bg-red-50'}`}
        >
          Quit
        </button>
      </div>

      <PreviousQuestionCard previousQuestion={quiz.previousQuestion} />

      <QuestionCard
        title={qa.englishQuestion}
        text={qa.questionBlank}
        currentQnNum={currentQnNum0 + 1}
        numTotal={numTotal}
        numCorrect={numCorrect}
        numWrong={numWrong}
      />

      <div className="mt-6">
        {answerContent}
      </div>
    </div>
  );
}
