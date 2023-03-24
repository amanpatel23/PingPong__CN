
let playerA__score__card = document.getElementById("playerA__score__div");
let playerB__score__card = document.getElementById("playerB__score__div")
let bar__top = document.getElementById("bar__top");
let bar__bottom = document.getElementById("bar__bottom");
let ball = document.getElementById("ball");

let toAddInX, toAddInY;

let ball__pos, bar__top__pos, bar__bottom__pos;

let window__width = window.innerWidth;
let window__height = window.innerHeight;

ball__pos = ball.getBoundingClientRect();
let ball__height = ball__pos.height;
let ball__width = ball__pos.width;

bar__top__pos = bar__top.getBoundingClientRect();
let bar__width = bar__top__pos.width;
let bar__height = bar__top__pos.height;

let flag;
let gameHasStarted;
let isBallGoingDown;

let playerA__score, playerB__score, max__score;
function setupPositionOfBall() {

    toAddInX = -5;
    if (isBallGoingDown === null) {
        ball.style.top = `${bar__height}px`;
        toAddInY = 2;
    } else {
        if (isBallGoingDown === 1) {
            ball.style.bottom = `${bar__height}px`;
            toAddInY = -2;
        } else {
            ball.style.top = `${bar__height}px`;
            toAddInY = 2;
        }
        isBallGoingDown ^= 1;
    }
    ball.style.left = `${(window__width / 2) - (ball__width / 2)}px`;
}

function setupBarPosition() {
    let left = (window__width / 2) - (bar__width / 2);
    bar__top.style.left = `${left}px`;
    bar__bottom.style.left = `${left}px`;
}

function welcomAlert() {
    flag = false;
    gameHasStarted = false;
    isBallGoingDown = null;
    playerA__score = 0;
    playerB__score = 0;
    max__score = 0;
    localStorage.setItem("max__score", JSON.stringify(max__score));
    localStorage.setItem("max__score__player", "PlayerA");
    setupPositionOfBall();
    setupBarPosition();
    isBallGoingDown = 1;

    window.alert("Press Enter to start the game and 'a' & 'd' keys to move the bar...");
}

function startTheGame() {
    gameHasStarted = true;
    flag = false;
    window.requestAnimationFrame(move);
}

function pauseTheGame() {
    let prev__max__score = JSON.parse(localStorage.getItem("max__score"));
    max__score = Math.max(playerA__score, playerB__score);
    if (prev__max__score < max__score) {
        localStorage.setItem("max__score", JSON.stringify(max__score));
        if (isBallGoingDown === 1) {
            localStorage.setItem("max__score__player", "PlayerA");
        } else {
            localStorage.setItem("max__score__player", "PlayerB");
        }
    }
    
    max__score = JSON.parse(localStorage.getItem("max__score"));
    let player__name = localStorage.getItem("max__score__player");
    if (isBallGoingDown === 1) {
        window.alert(`PlayerA has won the game with a score of ${playerA__score}. Max Score: ${max__score}[${player__name}].`)
    } else {
        window.alert(`PlayerB has won the game with a score of ${playerB__score}. Max Score: ${max__score}[${player__name}].`)
    }

    gameHasStarted = false;
    flag = false;
    playerA__score = 0;
    playerB__score = 0;

    updateScore();

    setupPositionOfBall();
    setupBarPosition();
}

welcomAlert();

function move() {

    ball__pos = ball.getBoundingClientRect();
    let curr__x = ball__pos.x, curr__y = ball__pos.y, curr__bottom = ball__pos.bottom, curr__right = ball__pos.right;
    

    bar__top__pos = bar__top.getBoundingClientRect();
    let bar__left = bar__top__pos.left;
    let bar__right = bar__top__pos.right;

    if (flag) {
        if (curr__y <= bar__height || curr__bottom + bar__height >= window__height) {
            if (curr__right >= bar__left && curr__x <= bar__right) {
                toAddInY *= -1;

                if (isBallGoingDown === 1) playerB__score++;
                else playerA__score++;

                updateScore();

                isBallGoingDown ^= 1;
            } else {
                pauseTheGame();
                return;
            }
        }
    }

    let updated__x = curr__x + toAddInX;
    let updated__y = curr__y + toAddInY;
    let updated__right = curr__right + toAddInX;

    if (updated__x <= 0 || updated__right >= window__width) {
        toAddInX *= (-1);
    }

    ball.style.left = `${updated__x}px`;
    ball.style.top = `${updated__y}px`;

    flag = true;

    requestAnimationFrame(move);
}

function updateScore() {
    playerA__score__card.innerHTML = `${playerA__score}`;
    playerB__score__card.innerHTML = `${playerB__score}`;
}

document.addEventListener("keydown", (event) => {
    if (event.key === 'a' || event.key === 'd' || event.key === 'A' || event.key === 'D') {
        if (!gameHasStarted) return;
        bar__top__pos = bar__top.getBoundingClientRect();

        let curr__x = parseFloat(bar__top__pos.x);
        let updated__x;
        if (event.key === 'a' || event.key === 'A')  {
            updated__x = curr__x - 10;
            if (updated__x < 0) updated__x = 0;
        } else if (event.key === 'd' || event.key === 'D') {
            updated__x = curr__x + 10;
            if (updated__x + bar__width > window__width) updated__x = window__width - bar__width;
        }

        bar__top.style.left = `${updated__x}px`;
        bar__bottom.style.left = `${updated__x}px`;
    } else if (event.key === 'Enter') {
        if (gameHasStarted) {
            return;
        }
        startTheGame();
    }
})



