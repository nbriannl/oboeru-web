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
import posList from "./poslist.json";
import lessonList from "./lessonlist.json";

const numLessons = Object.keys(lessonList).length;
const lessonNumbers = [...Array(numLessons).keys()].map(x => x + 1);

class App extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      isInQuiz: false,
      lessonNum: 1,
      isBlueTheme: false, // checked false == Red theme
      isOpenEnded: false
    };
  }

  handleRestartQuiz = _event => {
    this.handleStartQuiz(_event, this.state.incorrectQuestions);
  };

  handleStartQuiz = (_event, wordIndicesParam) => {
    const wordIndices = wordIndicesParam || lessonList[this.state.lessonNum];
    const shuffled = this.shuffleArray(wordIndices);
    const correctOptionIndex = Math.floor(Math.random() * 4);
    if (this.state.isOpenEnded) {
      const currentWordIndex = shuffled[0];
      const {
        japaneseAnswerOpenEnded,
        japaneseAnswerOpenEndedHiragana
      } = this.getQuestionAndAnswers(currentWordIndex);
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
        correctAnswer: japaneseAnswerOpenEnded,
        correctAnswerHiragana: japaneseAnswerOpenEndedHiragana,
        incorrectQuestions: [],
        answeredQuestions: [],
        answerFormValue: ""
      });
    } else {
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
        incorrectQuestions: [],
        answeredQuestions: []
      });
    }
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
      incorrectQuestions: undefined,
      answeredQuestions: undefined,
      numCorrect: undefined
    });
  };

  handleLessonSelect = event => {
    const selectedLessonNum = parseInt(event.target.value);
    this.setState({ lessonNum: selectedLessonNum });
  };

  handleThemeSwitch = event => {
    this.setState({ isBlueTheme: event.target.checked });
  };

  handleModeSwitch = event => {
    this.setState({ isOpenEnded: event.target.checked });
  };

  handleAnswerChange = event => {
    this.setState({ answerFormValue: event.target.value });
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
    const japaneseAnswerOpenEnded = questionWord.japanese;
    const japaneseAnswerOpenEndedHiragana = questionWord.japanese_all_hiragana;
    return {
      englishQuestion,
      questionBlank,
      japaneseAnswerString,
      japaneseAnswerStringHiragana,
      correctJapaneseOption,
      incorrectJapaneseOptions,
      japaneseAnswerOpenEnded,
      japaneseAnswerOpenEndedHiragana
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
      const randomWord =
        vocabulary[posListForQuestionWord[randomIndex]].japanese;
      const questionWord =
        vocabulary[posListForQuestionWord[indexInPosList]].japanese;
      if (
        randomIndex !== indexInPosList &&
        !optionIndices.includes(randomIndex) &&
        randomWord !== questionWord
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

    const currentIncorrectQuestions = this.state.incorrectQuestions;
    if (!isCorrect) {
      currentIncorrectQuestions.push(currentWordIndex);
    }

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

  handleAnswerSubmit = event => {
    const isCorrect =
      this.state.answerFormValue === this.state.correctAnswer ||
      this.state.answerFormValue === this.state.correctAnswerHiragana;
    let newNumCorrect = this.state.numCorrect;
    if (isCorrect) {
      newNumCorrect = newNumCorrect + 1;
    }

    const currQnNum = this.state.currentQnNum;
    const nextQnNum = this.state.currentQnNum + 1;
    const currentWordIndex = this.state.questionsIndices[currQnNum];
    const nextWordIndex = this.state.questionsIndices[nextQnNum];
    const {
      englishQuestion,
      japaneseAnswerString,
      japaneseAnswerStringHiragana
    } = this.getQuestionAndAnswers(currentWordIndex);

    const numTotal = this.state.questionsIndices.length;
    const isQuizEnd = nextQnNum >= numTotal;
    let nextJapaneseAnswerOpenEnded = "";
    let nextJapaneseAnswerOpenEndedHiragana = "";
    if (!isQuizEnd) {
      const {
        japaneseAnswerOpenEnded,
        japaneseAnswerOpenEndedHiragana
      } = this.getQuestionAndAnswers(nextWordIndex);
      nextJapaneseAnswerOpenEnded = japaneseAnswerOpenEnded;
      nextJapaneseAnswerOpenEndedHiragana = japaneseAnswerOpenEndedHiragana;
    }

    const currentAnsweredQuestions = this.state.answeredQuestions;
    currentAnsweredQuestions.push({
      isCorrect,
      english: englishQuestion,
      japanese: japaneseAnswerString,
      japaneseAllHiragana: japaneseAnswerStringHiragana
    });

    const currentIncorrectQuestions = this.state.incorrectQuestions;
    if (!isCorrect) {
      currentIncorrectQuestions.push(currentWordIndex);
    }

    this.setState({
      currentQnNum: nextQnNum,
      previousQuestion: {
        isCorrect: isCorrect,
        english: englishQuestion,
        japanese: japaneseAnswerString,
        japaneseAllHiragana: japaneseAnswerStringHiragana
      },
      numCorrect: newNumCorrect,
      correctAnswer: nextJapaneseAnswerOpenEnded,
      correctAnswerHiragana: nextJapaneseAnswerOpenEndedHiragana,
      answeredQuestions: currentAnsweredQuestions,
      answerFormValue: ""
    });

    event.preventDefault();
  };

  render() {
    const themeColor = this.state.isBlueTheme ? "primary" : "danger";
    const redColor = "#DC3545";
    const blueColor = "#007BFF";
    if (this.state.isBlueTheme) {
      document
        .querySelector('meta[name="theme-color"]')
        .setAttribute("content", blueColor);
    } else {
      document
        .querySelector('meta[name="theme-color"]')
        .setAttribute("content", redColor);
    }

    const isInQuiz = this.state.isInQuiz;
    const isOpenEnded = this.state.isOpenEnded;
    let content;
    if (isInQuiz) {
      const numTotal = this.state.questionsIndices.length;
      const currentQnNum = this.state.currentQnNum; // 0-index
      const isQuizEnd = currentQnNum >= numTotal;
      const numCorrect = this.state.numCorrect;
      const numWrong = currentQnNum - numCorrect;
      if (isQuizEnd) {
        let restartButton = "";
        if (numWrong !== 0) {
          restartButton = (
            <Row className="restart-button" onClick={this.handleRestartQuiz}>
              <Col>
                <Button block variant={`outline-${themeColor}`}>
                  Test Incorrect Questions
                </Button>
              </Col>
            </Row>
          );
        }
        content = (
          <>
            <Row className="quit-button" onClick={this.handleEndQuiz}>
              <Col>
                <Button block variant={`outline-${themeColor}`}>
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
            {restartButton}
            <Row className="question-card">
              <Col>
                <SummaryTable questions={this.state.answeredQuestions} />
              </Col>
            </Row>
          </>
        );
      } else {
        const currentWordIndex = this.state.questionsIndices[currentQnNum];
        const { englishQuestion, questionBlank } = this.getQuestionAndAnswers(
          currentWordIndex
        );
        let answerContent = "";
        if (isOpenEnded) {
          answerContent = (
            <>
              <OpenEndedAnswerForm
                themeColor={themeColor}
                value={this.state.answerFormValue}
                handleAnswerSubmit={this.handleAnswerSubmit}
                handleAnswerChange={this.handleAnswerChange}
              />
            </>
          );
        } else {
          const currentWordIndex = this.state.questionsIndices[currentQnNum];
          const {
            correctJapaneseOption,
            incorrectJapaneseOptions
          } = this.getQuestionAndAnswers(currentWordIndex);
          const correctOptionIndex = this.state.correctOptionIndex;
          let options = incorrectJapaneseOptions;
          options.splice(correctOptionIndex, 0, correctJapaneseOption);
          answerContent = (
            <>
              <MCQOptions
                themeColor={themeColor}
                handleOptionSelect={this.handleOptionSelect}
                options={options}
              />
            </>
          );
        }
        content = (
          <>
            <Row className="quit-button" onClick={this.handleEndQuiz}>
              <Col>
                <Button block variant={`outline-${themeColor}`}>
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
              <Col>{answerContent}</Col>
            </Row>
          </>
        );
      }
    } else {
      // Main screen
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
                variant={`outline-${themeColor}`}
                onClick={this.handleStartQuiz}
              >
                Start
              </Button>
            </Col>
          </Row>
          <Row>
            <Col>
              <Form.Group
                className="text-center"
                controlId="exampleForm.ControlSelect1"
              >
                <Form.Label>Select Lesson</Form.Label>
                <Form.Control
                  as="select"
                  value={this.state.lessonNum}
                  onChange={this.handleLessonSelect}
                >
                  {options}
                </Form.Control>
                <br></br>
                <Form.Check
                  type="switch"
                  id="mode-switch"
                  label="MCQ/Open Ended"
                  checked={this.state.isOpenEnded}
                  onChange={this.handleModeSwitch}
                />
                <br></br>
                <Form.Check
                  type="switch"
                  id="theme-switch"
                  label="Red/Blue"
                  checked={this.state.isBlueTheme}
                  onChange={this.handleThemeSwitch}
                />
              </Form.Group>
            </Col>
          </Row>
        </>
      );
    }
    return (
      <div>
        <NavBar bg={themeColor} />
        <Container className="content" fluid>
          {content}
        </Container>
      </div>
    );
  }
}

const NavBar = props => {
  return (
    <Navbar bg={props.bg} variant="dark" expand="lg">
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
  const themeColor = props.themeColor;
  return (
    <ButtonGroup vertical className="special">
      <Button
        value={0}
        variant={`outline-${themeColor}`}
        onClick={props.handleOptionSelect}
      >
        {props.options[0]}
      </Button>
      <Button
        value={1}
        variant={`outline-${themeColor}`}
        onClick={props.handleOptionSelect}
      >
        {props.options[1]}
      </Button>
      <Button
        value={2}
        variant={`outline-${themeColor}`}
        onClick={props.handleOptionSelect}
      >
        {props.options[2]}
      </Button>
      <Button
        value={3}
        variant={`outline-${themeColor}`}
        onClick={props.handleOptionSelect}
      >
        {props.options[3]}
      </Button>
    </ButtonGroup>
  );
}

const OpenEndedAnswerForm = props => {
  return (
    <>
      {/* <form onSubmit={props.handleAnswerSubmit}>
        <label>
          <input
            type="text"
            value={props.value}
            onChange={props.handleAnswerChange}
          />
        </label>
        <input type="submit" value="Submit" />
      </form> */}
      <Form>
        <Form.Group controlId="formAnswer">
          <Form.Label>Answer</Form.Label>
          <Form.Control
            type="answer"
            placeholder="Enter answer here"
            value={props.value}
            onChange={props.handleAnswerChange}
          />
          <Form.Text className="text-muted">
            If your answer includes kanji, you must type exactly the same as the
            textbook's entry.
          </Form.Text>
        </Form.Group>
        <Button
          variant={props.themeColor}
          type="submit"
          onClick={props.handleAnswerSubmit}
        >
          Submit
        </Button>
      </Form>
    </>
  );
};

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
