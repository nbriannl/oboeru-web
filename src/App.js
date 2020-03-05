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
import lessonList from "./lessonlist.json";

const numLessons = Object.keys(lessonList).length;
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
    console.log(lessonList);
  }

  handleStartQuiz = () => {
    const wordIndices = lessonList[this.state.lessonNum];
    this.setState({
      isInQuiz: true,
      questionsIndices: wordIndices,
      currentQnNum: 0,
      numCorrect: 0,
      previousQuestion: {
        isCorrect: null,
        english: null,
        japanese: null
      }
    });
  };

  handleEndQuiz = () => {
    this.setState({
      isInQuiz: false,
      questionsIndices: undefined,
      currentQnNum: undefined,
      previousQuestion: undefined
    });
  };

  handleLessonSelect = event => {
    const selectedLessonNum = parseInt(event.target.value);
    this.setState({ lessonNum: selectedLessonNum });
  };

  getQuestionAndAnswers = questionIndex => {
    console.log(questionIndex);
    const questionWord = vocabulary[questionIndex];
    console.log(questionWord);
    const englishQuestion = questionWord.english;
    let questionBlank = "(    ?    )";
    let japaneseAnswer = questionWord.japanese;
    if (questionWord.preJapanese !== "") {
      questionBlank = questionWord.preJapanese + " " + questionBlank;
      japaneseAnswer = questionWord.preJapanese + " " + japaneseAnswer;
    }
    if (questionWord.postJapanese !== "") {
      questionBlank = questionBlank + " " + questionWord.postJapanese;
      japaneseAnswer = japaneseAnswer + " " + questionWord.postJapanese;
    }
    return { englishQuestion, questionBlank, japaneseAnswer };
  };

  handleOptionSelect = event => {
    console.log("option selected: " + event.target.value);
    const currQnNum = this.state.currentQnNum;
    const currentWordIndex = this.state.questionsIndices[currQnNum];
    const nextQnNum = this.state.currentQnNum + 1;
    const { englishQuestion, japaneseAnswer } = this.getQuestionAndAnswers(
      currentWordIndex
    );
    this.setState({
      currentQnNum: nextQnNum,
      previousQuestion: {
        isCorrect: true,
        english: englishQuestion,
        japanese: japaneseAnswer
      }
    });
  };

  render() {
    const isInQuiz = this.state.isInQuiz;
    let content;
    if (isInQuiz) {
      const numTotal = this.state.questionsIndices.length;
      const currentQnNum = this.state.currentQnNum; // 0-index
      const currentWordIndex = this.state.questionsIndices[currentQnNum];
      const { englishQuestion, questionBlank } = this.getQuestionAndAnswers(
        currentWordIndex
      );
      const numCorrect = this.state.numCorrect;
      const numWrong = currentQnNum - numCorrect;
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
              <PreviousQuestionCard
                previousQuestion={this.state.previousQuestion}
              />
            </Col>
          </Row>
          <Row className="question-card">
            <Col>
              <QuestionCard
                title={englishQuestion}
                text={questionBlank}
                currentQnNum={currentQnNum + 1}
                numTotal={numTotal}
                numCorrect={numCorrect}
                numWrong={numWrong}
              />
            </Col>
          </Row>
          <Row className="answer-buttons">
            <Col>
              <MCQOptions
                handleOptionSelect={this.handleOptionSelect}
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
      const options = lessonNumbers.map(number => {
        return (
          <option key={number.toString()} value={number}>
            {number}
          </option>
        );
      });
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
  const { isCorrect, english, japanese } = props.previousQuestion;
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
        <Card.Text>{japanese}</Card.Text>
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
      <Button
        value={0}
        variant="outline-danger"
        onClick={props.handleOptionSelect}
      >
        {props.options[0]}
      </Button>
      <Button
        value={1}
        variant="outline-danger"
        onClick={props.handleOptionSelect}
      >
        {props.options[1]}
      </Button>
      <Button
        value={2}
        variant="outline-danger"
        onClick={props.handleOptionSelect}
      >
        {props.options[2]}
      </Button>
      <Button
        value={3}
        variant="outline-danger"
        onClick={props.handleOptionSelect}
      >
        {props.options[3]}
      </Button>
    </ButtonGroup>
  );
}

export default App;
