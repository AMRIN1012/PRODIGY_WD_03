const board = document.getElementById("gameBoard");
const statusText = document.getElementById("statusText");
const restartBtn = document.getElementById("restartBtn");
const gameContainer = document.getElementById("gameContainer");
const modeSelection = document.getElementById("modeSelection");

let currentPlayer = "X";
let gameActive = true;
let gameMode = "pvp"; // or 'ai'
let gameState = ["", "", "", "", "", "", "", "", ""];

const winningConditions = [
  [0,1,2], [3,4,5], [6,7,8],
  [0,3,6], [1,4,7], [2,5,8],
  [0,4,8], [2,4,6]
];

function startGame(mode) {
  gameMode = mode;
  modeSelection.style.display = "none";
  gameContainer.style.display = "block";
  createBoard();
}

function handleCellClick(event) {
  const clickedCell = event.target;
  const index = parseInt(clickedCell.getAttribute("data-index"));

  if (gameState[index] !== "" || !gameActive) return;

  gameState[index] = currentPlayer;
  clickedCell.textContent = currentPlayer;

  if (checkResult()) return;

  currentPlayer = currentPlayer === "X" ? "O" : "X";
  statusText.textContent = `Player ${currentPlayer}'s turn`;

  if (gameMode === "ai" && currentPlayer === "O") {
    aiMove();
  }
}

function aiMove() {
  // Very basic AI: pick first available cell
  let index = gameState.findIndex(cell => cell === "");
  if (index !== -1) {
    setTimeout(() => {
      const cell = board.children[index];
      gameState[index] = "O";
      cell.textContent = "O";
      if (checkResult()) return;
      currentPlayer = "X";
      statusText.textContent = `Player ${currentPlayer}'s turn`;
    }, 500);
  }
}

function checkResult() {
  for (let condition of winningConditions) {
    const [a, b, c] = condition;
    if (gameState[a] && gameState[a] === gameState[b] && gameState[a] === gameState[c]) {
      statusText.textContent = `Player ${currentPlayer} wins!`;
      gameActive = false;
      return true;
    }
  }

  if (!gameState.includes("")) {
    statusText.textContent = "Draw!";
    gameActive = false;
    return true;
  }

  return false;
}

function restartGame() {
  currentPlayer = "X";
  gameActive = true;
  gameState = ["", "", "", "", "", "", "", "", ""];
  statusText.textContent = `Player ${currentPlayer}'s turn`;
  board.innerHTML = "";
  createBoard();
}

function createBoard() {
  board.innerHTML = "";
  for (let i = 0; i < 9; i++) {
    const cell = document.createElement("div");
    cell.classList.add("cell");
    cell.setAttribute("data-index", i);
    cell.addEventListener("click", handleCellClick);
    board.appendChild(cell);
  }
}

restartBtn.addEventListener("click", restartGame);
