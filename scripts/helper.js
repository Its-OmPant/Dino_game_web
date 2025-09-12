export function changeTimeAndBackground(time, gameContainer) {
	if (time == "day") {
		gameContainer.style.backgroundImage = `url("./assets/bg-day.jpg") `;
	} else {
		gameContainer.style.backgroundImage = `url("./assets/bg-night.jpg") `;
	}

	// gameContainer.style.backgroundPosition = "center center";
	return time === "day" ? "night" : "day";
}

export function moveDino(dino, direction, amount, boundry) {
	const style = getComputedStyle(dino, null);
	if (direction == "left") {
		let prevValue = parseFloat(style.left);
		let newVal = prevValue - amount;
		if (newVal > 10) {
			dino.style.left = newVal + "px";
		}
	}
	if (direction == "right") {
		let prevValue = parseFloat(style.left);
		let newVal = prevValue + amount;
		let dino_right = dino.getBoundingClientRect().right;
		if (dino_right < boundry - 50) {
			dino.style.left = newVal + "px";
		} else {
			console.log("stopped");
		}
	}
}
export function detectCollision(dino, enemies) {
	let dinoRect = dino.getBoundingClientRect();
	let isCollided = false;

	enemies.forEach((enemy) => {
		let enemyRect = enemy.getBoundingClientRect();
		let type = enemy.id;

		// ground enemies
		if (type == "enemy1" || type == "enemy2") {
			if (
				enemyRect.left >= dinoRect.left &&
				enemyRect.left <= dinoRect.right &&
				parseInt(enemyRect.bottom) <= parseInt(dinoRect.bottom)
			) {
				isCollided = true;
			}
		}
		// flying enemies
		else if (type == "enemy3") {
			if (
				enemyRect.left >= dinoRect.left &&
				enemyRect.left <= dinoRect.right &&
				enemyRect.bottom >= dinoRect.top
			) {
				isCollided = true;
			}
		}
	});

	return isCollided;
}
