
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
	startingSpeed: 4,
	speed: 4,
	dX: -1,
	dY: 1,
	totalBounces: 0 // use to determine ball speed
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
	speed: 5,
	trackDistance: 530 // decrease to make computer see further (harder to beat)
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

function resetGame(){
	ball.top = 190;
    ball.left = 432;
    pause();
	setTimeout(unpause, 1500);
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
	updateBallSpeed()
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
	if (ball.left > paddle2.trackDistance) {
		var paddle2Bottom = paddle2.height + paddle2.top;
		if (ball.top < paddle2.top) {
			// move up
			paddle2.dY =  -paddle2.speed;
		} else if (ball.top > paddle2Bottom - ball.height) {
			// move down
			paddle2.dY = paddle2.speed
		} else {
			paddle2.dY = ball.dY;
		}
	} else {
		if (paddle2.top > 210) {
			paddle2.dY = -paddle2.speed * .2;
		} else if (paddle2.top < 210) {
			paddle2.dY = paddle2.speed * .2;
		} else {
			paddle2.dY = 0
		}
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
	ball.top += ball.dY * ball.speed
	ball.left += ball.dX * ball.speed

	if (ball.top > 480 || ball.top < 0) {
		ball.dY = -ball.dY
		ball.totalBounces++;
	}

	if (ball.left > 870 || ball.left < 0) {
		if (ball.left < 0) {
			// if ball.left is 0, enemy scored
			scores.score2.score++;
			resetGame();
		} else {
			// if ball.left is 870, you scored
			scores.score1.score++;
			// make enemy harder
			// debugger
			paddle2.trackDistance -= 10;
			resetGame();
		}
		ball.dX = -ball.dX
	}
}

function updateBallSpeed() {
	if (ball.totalBounces > 0 && ball.totalBounces % 10 === 0 && ball.totalBounces < 100) {
		// increase ball speed by 1 every 10 bounces
		var newSpeed = ball.totalBounces / 10 + ball.startingSpeed;
		ball.speed = newSpeed;
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

