
const playBoard = document.querySelector(".play-board");
const scoreElement = document.querySelector(".score");
const highScoreElement = document.querySelector(".high-score");
const controls = document.querySelectorAll(".controls p");

let gameOver = false;
let foodX,  foodY;
let snakeX =5, snakeY = 10; //position will be fixed
let snakeBody = [];
let velocityX = 0, velocityY = 0;
let setIntervalId;
let score = 0;

//Getting hisg score from local storage
let highScore = localStorage.getItem("high-score") || 0;
highScoreElement.innerText = `High-Score: ${highScore} `;


//change food position randomly
const changeFoodPosition = () =>{
    //passing a random 0-30 value as food position
    foodX = Math.floor(Math.random() * 30) + 1;
    foodY = Math.floor(Math.random() * 30) + 1;
}

const handleGameOver = () => {
    //clearing the timer and reloading the page on gameover
    clearInterval(setIntervalId);
    alert("Game Over! Press OK to replay...");
    location.reload();
}

const changeDirection = (e) => {
    //changing velocity value based on key press
   if(e.key === "ArrowUp" && velocityY != 1){
    velocityX = 0;
    velocityY = -1;
   }
   else if(e.key === "ArrowDown" && velocityY != -1){
    velocityX = 0;
    velocityY = 1;
   }
    else if(e.key === "ArrowLeft" && velocityX != 1){
    velocityX = -1;
    velocityY = 0;
   }
   else if(e.key === "ArrowRight" && velocityX != -1){
    velocityX = 1;
    velocityY = 0;
   }
   
}

controls.forEach(key => {
    //calling changeDirectio on each key click and passing key dataset as an object
    key.addEventListener("click", () => changeDirection({key: key.dataset.key}));
})

const initGame = () => {
    if(gameOver) return handleGameOver();
    //create a food div and insert it in the playboard element
    let htmlMarkup = `<div class="food" style="grid-area: ${foodY} / ${foodX}"></div>`;

    //checking if the snake eats the food
    if(snakeX === foodX && snakeY === foodY){
        changeFoodPosition();
        snakeBody.push([foodX, foodY]);//Pushing food position to snake body array
        score++; //increase score by 1

        highScore = score >= highScore ? score : highScore;
        localStorage.setItem("high-score", highScore);
        scoreElement.innerText = `Score: ${score} `;
        highScoreElement.innerText = `High-Score: ${highScore} `;
    }

    for (let i = snakeBody.length - 1; i > 0; i--) {
        //shifting forward the values of the elements in the snake body
        snakeBody[i] = snakeBody[i -1];
    }

    //setting first element of snake body to current snake position
    snakeBody[0] = [snakeX, snakeY]

    //update snake head position based on current velocity
    snakeX += velocityX;
    snakeY += velocityY;

//check if the snake's head is out of wall, if so setting gameover to true
    if(snakeX <= 0 || snakeX > 30 || snakeY <= 0 || snakeY > 30){
             gameOver = true;
    }

    for(let i = 0; i < snakeBody.length; i++){
        //adding a div for each part of the snake's body
    htmlMarkup += `<div class="head" style="grid-area: ${snakeBody[i][1]} / ${snakeBody[i][0]}"></div>`;

    //checking if the snake's head hit the body, if so gameover is true 
    if(i !== 0 && snakeBody[0][1] === snakeBody[i][1] && snakeBody[0][0] === snakeBody[i][0]){
        gameOver = true;
    }
    }
   
    playBoard.innerHTML = htmlMarkup;
}

changeFoodPosition();
 setIntervalId =  setInterval(initGame, 125) //Now the head will move after every 125 milliseconds. 125 is the speed of the snake
document.addEventListener("keydown", changeDirection);