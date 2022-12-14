const scoreElement = document.getElementById('score');
const questionElement = document.getElementById('question');
const answerElement = document.getElementById('answer');
const formHero = document.getElementById('form-hero');
const remainingChancesElement = document.getElementById('remaining-chances');
const startGameElement = document.getElementById('start-game');
const answerSectionElement = document.getElementById('answer-section');
const questionSectionElement = document.getElementById('question-section');
const scoreSectionElement = document.getElementById('score-section');
const contentDiv = document.getElementById('content-div');
const themeElement = document.getElementById('toggle-theme');

let unusedQuestions = [];
let usedQuestions = [];
let score = 0;
let remainingChances = 3;
let currentQuestion;

const fetchQuestions = async () => {
  try {
    const response = await fetch('https://eok9ha49itquif.m.pipedream.net');
    const data = await response.json();

    cleanQuestions(data.questions);
    return { success: true };
  } catch (error) {
    console.log(error);
    questionElement.textContent = 'Oops! something went wrong ';
    return { success: false };
  }
};

const showQuestion = () => {
  answerElement.value = '';
  if (unusedQuestions.length == 1) {
    fetchQuestions();
  }

  const selectedQuestion = unusedQuestions.pop();
  usedQuestions.push(selectedQuestion);
  questionElement.textContent = selectedQuestion.question;
  currentQuestion = selectedQuestion;
};

const cleanQuestions = (questions) => {
  if (usedQuestions.length == 0) unusedQuestions = questions;
  else {
    questions = questions.filter((q) => {
      return !usedQuestions.find((e) => {
        return e.question == q.question;
      });
    });

    unusedQuestions = questions;
  }

  showQuestion();
};

const stringToHash = (value) => {
  const hash = CryptoJS.SHA1(value);
  return CryptoJS.enc.Hex.stringify(hash);
};

const checkAnswer = () => {
  const answer = answerElement.value.toLowerCase();

  if (stringToHash(answer) == currentQuestion.answerSha1) score += 1;
  else {
    remainingChances -= 1;
  }

  if (remainingChances == 0) showFinalScore();
  else {
    updateScoreAndChances();
    showQuestion();
  }
};

const updateScoreAndChances = () => {
  scoreElement.textContent = score;
  remainingChancesElement.textContent = remainingChances;
};

const showFinalScore = () => {
  confirm(`Game over! Your score is ${score}. Play again?`);
  location.reload();
};

startGameElement.onclick = async () => {
  const { success } = await fetchQuestions();

  if (success) {
    contentDiv.classList.remove('h-20');
    questionSectionElement.classList.remove('invisible');
    answerSectionElement.classList.remove('invisible');
    scoreSectionElement.classList.remove('invisible');
    startGameElement.classList.add('hidden');
  } else {
    contentDiv.classList.remove('h-20');
    questionSectionElement.classList.remove('invisible');
  }
};

formHero.onsubmit = (e) => {
  e.preventDefault();
  checkAnswer();
};

themeElement.onclick = () => {
  document.documentElement.classList.contains('dark')
    ? document.documentElement.classList.remove('dark')
    : document.documentElement.classList.add('dark');
};
