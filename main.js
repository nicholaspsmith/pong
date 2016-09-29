

var paddle2 = document.getElementById('paddle2')

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
	left: 426,
	top: 100,
	dX: 6,
	dY: 6
}

var paddle1 = {
	el: document.getElementById('paddle1'),
	top: 210,
	dY: 0
}

function gameLoop() {
	update();
	render();
	requestAnimationFrame(gameLoop)
}

window.requestAnimationFrame(gameLoop);

function update() {
	updatePaddle1Pos()
	updateBallPos()
	checkPaddle1Collision()
}

function render() {
	drawPaddle1()
	drawBall()
	// drawPaddle2()
	drawScores()
}

document.onkeydown = function(e) {
	if (e.key == "ArrowDown") {
		paddle1.dY = 5;
	} else if (e.key == "ArrowUp") {
		paddle1.dY = -5;
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

function drawPaddle1() {
	paddle1.el.style.top  = paddle1.top + "px"
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
	if (ball.top > paddle1.top && (ball.top + 20) < (paddle1.top + 80)) {
		console.log('hit')
		// ball is within height range of paddle

		if (ball.left < 35) {
			ball.dX = -ball.dX
		}
	}
}