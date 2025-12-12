import React from "react";
import { Card } from "react-bootstrap";

export function PreviousQuestionCard({ previousQuestion }) {
  const {
    isCorrect,
    english,
    japanese,
    japaneseAllHiragana
  } = previousQuestion;

  if (isCorrect === null) {
    return (
      <Card bg="light" text="black" className="text-center">
        <Card.Header>Previous Question</Card.Header>
        <Card.Body>
          <Card.Title></Card.Title>
          <Card.Text></Card.Text>
        </Card.Body>
      </Card>
    );
  }

  const bgStyle = isCorrect ? "success" : "danger";

  return (
    <Card bg={bgStyle} text="white" className="text-center">
      <Card.Header>Previous Question</Card.Header>
      <Card.Body>
        <Card.Title>{english}</Card.Title>
        <Card.Text>
          {japanese}
          <br />
          {japaneseAllHiragana}
        </Card.Text>
      </Card.Body>
    </Card>
  );
}

export function PreviousQuestionCardCompact({ previousQuestion }) {
  const {
    isCorrect,
    english,
    japanese,
    japaneseAllHiragana
  } = previousQuestion;
  const bgStyle = isCorrect ? "success" : "danger";

  return (
    <Card bg={bgStyle} text="white" className="text-center">
      <Card.Body>
        <Card.Title>{english}</Card.Title>
        <Card.Text>
          {japanese}
          <br />
          {japaneseAllHiragana}
        </Card.Text>
      </Card.Body>
    </Card>
  );
}
