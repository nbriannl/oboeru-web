# Oboeru
*Japanese Language Vocabulary Quiz Application* 

Oboeru (The romanization of the Japanese 覚える, which means ‘to remember’) is an application to help Japanese language learning, particularly NUS Japanese Language students using the みんなの日本語 textbook, to practice their vocabulary, especially after a hiatus of language studies.

This project was initially started as a project in Python and later ported over as a React app. https://github.com/nbriannl/Oboeru

## Features

- Vocabulary according to みんなの日本語
  - Be quizzed on a specific lesson.
- Similar part of speech will be suggested as other options in MCQ.
- Vocabulary with clauses are handled, especially useful for open-ended quizes.

### Possible Future Features

- Open-ended quiz asking for different forms of words (eg: positive, negative, past, present, imperative, volitional)
- Testing particle usage of verbs.
- Choosing a range of lessons

Feel free to request a feature over at https://github.com/nbriannl/oboeru-web/issues

## Developers: How to setup

Fork and clone the repo and `npm install`

To preview the app `npm start`

Please install and set up `Prettier`.

### Vocabulary Generator

To update the vocabulary, update the Excel file in Google Sheets and run:

`npm run updatevocab`

This script (`src/vocabulary.js`) fetches the data and updates the JSON files used by the application.

## How to add Vocabulary
To update the vocabulary, simply edit [this excel file](https://docs.google.com/spreadsheets/d/1PAyIJA98h7Zgsj7Hpvhee5po4l8gZGjqNMiMRr27_nk/edit?usp=sharing).

### Fields
The excel file was originally made by me for Japanese 3 revision, hence not all fields are used in the current version of the application. It would be best however to fill up all fields when adding vocabulary as future functionality may use these.

⊛ indicates a required field for the current version of the program.

- ⊛ **lesson:** The corresponding lesson of the vocab as found in Minna no Nihongo. For the current version of the program, ensure that the lesson numbers are not discontinuous. (i.e. The current lesson numbers are from 1 to 31. Do not add a lesson number 50 or 43 etc.)

- ⊛ **pos:** The part of speech of the word. The current options are 'n', 'v', 'な-adj', 'い-adj', 'adverb', 'exp' (expression) and ' '. You can leave it blank, and it will be suggested as similar words to other words that have their part of speech undefined.

- **verbGroup:** The Verb group of the word. Use \*2 to indicate a special Group 2 verb. 

- **intransitive:** i for intransitive, t for transitive verbs

- **hasKatakanaOrKanji:** J if the **Japanese** field contains Kanji, K if it contains Katakana

- **preJapanese:** Any clause or symbol (eg: ～, ー) that appears before the Japanese word

- **preJapaneseParticle:** The particle of the clause that appears before the Japanese word

- ⊛ **japanese:** The Japanese word

- **postJapanese:** Any clause or symbol that appears after the Japanese word. Typically the '。' for expressions will be put here. 

- **preEnglish:** Any clause that appears before the English word

- ⊛ **english:** The English word

- **postEnglish:** Any clause that appears after the English word

- **isSuruVerb:** Fill with either [を]する or をする or none, depending on whether the word can be used with する and in what usage. Such words are likely nouns 

- **suruMeaning:** The meaning of the word when added with する 

**Examples for language related columns:**

| Original | preJapanese |preJapaneseParticle | Japanese | postJapanese | preEnglish | english | postEnglish |
| --------:|------------:| -----:|-----: |-----:|-----:|-----:|-----:|
| うれます　[パンが～]  [bread] sell, be sold | パン | が | うれます | | bread | sell, be sold | 
| かようます　[大学に] go to and from [university] | 大学　| に | かようます | | | go to and from | university |　 
| [ああ、]よかった。  [Oh,] that's great!| ああ、| | よかった  |。 | Oh, | that's great! | |　 

## How to Contribute
If you would like to work on this project. Do fork and PR any changes. It'll be amazing if you're a 日本語 学生 as well.

## FAQ

**Why not use Anki or [insert App name here]?**

_I get asked and probably will get asked this a lot._ 

- Oboeru fills up the other MCQ options with words of similar parts of speech. 
- Creating over 1800 Anki cards (or any quiz question on [_insert app name here_]) is tedious. 
- There is much more flexibility allowing more advanced quiz features to be potentially made.
- I decided to do this as a fun project before my last semester starts.

**Is this illegal? Using the vocabulary of みんなの日本語**

- Firstly, I don't intend to profit off this project.
- If you google ['minna no nihongo vocabulary list'](https://www.google.com/search?q=minna+no+nihongo+vocabulary+list) you would notice that the vocabulary list is also used in other memorisation or learning platforms.
- However, I'm open to going through any due process regarding the usage of 3A Network's vocabulary list.

# create-react-app related documentation 

This project was bootstrapped with [Create React App](https://github.com/facebook/create-react-app).

## Available Scripts

In the project directory, you can run:

### `npm start`

Runs the app in the development mode.<br />
Open [http://localhost:3000](http://localhost:3000) to view it in the browser.

The page will reload if you make edits.<br />
You will also see any lint errors in the console.

## `npm deploy`

Builds the application and publishes it to gh-pages on remote and deploys it to github pages.

### `npm test`

Launches the test runner in the interactive watch mode.<br />
See the section about [running tests](https://facebook.github.io/create-react-app/docs/running-tests) for more information.

### `npm run build`

Builds the app for production to the `build` folder.<br />
It correctly bundles React in production mode and optimizes the build for the best performance.

The build is minified and the filenames include the hashes.<br />
Your app is ready to be deployed!

See the section about [deployment](https://facebook.github.io/create-react-app/docs/deployment) for more information.

### `npm run eject`

**Note: this is a one-way operation. Once you `eject`, you can’t go back!**

If you aren’t satisfied with the build tool and configuration choices, you can `eject` at any time. This command will remove the single build dependency from your project.

Instead, it will copy all the configuration files and the transitive dependencies (webpack, Babel, ESLint, etc) right into your project so you have full control over them. All of the commands except `eject` will still work, but they will point to the copied scripts so you can tweak them. At this point you’re on your own.

You don’t have to ever use `eject`. The curated feature set is suitable for small and middle deployments, and you shouldn’t feel obligated to use this feature. However we understand that this tool wouldn’t be useful if you couldn’t customize it when you are ready for it.

## Learn More

You can learn more in the [Create React App documentation](https://facebook.github.io/create-react-app/docs/getting-started).

To learn React, check out the [React documentation](https://reactjs.org/).

### Code Splitting

This section has moved here: https://facebook.github.io/create-react-app/docs/code-splitting

### Analyzing the Bundle Size

This section has moved here: https://facebook.github.io/create-react-app/docs/analyzing-the-bundle-size

### Making a Progressive Web App

This section has moved here: https://facebook.github.io/create-react-app/docs/making-a-progressive-web-app

### Advanced Configuration

This section has moved here: https://facebook.github.io/create-react-app/docs/advanced-configuration

### Deployment

This section has moved here: https://facebook.github.io/create-react-app/docs/deployment

### `npm run build` fails to minify

This section has moved here: https://facebook.github.io/create-react-app/docs/troubleshooting#npm-run-build-fails-to-minify
