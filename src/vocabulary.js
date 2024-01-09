const { GoogleSpreadsheet } = require("google-spreadsheet");
const { JWT } = require("google-auth-library");
const fs = require("fs");

require("dotenv").config();

class Word {
  constructor(
    index,
    lesson,
    partOfSpeech,
    isTransitive,
    preJapanese,
    preJapaneseParticle,
    japaneseAllHiragana,
    japanese,
    postJapanese,
    preEnglish,
    english,
    postEnglish
  ) {
    this.index = index;
    this.lesson = lesson;
    this.partOfSpeech = partOfSpeech;
    this.isTransitive = isTransitive;
    this.preJapanese = preJapanese;
    this.preJapaneseParticle = preJapaneseParticle;
    this.japaneseAllHiragana = japaneseAllHiragana;
    this.japanese = japanese;
    this.postJapanese = postJapanese;
    this.preEnglish = preEnglish;
    this.english = english;
    this.postEnglish = postEnglish;

    if (this.isTransitive !== null && !this.partOfSpeech.includes("verb")) {
      throw new Error(
        `${this.japanese} ${this.partOfSpeech} ${this.isTransitive} is not a verb but is either transitive/intransitive.`
      );
    }
  }

  toString() {
    return `${this.preJapanese} ${this.preJapaneseParticle} ${this.japanese} ${
      this.postJapanese
    } ${this.japaneseAllHiragana} ${this.preEnglish} ${this.english} ${
      this.postEnglish
    } ${this.lesson} ${this.partOfSpeech.join("")}${this.isTransitive}`;
  }
}

class VocabularyBuilder {
  async buildVocabulary(filePath) {
    console.log(process.env.GOOGLE_PRIVATE_KEY);
    const serviceAccountAuth = new JWT({
      email: process.env.GOOGLE_SERVICE_ACCOUNT_EMAIL, // Replace with your service account email
      key: process.env.GOOGLE_PRIVATE_KEY.split(String.raw`\n`).join("\n"), // Replace with your private key
      scopes: ["https://www.googleapis.com/auth/spreadsheets"]
    });

    const doc = new GoogleSpreadsheet(
      "1PAyIJA98h7Zgsj7Hpvhee5po4l8gZGjqNMiMRr27_nk",
      serviceAccountAuth
    );

    try {
      await doc.loadInfo();
      const sheet = doc.sheetsByTitle["Sheet1"]; // Change to your actual sheet name
      const rows = await sheet.getRows();

      const wordList = [];
      const partOfSpeechList = {};
      const lessonList = {};

      const columnMapping = {
        lesson: 0,
        pos: 1,
        verbGroup: 2,
        intransitive: 3,
        // hasKatakanaOrKanji: 4,
        preJapanese: 5,
        preJapaneseParticle: 6,
        japaneseAllHiragana: 7,
        japanese: 8,
        postJapaneseParticle: 9,
        preEnglish: 10,
        english: 11
      };

      var index = 0;
      for (const row of rows) {
        if (this.checkValidData(row._rawData)) {
          row.lesson = row._rawData[columnMapping.lesson];
          row.pos = row._rawData[columnMapping.pos];
          row.intransitive = row._rawData[columnMapping.intransitive];
          row.preJapanese = row._rawData[columnMapping.preJapanese];
          row.preJapaneseParticle =
            row._rawData[columnMapping.preJapaneseParticle];
          row.japaneseAllHiragana =
            row._rawData[columnMapping.japaneseAllHiragana];
          row.japanese = row._rawData[columnMapping.japanese];
          row.postJapaneseParticle =
            row._rawData[columnMapping.postJapaneseParticle];
          row.preEnglish = row._rawData[columnMapping.preEnglish];
          row.english = row._rawData[columnMapping.english];

          const lessonNum = Number(row.lesson);
          const posList = this.parsePartOfSpeech(row.pos);

          const isTransitive =
            row.intransitive === "t"
              ? true
              : row.intransitive === "i"
              ? false
              : null;

          const preJapanese = this.convertNanToEmptyString(row.preJapanese);
          const preJapaneseParticle = this.convertNanToEmptyString(
            row.preJapaneseParticle
          );
          const japaneseAllHiragana = row.japaneseAllHiragana;
          const japanese = row.japanese;
          const postJapanese = this.convertNanToEmptyString(row.postJapanese);
          const preEnglish = this.convertNanToEmptyString(row.preEnglish);
          const english = row.english;
          const postEnglish = this.convertNanToEmptyString(row.postEnglish);

          const word = new Word(
            index,
            lessonNum,
            posList,
            isTransitive,
            preJapanese,
            preJapaneseParticle,
            japaneseAllHiragana,
            japanese,
            postJapanese,
            preEnglish,
            english,
            postEnglish
          );

          index++;
          wordList.push(word);

          const indexOfAddedWord = wordList.length - 1;
          const indices = lessonList[lessonNum] || [];
          indices.push(indexOfAddedWord);
          lessonList[lessonNum] = indices;

          for (const pos of posList) {
            const indices = partOfSpeechList[pos] || [];
            indices.push(indexOfAddedWord);
            partOfSpeechList[pos] = indices;
          }
        } else {
          throw Error("something wrong with data");
        }
      }

      // Save wordList to a JSON file
      const wordListJson = JSON.stringify(wordList, null, 4);
      fs.writeFileSync("./src/vocabulary.json", wordListJson);
      console.log("wordList saved to JSON file");

      // Save partOfSpeechList to a JSON file
      const partOfSpeechListJson = JSON.stringify(partOfSpeechList, null, 4);
      fs.writeFileSync("./src/poslist.json", partOfSpeechListJson);
      console.log("partOfSpeechList saved to JSON file");

      // Save lessonList to a JSON file
      const lessonListJson = JSON.stringify(lessonList, null, 4);
      fs.writeFileSync("./src/lessonList.json", lessonListJson);
      console.log("lessonList saved to JSON file");

      return { wordList, partOfSpeechList, lessonList };
    } catch (error) {
      console.error(error);
    }
  }

  checkValidData(rowData) {
    const requiredColNames = [
      "lesson",
      "japanese",
      "japaneseAllHiragana",
      "english"
    ];
    const columnMapping = {
      lesson: 0,
      japanese: 8,
      japaneseAllHiragana: 7,
      english: 11
    };

    for (const colName of requiredColNames) {
      var index = columnMapping[colName];
      if (
        rowData[index] === null ||
        rowData[index] === undefined ||
        rowData[index] === ""
      ) {
        return false;
      }
    }
    return true;
  }

  convertNanToEmptyString(input) {
    return input !== null && input !== undefined ? input : "";
  }

  parsePartOfSpeech(unparsedData) {
    if (unparsedData === null || unparsedData === undefined) {
      return ["undefined"];
    }

    const splitPOS = unparsedData.split(",");
    const cleanSplit = splitPOS.map(posElem => {
      const trimmedElem = posElem.trim();
      switch (trimmedElem) {
        case "n":
          return "noun";
        case "v":
          return "verb";
        case "adverb":
          return "adverb";
        case "な-adj":
          return "na-adj";
        case "い-adj":
          return "i-adj";
        case "exp":
          return "exp";
        case "counter":
          return "counter";
        case "undefined":
        case "":
          return "others";
        default:
          throw new Error(`Invalid part of speech: ${trimmedElem}`);
      }
    });

    return cleanSplit;
  }
}

// Usage
const vocabularyBuilder = new VocabularyBuilder();
vocabularyBuilder.buildVocabulary();
