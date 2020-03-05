import React from "react";
import {
  Row,
  Col,
  Container,
  Badge,
  Navbar,
  Card,
  Button,
  ButtonGroup,
  Form
} from "react-bootstrap";

import "./App.css";
import vocabulary from "./vocabulary.json";
import poslist from "./poslist.json";
import lessonlist from "./lessonlist.json";

const numLessons = Object.keys(lessonlist).length;
const lessonNumbers = [...Array(numLessons).keys()].map(x => x + 1);

class App extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      isInQuiz: false,
      lessonNum: 1
    };
    console.log(vocabulary);
    console.log(poslist);
    console.log(lessonlist);
  }

  handleStartQuiz = () => {
    this.setState({ isInQuiz: true });
  };

  handleEndQuiz = () => {
    this.setState({ isInQuiz: false });
  };

  handleLessonSelect = event => {
    const selectedLessonNum = parseInt(event.target.value);
    this.setState({ lessonNum: selectedLessonNum });
  };

  render() {
    const isInQuiz = this.state.isInQuiz;
    let content;
    const options = lessonNumbers.map(number => {
      return (
        <option key={number.toString()} value={number}>
          {number}
        </option>
      );
    });
    if (isInQuiz) {
      content = (
        <>
          <Row className="quit-button" onClick={this.handleEndQuiz}>
            <Col>
              <Button block variant="outline-danger">
                Quit
              </Button>
            </Col>
          </Row>
          <Row className="previous-question-card">
            <Col>
              <PreviousQuestionCard title="Free of Charge" text="無料" />
            </Col>
          </Row>
          <Row className="question-card">
            <Col>
              <QuestionCard
                title="See you later"
                text="(   ?   )[。]"
                currentQnNum={2}
                numTotal={50}
                numCorrect={2}
                numWrong={0}
              />
            </Col>
          </Row>
          <Row className="answer-buttons">
            <Col>
              <MCQOptions
                options={[
                  "おさがしですか　[おさがしですか]",
                  "しつれいします [しつれいします]",
                  "行ってきます [いってきます]",
                  "つかれました　[つかれました]"
                ]}
              />
            </Col>
          </Row>
        </>
      );
    } else {
      content = (
        <>
          <Row>
            <Col>
              <Button
                block
                variant="outline-danger"
                onClick={this.handleStartQuiz}
              >
                Start
              </Button>
            </Col>
          </Row>
          <Row>
            <Col>
              <Form.Group controlId="exampleForm.ControlSelect1">
                <Form.Label>Example select</Form.Label>
                <Form.Control
                  as="select"
                  value={this.state.lessonNum}
                  onChange={this.handleLessonSelect}
                >
                  {options}
                </Form.Control>
              </Form.Group>
            </Col>
          </Row>
        </>
      );
    }
    return (
      <div>
        <NavBar />
        <Container className="content" fluid>
          {content}
        </Container>
      </div>
    );
  }
}

const NavBar = () => {
  return (
    <Navbar bg="danger" variant="dark" expand="lg">
      <Navbar.Brand href="#home">Oboeru</Navbar.Brand>
    </Navbar>
  );
};

function PreviousQuestionCard(props) {
  return (
    <Card bg="success" text="white" className="text-center">
      <Card.Header>Previous Question</Card.Header>
      <Card.Body>
        <Card.Title>{props.title}</Card.Title>
        <Card.Text>{props.text}</Card.Text>
      </Card.Body>
    </Card>
  );
}

function QuestionCard(props) {
  return (
    <Card className="text-center">
      <Card.Body>
        <Card.Title>{props.title}</Card.Title>
        <Card.Text>{props.text}</Card.Text>
      </Card.Body>
      <Card.Footer>
        Q <Badge variant="secondary">{props.currentQnNum}</Badge> out of{" "}
        <Badge variant="secondary">{props.numTotal}</Badge>{" "}
        <i className="fa fa-check"></i>{" "}
        <Badge variant="success">{props.numCorrect}</Badge>{" "}
        <i className="fa fa-times"></i>{" "}
        <Badge variant="danger">{props.numWrong}</Badge>
      </Card.Footer>
    </Card>
  );
}

function MCQOptions(props) {
  return (
    <ButtonGroup vertical className="special">
      <Button variant="outline-danger">{props.options[0]}</Button>
      <Button variant="outline-danger">{props.options[1]}</Button>
      <Button variant="outline-danger">{props.options[2]}</Button>
      <Button variant="outline-danger">{props.options[3]}</Button>
    </ButtonGroup>
  );
}

export default App;