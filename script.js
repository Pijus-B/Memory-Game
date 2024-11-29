const gridContainer = document.querySelector(".grid-container");
let cards = [];
let firstCard, secondCard;
let lockBoard = false;
let score = 0;
let playerName = "";
let bestScore = sessionStorage.getItem("bestScore") || null;

document.querySelector(".score").textContent = score;
document.querySelector(".best-score").textContent = bestScore ? bestScore : "-";

// Show overlay to input player name
const overlay = document.getElementById("overlay");
const startGameBtn = document.getElementById("start-game-btn");
const playerNameInput = document.getElementById("player-name");
const playerNameDisplay = document.querySelector(".player-name");

startGameBtn.addEventListener("click", () => {
  playerName = playerNameInput.value.trim();
  if (playerName === "") {
    alert("Įveskite savo vardą!");
  } else {
    playerNameDisplay.textContent = playerName;
    overlay.style.display = "none";
    startGame();
  }
});

function startGame() {
  // Initialize cards and start the game
  cards = [...cardData, ...cardData]; // Duplicate the array to create pairs
  shuffleCards();
  generateCards();
}

const cardData = [
  { image: "images/chili.png", name: "chili" },
  { image: "images/grapes.png", name: "grapes" },
  { image: "images/lemon.png", name: "lemon" },
  { image: "images/orange.png", name: "orange" },
  { image: "images/pineapple.png", name: "pineapple" },
  { image: "images/strawberry.png", name: "strawberry" }
];

function shuffleCards() {
  let currentIndex = cards.length,
    randomIndex;

  while (currentIndex !== 0) {
    randomIndex = Math.floor(Math.random() * currentIndex);
    currentIndex--;

    [cards[currentIndex], cards[randomIndex]] = [cards[randomIndex], cards[currentIndex]];
  }
}

function generateCards() {
  gridContainer.innerHTML = "";
  cards.forEach(card => {
    const cardElement = document.createElement("div");
    cardElement.classList.add("card");
    cardElement.setAttribute("data-name", card.name);

    cardElement.innerHTML = `
      <div class="front">
        <img class="front-image" src="${card.image}" alt="${card.name}" />
      </div>
      <div class="back"></div>
    `;

    cardElement.addEventListener("click", flipCard);
    gridContainer.appendChild(cardElement);
  });
}

function flipCard() {
  if (lockBoard) return;
  if (this === firstCard) return;

  this.classList.add("flipped");

  if (!firstCard) {
    firstCard = this;
    return;
  }

  secondCard = this;
  score++;
  document.querySelector(".score").textContent = score;
  lockBoard = true;

  checkForMatch();
}

function checkForMatch() {
  let isMatch = firstCard.dataset.name === secondCard.dataset.name;

  isMatch ? disableCards() : unflipCards();
  checkGameEnd();
}

function disableCards() {
  firstCard.removeEventListener("click", flipCard);
  secondCard.removeEventListener("click", flipCard);
  resetBoard();
}

function unflipCards() {
  setTimeout(() => {
    firstCard.classList.remove("flipped");
    secondCard.classList.remove("flipped");
    resetBoard();
  }, 1000);
}

function resetBoard() {
  [firstCard, secondCard, lockBoard] = [null, null, false];
}

function checkGameEnd() {
  const allCardsFlipped = [...document.querySelectorAll(".card")].every(card =>
    card.classList.contains("flipped")
  );

  if (allCardsFlipped) {
    setTimeout(() => {
      alert(`Sveikiname, ${playerName}! Žaidimą įveikėte per ${score} ėjimus.`);
      updateBestScore();
    }, 500);
  }
}

function updateBestScore() {
  let currentBestScore = sessionStorage.getItem("bestScore");
  if (!currentBestScore || score < currentBestScore) {
    sessionStorage.setItem("bestScore", score);
    document.querySelector(".best-score").textContent = score;
  }
}

function restart() {
  resetBoard();
  score = 0;
  document.querySelector(".score").textContent = score;
  overlay.style.display = "flex";
  playerNameInput.value = "";
  playerNameDisplay.textContent = "";
}
