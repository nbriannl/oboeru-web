import { getRandomInt, getQuestionAndAnswers, shuffle } from "./quizEngine";
import vocabulary from "../vocabulary.json";

export const QUIZ_PHASE = {
  IDLE: "IDLE",
  RUNNING: "RUNNING",
  DONE: "DONE"
};

export function initialQuizState() {
  return {
    phase: QUIZ_PHASE.IDLE,
    isOpenEnded: false,
    questionsIndices: [],
    currentQnNum: 0,
    numCorrect: 0,
    correctOptionIndex: 0,
    correctAnswer: "",
    correctAnswerHiragana: "",
    previousQuestion: {
      isCorrect: null,
      english: null,
      japanese: null,
      japaneseAllHiragana: null
    },
    answeredQuestions: [],
    incorrectQuestions: [],
    answerFormValue: ""
  };
}

export function quizReducer(state, action) {
  switch (action.type) {
    case "START": {
      const indices = shuffle(action.wordIndices ?? []);
      const base = {
        ...state,
        phase: QUIZ_PHASE.RUNNING,
        questionsIndices: indices,
        currentQnNum: 0,
        numCorrect: 0,
        answeredQuestions: [],
        incorrectQuestions: [],
        previousQuestion: {
          isCorrect: null,
          english: null,
          japanese: null,
          japaneseAllHiragana: null
        },
        answerFormValue: ""
      };

      if (action.isOpenEnded) {
        const first = indices[0];
        const qa = getQuestionAndAnswers(first);
        return {
          ...base,
          isOpenEnded: true,
          correctAnswer: qa.openEndedAnswer,
          correctAnswerHiragana: qa.openEndedAnswerHiragana
        };
      }

      return {
        ...base,
        isOpenEnded: false,
        correctOptionIndex: getRandomInt(0, 3)
      };
    }

    case "END":
      return { ...initialQuizState(), isOpenEnded: state.isOpenEnded };

    case "ANSWER_MCQ": {
      const pickedIndex = action.pickedIndex;
      const isCorrect = pickedIndex === state.correctOptionIndex;

      const currentWordIndex = state.questionsIndices[state.currentQnNum];
      const qa = getQuestionAndAnswers(currentWordIndex);

      const entry = {
        isCorrect,
        english: qa.englishQuestion,
        japanese: qa.japaneseAnswerString,
        japaneseAllHiragana: qa.japaneseAnswerStringHiragana
      };

      const nextQnNum = state.currentQnNum + 1;
      const done = nextQnNum >= state.questionsIndices.length;

      return {
        ...state,
        phase: done ? QUIZ_PHASE.DONE : QUIZ_PHASE.RUNNING,
        currentQnNum: nextQnNum,
        numCorrect: state.numCorrect + (isCorrect ? 1 : 0),
        previousQuestion: entry,
        answeredQuestions: [...state.answeredQuestions, entry],
        incorrectQuestions: isCorrect
          ? state.incorrectQuestions
          : [...state.incorrectQuestions, currentWordIndex],
        correctOptionIndex: done ? state.correctOptionIndex : getRandomInt(0, 3)
      };
    }

    case "ANSWER_OPEN": {
      const answer = action.answer ?? "";
      const isCorrect =
        answer === state.correctAnswer ||
        answer === state.correctAnswerHiragana;

      const currentWordIndex = state.questionsIndices[state.currentQnNum];
      const qa = getQuestionAndAnswers(currentWordIndex);

      const entry = {
        isCorrect,
        english: qa.englishQuestion,
        japanese: qa.japaneseAnswerString,
        japaneseAllHiragana: qa.japaneseAnswerStringHiragana
      };

      const nextQnNum = state.currentQnNum + 1;
      const done = nextQnNum >= state.questionsIndices.length;

      let nextCorrectAnswer = "";
      let nextCorrectHira = "";
      if (!done) {
        const nextWordIndex = state.questionsIndices[nextQnNum];
        const nextQa = getQuestionAndAnswers(nextWordIndex);
        nextCorrectAnswer = nextQa.openEndedAnswer;
        nextCorrectHira = nextQa.openEndedAnswerHiragana;
      }

      return {
        ...state,
        phase: done ? QUIZ_PHASE.DONE : QUIZ_PHASE.RUNNING,
        currentQnNum: nextQnNum,
        numCorrect: state.numCorrect + (isCorrect ? 1 : 0),
        previousQuestion: entry,
        answeredQuestions: [...state.answeredQuestions, entry],
        incorrectQuestions: isCorrect
          ? state.incorrectQuestions
          : [...state.incorrectQuestions, currentWordIndex],
        correctAnswer: nextCorrectAnswer,
        correctAnswerHiragana: nextCorrectHira,
        answerFormValue: ""
      };
    }

    case "SET_OPEN_ANSWER":
      return { ...state, answerFormValue: action.value };

    default:
      return state;
  }
}

// Convenience for Start All:
export function allWordIndices() {
  return [...Array(vocabulary.length).keys()];
}
