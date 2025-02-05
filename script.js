const canvas = document.getElementById("gameCanvas");
const ctx = canvas.getContext("2d");

let snake = [{ x: 10, y: 10 }];
let direction = { x: 0, y: 0 };
let food = { x: 0, y: 0 };
let bonus = { x: 0, y: 0, active: false };
let score = 0;
let highestScore = localStorage.getItem("highestScore")
  ? parseInt(localStorage.getItem("highestScore"))
  : 0;
let gameOver = false;
let paused = false;

let hue = 0;

const currentScoreElement = document.getElementById("current-score");
const highestScoreElement = document.getElementById("highest-score");

function placeFood() {
  food.x = Math.floor(Math.random() * (canvas.width / 10)) * 10;
  food.y = Math.floor(Math.random() * (canvas.height / 10)) * 10;
}

function placeBonus() {
  if (!bonus.active) {
    bonus.x = Math.floor(Math.random() * (canvas.width / 10)) * 10;
    bonus.y = Math.floor(Math.random() * (canvas.height / 10)) * 10;
    bonus.active = true;
  }
}

function draw() {
  ctx.clearRect(0, 0, canvas.width, canvas.height);
  snake.forEach((segment, index) => {
    ctx.fillStyle = index === 0 ? "black" : "black";
    ctx.beginPath();
    ctx.arc(segment.x + 5, segment.y + 6, 6, 0, Math.PI * 2);
    ctx.fill();
    ctx.strokeStyle = "white";
    ctx.stroke();
  });

  ctx.fillStyle = "darkblue";
  ctx.beginPath();
  ctx.arc(food.x + 5, food.y + 5, 5, 0, Math.PI * 2);
  ctx.fill();

  if (bonus.active) {
    ctx.fillStyle = `hsl(${hue}, 100%, 50%)`;
    ctx.beginPath();
    ctx.arc(bonus.x + 5, bonus.y + 5, 8, 0, Math.PI * 2);
    ctx.fill();
  }

  currentScoreElement.textContent = "Score: " + score;
  highestScoreElement.textContent = "Highest Score: " + highestScore;
}

function update() {
  if (gameOver || paused) return;
  const head = { x: snake[0].x + direction.x, y: snake[0].y + direction.y };
  if (
    head.x < 0 ||
    head.x >= canvas.width ||
    head.y < 0 ||
    head.y >= canvas.height ||
    collision(head)
  ) {
    gameOver = true;
    displayGameOverMessage();
    if (score > highestScore) {
      highestScore = score;
      localStorage.setItem("highestScore", highestScore);
    }
    return;
  }

  if (head.x === food.x && head.y === food.y) {
    score++;
    placeFood();
    if (Math.random() < 0.3) {
      placeBonus();
    }
  } else if (bonus.active && head.x === bonus.x && head.y === bonus.y) {
    score += 2;
    snake.push({ ...snake[snake.length - 1] });
    bonus.active = false;
  } else {
    snake.pop();
  }

  snake.unshift(head);
}

function collision(head) {
  return snake.some(
    (segment, index) =>
      index !== 0 && segment.x === head.x && segment.y === head.y
  );
}

function changeDirection(event) {
  switch (event.key) {
    case "ArrowUp":
      if (direction.y === 0) direction = { x: 0, y: -10 };
      break;
    case "ArrowDown":
      if (direction.y === 0) direction = { x: 0, y: 10 };
      break;
    case "ArrowLeft":
      if (direction.x === 0) direction = { x: -10, y: 0 };
      break;
    case "ArrowRight":
      if (direction.x === 0) direction = { x: 10, y: 0 };
      break;
  }
}

document.addEventListener("keydown", changeDirection);
placeFood();
placeBonus();
let gameInterval = setInterval(() => {
  draw();
  update();

  hue += 2;
  if (hue >= 360) hue = 0;
}, 100);

const restartButton = document.getElementById("restart-button");
const pauseButton = document.getElementById("pause-button");

restartButton.addEventListener("click", () => {
  snake = [{ x: 10, y: 10 }];
  direction = { x: 0, y: 0 };
  score = 0;
  gameOver = false;
  paused = false;
  placeFood();
  bonus.active = false;
  currentScoreElement.textContent = "Score: " + score;
});

pauseButton.addEventListener("click", () => {
  paused = !paused;
  pauseButton.textContent = paused ? "Resume" : "Pause";
});

highestScoreElement.textContent = "Highest Score: " + highestScore;

document.getElementById("up-button").addEventListener("click", () => {
  if (direction.y === 0) direction = { x: 0, y: -10 };
});

document.getElementById("down-button").addEventListener("click", () => {
  if (direction.y === 0) direction = { x: 0, y: 10 };
});

document.getElementById("left-button").addEventListener("click", () => {
  if (direction.x === 0) direction = { x: -10, y: 0 };
});

document.getElementById("right-button").addEventListener("click", () => {
  if (direction.x === 0) direction = { x: 10, y: 0 };
});

function displayGameOverMessage() {
  const gameOverMessage = document.createElement("div");
  gameOverMessage.textContent = "Game Over! Your score: " + score;
  gameOverMessage.style.position = "absolute";
  gameOverMessage.style.top = "50%";
  gameOverMessage.style.left = "50%";
  gameOverMessage.style.transform = "translate(-50%, -50%)";
  gameOverMessage.style.padding = "20px";
  gameOverMessage.style.backgroundColor = "rgba(0, 0, 0, 0.7)";
  gameOverMessage.style.color = "white";
  gameOverMessage.style.fontSize = "24px";
  gameOverMessage.style.borderRadius = "10px";
  gameOverMessage.style.opacity = "1";
  gameOverMessage.style.transition = "opacity 2s";

  document.body.appendChild(gameOverMessage);

  setTimeout(() => {
    gameOverMessage.style.opacity = "0";
    setTimeout(() => {
      document.body.removeChild(gameOverMessage);
    }, 2000);
  }, 2000);
}
document.getElementById("tips-button").addEventListener("click", () => {
  const tipsPopup = document.getElementById("tips-popup");
  tipsPopup.classList.toggle("show");
  setTimeout(() => {
    tipsPopup.classList.remove("show");
  }, 5000);
});
