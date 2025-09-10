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
