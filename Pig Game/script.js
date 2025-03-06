'use strict';

// Selecting DOM elements...
const actualScoreOfPerson0 = document.querySelector('#score--0');
const actualScoreOfPerson1 = document.querySelector('#score--1');
const currentScoreOfPerson0 = document.querySelector('#current--0');
const currentScoreOfPerson1 = document.querySelector('#current--1');
const btnrollDice = document.querySelector('.btn--roll');
const btnhold = document.querySelector('.btn--hold');
const btnnewGame = document.querySelector('.btn--new');
let player0Active = document.querySelector('.player--0');
let player1Active = document.querySelector('.player--1');
let dice;
let isDiceRolled, currScoreOfPlayer, whichPlayer;

// Function for resetting the game to initial state ...
const resetTheGame = function () {
  actualScoreOfPerson0.textContent = Number(0);
  actualScoreOfPerson1.textContent = Number(0);
  dice = document.querySelector('.dice');
  dice.classList.add('hidden');
  isDiceRolled = 0;
  currScoreOfPlayer = 0;
  whichPlayer = 0;
  btnhold.disabled = false;
  btnrollDice.disabled = false;
  currentScoreOfPerson0.textContent = Number(0);
  currentScoreOfPerson1.textContent = Number(0);
  player0Active.classList.remove('player--winner');
  player1Active.classList.remove('player--winner');
  player0Active.classList.add('player--active');
  player1Active.classList.remove('player--active');
};

// Initial game state resetting...
resetTheGame();

// Function for switching players...
const SwitchPlayer = function () {
  document
    .querySelector(`.player--${whichPlayer}`)
    .classList.add('player--active');
  document
    .querySelector(`.player--${whichPlayer === 0 ? 1 : 0}`)
    .classList.remove('player--active');
};
// Event listener for rolling the dice...
btnrollDice.addEventListener('click', function () {
  //Mark that the dice has rolled
  isDiceRolled = 1;

  // Generating a random number between 1 and 6 for the dice...
  const randomNumberOfDice = Number(Math.trunc(Math.random() * 6) + 1);

  // Making the dice visible
  dice.classList.remove('hidden');

  // Changing the dice image based on the random number generated...
  dice.src = `img/dice-${randomNumberOfDice}.png`;

  // Updating the current score and switching players if the dice is not 1...
  if (randomNumberOfDice !== 1) {
    currScoreOfPlayer += randomNumberOfDice;
    console.log(currScoreOfPlayer);
    document.querySelector(`#current--${whichPlayer}`).textContent =
      currScoreOfPlayer;
  } else {
    // (1 means the player has to start a new round)...
    currScoreOfPlayer = 0;
    document.querySelector(`#current--${whichPlayer}`).textContent =
      currScoreOfPlayer;
    whichPlayer = whichPlayer === 0 ? 1 : 0;
    SwitchPlayer();
  }
});

// Event listener for holding the score...
btnhold.addEventListener('click', function () {
  // Make sure the dice is rolled before holding the score...
  if (isDiceRolled) {
    // Updating the actual score of the player...
    document.querySelector(`#score--${whichPlayer}`).textContent =
      Number(document.querySelector(`#score--${whichPlayer}`).textContent) +
      currScoreOfPlayer;
    // Checking if the player has won the game...
    if (document.querySelector(`#score--${whichPlayer}`).textContent >= 100) {
      dice.classList.add('hidden');
      btnhold.disabled = true;
      btnrollDice.disabled = true;
      document
        .querySelector(`.player--${whichPlayer}`)
        .classList.add('player--winner');
      document
        .querySelector(`.player--${whichPlayer}`)
        .classList.remove('player--active');

      setTimeout(function () {
        alert(`Player ${whichPlayer + 1} wins the game`);
      }, 300);
      return;
    }
    // Change the current Player after pressing hold ...
    whichPlayer = whichPlayer === 0 ? 1 : 0;
    SwitchPlayer();
    isDiceRolled = 0;
  } else {
    alert('Please roll the dice first');
  }
});

// Event listener for starting a new game...
btnnewGame.addEventListener('click', resetTheGame);
