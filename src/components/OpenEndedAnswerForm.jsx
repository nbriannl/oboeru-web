import React from "react";
import { Button, Form } from "react-bootstrap";

export default function OpenEndedAnswerForm({
  themeColor,
  value,
  handleAnswerSubmit,
  handleAnswerChange
}) {
  return (
    <Form onSubmit={handleAnswerSubmit}>
      <Form.Group controlId="formAnswer">
        <Form.Label>Answer</Form.Label>
        <Form.Control
          type="answer"
          placeholder="Enter answer here"
          value={value}
          onChange={handleAnswerChange}
        />
        <Form.Text className="text-muted">
          If your answer includes kanji, you must type exactly the same as the
          textbook&apos;s entry.
        </Form.Text>
      </Form.Group>

      <Button variant={themeColor} type="submit">
        Submit
      </Button>
    </Form>
  );
}
