import {
	changeTimeAndBackground,
	moveDino,
	detectCollision,
} from "./helper.js";

// ---------- ELEMENTS ------------
const gameContainer = document.querySelector(".game-container");
const bgContainer = document.querySelector("#bg-overlay");
const dinoElement = document.querySelector("#dino");
const startButton = document.querySelector(".start");
const closeButton = document.querySelector("#close");
const restartButton = document.querySelector("#restart");
const instructionOverlay = document.querySelector("#instruction-overlay");
const gameoverOverlay = document.querySelector("#gameover-overlay");
const controls = Array.from(document.querySelectorAll(".hotkeys button"));
const scoreElement = document.querySelector("#score");
const gameOverScoreElement = document.querySelector("#game-over-score");
const highScoreElement = document.querySelector("#high-score");
const hScoreMsgElement = document.querySelector("#hScore_msg");
const playPauseBtn = document.querySelector("#btn-play-pause");

// ---------- Helper Functions------------

function jump() {
	dinoElement.classList.remove("dino-crouch");
	dinoElement.classList.add("dino-jump");
	setTimeout(() => {
		dinoElement.classList.remove("dino-jump");
	}, 800);
}

function crouch() {
	dinoElement.classList.remove("dino-jump");
	dinoElement.classList.add("dino-crouch");
	setTimeout(() => {
		dinoElement.classList.remove("dino-crouch");
	}, 800);
}

function moveLeft() {
	let leftMostBoundry = gameContainer.getBoundingClientRect().left;
	moveDino(dinoElement, "left", 50, leftMostBoundry);
}

function moveRight() {
	let rightMostBoundry = gameContainer.getBoundingClientRect().right;
	moveDino(dinoElement, "right", 50, rightMostBoundry);
}

function main(ctime) {
	if (isPlaying) {
		window.requestAnimationFrame(main);
		if ((ctime - lastPaintTime) / 1000 < 1 / 8) {
			return;
		}
		lastPaintTime = ctime;

		const allEnemies = Array.from(document.querySelectorAll(".enemy"));
		// check collisions and game over
		let isCollided = detectCollision(dinoElement, allEnemies);
		if (isCollided === true) {
			gameOver();
		}
		score += 1;
		scoreElement.innerText = score;
		// remove screen-out enemies
		let boundry = gameContainer.getBoundingClientRect().left;
		allEnemies.forEach((enemy) => {
			let enemyLeft = parseFloat(
				window.getComputedStyle(enemy, null).left
			);
			// remove enemy if out of boundry
			if (enemyLeft < boundry) {
				gameContainer.removeChild(enemy);
			}
		});

		const allEnemies2 = Array.from(document.querySelectorAll(".enemy"));
		if (allEnemies.length == 0) {
			generateEnemy();
		}
	}
}

function generateEnemy() {
	const randNum = Math.round(Math.random() * 10 + 1);
	let enemyType;
	let speedType;
	if (
		randNum == 1 ||
		randNum == 3 ||
		randNum == 5 ||
		randNum == 9 ||
		randNum == 10
	) {
		enemyType = "enemy1";
		speedType = "enemy-move-1";
	} else if (randNum == 2 || randNum == 6 || randNum == 8 || randNum == 4) {
		enemyType = "enemy2";
		speedType = "enemy-move-2";
	} else {
		enemyType = "enemy3";
		speedType = "enemy-move-3";
	}

	let enemy = document.createElement("div");
	enemy.id = enemyType;
	enemy.classList.add("enemy", speedType);
	gameContainer.appendChild(enemy);
}

function playPauseGame() {
	if (isPlaying) {
		// pause
		isPlaying = false;
		playPauseBtn.innerText = "Play";
		document.querySelectorAll("div").forEach((element) => {
			if (getComputedStyle(element).animationName !== "none") {
				element.style.animationPlayState = "paused";
			}
		});
	} else {
		// resume
		isPlaying = true;
		playPauseBtn.innerText = "Pause";
		document.querySelectorAll("div").forEach((element) => {
			element.style.animationPlayState = "running";
		});
		window.requestAnimationFrame(main);
	}
}

function gameOver() {
	// remove all enemies
	let allRenderedEnemies = Array.from(document.querySelectorAll(".enemy"));
	allRenderedEnemies.forEach((enemy) => {
		gameContainer.removeChild(enemy);
	});

	playPauseGame();
	gameoverOverlay.classList.remove("hidden");
	gameOverScoreElement.innerText = score;
	if (score > highScore) {
		highScore = score;
		localStorage.setItem("highScore", highScore);
		highScoreElement.innerText = highScore;
		hScoreMsgElement.classList.remove("hidden");
	}
	score = 0;
	scoreElement.innerText = 0;
}

// -------------- GAME LOGIC --------------

// 0 detect initial load
let isInitialLoad = sessionStorage.getItem("isDinoGameInitialLoad");
if (!isInitialLoad) {
	isInitialLoad = false;
	sessionStorage.setItem("isDinoGameInitialLoad", false);
} else {
	isInitialLoad = true;
}

// 1 setting default values
let time = "day";
let score = 0;
let highScore = localStorage.getItem("highScore");
if (!highScore) {
	localStorage.setItem("highScore", 0);
	highScore = localStorage.getItem("highScore");
}

scoreElement.innerText = 0;
highScoreElement.innerText = highScore;

time = changeTimeAndBackground(time, bgContainer);
let isPlaying = false;

if (isPlaying) {
	bgContainer.classList.add("animate-bg");
}
let lastPaintTime = 0;

playPauseBtn.innerText = isPlaying ? "Pause" : "Play";

// 2 change the time and bg
setInterval(() => {
	time = changeTimeAndBackground(time, bgContainer);
}, 60000);

// -------------- Event Handlers --------------

window.addEventListener("keydown", (e) => {
	switch (e.key) {
		case "p":
		case "P":
			playPauseGame();
			break;
		case "i":
		case "I":
			if (isPlaying) playPauseGame();
			instructionOverlay.classList.toggle("hidden");
			break;
		case "w":
		case "ArrowUp":
			jump();
			break;
		case "a":
		case "ArrowLeft":
			moveLeft();
			break;
		case "s":
		case "ArrowDown":
			crouch();
			break;
		case "d":
		case "ArrowRight":
			moveRight();
			break;
	}
});

closeButton.onclick = () => {
	if (isInitialLoad) {
		playPauseGame();
		bgContainer.classList.add("animate-bg");
	}
	instructionOverlay.classList.add("hidden");
};

startButton.onclick = (e) => {
	instructionOverlay.classList.add("hidden");
	isPlaying = true;
	playPauseBtn.innerText = "Pause";
	window.requestAnimationFrame(main);
	bgContainer.classList.add("animate-bg");
};

restartButton.onclick = () => {
	gameoverOverlay.classList.add("hidden");
	playPauseGame();
};

// control button handlers
controls.forEach((btn) => {
	const control_type = btn.dataset.control;
	if (control_type == "jump") {
		btn.onclick = jump;
	} else if (control_type == "crouch") {
		btn.onclick = crouch;
	} else if (control_type == "left") {
		btn.onclick = moveLeft;
	} else if (control_type == "right") {
		btn.onclick = moveRight;
	} else if (control_type == "pausePlay") {
		btn.onclick = playPauseGame;
	}
});
