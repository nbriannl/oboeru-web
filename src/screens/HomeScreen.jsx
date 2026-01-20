import React from "react";
import { Row, Col, Button, Form } from "react-bootstrap";
import lessonMetadata from "../lessonMetadata.json";

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
              onChange={e => setLessonNum(e.target.value)}
            >
              {(() => {
                const groups = lessonMetadata.map(meta => ({
                  ...meta,
                  lessons: []
                }));
                const others = [];

                lessonNumbers.forEach(n => {
                  // Check if 'n' belongs to a group
                  const group = groups.find(g => g.ids.includes(n));
                  if (group) {
                    group.lessons.push(n);
                  } else {
                    others.push(n);
                  }
                });

                return (
                  <>
                    {groups.map(g =>
                      g.lessons.length > 0 ? (
                        <optgroup key={g.title} label={g.title}>
                          {g.lessons.map(id => {
                            // Extract lesson number from ID "textbookId-lessonNum"
                            const parts = String(id).split("-");
                            const displayNum =
                              parts.length > 1 ? parts[parts.length - 1] : id;
                            return (
                              <option key={id} value={id}>
                                {displayNum}
                              </option>
                            );
                          })}
                        </optgroup>
                      ) : null
                    )}
                    {others.length > 0 && (
                      <optgroup label="Others">
                        {others.map(n => (
                          <option key={n} value={n}>
                            {n}
                          </option>
                        ))}
                      </optgroup>
                    )}
                  </>
                );
              })()}
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
