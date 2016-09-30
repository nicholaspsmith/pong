
var paused = false;

var scores = {
	score1: {
		el: document.getElementById('score1'),
		score: 0
	},
	score2: {
		el: document.getElementById('score2'),
		score: 0
	}
}

var ball = {
	el: document.getElementById('ball'),
	width: 20,
	height: 20,
	left: 426,
	top: 100,
	dX: 4,
	dY: 4
}

var paddle1 = {
	el: document.getElementById('paddle1'),
	height: 80,
	width: 30,
	top: 210,
	dY: 0,
	speed: 5
}

var paddle2 = {
	el: document.getElementById('paddle2'),
	height: 80,
	width: 30,
	top: 210,
	dY: 0,
	speed: 1
}

function pause() {
	paused = true;
}

function unpause() {
	if (paused) {
		paused = false;
		window.requestAnimationFrame(gameLoop)
	}
}

function gameLoop() {
	update();
	render();
	if (!paused) {
		requestAnimationFrame(gameLoop)
	}
}

window.requestAnimationFrame(gameLoop);

function update() {
	paddle2TrackBall()
	updatePaddle1Pos()
	updatePaddle2Pos()
	updateBallPos()
	checkPaddle1Collision()
	checkPaddle2Collision()
}

function render() {
	drawPaddle1()
	drawBall()
	drawPaddle2()
	drawScores()
}

document.getElementById('pause-button').onclick = function() {
	if (paused) {
		unpause()
		this.innerHTML = "||"
	} else {
		pause()
		this.innerHTML = "&#9658;"
		
	}
}

document.onkeydown = function(e) {
	if (e.key == "ArrowDown") {
		paddle1.dY = paddle1.speed;
	} else if (e.key == "ArrowUp") {
		paddle1.dY = -paddle1.speed;
	}
}

function paddle2TrackBall() {
	// move in the wrong direction every once in a while
	if (Math.random() > 0.3) {
		var reverse = true;
	}
	var paddle2Bottom = paddle2.height + paddle2.top;
	if (ball.top < paddle2.top) {
		paddle2.dY = !reverse ? -paddle2.speed : paddle2.speed;
	} else if (ball.top > paddle2Bottom - ball.height) {
		paddle2.dY = !reverse ? paddle2.speed : -paddle2.speed;
	} else {
		paddle2.dY = ball.dY;
	}
}

document.onkeyup = function(e) {
	if (e.key == "ArrowDown" || e.key == "ArrowUp") {
		paddle1.dY = 0;
	}
}

function updatePaddle1Pos() {
	paddle1.top += paddle1.dY;

	var top = paddle1.el.style.top;
	var newTop = paddle1.top + paddle1.dY;

	newTop = Math.max(parseInt(newTop, 10), 0)
	newTop = Math.min(parseInt(newTop, 10), 420)

	paddle1.top = newTop
}

function updatePaddle2Pos() {
	paddle2.top += paddle2.dY;

	var top = paddle2.el.style.top;
	var newTop = paddle2.top + paddle2.dY;

	newTop = Math.max(parseInt(newTop, 10), 0)
	newTop = Math.min(parseInt(newTop, 10), 420)

	paddle2.top = newTop;
}

function drawPaddle1() {
	paddle1.el.style.top  = paddle1.top + "px"
}

function drawPaddle2() {
	paddle2.el.style.top = paddle2.top + "px";
}

function updateBallPos() {
	ball.top += ball.dY
	ball.left += ball.dX

	if (ball.top > 480 || ball.top < 0) {
		ball.dY = -ball.dY
	}

	if (ball.left > 870 || ball.left < 0) {
		if (ball.left < 0) {
		// if ball.left is 0, enemy scored
		scores.score2.score++;
		} else {
			// if ball.left is 870, you scored
			scores.score1.score++;
		}
		ball.dX = -ball.dX
	}
}

function drawBall() {
	ball.el.style.top = ball.top + "px"
	ball.el.style.left = ball.left + "px"
}

function drawScores() {
	scores.score1.el.innerHTML = scores.score1.score;
	scores.score2.el.innerHTML = scores.score2.score;
}

function checkPaddle1Collision() {
	if (ball.left <= paddle1.width) {
		// ball is on our side of the court
		if ((ball.top + ball.height) > paddle1.top + 3 && (ball.top + ball.width) < (paddle1.top + paddle1.height) + 3) {
			// ball is hitting front face of paddle
			ball.dX = Math.max(-ball.dX, ball.dX)
		}
		// if (ball.top)
	}
}

function checkPaddle2Collision() {
	if (ball.left >= (890 - (paddle2.width + ball.width))) {
		if (ball.top > paddle2.top && (ball.top + ball.width) < (paddle2.top + paddle2.height)) {
			ball.dX = Math.min(-ball.dX, ball.dX)
		}
	}
}

