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
import BuildStamp from "./BuildStamp";

const THEME = {
  red: "#DC3545",
  blue: "#007BFF"
};

function setBrowserThemeColor(color) {
  const meta = document.querySelector('meta[name="theme-color"]');
  if (meta) meta.setAttribute("content", color);
}

// More robust than “1..N”
const lessonNumbers = Object.keys(lessonList)
  .map(Number)
  .filter(n => Number.isFinite(n))
  .sort((a, b) => a - b);

class App extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      // UI config
      isInQuiz: false,
      lessonNum: lessonNumbers[0] ?? 1,
      isBlueTheme: false, // false => red
      isOpenEnded: false,

      // quiz runtime (set when quiz starts)
      questionsIndices: undefined,
      currentQnNum: undefined,
      numCorrect: undefined,
      previousQuestion: undefined,
      correctOptionIndex: undefined,
      correctAnswer: undefined,
      correctAnswerHiragana: undefined,
      incorrectQuestions: undefined,
      answeredQuestions: undefined,
      answerFormValue: undefined
    };
  }

  componentDidMount() {
    this.applyThemeColor();
  }

  componentDidUpdate(prevProps, prevState) {
    if (prevState.isBlueTheme !== this.state.isBlueTheme) {
      this.applyThemeColor();
    }
  }

  applyThemeColor() {
    const color = this.state.isBlueTheme ? THEME.blue : THEME.red;
    setBrowserThemeColor(color);
  }

  // ---------- Quiz lifecycle ----------

  handleStartQuiz = (_event, wordIndicesParam) => {
    const wordIndices = wordIndicesParam || lessonList[this.state.lessonNum];
    this.startQuizFromIndices(wordIndices);
  };

  handleStartAllQuiz = (_event, wordIndicesParam) => {
    const wordIndices = wordIndicesParam || [
      ...Array(vocabulary.length).keys()
    ];
    this.startQuizFromIndices(wordIndices);
  };

  handleRestartQuiz = _event => {
    const wordIndices = this.state.incorrectQuestions || [];
    this.startQuizFromIndices(wordIndices);
  };

  startQuizFromIndices = wordIndicesInput => {
    const wordIndices = Array.isArray(wordIndicesInput)
      ? [...wordIndicesInput]
      : [];

    const questionsIndices = this.shuffleArray(wordIndices);
    const baseState = {
      isInQuiz: true,
      questionsIndices,
      currentQnNum: 0,
      numCorrect: 0,
      previousQuestion: {
        isCorrect: null,
        english: null,
        japanese: null,
        japaneseAllHiragana: null
      },
      incorrectQuestions: [],
      answeredQuestions: []
    };

    if (this.state.isOpenEnded) {
      const currentWordIndex = questionsIndices[0];
      const {
        japaneseAnswerOpenEnded,
        japaneseAnswerOpenEndedHiragana
      } = this.getQuestionAndAnswers(currentWordIndex);

      this.setState({
        ...baseState,
        correctAnswer: japaneseAnswerOpenEnded,
        correctAnswerHiragana: japaneseAnswerOpenEndedHiragana,
        answerFormValue: ""
      });
      return;
    }

    this.setState({
      ...baseState,
      correctOptionIndex: this.getRandomInt(0, 3)
    });
  };

  handleEndQuiz = () => {
    this.setState({
      isInQuiz: false,
      questionsIndices: undefined,
      currentQnNum: undefined,
      previousQuestion: undefined,
      correctOptionIndex: undefined,
      correctAnswer: undefined,
      correctAnswerHiragana: undefined,
      incorrectQuestions: undefined,
      answeredQuestions: undefined,
      numCorrect: undefined,
      answerFormValue: undefined
    });
  };

  // ---------- UI config handlers ----------

  handleLessonSelect = event => {
    const selectedLessonNum = Number(event.target.value);
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

  // ---------- Helpers ----------

  shuffleArray = array => {
    // Fisher–Yates shuffle on a copy
    const a = [...array];
    for (let i = a.length - 1; i > 0; i--) {
      const j = Math.floor(Math.random() * (i + 1)); // 0..i
      [a[i], a[j]] = [a[j], a[i]];
    }
    return a;
  };

  getRandomInt = (min, max) => {
    const lo = Math.ceil(min);
    const hi = Math.floor(max);
    return Math.floor(Math.random() * (hi - lo + 1)) + lo;
  };

  getQuestionAndAnswers = questionIndex => {
    const questionWord = vocabulary[questionIndex];
    const englishQuestion = questionWord.english;

    let questionBlank = "(    ?    )";
    let japaneseAnswerString = `[${questionWord.japanese}]`;
    let japaneseAnswerStringHiragana = `[${questionWord.japaneseAllHiragana}]`;

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

    const correctJapaneseOption =
      questionWord.japanese + " [" + questionWord.japaneseAllHiragana + "]";

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
      incorrectJapaneseOptions,
      japaneseAnswerOpenEnded: questionWord.japanese,
      japaneseAnswerOpenEndedHiragana: questionWord.japaneseAllHiragana
    };
  };

  getIncorrectOptions = (partOfSpeech, indexQuestionWord) => {
    const posListForQuestionWord = posList[partOfSpeech] || [];
    const indexInPosList = posListForQuestionWord.indexOf(indexQuestionWord);

    // Fallback if not found (avoid crashes)
    if (indexInPosList < 0 || posListForQuestionWord.length < 4) {
      return [];
    }

    const optionIndices = new Set();
    let guard = 0;

    while (optionIndices.size < 3 && guard < 10_000) {
      guard++;
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
        !optionIndices.has(randomIndex) &&
        randomWord !== questionWord
      ) {
        optionIndices.add(randomIndex);
      }
    }

    return [...optionIndices].map(index => {
      const indexToVocab = posListForQuestionWord[index];
      const incorrectWord = vocabulary[indexToVocab];
      return (
        incorrectWord.japanese + " [" + incorrectWord.japaneseAllHiragana + "]"
      );
    });
  };

  // ---------- Answer handlers ----------

  handleOptionSelect = event => {
    const pickedIndex = Number(event.target.value);
    const isCorrect = pickedIndex === this.state.correctOptionIndex;

    const currQnNum = this.state.currentQnNum;
    const nextQnNum = currQnNum + 1;
    const currentWordIndex = this.state.questionsIndices[currQnNum];

    const {
      englishQuestion,
      japaneseAnswerString,
      japaneseAnswerStringHiragana
    } = this.getQuestionAndAnswers(currentWordIndex);

    const answeredEntry = {
      isCorrect,
      english: englishQuestion,
      japanese: japaneseAnswerString,
      japaneseAllHiragana: japaneseAnswerStringHiragana
    };

    const answeredQuestions = [...this.state.answeredQuestions, answeredEntry];
    const incorrectQuestions = isCorrect
      ? [...this.state.incorrectQuestions]
      : [...this.state.incorrectQuestions, currentWordIndex];

    this.setState({
      currentQnNum: nextQnNum,
      numCorrect: this.state.numCorrect + (isCorrect ? 1 : 0),
      previousQuestion: answeredEntry,
      correctOptionIndex: this.getRandomInt(0, 3),
      answeredQuestions,
      incorrectQuestions
    });
  };

  handleAnswerSubmit = event => {
    event.preventDefault();

    const answer = this.state.answerFormValue || "";
    const isCorrect =
      answer === this.state.correctAnswer ||
      answer === this.state.correctAnswerHiragana;

    const currQnNum = this.state.currentQnNum;
    const nextQnNum = currQnNum + 1;

    const currentWordIndex = this.state.questionsIndices[currQnNum];
    const nextWordIndex = this.state.questionsIndices[nextQnNum];

    const {
      englishQuestion,
      japaneseAnswerString,
      japaneseAnswerStringHiragana
    } = this.getQuestionAndAnswers(currentWordIndex);

    const answeredEntry = {
      isCorrect,
      english: englishQuestion,
      japanese: japaneseAnswerString,
      japaneseAllHiragana: japaneseAnswerStringHiragana
    };

    const answeredQuestions = [...this.state.answeredQuestions, answeredEntry];
    const incorrectQuestions = isCorrect
      ? [...this.state.incorrectQuestions]
      : [...this.state.incorrectQuestions, currentWordIndex];

    const numTotal = this.state.questionsIndices.length;
    const isQuizEnd = nextQnNum >= numTotal;

    let nextCorrectAnswer = "";
    let nextCorrectAnswerHiragana = "";

    if (!isQuizEnd) {
      const next = this.getQuestionAndAnswers(nextWordIndex);
      nextCorrectAnswer = next.japaneseAnswerOpenEnded;
      nextCorrectAnswerHiragana = next.japaneseAnswerOpenEndedHiragana;
    }

    this.setState({
      currentQnNum: nextQnNum,
      numCorrect: this.state.numCorrect + (isCorrect ? 1 : 0),
      previousQuestion: answeredEntry,
      correctAnswer: nextCorrectAnswer,
      correctAnswerHiragana: nextCorrectAnswerHiragana,
      answeredQuestions,
      incorrectQuestions,
      answerFormValue: ""
    });
  };

  // ---------- Render ----------

  render() {
    const themeColor = this.state.isBlueTheme ? "primary" : "danger";

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
        const showRestart = numWrong !== 0;

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

            {showRestart && (
              <Row className="restart-button" onClick={this.handleRestartQuiz}>
                <Col>
                  <Button block variant={`outline-${themeColor}`}>
                    Test Incorrect Questions
                  </Button>
                </Col>
              </Row>
            )}

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

        let answerContent = null;

        if (isOpenEnded) {
          answerContent = (
            <OpenEndedAnswerForm
              themeColor={themeColor}
              value={this.state.answerFormValue}
              handleAnswerSubmit={this.handleAnswerSubmit}
              handleAnswerChange={this.handleAnswerChange}
            />
          );
        } else {
          const {
            correctJapaneseOption,
            incorrectJapaneseOptions
          } = this.getQuestionAndAnswers(currentWordIndex);

          const options = [...incorrectJapaneseOptions];
          options.splice(
            this.state.correctOptionIndex,
            0,
            correctJapaneseOption
          );

          answerContent = (
            <MCQOptions
              themeColor={themeColor}
              handleOptionSelect={this.handleOptionSelect}
              options={options}
            />
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
      const options = lessonNumbers.map(number => (
        <option key={number.toString()} value={number}>
          {number}
        </option>
      ));

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

                <br />

                <Form.Check
                  type="switch"
                  id="mode-switch"
                  label="MCQ/Open Ended"
                  checked={this.state.isOpenEnded}
                  onChange={this.handleModeSwitch}
                />

                <br />

                <Form.Check
                  type="switch"
                  id="theme-switch"
                  label="Red/Blue"
                  checked={this.state.isBlueTheme}
                  onChange={this.handleThemeSwitch}
                />
              </Form.Group>

              <h6 className="text-center">New features!</h6>
              <ul className="list-unstyled text-center">
                <li>Refactoring in progress!</li>
              </ul>
            </Col>
          </Row>

          <h4>Experimental</h4>

          <Row>
            <Col>
              <Button
                block
                variant={`outline-${themeColor}`}
                onClick={this.handleStartAllQuiz}
              >
                Start All
              </Button>
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
        <BuildStamp />
      </div>
    );
  }
}

const NavBar = props => (
  <Navbar bg={props.bg} variant="dark" expand="lg">
    <Navbar.Brand href="#home">Oboeru</Navbar.Brand>
  </Navbar>
);

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
          <br />
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
          <br />
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
      {props.options.map((opt, idx) => (
        <Button
          key={idx}
          value={idx}
          variant={`outline-${themeColor}`}
          onClick={props.handleOptionSelect}
        >
          {opt}
        </Button>
      ))}
    </ButtonGroup>
  );
}

const OpenEndedAnswerForm = props => (
  <Form onSubmit={props.handleAnswerSubmit}>
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
    <Button variant={props.themeColor} type="submit">
      Submit
    </Button>
  </Form>
);

const SummaryTable = props => (
  <>
    <h3 className="text-center">Summary</h3>
    {props.questions.map((question, index) => (
      <PreviousQuestionCardCompact key={index} previousQuestion={question} />
    ))}
  </>
);

export default App;
