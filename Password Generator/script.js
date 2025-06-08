const passwordInput = document.querySelector(".password");
const lengthSlider = document.querySelector(".length");
const lengthDisplay = document.querySelector(".length-value");
const uppercaseCheckbox = document.querySelector(".uppercase");
const lowercaseCheckbox = document.querySelector(".lowercase");
const numbersCheckbox = document.querySelector(".numbers");
const symbolsCheckbox = document.querySelector(".symbols");
const generateButton = document.querySelector(".generate-btn");
const copyButton = document.querySelector(".copy-icon");
const strengthBar = document.querySelector(".strength-bar");
const strengthText = document.querySelector(".strength-container p");
const strengthLabel = document.querySelector(".strength-value");

const upperCase = "ABCDEFGHIJKLMNOPQRSTUVWXYZ";
const lowerCase = "abcdefghijklmnopqrstuvwxyz";
const numbers = "0123456789";
const specialChars = "!@#$%^&*()_+[]{}|;:,.<>?";
const passwordLength = 12;

function lengthOfPassword() {
  return parseInt(lengthSlider.value);
}
function checkUpperCase() {
  return uppercaseCheckbox.checked;
}
function checkLowerCase() {
  return lowercaseCheckbox.checked;
}
function checkNumbers() {
  return numbersCheckbox.checked;
}
function checkSymbols() {
  return symbolsCheckbox.checked;
}
function generateRandomPassword(n, type) {
  let password = "";
  for (let i = 0; i < n; i++) {
    password += type[Math.floor(Math.random() * type.length)];
  }
  return password;
}
function checkedTypes() {
  let types = [];
  if (checkUpperCase()) types.push(upperCase);
  if (checkLowerCase()) types.push(lowerCase);
  if (checkNumbers()) types.push(numbers);
  if (checkSymbols()) types.push(specialChars);
  return types;
}

function updateStrengthBar() {
  const length = lengthOfPassword();
  const types = checkedTypes();
  let strength = 0;

  if (length >= 8) strength += 1;

  if (types.length > 0) {
    strength += types.length; // Add points for each selected type
  }

  // Update the strength bar and text
  strengthBar.value = strength;

  switch (strength) {
    case 0:
      strengthText.textContent = "Very Weak";
      strengthLabel.textContent = "0";
      break;
    case 1:
      strengthText.textContent = "Weak";
      strengthLabel.textContent = "1";
      break;
    case 2:
      strengthText.textContent = "Moderate";
      strengthLabel.textContent = "2";
      break;
    case 3:
      strengthText.textContent = "Strong";
      strengthLabel.textContent = "3";
      break;
    default:
      strengthText.textContent = "Very Strong";
      strengthLabel.textContent = "4";
      break;
  }
  strengthBar.style.width = `${(strength / 5) * 100}%`; // Adjust width based on strength
}

function createPassword() {
  const length = lengthOfPassword();
  let types = checkedTypes();
  let password = "";
  if (types.length === 0) {
    passwordInput.value = "Please select at least one character type.";
    return;
  }
  const numberOfEachChar = Math.floor(length / types.length);
  let remainingChars = length % types.length;
  types.forEach((type) => {
    password += generateRandomPassword(numberOfEachChar, type);
  });
  while (remainingChars--) {
    let randomType = types[Math.floor(Math.random() * types.length)];
    password += generateRandomPassword(1, randomType);
  }
  // Shuffle the password to ensure randomness
  password = password
    .split("")
    .sort(() => Math.random() - 0.5)
    .join("");
  passwordInput.value = password;
  updateStrengthBar();
}
function copyToClipboard() {
  navigator.clipboard
    .writeText(passwordInput.value)
    .then(() => {
      // Change icon to checkmark
      copyButton.className = "fas fa-check copy-icon";
      copyButton.style.color = "#68d391"; // Green color for success
      
      // Revert back to copy icon after 1 second
      setTimeout(() => {
        copyButton.className = "far fa-copy copy-icon";
        copyButton.style.color = ""; // Reset to original color
      }, 1000);
    })
    .catch((err) => {
      console.error("Failed to copy: ", err);
      // Show error icon briefly
      copyButton.className = "fas fa-times copy-icon";
      copyButton.style.color = "#fc8181"; // Red color for error
      
      setTimeout(() => {
        copyButton.className = "far fa-copy copy-icon";
        copyButton.style.color = ""; // Reset to original color
      }, 1000);
    });
}

lengthSlider.addEventListener("input", () => {
  lengthDisplay.textContent = lengthSlider.value;
  updateStrengthBar(); // Add this line
});

generateButton.addEventListener("click", createPassword);
copyButton.addEventListener("click", copyToClipboard);
// strengthBar.addEventListener("input", updateStrengthBar);
// lengthSlider.addEventListener("input", updateStrengthBar); // Add this line
uppercaseCheckbox.addEventListener("change", updateStrengthBar);
lowercaseCheckbox.addEventListener("change", updateStrengthBar);
numbersCheckbox.addEventListener("change", updateStrengthBar);
symbolsCheckbox.addEventListener("change", updateStrengthBar);
updateStrengthBar(); // Initial strength bar update
