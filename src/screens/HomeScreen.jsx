import React from "react";
import { Row, Col, Button, Form } from "react-bootstrap";

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
  return (
    <>
      <Row>
        <Col>
          <Button
            block
            variant={`outline-${themeColor}`}
            onClick={startLessonQuiz}
          >
            Start
          </Button>
        </Col>
      </Row>

      <Row>
        <Col>
          <Form.Group className="text-center" controlId="lessonSelect">
            <Form.Label>Select Lesson</Form.Label>
            <Form.Control
              as="select"
              value={lessonNum}
              onChange={e => setLessonNum(Number(e.target.value))}
            >
              {lessonNumbers.map(n => (
                <option key={String(n)} value={n}>
                  {n}
                </option>
              ))}
            </Form.Control>

            <br />

            <Form.Check
              type="switch"
              id="mode-switch"
              label="MCQ/Open Ended"
              checked={isOpenEnded}
              onChange={e => setIsOpenEnded(e.target.checked)}
            />

            <br />

            <Form.Check
              type="switch"
              id="theme-switch"
              label="Red/Blue"
              checked={isBlueTheme}
              onChange={e => setIsBlueTheme(e.target.checked)}
            />
          </Form.Group>

          <h6 className="text-center">New features!</h6>
          <ul className="list-unstyled text-center">
            <li>Refactor V2</li>
          </ul>
        </Col>
      </Row>

      <h4>Experimental</h4>

      <Row>
        <Col>
          <Button
            block
            variant={`outline-${themeColor}`}
            onClick={startAllQuiz}
          >
            Start All
          </Button>
        </Col>
      </Row>
    </>
  );
}
