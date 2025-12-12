import React from "react";
import { PreviousQuestionCardCompact } from "./PreviousQuestionCard";

export default function SummaryTable({ questions }) {
  return (
    <>
      <h3 className="text-center">Summary</h3>
      {questions.map((question, index) => (
        <PreviousQuestionCardCompact key={index} previousQuestion={question} />
      ))}
    </>
  );
}
