"use strict";
let secretNumber = Math.trunc(Math.random() * 20 + 1);
let currentSocare = Number(document.querySelector(".score").textContent);
// document.querySelector(".number").textContent = secretNumber;
const editText = function (message) {
  document.querySelector(".message").textContent = message;
};
function playGame() {
  const guessNumber = Number(document.querySelector(".guess").value);
  if (!guessNumber) editText("⚠️ No Number !!");
  else if (guessNumber === secretNumber && currentSocare >= 1) {
    document.querySelector(".highscore").textContent = Math.max(
      currentSocare,
      Number(document.querySelector(".highscore").textContent)
    );
    editText("💯 Correct Answer !");
    document.querySelector("body").style.backgroundColor = "#60b347";
    document.querySelector(".number").style.width = "30rem";
    document.querySelector(".number").textContent = secretNumber;
  } else if (guessNumber != secretNumber && currentSocare >= 1) {
    editText(guessNumber > secretNumber ? "↗️ too high" : "↘️ too low");
    currentSocare--;
    document.querySelector(".score").textContent = currentSocare;
  }
  if (currentSocare == 0) {
    editText("😢 Game Over try Again");
    document.querySelector(".score").textContent = 0;
  }
}

function resetGame() {
  secretNumber = Math.trunc(Math.random() * 20 + 1);
  currentSocare = 20;
  editText("Start guessing...");
  document.querySelector(".score").textContent = 20;
  document.querySelector("body").style.backgroundColor = "#212121";
  document.querySelector(".number").style.width = "15rem";
  document.querySelector(".number").textContent = "?";
  document.querySelector(".guess").value = "";
}

document.querySelector(".check").addEventListener("click", playGame);

document.querySelector(".again").addEventListener("click", resetGame);
