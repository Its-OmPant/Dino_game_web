import {
	changeTimeAndBackground,
	moveDino,
	detectCollision,
} from "./helper.js";

// ---------- ELEMENTS ------------
const gameContainer = document.querySelector(".game-container");
const bgContainer = document.querySelector("#bg-overlay");
const dinoElement = document.querySelector("#dino");

// ---------- GAME LOGIC ------------

let time = "day";
time = changeTimeAndBackground(time, bgContainer);
let isPlaying = true;

window.addEventListener("keydown", (e) => {
	switch (e.key) {
		case "p":
		case "P":
			playPauseGame();
			break;
		case "w":
		case "ArrowUp":
			dinoElement.classList.remove("dino-crouch");
			dinoElement.classList.add("dino-jump");
			setTimeout(() => {
				dinoElement.classList.remove("dino-jump");
			}, 800);
			break;
		case "a":
		case "ArrowLeft":
			let leftMostBoundry = gameContainer.getBoundingClientRect().left;
			moveDino(dinoElement, "left", 50, leftMostBoundry);
			break;
		case "s":
		case "ArrowDown":
			dinoElement.classList.remove("dino-jump");
			dinoElement.classList.add("dino-crouch");
			setTimeout(() => {
				dinoElement.classList.remove("dino-crouch");
			}, 800);
			break;
		case "d":
		case "ArrowRight":
			let rightMostBoundry = gameContainer.getBoundingClientRect().right;
			moveDino(dinoElement, "right", 50, rightMostBoundry);
			break;
	}
});
if (isPlaying) {
	bgContainer.classList.add("animate-bg");
}
// change the time and bg
setInterval(() => {
	time = changeTimeAndBackground(time, bgContainer);
}, 60000);

let lastPaintTime = 0;

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

window.requestAnimationFrame(main);

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
		document.querySelectorAll("div").forEach((element) => {
			if (getComputedStyle(element).animationName !== "none") {
				element.style.animationPlayState = "paused";
			}
		});
	} else {
		// resume
		isPlaying = true;
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

	// TODO: show gameOver Overlay
	alert("Game Over. Press p to restart");
}
