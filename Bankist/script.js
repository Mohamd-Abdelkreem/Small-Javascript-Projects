"use strict";

// BANKIST APP

// Data
const account1 = {
  owner: "Mohamed Abdel Kareem",
  movements: [200, 455.23, -306.5, 25000, -642.21, -133.9, 79.97, 1300],
  interestRate: 1.2, // %
  pin: 1111,

  movementsDates: [
    "2019-11-18T21:31:17.178Z",
    "2019-12-23T07:42:02.383Z",
    "2020-01-28T09:15:04.904Z",
    "2020-04-01T10:17:24.185Z",
    "2020-05-08T14:11:59.604Z",
    "2020-05-27T17:01:17.194Z",
    "2020-07-11T23:36:17.929Z",
    "2025-03-13T10:51:36.790Z",
  ],
  currency: "EUR",
  locale: "pt-PT", // de-DE
};

const account2 = {
  owner: "Ahmed Abdel Kareem",
  movements: [5000, 3400, -150, -790, -3210, -1000, 8500, -30],
  interestRate: 1.5,
  pin: 2222,

  movementsDates: [
    "2019-11-01T13:15:33.035Z",
    "2019-11-30T09:48:16.867Z",
    "2019-12-25T06:04:23.907Z",
    "2020-01-25T14:18:46.235Z",
    "2020-02-05T16:33:06.386Z",
    "2020-04-10T14:43:26.374Z",
    "2020-06-25T18:49:59.371Z",
    "2020-07-26T12:01:20.894Z",
  ],
  currency: "USD",
  locale: "en-US",
};

const accounts = [account1, account2];
// Elements
const labelWelcome = document.querySelector(".welcome");
const labelDate = document.querySelector(".date");
const labelBalance = document.querySelector(".balance__value");
const labelSumIn = document.querySelector(".summary__value--in");
const labelSumOut = document.querySelector(".summary__value--out");
const labelSumInterest = document.querySelector(".summary__value--interest");
const labelTimer = document.querySelector(".timer");

const containerApp = document.querySelector(".app");
const containerMovements = document.querySelector(".movements");

const btnLogin = document.querySelector(".login__btn");
const btnTransfer = document.querySelector(".form__btn--transfer");
const btnLoan = document.querySelector(".form__btn--loan");
const btnClose = document.querySelector(".form__btn--close");
const btnSort = document.querySelector(".btn--sort");

const inputLoginUsername = document.querySelector(".login__input--user");
const inputLoginPin = document.querySelector(".login__input--pin");
const inputTransferTo = document.querySelector(".form__input--to");
const inputTransferAmount = document.querySelector(".form__input--amount");
const inputLoanAmount = document.querySelector(".form__input--loan-amount");
const inputCloseUsername = document.querySelector(".form__input--user");
const inputClosePin = document.querySelector(".form__input--pin");

// Global variables
let currentAccount, timer;

// Create a function to format the date
const formatMovementDate = function (date) {
  const calcDaysPassed = (date1, date2) =>
    Math.round(Math.abs(date2 - date1) / (1000 * 60 * 60 * 24));
  const daysPassed = calcDaysPassed(new Date(), date);
  if (daysPassed === 0) return "Today";
  if (daysPassed === 1) return "Yesterday";
  if (daysPassed <= 7) return `${daysPassed} days ago`;
  return new Intl.DateTimeFormat(currentAccount.locale).format(date);
};

// calculate total balance for each account
const calcTotalBalanceForEachAccount = function (acc) {
  acc.totalBalance = acc.movements.reduce((acc, mov) => acc + mov, 0);
};
accounts.forEach(calcTotalBalanceForEachAccount);

const formatCur = function (value, locale, currency) {
  return new Intl.NumberFormat(locale, {
    style: "currency",
    currency: currency,
  }).format(value);
};

//Display the movements of each account
const displayMovements = function (acc, sort) {
  containerMovements.innerHTML = "";
  const movs = sort
    ? acc.movements.slice().sort((a, b) => a - b)
    : acc.movements;
  movs.forEach(function (mov, ind) {
    const currDate = new Date(acc.movementsDates[ind]);

    const formattedMovement = formatCur(mov, acc.locale, acc.currency);

    const type = mov > 0 ? "deposit" : "withdrawal";
    const htmlRaw = `
        <div class="movements__row">
          <div class="movements__type movements__type--${type}">${
      ind + 1
    } ${type}</div>
          <div class="movements__date">${formatMovementDate(currDate)}</div>
          <div class="movements__value">${formattedMovement}</div>
        </div>
        `;
    containerMovements.insertAdjacentHTML("afterbegin", htmlRaw);
  });
};

//Create a function to start the logout timer

//Create Username for each account
const createUserName = function (accounts) {
  accounts.forEach(function (acc) {
    acc.userName = acc.owner
      .toLowerCase()
      .split(" ")
      .map((name) => name[0])
      .join("");
  });
};
createUserName(accounts);
// console.log(accounts);

//Calculate the total Balance
const calcDisplayTotalBalance = function (Account) {
  Account.totalBalance = Account.movements.reduce(function (acc, mov) {
    return acc + mov;
  }, 0);
  console.log(Account.totalBalance);
  // labelBalance.textContent = `${Account.totalBalance.toFixed(2)}€`;
  const formattedBalance = formatCur(
    Account.totalBalance,
    Account.locale,
    Account.currency
  );
  labelBalance.textContent = formattedBalance;
};

//Calculate the Summary Balance
const calcSummaryBalance = function (account) {
  const totalInBalance = account.movements
    .filter((mov) => mov > 0)
    .reduce((acc, mov) => acc + mov);
  console.log(totalInBalance);
  const formattedTotalInBalance = formatCur(
    totalInBalance,
    account.locale,
    account.currency
  );

  labelSumIn.textContent = `${formattedTotalInBalance}`;

  const totalOutBalance = account.movements
    .filter((mov) => mov < 0)
    .reduce((acc, mov) => acc + mov);
  console.log(totalOutBalance);
  const formattedTotalOutBalance = formatCur(
    totalOutBalance,
    account.locale,
    account.currency
  );

  labelSumOut.textContent = `${formattedTotalOutBalance}`;

  const totalInterstBalance = account.movements
    .filter((mov) => mov > 0)
    .map((mov) => Math.trunc((mov * account.interestRate) / 100))
    .filter((mov) => mov >= 1)
    .reduce((acc, mov) => acc + mov);
  const formattedTotalInterstBalance = formatCur(
    Math.abs(totalInterstBalance),
    account.locale,
    account.currency
  );
  console.log(totalInterstBalance);
  labelSumInterest.textContent = `${formattedTotalInterstBalance}`;
};

// Update UI
const updateUI = function (account) {
  displayMovements(account);
  calcDisplayTotalBalance(account);
  calcSummaryBalance(account);
};

// Create a function to start the logout timer
const startLogOutTimer = function () {
  const tick = function () {
    const min = String(Math.trunc(time / 60)).padStart(2, 0);
    const sec = String(time % 60).padStart(2, 0);
    labelTimer.textContent = `${min}:${sec}`;
    if (time === 0) {
      clearInterval(timer);
      labelWelcome.textContent = "Log in to get started";
      containerApp.style.display = "none";
    }
    time--;
  };
  let time = 300;
  tick();
  const timer = setInterval(tick, 1000);
  return timer;
};

// add Event handlers to the login button
btnLogin.addEventListener("click", function (e) {
  e.preventDefault();
  const enteredUsername = inputLoginUsername.value;
  currentAccount = accounts.find((curr) => curr.userName == enteredUsername);
  const enteredPass = inputLoginPin.value;
  console.log(currentAccount);
  if (currentAccount === undefined || enteredPass != currentAccount.pin) {
    alert("No account found with this username or Passowrd! ");
    return;
  } else {
    inputLoginUsername.value = inputLoginPin.value = "";
    inputLoginPin.blur();

    const currDate = new Date();
    const options = {
      hour: "numeric",
      minute: "numeric",
      day: "numeric",
      month: "numeric",
      year: "numeric",
    };

    if (timer) clearInterval(timer);
    timer = startLogOutTimer();
    labelDate.textContent = new Intl.DateTimeFormat(
      currentAccount.locale,
      options
    ).format(currDate);
    labelWelcome.textContent = `Welcome, ${currentAccount.owner}!`;

    updateUI(currentAccount);
    containerApp.style.display = "grid";
  }
});
// add Event handlers to the transfer button
btnTransfer.addEventListener("click", function (e) {
  e.preventDefault();
  const enterdAccount = inputTransferTo.value;
  const enterdAmount = Number(inputTransferAmount.value);
  const isAccountExist = accounts.find(
    (account) => account.userName === enterdAccount
  );
  if (
    isAccountExist &&
    currentAccount.totalBalance >= enterdAmount &&
    enterdAmount > 0 &&
    currentAccount.userName !== enterdAccount
  ) {
    // console.log("Here");
    const currDate = new Date().toISOString();
    currentAccount.movementsDates.push(currDate);
    currentAccount.movements.push(-enterdAmount);
    isAccountExist.movements.push(enterdAmount);
    clearInterval(timer);
    timer = startLogOutTimer();
    updateUI(currentAccount);
    console.log(currentAccount.movements);
  } else {
    alert("Insufficient balance or Account not found!");
  }
  inputTransferTo.value = inputTransferAmount.value = "";
  inputTransferAmount.blur();
});


// add Event handlers to the close button
btnClose.addEventListener("click", function (e) {
  e.preventDefault();
  const enteredUsername = inputCloseUsername.value;
  const enteredPass = Number(inputClosePin.value);
  const isAccountExist = accounts.findIndex(
    (account) => account.userName === enteredUsername
  );
  if (isAccountExist !== -1 && currentAccount.pin === enteredPass) {
    // console.log("Here");
    accounts.splice(isAccountExist, 1);
    containerApp.style.display = "none";
    labelWelcome.textContent = "Log in to access your account";
    inputLoginUsername.value = inputLoginPin.value = "";
    inputLoginPin.blur();
  }
});

// add Event handlers to the loan button
btnLoan.addEventListener("click", function (e) {
  e.preventDefault();
  const amount = Number(inputLoanAmount.value);
  if (amount > 0 && currentAccount.totalBalance >= amount) {
    clearInterval(timer);
    timer = startLogOutTimer();
    setTimeout(function () {
      const currDate = new Date().toISOString();
      currentAccount.movementsDates.push(currDate);
      currentAccount.movements.push(Math.floor(amount));
      updateUI(currentAccount);
    }, 3000);
  } else if (amount <= 0) {
    alert("Insufficient Amount is not positive!");
  } else {
    alert("Insufficient balance!");
  }
  inputLoanAmount.value = "";
  inputLoanAmount.blur();
});

// Make Sort Button
let sorted = false;
btnSort.addEventListener("click", function (e) {
  e.preventDefault();
  displayMovements(currentAccount, !sorted);
  sorted = !sorted;
});
