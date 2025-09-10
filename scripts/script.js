import { changeTimeAndBackground, moveDino } from "./helper.js";

// ---------- ELEMENTS ------------
const gameContainer = document.querySelector(".game-container");
const bgContainer = document.querySelector("#bg-overlay");
const dinoElement = document.querySelector("#dino");

// ---------- GAME LOGIC ------------

let time = "day";
time = changeTimeAndBackground(time, bgContainer);

window.addEventListener("keydown", (e) => {
	switch (e.key) {
		case "w":
		case "ArrowUp":
			// moveDino(dinoElement, "up", 10);
			dinoElement.classList.add("dino-crouch");
			setTimeout(() => {
				dinoElement.classList.remove("dino-crouch");
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
			break;
		case "d":
		case "ArrowRight":
			let rightMostBoundry = gameContainer.getBoundingClientRect().right;
			moveDino(dinoElement, "right", 50, rightMostBoundry);
			break;
	}
});

// change the time and bg
setInterval(() => {
	time = changeTimeAndBackground(time, bgContainer);
}, 60000);

let lastPaintTime = 0;

// generate Enemy
generateEnemy();
setInterval(() => {
	generateEnemy();
}, 3500);

function main(ctime) {
	window.requestAnimationFrame(main);
	if ((ctime - lastPaintTime) / 1000 < 1 / 3) {
		return;
	}
	lastPaintTime = ctime;

	// check collisions and game over

	// remove screen-out enemies
	const allEnemies = Array.from(document.querySelectorAll(".enemy"));
	let boundry = gameContainer.getBoundingClientRect().left;
	allEnemies.forEach((enemy) => {
		let enemyLeft = parseFloat(window.getComputedStyle(enemy, null).left);
		if (enemyLeft < boundry) {
			console.log("e b: ", enemyLeft);
			console.log("b: ", boundry);
			gameContainer.removeChild(enemy);
			console.log("Enemy removed");
		}
	});
}

window.requestAnimationFrame(main);

/**
 * in every 5s genearte a new enemy
 * add enemy-animation to it
 *
 *
 */

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
	// console.log(enemy);
	gameContainer.appendChild(enemy);
}
