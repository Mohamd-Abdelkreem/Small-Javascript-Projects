const generateButton = document.querySelector(".generate-btn");
const paletteContainer = document.querySelector(".palette-container");
const copyButton = document.querySelector(".copy-btn");

function shiowCopyMessage(e) {
  let btn = e.target.closest(".color-box").querySelector(".copy-btn");
  btn.classList.remove("far", "fa-copy");
  btn.classList.add("fas", "fa-check");
  setTimeout(() => {
    btn.classList.remove("fas", "fa-check");
    btn.classList.add("far", "fa-copy");
  }, 1000);
}
function generateRandomColor() {
  const letters = "0123456789ABCDEF";
  let randomColor = "#";
  for (let i = 0; i < 6; i++) {
    randomColor += letters[Math.floor(Math.random() * 16)];
  }
  return randomColor;
}
function generateArrayOfRandomColors(numColors) {
  const randomColors = [];
  for (let i = 0; i < numColors; i++) {
    randomColors.push(generateRandomColor());
  }
  return randomColors;
}

function generatePalette() {
  const randomColors = generateArrayOfRandomColors(5);
  paletteContainer.innerHTML = ""; // Clear previous palette
  for (let i = 0; i < randomColors.length; i++) {
    const html = `        
    <div class="color-box">
          <div class="color" style="background-color:${randomColors[i]} ;"></div>
          <div class="color-info">
            <span class="color-code"> ${randomColors[i]} </span>
            <span>
              <i class="far fa-copy copy-btn" title="Copy to Clipboard"></i>
            </span>
          </div>
    </div>`;
    // console.log(html);
    paletteContainer.insertAdjacentHTML("beforeend", html);
  }
}
function copyColorToClipboard(e) {
  let hexCode = "";
  if (e.target.classList.contains("copy-btn")) {
    hexCode = e.target
      .closest(".color-info")
      .querySelector(".color-code").textContent;
    console.log(hexCode);
  } else if (e.target.classList.contains("color")) {
    hexCode = e.target
      .closest(".color-box")
      .querySelector(".color-code").textContent;
    console.log(hexCode);
  }
  if (hexCode) {
    navigator.clipboard
      .writeText(hexCode)
      .then(() => shiowCopyMessage(e))
      .catch((err) => {
        console.error("Failed to copy text: ", err);
      });
  }
}

generateButton.addEventListener("click", generatePalette);
paletteContainer.addEventListener("click", copyColorToClipboard);
generatePalette();
