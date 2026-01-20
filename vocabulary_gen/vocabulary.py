import pandas as pd
from enum import Enum
from pykakasi import kakasi
import random
import json
import gspread
from oauth2client.service_account import ServiceAccountCredentials

class Vocabulary:
    def __init__(self):
        self.wordList = []
        self.partOfSpeechList = {}
        self.lessonList = {}

    def buildVocabulary(self):
        self.wordList, self.partOfSpeechList, self.lessonList = VocabularyBuilder(
        ).buildVocabulary('vocab.xlsx')

    def getVocabularySize(self):
        return len(self.wordList)

    def getWord(self, index):
        return self.wordList[index]

    def printWholeVocabulary(self):
        for word in self.wordList:
            print(word.__str__())
        input()

    def hasLesson(self, lessonNumber):
        return lessonNumber in self.lessonList


class Word:
    def __init__(self,  lesson, partOfSpeech, isTransitive,
                 preJapanese, preJapaneseParticle, japanese_all_hiragana, japanese, postJapanese,
                 preEnglish, english, postEnglish):
        self.lesson = lesson  # int
        self.partOfSpeech = partOfSpeech  # list of PartOfSpeech Enum
        self.isTransitive = isTransitive
        self.preJapanese = preJapanese
        self.preJapaneseParticle = preJapaneseParticle
        self.japanese = japanese
        self.japanese_all_hiragana = japanese_all_hiragana
        self.postJapanese = postJapanese
        self.preEnglish = preEnglish
        self.english = english
        self.postEnglish = postEnglish

        if self.isTransitive is not None and 'verb' not in self.partOfSpeech:
            raise Exception(self.japanese, self.partOfSpeech, self.isTransitive,
                            " is not a verb but is either transitive/intransitive.")

    def __str__(self):
        return (self.preJapanese + ' ' + self.preJapaneseParticle + ' ' + self.japanese + ' ' + self.postJapanese + ' ' +
                self.japanese_all_hiragana + ' ' +
                self.preEnglish + ' ' + self.english + ' ' + self.postEnglish + ' ' +
                str(self.lesson) + ' ' + ''.join(str(self.partOfSpeech)) + str(self.isTransitive))

# builds a vocabulary from a xlsx file
# ['lesson', 'pos', 'verbGroup', 'intransitive', 'hasKatakanaOrKanji', 'japanese', 'english', 'isSuruVerb', 'suruMeaning']


class VocabularyBuilder:
    # returns an array of Word objects and a part of speech list
    def buildVocabulary(self, filePath):
        # Initialize Google Sheets API credentials
        scope = ['https://spreadsheets.google.com/feeds', 'https://www.googleapis.com/auth/drive']
        credentials = ServiceAccountCredentials.from_json_keyfile_name('oboeru-410709-90e8c69eeb8a.json', scope)
        gc = gspread.authorize(credentials)
        # Open the worksheet
        # Replace 'YOUR_SPREADSHEET_KEY' with your actual Google Sheets document key
        spreadsheet_key = '1PAyIJA98h7Zgsj7Hpvhee5po4l8gZGjqNMiMRr27_nk'
        # Load Textbooks mapping
        textbooks_worksheet = gc.open_by_key(spreadsheet_key).worksheet("Textbooks")
        textbooks_df = pd.DataFrame(textbooks_worksheet.get_all_records())
        textbook_map = {}
        for index, row in textbooks_df.iterrows():
            textbook_map[row['id']] = row['name']

        # Get data as a Pandas DataFrame
        df = pd.DataFrame(worksheet.get_all_records())
        
        # ... (rest of loading) ...
        
        lessonMetadata = {}

        for index, row in df.iterrows():
            if self.checkValidData(row):
                # ... existing processing ...
                
                # Metadata aggregation
                textbook_id = row.get('textbookId')
                lesson_num = row['lesson']
                if textbook_id and textbook_id in textbook_map:
                    if textbook_id not in lessonMetadata:
                        lessonMetadata[textbook_id] = {
                            'title': textbook_map[textbook_id],
                            'ids': set()
                        }
                    lessonMetadata[textbook_id]['ids'].add(lesson_num)

                # ... rest of loop ...

        # Write metadata
        metadata_output = []
        for tid, meta in lessonMetadata.items():
            metadata_output.append({
                'title': meta['title'],
                'ids': sorted(list(meta['ids']))
            })
            
        with open('../src/lessonMetadata.json', 'w') as outfile:
             json.dump(metadata_output, outfile, indent=4)
        print('lessonMetadata made into json')

        with open('../src/lessonlist.json', 'w') as outfile:
            json.dump(lessonList, outfile, indent=4)

        quit()
        return wordList, partOfSpeechList, lessonList

    # in vocab.xlsx, an entry (row) must have the following columns
    def checkValidData(self, rowData):
        requiredColNames = ['lesson', 'japanese',
                            'japaneseAllHiragana', 'english']
        for colName in requiredColNames:
            if pd.isnull(rowData[colName]):
                return False
        return True

    def convertNanToEmptyString(self, input):
        if pd.isnull(input):
            return ''
        else:
            return input

    def parsePartOfSpeech(self, unparsedData):
        if pd.isnull(unparsedData):
            splitPOS = ['undefined']
        else:
            splitPOS = unparsedData.split(",")
        cleanSplit = []
        for posElem in splitPOS:
            posElem = posElem.strip()
            if posElem == 'n':
                convertedPosElem = 'noun'
            elif posElem == 'v':
                convertedPosElem = 'verb'
            elif posElem == 'adverb':
                convertedPosElem = 'adverb'
            elif posElem == 'な-adj':
                convertedPosElem = 'na-adj'
            elif posElem == 'い-adj':
                convertedPosElem = 'i-adj'
            elif posElem == 'exp':
                convertedPosElem = 'exp'
            elif posElem == 'counter':
                convertedPosElem = 'counter'
            elif posElem == 'undefined' or posElem == '':
                convertedPosElem = 'others'
            else:
                raise Exception('invalid part of speech', posElem)
            cleanSplit.append(convertedPosElem)
        return cleanSplit
