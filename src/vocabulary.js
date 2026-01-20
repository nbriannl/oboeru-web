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
  normalizeText(input) {
    if (input === null || input === undefined) return "";
    return String(input)
      .replace(/\u3000/g, " ") // full-width space -> normal space
      .replace(/[ \t]+/g, " ") // collapse multiple spaces/tabs (optional)
      .trim(); // optional (remove if you need leading/trailing spaces)
  }

  async buildVocabulary(filePath) {
    function loadServiceAccountCreds() {
      if (process.env.GOOGLE_SERVICE_ACCOUNT_JSON) {
        return JSON.parse(process.env.GOOGLE_SERVICE_ACCOUNT_JSON.trim());
      }

      if (process.env.GOOGLE_SERVICE_ACCOUNT_JSON_PATH) {
        const raw = fs.readFileSync(
          process.env.GOOGLE_SERVICE_ACCOUNT_JSON_PATH,
          "utf8"
        );
        return JSON.parse(raw);
      }

      return null;
    }

    const creds = loadServiceAccountCreds();

    const serviceAccountAuth = creds
      ? new JWT({
          email: creds.client_email,
          key: creds.private_key,
          scopes: ["https://www.googleapis.com/auth/spreadsheets"]
        })
      : new JWT({
          email: process.env.GOOGLE_SERVICE_ACCOUNT_EMAIL,
          key: process.env.GOOGLE_PRIVATE_KEY.split(String.raw`\n`).join("\n"),
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

      const textbookSheet = doc.sheetsByTitle["Textbooks"];
      const textbookRows = await textbookSheet.getRows();
      const textbookMap = {};
      
      // Build Textbook ID -> Name map
      for (const row of textbookRows) {
        if (row._rawData[0] && row._rawData[1]) {
           textbookMap[row._rawData[0]] = row._rawData[1];
        }
      }

      const wordList = [];
      const partOfSpeechList = {};
      const lessonList = {};
      const lessonMetadata = {}; // textbookId -> { title, ids: Set() }

      const columnMapping = {
        lesson: 0,
        textbookId: 1,
        pos: 2,
        verbGroup: 3,
        intransitive: 4,
        // hasKatakanaOrKanji: 5,
        preJapanese: 6,
        preJapaneseParticle: 7,
        japaneseAllHiragana: 8,
        japanese: 9,
        postJapaneseParticle: 10,
        preEnglish: 11,
        english: 12
      };

      var index = 0;
      for (const row of rows) {
        if (this.checkValidData(row._rawData)) {
          // ... existing mappings ...
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
          // New: Textbook ID
          const textbookId = row._rawData[columnMapping.textbookId];

          const lessonNum = Number(row.lesson);
          
      // Aggregate Metadata
          const uniqueLessonId = `${textbookId || 'default'}-${lessonNum}`;

          if (textbookId && textbookMap[textbookId]) {
              if (!lessonMetadata[textbookId]) {
                  lessonMetadata[textbookId] = {
                      title: textbookMap[textbookId],
                      ids: new Set()
                  };
              }
              lessonMetadata[textbookId].ids.add(uniqueLessonId);
          }

          // ... rest of processing ...
          const posList = this.parsePartOfSpeech(row.pos);

          const isTransitive =
            row.intransitive === "t"
              ? true
              : row.intransitive === "i"
              ? false
              : null;

          const preJapanese = this.normalizeText(row.preJapanese);
          const preJapaneseParticle = this.normalizeText(
            row.preJapaneseParticle
          );
          const japaneseAllHiragana = this.normalizeText(
            row.japaneseAllHiragana
          );
          const japanese = this.normalizeText(row.japanese);
          const postJapanese = this.normalizeText(row.postJapanese);
          const preEnglish = this.normalizeText(row.preEnglish);
          const english = this.normalizeText(row.english);
          const postEnglish = this.normalizeText(row.postEnglish);
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
          const indices = lessonList[uniqueLessonId] || [];
          indices.push(indexOfAddedWord);
          lessonList[uniqueLessonId] = indices;

          for (const pos of posList) {
            const indices = partOfSpeechList[pos] || [];
            indices.push(indexOfAddedWord);
            partOfSpeechList[pos] = indices;
          }
        } else {
          // throw Error("something wrong with data");
          // Proceeding instead of crashing on empty row
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
      fs.writeFileSync("./src/lessonlist.json", lessonListJson);
      console.log("lessonList saved to JSON file");

      // Save lessonMetadata to JSON
      const metadataOutput = Object.values(lessonMetadata).map(meta => ({
          title: meta.title,
          ids: Array.from(meta.ids).sort((a, b) => {
              const numA = parseInt(a.split('-').pop(), 10);
              const numB = parseInt(b.split('-').pop(), 10);
              return numA - numB;
          })
      }));
      fs.writeFileSync("./src/lessonMetadata.json", JSON.stringify(metadataOutput, null, 4));
      console.log("lessonMetadata saved to JSON file");

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
      japanese: 9,
      japaneseAllHiragana: 8,
      english: 12
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
