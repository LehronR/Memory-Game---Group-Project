import { superMario, avengers, defaultDeck } from "./gameData.js";
// Object used for selecting different themes
let cardTheme = {
  basic: defaultDeck,
  mario: superMario,
  avengers: avengers
};
// Global variables
let currentTheme = cardTheme.basic;
let moveCount = 0;
let setImgsArr = [];
// HTML elements used for data manipulation
const cardDeck = Array.from(document.querySelectorAll("#cardDeck > div"));
const moveCounter = document.getElementById("moveCount");
const newGame = document.getElementById("newGame");
const theme = document.querySelector("select");

// Start new game
function startNewGame() {
  // Reshuffle deck once a new game is started
  let shuffledDeck = shuffleImgs(currentTheme);
  // Capture images for new shuffled deck
  let imgArray = Array.from(document.querySelectorAll("div>img"));
  // Reset move counter
  moveCount = 0;
  moveCounter.textContent = moveCount;
  // Reset classes on card elements
  cardDeck.forEach((card) => {
    card.classList.remove("front", "match");
    // Reset cards to initial state with back class
    if (!card.classList.contains("back")) {
      card.classList.add("back");
    }
    // If new game started after initial load, remove images from card elements
    if (card.children.length > 0) {
      card.removeChild(document.querySelector("div > img"));
    }
  });
  setImgsToCards(cardDeck);
}

// Shuffle card images
function shuffleImgs(currentTheme) {
  let numCards = currentTheme.length;
  let shuffledArr = [];

  //Puts one of each card in a random location
  currentTheme.map((card) => {
    let index = Math.floor(Math.random() * numCards * 2);
    if (!shuffledArr[index]) {
      shuffledArr[index] = card;
    } else {
      while (shuffledArr[index]) {
        index = Math.floor(Math.random() * numCards * 2);
      } //Ensures no overwrite
      shuffledArr[index] = card;
    }
  });

  //Puts a second of each card in a random location
  currentTheme.map((card) => {
    let index = Math.floor(Math.random() * numCards * 2);
    if (!shuffledArr[index]) {
      shuffledArr[index] = card;
    } else {
      while (shuffledArr[index]) {
        index = Math.floor(Math.random() * numCards * 2);
      }
      shuffledArr[index] = card;
    }
  });

  return shuffledArr;
}
// Randomly set current game cards images
function setImgsToCards(cardDeck) {
  let currentImgs = shuffleImgs(currentTheme);
  let index = 0;

  console.log(currentImgs);

  cardDeck.forEach((card) => {
    // Create and append card img element to current game deck
    const newImg = document.createElement("img");
    newImg.setAttribute("src", currentImgs[index]);
    newImg.classList.add("hide");
    card.appendChild(newImg);
    // Used to capture current images being used
    setImgsArr.push(newImg);
    index++;
  });
}
// Flip card when clicked
function flipCard(e) {
  // Change class on card img to make visible
  e.target.classList.remove("back");
  e.target.children[0].classList.remove("hide");
  e.target.classList.add("front");
  e.target.children[0].classList.add("show");

  // Check if 2 cards are currently flipped
  checkFlippedCards();
}
// Compare 2 flipped cards to check if they're a match
function compareCards(flippedCards) {
  // Capture flipped cards for comparison in variables
  let firstCard = flippedCards[0];
  let secondCard = flippedCards[1];
  // Add a move to the move counter every time 2 cards are compared

  // Check if the 2 flipped cards are a match and what to do based on the result
  firstCard.children[0].getAttribute("src") ===
  secondCard.children[0].getAttribute("src")
    ? (firstCard.classList.add("match"),
      secondCard.classList.add("match"),
      firstCard.classList.remove("front"),
      secondCard.classList.remove("front"),
      console.log(firstCard, secondCard))
    : setTimeout(() => {
        firstCard.classList.remove("front");
        secondCard.classList.remove("front");
        firstCard.children[0].classList.remove("show");
        secondCard.children[0].classList.remove("show");
        firstCard.classList.add("back");
        secondCard.classList.add("back");
        firstCard.children[0].classList.add("hide");
        secondCard.children[0].classList.add("hide");

        console.log(firstCard, secondCard);
      }, 500);

  setTimeout(() => {
    hasPlayerWon();
  }, 500);
  // Update move count
  moveCount++;
  moveCounter.textContent = moveCount;
}
// Filter through card deck array to check the number of flipped cards
function checkFlippedCards() {
  let flippedCards = cardDeck.filter((card) => {
    return card.classList.contains("front");
  });
  // Check number of flip cards
  flippedCards.length === 2
    ? compareCards(flippedCards)
    : console.log("cards flipped: " + flippedCards.length);
}
// Check if player has won
function hasPlayerWon() {
  let matchesMade = cardDeck.filter((card) => card.classList.contains("match"));

  if (matchesMade.length === cardDeck.length) {
    alert("YOU WIN!!! Play again?");
  }
}

function changeTheme() {
  let chosenTheme = theme.options[theme.selectedIndex].text;
  console.log(chosenTheme);
  // Used to handle theme changes
  switch (chosenTheme) {
    case "Super Mario":
      currentTheme = cardTheme.mario;
      cardDeck.forEach((card) => {
        card.classList.remove("avengers", "basic");
        card.classList.add("mario");
      });
      break;
    case "Avengers":
      currentTheme = cardTheme.avengers;
      cardDeck.forEach((card) => {
        card.classList.remove("mario", "basic");
        card.classList.add("avengers");
      });
      break;
    case "Basic":
      currentTheme = cardTheme.basic;
      cardDeck.forEach((card) => {
        card.classList.remove("avengers", "mario");
        card.classList.add("basic");
      });
      break;
  }
  startNewGame();
}
// Event Listeners
cardDeck.map((card) => {
  card.addEventListener("click", flipCard);
  newGame.addEventListener("click", startNewGame);
});

theme.addEventListener("change", changeTheme);

startNewGame();
