import React, { useMemo } from "react";
import { Row, Col, Button } from "react-bootstrap";

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

  if (isQuizEnd) {
    const showRestart = numWrong !== 0;

    return (
      <>
        <Row className="quit-button" onClick={endQuiz}>
          <Col>
            <Button block variant={`outline-${themeColor}`}>
              Quit
            </Button>
          </Col>
        </Row>

        <Row className="previous-question-card">
          <Col>
            <PreviousQuestionCard previousQuestion={quiz.previousQuestion} />
          </Col>
        </Row>

        <Row className="question-card">
          <Col>
            <QuestionCard
              title="Quiz Over"
              currentQnNum={currentQnNum0}
              numTotal={numTotal}
              numCorrect={numCorrect}
              numWrong={numWrong}
            />
          </Col>
        </Row>

        {showRestart && (
          <Row className="restart-button" onClick={restartIncorrect}>
            <Col>
              <Button block variant={`outline-${themeColor}`}>
                Test Incorrect Questions
              </Button>
            </Col>
          </Row>
        )}

        <Row className="question-card">
          <Col>
            <SummaryTable questions={quiz.answeredQuestions} />
          </Col>
        </Row>
      </>
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
    <>
      <Row className="quit-button" onClick={endQuiz}>
        <Col>
          <Button block variant={`outline-${themeColor}`}>
            Quit
          </Button>
        </Col>
      </Row>

      <Row className="previous-question-card">
        <Col>
          <PreviousQuestionCard previousQuestion={quiz.previousQuestion} />
        </Col>
      </Row>

      <Row className="question-card">
        <Col>
          <QuestionCard
            title={qa.englishQuestion}
            text={qa.questionBlank}
            currentQnNum={currentQnNum0 + 1}
            numTotal={numTotal}
            numCorrect={numCorrect}
            numWrong={numWrong}
          />
        </Col>
      </Row>

      <Row className="answer-buttons">
        <Col>{answerContent}</Col>
      </Row>
    </>
  );
}
