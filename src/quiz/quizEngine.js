import vocabulary from "../vocabulary.json";
import posList from "../poslist.json";

export function shuffle(array) {
  const a = [...array];
  for (let i = a.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [a[i], a[j]] = [a[j], a[i]];
  }
  return a;
}

export function getRandomInt(min, max) {
  const lo = Math.ceil(min);
  const hi = Math.floor(max);
  return Math.floor(Math.random() * (hi - lo + 1)) + lo;
}

export function getQuestionAndAnswers(questionIndex) {
  const q = vocabulary[questionIndex];
  const englishQuestion = q.english;

  let questionBlank = "(    ?    )";
  let japaneseAnswerString = `[${q.japanese}]`;
  let japaneseAnswerStringHiragana = `[${q.japaneseAllHiragana}]`;

  if (q.preJapaneseParticle) {
    questionBlank = `${q.preJapaneseParticle} ${questionBlank}`;
    japaneseAnswerString = `${q.preJapaneseParticle} ${japaneseAnswerString}`;
    japaneseAnswerStringHiragana = `${q.preJapaneseParticle} ${japaneseAnswerStringHiragana}`;
  }

  if (q.preJapanese) {
    questionBlank = `${q.preJapanese} ${questionBlank}`;
    japaneseAnswerString = `${q.preJapanese} ${japaneseAnswerString}`;
    japaneseAnswerStringHiragana = `${q.preJapanese} ${japaneseAnswerStringHiragana}`;
  }

  if (q.partOfSpeech?.includes("na-adj")) {
    questionBlank += "[な]";
    japaneseAnswerString += "[な]";
    japaneseAnswerStringHiragana += "[な]";
  }

  if (q.postJapanese) {
    questionBlank = `${questionBlank} ${q.postJapanese}`;
    japaneseAnswerString = `${japaneseAnswerString} ${q.postJapanese}`;
    japaneseAnswerStringHiragana = `${japaneseAnswerStringHiragana} ${q.postJapanese}`;
  }

  const correctJapaneseOption = `${q.japanese} [${q.japaneseAllHiragana}]`;
  const incorrectJapaneseOptions = getIncorrectOptions(
    q.partOfSpeech?.[0],
    questionIndex
  );

  return {
    englishQuestion,
    questionBlank,
    japaneseAnswerString,
    japaneseAnswerStringHiragana,
    correctJapaneseOption,
    incorrectJapaneseOptions,
    openEndedAnswer: q.japanese,
    openEndedAnswerHiragana: q.japaneseAllHiragana
  };
}

export function getIncorrectOptions(partOfSpeech, indexQuestionWord) {
  const pool = posList[partOfSpeech] || [];
  const idxInPool = pool.indexOf(indexQuestionWord);
  if (idxInPool < 0 || pool.length < 4) return [];

  const picked = new Set();
  let guard = 0;

  while (picked.size < 3 && guard++ < 10_000) {
    const r = getRandomInt(0, pool.length - 1);
    if (r === idxInPool || picked.has(r)) continue;

    const randomWord = vocabulary[pool[r]].japanese;
    const questionWord = vocabulary[pool[idxInPool]].japanese;
    if (randomWord === questionWord) continue;

    picked.add(r);
  }

  return [...picked].map(i => {
    const w = vocabulary[pool[i]];
    return `${w.japanese} [${w.japaneseAllHiragana}]`;
  });
}
