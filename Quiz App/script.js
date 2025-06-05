//DOM Elements
// Start Screen Elements
const startButton = document.querySelector(".start-btn"); // Start quiz button
const startScreen = document.querySelector(".start-screen"); // Start screen container

// Quiz Screen Elements
const quizScreen = document.querySelector(".quiz-screen"); // Quiz screen container
const questionText = document.querySelector(".question-text"); // Question text
const answersContainer = document.querySelector(".answers-container"); // Answers container
const currentQuestionSpan = document.querySelector(".current-question"); // Current question number
const totalQuestionsSpan = document.querySelector(".total-questions"); // Total questions
const scoreSpan = document.querySelector(".score"); // Current score
const scoreResult = document.querySelector(".score-result"); // Current score
const progressBar = document.querySelector(".progress"); // Progress bar

// Result Screen Elements
const resultScreen = document.querySelector(".result-screen"); // Result screen container
const finalScoreSpan = document.querySelector(".final-score"); // Final score
const maxScoreSpan = document.querySelector(".max-score"); // Maximum score
const resultMessage = document.querySelector(".result-message"); // Result message
const restartButton = document.querySelector(".restart-btn"); // Restart quiz button

const quizQuestions = [
  {
    question: "What does HTML stand for?",
    answers: [
      { text: "Hyperlinks and Text Markup Language", correct: false },
      { text: "Home Tool Markup Language", correct: false },
      { text: "Hyper Text Markup Language", correct: true },
      { text: "Hyper Tool Markup Language", correct: false },
    ],
  },
  {
    question: "Which HTML tag is used to link an external CSS file?",
    answers: [
      { text: "<link>", correct: true },
      { text: "<style>", correct: false },
      { text: "<css>", correct: false },
      { text: "<script>", correct: false },
    ],
  },
  {
    question: "Which property is used to change the text color in CSS?",
    answers: [
      { text: "font-color", correct: false },
      { text: "text-color", correct: false },
      { text: "color", correct: true },
      { text: "text-style", correct: false },
    ],
  },
  {
    question: "Which symbol is used for comments in JavaScript?",
    answers: [
      { text: "//", correct: true },
      { text: "/* */", correct: false },
      { text: "<!-- -->", correct: false },
      { text: "#", correct: false },
    ],
  },
  {
    question: "What will `typeof []` return in JavaScript?",
    answers: [
      { text: "'array'", correct: false },
      { text: "'object'", correct: true },
      { text: "'list'", correct: false },
      { text: "'undefined'", correct: false },
    ],
  },
];

let currentQuestionIndex = 0; // Current question index
let score = 0; // Current score
let answerDisabled = false; // Flag to disable answers

totalQuestionsSpan.textContent = quizQuestions.length; // Set total questions
maxScoreSpan.textContent = quizQuestions.length; // Set maximum score

function createQuestionElement() {
  let questionsArray = [];
  for (let i = 0; i < quizQuestions.length; i++) {
    questionsArray.push(
      `<button class="answer-btn" >${quizQuestions[i].question}</button>`
    );
  }
}
function showResult() {
  quizScreen.classList.remove("active"); // Hide quiz screen
  resultScreen.classList.add("active"); // Show result screen
  scoreResult.textContent = score; // Display final score
  resultMessage.textContent =
    score === quizQuestions.length
      ? "Perfect Score! Well done!"
      : score >= quizQuestions.length / 2
      ? "Good Job! You passed!"
      : "Better luck next time!";
}

function selectAnswer(event) {
  if (answerDisabled) return; // Prevent further selection if answers are disabled

  answerDisabled = true; // Disable further answer selection
  const isCorrect = event.target.dataset.correct === "true"; // Check if the answer is correct
  Array.from(answersContainer.children).forEach((button) => {
    button.disabled = true; // Disable all answer buttons
    if (button.dataset.correct === "true") {
      button.classList.add("correct"); // Add correct class to correct answer
    } else {
      button.classList.add("incorrect"); // Add incorrect class to wrong answers
    }
  });
  if (isCorrect) {
    score++; // Increment score for correct answer
    scoreSpan.textContent = score; // Update score display
  }
  setTimeout(() => {
    currentQuestionIndex++; // Move to the next question
    if (currentQuestionIndex < quizQuestions.length) {
      showQuestion(); // Show next question
    } else {
      showResult(); // Show result if all questions answered
    }
  }, 1000); // Wait before showing next question
}

function showQuestion() {
  answerDisabled = false; // Reset answer disabled flag
  const currentQuestion = quizQuestions[currentQuestionIndex];
  currentQuestionSpan.textContent = currentQuestionIndex + 1; // Update current question number
  const progressPercentage =
    ((currentQuestionIndex + 1) / quizQuestions.length) * 100;
  progressBar.style.width = `${progressPercentage}%`; // Update progress bar width
  questionText.textContent = currentQuestion.question; // Set question text
  answersContainer.innerHTML = ""; // Clear previous answers

  currentQuestion.answers.forEach((answer) => {
    const button = document.createElement("button");
    button.classList.add("answer-button");
    button.textContent = answer.text;
    button.dataset.correct = answer.correct; // Store correctness in data attribute
    button.addEventListener("click", selectAnswer);
    answersContainer.appendChild(button);
  });
}

function restartQuiz() {
  resultScreen.classList.remove("active"); // Hide result screen
  startScreen.classList.add("active"); // Show start screen
  score = 0; // Reset score
  scoreSpan.textContent = score; // Update score display
  currentQuestionIndex = 0; // Reset current question index
  progressBar.style.width = "0%"; // Reset progress bar
}

function startQuiz() {
  currentQuestionIndex = 0; // Reset current question index
  score = 0; // Reset score
  startScreen.classList.remove("active");
  quizScreen.classList.add("active");
  showQuestion(); // Show the first question
}
// Event Listeners

startButton.addEventListener("click", startQuiz); // Start quiz on button click
restartButton.addEventListener("click", restartQuiz); // Restart quiz on button click
