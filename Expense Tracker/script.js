const BalanceEle = document.querySelector(".balance");

const totalIncome = document.querySelector(".plus");
const totalExpense = document.querySelector(".minus");
const transactionList = document.querySelector(".transactions-list");
const descriptionInput = document.querySelector("#description");
const amountInput = document.querySelector("#amount");
const addTransactionBtn = document.querySelector(".btn");
const reverseIcon = document.querySelector(".reverse-icon");
const sortIcon = document.querySelector(".sort-icon");
const clearAllBtn = document.querySelector(".clear-all-btn");
let transactions = JSON.parse(localStorage.getItem("transactions")) || [];
let typeOfSort = "descending";
let yourBalanceValue = parseFloat(
  document.querySelector(".balance").textContent.replace("$", "")
);
function checkForTransaction(ammount, description) {
  console.log(yourBalanceValue);
  if (description === "" || isNaN(ammount) || ammount === 0) {
    alert("Please enter a valid description and amount.");
    return false;
  }
  console.log(yourBalanceValue + ammount >= 0);
  if (!(yourBalanceValue + ammount >= 0)) {
    alert("Insufficient balance for this transaction.");
    return false;
  }
  return true;
}

function generateTransactionHTML(amount, description, transactionId) {
  const transaction = `
                 <li class="transaction ${amount > 0 ? "income" : "expense"}">
    <span class="description">${description}</span>
    <div class="transaction-right">
      <span class="amount">${amount > 0 ? "+" : ""}${amount.toFixed(2)}</span>
      <i class="fa-solid fa-trash delete-btn" onclick="DeleteTransaction(${transactionId})" title="Delete Transaction"></i>
    </div>
    </li>
    `;
  return transaction;
}
function updateLocalStorageAndTransactionsArray(
  amount,
  description,
  transactionId
) {
  transactions.push({
    id: transactionId,
    description,
    amount,
    typeOfTransaction: amount > 0 ? "income" : "expense",
  });

  localStorage.setItem("transactions", JSON.stringify(transactions));
}

function insertAdjacentHTMLComponent(transactionHTML) {
  const liElement = document.createElement("li");
  liElement.innerHTML = transactionHTML; // Set the HTML content of the <li>
  transactionList.prepend(liElement); // Append the <li> to the <ul>
}
function resetForm() {
  descriptionInput.value = "";
  amountInput.value = "";
}
function formatCurrency(amount) {
  const formatter = new Intl.NumberFormat("en-US", {
    style: "currency",
    currency: "USD",
  });
  return formatter.format(amount); // Format the amount using Intl.NumberFormat
}
function updateSummary(ammount) {
  if (ammount > 0) {
    totalIncome.textContent = formatCurrency(
      parseFloat(totalIncome.textContent.replace("$", "")) + ammount
    );
  } else {
    totalExpense.textContent = formatCurrency(
      parseFloat(totalExpense.textContent.replace("$", "")) - ammount
    );
  }
  console.log(yourBalanceValue);
  console.log(totalIncome);
  console.log(totalExpense);
}
function updateBalance(ammount) {
  yourBalanceValue += ammount;
  document.querySelector(".balance").textContent =
    formatCurrency(yourBalanceValue);
}
function updateTransactionsListBySorting() {
  transactionList.innerHTML = ""; // Clear the list before re-adding
  // const sortedTransactions = transactions.sort((a, b) => b.id - a.id);

  if (typeOfSort === "descending") {
    typeOfSort = "ascending";
    transactions = transactions.sort((a, b) => b.amount - a.amount);
  } else {
    typeOfSort = "descending";
    transactions = transactions.sort((a, b) => a.amount - b.amount);
  }
  transactions.forEach((transaction) => {
    const transactionHTML = generateTransactionHTML(
      transaction.amount,
      transaction.description,
      transaction.id
    );
    insertAdjacentHTMLComponent(transactionHTML);
  });
}
function updateTransactionsListByReverse() {
  transactionList.innerHTML = ""; // Clear the list before re-adding
  transactions.reverse();
  transactions.forEach((transaction) => {
    const transactionHTML = generateTransactionHTML(
      transaction.amount,
      transaction.description,
      transaction.id
    );
    insertAdjacentHTMLComponent(transactionHTML);
  });
}

function addTransaction(e) {
  e.preventDefault();
  const description = descriptionInput.value.trim();
  const amount = parseFloat(amountInput.value.replace("$", ""));

  console.log(amount, description);

  if (!checkForTransaction(amount, description)) {
    return;
  }
  const transactionId = Date.now(); // Generate a unique ID for the transaction

  const transaction = generateTransactionHTML(
    amount,
    description,
    transactionId
  );

  updateLocalStorageAndTransactionsArray(amount, description, transactionId);

  updateBalance(amount);

  updateSummary(amount);

  insertAdjacentHTMLComponent(transaction);

  console.log(transactions);
  resetForm();
}

function loadTransactionsOfLocalStorage() {
  transactionList.innerHTML = ""; // Clear the list before re-adding
  let income = 0;
  let expense = 0;
  let total = 0;
  transactions.forEach((transaction) => {
    const transactionHTML = generateTransactionHTML(
      transaction.amount,
      transaction.description,
      transaction.id
    );
    if (transaction.amount > 0) {
      income += transaction.amount;
    } else {
      expense += transaction.amount;
    }
    total += transaction.amount;
    insertAdjacentHTMLComponent(transactionHTML);
  });
  totalIncome.textContent = formatCurrency(income);
  totalExpense.textContent = formatCurrency(Math.abs(expense));
  yourBalanceValue = total;
  BalanceEle.textContent = formatCurrency(yourBalanceValue);
}
function DeleteTransaction(transactionId) {
  transactions = transactions.filter(
    (transaction) => transaction.id !== transactionId
  );
  localStorage.setItem("transactions", JSON.stringify(transactions));
  loadTransactionsOfLocalStorage();
}

loadTransactionsOfLocalStorage();

addTransactionBtn.addEventListener("click", addTransaction);

// Add event listeners for transaction controls

// Reverse order functionality
reverseIcon.addEventListener("click", () => {
  updateTransactionsListByReverse();
});

// Sort functionality (by amount)
sortIcon.addEventListener("click", updateTransactionsListBySorting);

// Clear all functionality
clearAllBtn.addEventListener("click", () => {
  if (
    confirm(
      "Are you sure you want to clear all transactions? This action cannot be undone."
    )
  ) {
    transactions = [];
    localStorage.removeItem("transactions");
    transactionList.innerHTML = "";

    // Reset balance and summary
    yourBalanceValue = 0;
    BalanceEle.textContent = formatCurrency(0);
    totalIncome.textContent = formatCurrency(0);
    totalExpense.textContent = formatCurrency(0);
  }
});
