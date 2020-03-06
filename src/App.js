import React from "react";
import { Helmet } from "react-helmet";

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
import posList from "./poslist.json";
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
  }

  handleStartQuiz = () => {
    const wordIndices = lessonList[this.state.lessonNum];
    const shuffled = this.shuffleArray(wordIndices);

    const correctOptionIndex = Math.floor(Math.random() * 4);
    this.setState({
      isInQuiz: true,
      questionsIndices: shuffled,
      currentQnNum: 0,
      numCorrect: 0,
      previousQuestion: {
        isCorrect: null,
        english: null,
        japanese: null
      },
      correctOptionIndex: correctOptionIndex,
      answeredQuestions: []
    });
  };

  shuffleArray = array => {
    for (let i = array.length - 1; i > 0; i--) {
      const j = Math.floor(Math.random() * i);
      const temp = array[i];
      array[i] = array[j];
      array[j] = temp;
    }
    return array;
  };

  handleEndQuiz = () => {
    this.setState({
      isInQuiz: false,
      questionsIndices: undefined,
      currentQnNum: undefined,
      previousQuestion: undefined,
      correctOptionIndex: undefined,
      answeredQuestions: undefined
    });
  };

  handleLessonSelect = event => {
    const selectedLessonNum = parseInt(event.target.value);
    this.setState({ lessonNum: selectedLessonNum });
  };

  getQuestionAndAnswers = questionIndex => {
    const questionWord = vocabulary[questionIndex];
    const englishQuestion = questionWord.english;
    let questionBlank = "(    ?    )";
    let japaneseAnswerString = `[${questionWord.japanese}]`;
    let japaneseAnswerStringHiragana = `[${questionWord.japanese_all_hiragana}]`;
    if (questionWord.preJapaneseParticle !== "") {
      questionBlank = questionWord.preJapaneseParticle + " " + questionBlank;
      japaneseAnswerString =
        questionWord.preJapaneseParticle + " " + japaneseAnswerString;
      japaneseAnswerStringHiragana =
        questionWord.preJapaneseParticle + " " + japaneseAnswerStringHiragana;
    }
    if (questionWord.preJapanese !== "") {
      questionBlank = questionWord.preJapanese + " " + questionBlank;
      japaneseAnswerString =
        questionWord.preJapanese + " " + japaneseAnswerString;
      japaneseAnswerStringHiragana =
        questionWord.preJapanese + " " + japaneseAnswerStringHiragana;
    }
    if (questionWord.partOfSpeech.includes("na-adj")) {
      questionBlank = questionBlank + "[な]";
      japaneseAnswerString = japaneseAnswerString + "[な]";
      japaneseAnswerStringHiragana = japaneseAnswerStringHiragana + "[な]";
    }
    if (questionWord.postJapanese !== "") {
      questionBlank = questionBlank + " " + questionWord.postJapanese;
      japaneseAnswerString =
        japaneseAnswerString + " " + questionWord.postJapanese;
      japaneseAnswerStringHiragana =
        japaneseAnswerStringHiragana + " " + questionWord.postJapanese;
    }
    let correctJapaneseOption =
      questionWord.japanese + " [" + questionWord.japanese_all_hiragana + "]";
    const incorrectJapaneseOptions = this.getIncorrectOptions(
      questionWord.partOfSpeech[0],
      questionIndex
    );
    return {
      englishQuestion,
      questionBlank,
      japaneseAnswerString,
      japaneseAnswerStringHiragana,
      correctJapaneseOption,
      incorrectJapaneseOptions
    };
  };

  getIncorrectOptions = (partOfSpeech, indexQuestionWord) => {
    const posListForQuestionWord = posList[partOfSpeech];
    const indexInPosList = posListForQuestionWord.indexOf(indexQuestionWord);
    let optionIndices = [];
    while (optionIndices.length < 3) {
      const randomIndex = this.getRandomInt(
        0,
        posListForQuestionWord.length - 1
      );
      if (
        randomIndex !== indexInPosList &&
        !optionIndices.includes(randomIndex)
      ) {
        optionIndices.push(randomIndex);
      }
    }
    const incorrectOptions = optionIndices.map(index => {
      const indexToVocab = posListForQuestionWord[index];
      const incorrectWord = vocabulary[indexToVocab];
      const incorrecOption =
        incorrectWord.japanese +
        " [" +
        incorrectWord.japanese_all_hiragana +
        "]";
      return incorrecOption;
    });
    return incorrectOptions;
  };

  getRandomInt = (min, max) => {
    min = Math.ceil(min);
    max = Math.floor(max);
    return Math.floor(Math.random() * (max - min + 1)) + min;
  };

  handleOptionSelect = event => {
    const isCorrect =
      parseInt(event.target.value) === this.state.correctOptionIndex;
    let newNumCorrect = this.state.numCorrect;
    if (isCorrect) {
      newNumCorrect = newNumCorrect + 1;
    }

    const currQnNum = this.state.currentQnNum;
    const nextQnNum = this.state.currentQnNum + 1;

    const currentWordIndex = this.state.questionsIndices[currQnNum];
    const {
      englishQuestion,
      japaneseAnswerString,
      japaneseAnswerStringHiragana
    } = this.getQuestionAndAnswers(currentWordIndex);

    const correctOptionIndex = Math.floor(Math.random() * 4);

    const currentAnsweredQuestions = this.state.answeredQuestions;
    currentAnsweredQuestions.push({
      isCorrect,
      english: englishQuestion,
      japanese: japaneseAnswerString,
      japaneseAllHiragana: japaneseAnswerStringHiragana
    });

    this.setState({
      currentQnNum: nextQnNum,
      previousQuestion: {
        isCorrect: isCorrect,
        english: englishQuestion,
        japanese: japaneseAnswerString,
        japaneseAllHiragana: japaneseAnswerStringHiragana
      },
      numCorrect: newNumCorrect,
      correctOptionIndex: correctOptionIndex,
      answeredQuestions: currentAnsweredQuestions
    });
  };

  render() {
    const isInQuiz = this.state.isInQuiz;
    let content;
    if (isInQuiz) {
      const numTotal = this.state.questionsIndices.length;
      const currentQnNum = this.state.currentQnNum; // 0-index
      const isQuizEnd = currentQnNum >= numTotal;
      const numCorrect = this.state.numCorrect;
      const numWrong = currentQnNum - numCorrect;
      if (isQuizEnd) {
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
                  title="Quiz Over"
                  currentQnNum={currentQnNum}
                  numTotal={numTotal}
                  numCorrect={numCorrect}
                  numWrong={numWrong}
                />
              </Col>
            </Row>
            <Row className="question-card">
              <Col>
                <SummaryTable questions={this.state.answeredQuestions} />
              </Col>
            </Row>
          </>
        );
      } else {
        const currentWordIndex = this.state.questionsIndices[currentQnNum];
        const {
          englishQuestion,
          questionBlank,
          correctJapaneseOption,
          incorrectJapaneseOptions
        } = this.getQuestionAndAnswers(currentWordIndex);
        const correctOptionIndex = this.state.correctOptionIndex;
        let options = incorrectJapaneseOptions;
        options.splice(correctOptionIndex, 0, correctJapaneseOption);

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
                  options={options}
                />
              </Col>
            </Row>
          </>
        );
      }
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
                <Form.Label>Select Lesson</Form.Label>
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
        <Helmet>
          <title>Oboeru 覚える MCQ Vocab Quiz App</title>
          <meta name="author" content="Neil Brian Labayna" />
          <meta
            name="description"
            content="MCQ Quiz App for Japanese Langauge"
          />
        </Helmet>
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
  const {
    isCorrect,
    english,
    japanese,
    japaneseAllHiragana
  } = props.previousQuestion;
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
          <br></br>
          {japaneseAllHiragana}
        </Card.Text>
      </Card.Body>
    </Card>
  );
}

function PreviousQuestionCardCompact(props) {
  const {
    isCorrect,
    english,
    japanese,
    japaneseAllHiragana
  } = props.previousQuestion;
  const bgStyle = isCorrect ? "success" : "danger";
  return (
    <Card bg={bgStyle} text="white" className="text-center">
      <Card.Body>
        <Card.Title>{english}</Card.Title>
        <Card.Text>
          {japanese}
          <br></br>
          {japaneseAllHiragana}
        </Card.Text>
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

const SummaryTable = props => {
  const cards = props.questions.map((question, index) => {
    return (
      <PreviousQuestionCardCompact key={index} previousQuestion={question} />
    );
  });
  return (
    <>
      <h3 className="text-center">Summary</h3>
      {cards}
    </>
  );
};

export default App;
