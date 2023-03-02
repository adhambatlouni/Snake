window.requestAnimationFrame = window.requestAnimationFrame ||
    window.mozRequestAnimationFrame ||
    window.webkitRequestAnimationFrame ||
    window.msRequestAnimationFrame ||
    function (f) {
        return setTimeout(f, 1000 / 60)
    }

let keysPress = {};

let direction;
let move;


addEventListener('keydown', function (e) {
    //console.log(e);
    keysPress[e.keyCode] = true;
}, false);

this.document.addEventListener("keydown", snakeMovement);

function snakeMovement(e) {

    if (e.keyCode == 37) {
        direction = "left";
    } else if (e.keyCode == 38) {
        direction = "up";
    } else if (e.keyCode == 39) {
        direction = "right";
    } else if (e.keyCode == 40) {
        direction = "down";
    } else if (e.keyCode == 80) {
        move = "pause";
    } else if (e.keyCode == 13) {
        move = "continue";
    }
}

class Game {

    constructor(snake, move) {
        this.canvas = document.getElementById("myCanvas");
        this.ctx = this.canvas.getContext("2d");
        this.sprites = [];
        this.lives = [];
        this.snake = snake;
        this.move = move;
        this.won = false;
        this.lost = false;
        this.gameStory = true;
        this.win = new Audio("sounds/win.wav");
        this.lose = new Audio("sounds/lose.wav");

        this.bgReady = false;
        this.bgImage = new Image();
        this.bgImage.onload = () => {
            this.bgReady = true;
        };

        this.bgImage.src = 'images/bg2.png';
        this.bgWidth = this.canvas.width;
        this.bgHeight = this.canvas.height;

        this.livesReady = false;
        this.livesImage = new Image();
        this.livesImage.onload = () => {
            this.livesReady = true;
        };

        this.livesImage.src = 'images/lives.png';
        this.livesWidth = 20;
        this.livesHeight = 20;

        for (var i = 0; i < 3; i++) {
            this.lives[i] = {
                x: 0,
                livesFound: 1
            };
        }

    }

    update() {
        this.snake = snake;
        this.move = move;
        let lSpritesLength = this.sprites.length;
        let canvas = this.canvas;
        for (let i = 0; i < lSpritesLength; i++)
            if (this.move == "continue")
                this.sprites[i].update(this.canvas);

        if (this.move == "continue") {
            this.gameStory = false;
            this.won = false;
            this.lost = false;
        }
        if (this.snake.loses == 3) {
            this.snake.pX = 27;
            this.snake.pY = 81;
            this.snake.score = 0;
            this.snake.loses = 0;
            this.lost = true;
            this.lose.play();
            move = "pause";

            for (let i = 0; i < 3; i++) {
                this.lives[i].livesFound = 1;
            }
        }
        if (this.snake.score == 3) {
            this.snake.pX = 27;
            this.snake.pY = 81;
            this.snake.score = 0;
            this.won = true;
            this.win.play();
            move = "pause";

            for (let i = 0; i < 3; i++) {
                this.lives[i].livesFound = 1;
            }
        }      
    }

    addSprites(pSprites) {
        this.sprites.push(pSprites);
    }

    draw(ctx) {
        if (this.bgReady) {
            this.ctx.beginPath();
            this.ctx.drawImage(this.bgImage, 0, 0);
        }

        for (var i = 0; i < 3; i++) {
            if (this.lives[i].livesFound == 1 && this.livesReady) {
                this.lX = this.canvas.width - 110 + i * 33;
                this.lives[i].x = this.lX;
                this.ctx.drawImage(this.livesImage, this.lX, 20);
            }
        }

        let lSpritesLength = this.sprites.length;
        for (let i = 0; i < lSpritesLength; i++)
            this.sprites[i].draw(this.ctx);

        this.drawScore(this.snake.score);

        if (this.gameStory) {
            this.drawGameStory();
        }

        if (this.won) {
            this.drawGameWon();
        }

        if (this.lost) {
            this.drawGameLost();
        }
    }

    drawGameStory() {
        this.ctx.fillStyle = "rgb(255, 250, 250)";
        this.ctx.textAlign = "center";
        this.ctx.font = "30px Pretendo";
        this.ctx.fillText('Let us follow the right path', this.canvas.width / 2, 200);
        this.ctx.fillText('to help the snake reach its food', this.canvas.width / 2, 250);
        this.ctx.fillText('so it can grow faster and faster!', this.canvas.width / 2, 300);
        this.ctx.font = "25px Pretendo";
        this.ctx.fillText('Press Enter to start the game.', this.canvas.width / 2, 400);
    }

    drawScore() {
        this.ctx.fillStyle = "rgb(250, 250, 250)";
        this.ctx.textAlign = "left";
        this.ctx.textBaseline = "top";
        this.ctx.font = "42px Pretendo";
        this.ctx.fillText(this.snake.score, 30, 18);
    }

    drawGameWon() {
        this.ctx.fillStyle = "rgb(250, 250, 250)";
        this.ctx.textAlign = "center";
        this.ctx.font = "70px Pretendo";
        this.ctx.fillText('You Won!', this.canvas.width / 2, this.canvas.height / 2);
        this.ctx.font = "25px Pretendo";
        this.ctx.fillText('Press enter to continue.', this.canvas.width / 2, this.canvas.height / 2 + 100);
    }

    drawGameLost() {
        this.ctx.fillStyle = "rgb(250, 250, 250)";
        this.ctx.textAlign = "center";
        this.ctx.font = "70px Pretendo";
        this.ctx.fillText('Game Over!', this.canvas.width / 2, this.canvas.height / 2);
        this.ctx.font = "25px Pretendo";
        this.ctx.fillText('Press enter to continue.', this.canvas.width / 2, this.canvas.height / 2 + 100);
    }
}

class Sprite {
    constructor() {}
    update() {}
    draw(pCtx) {}
}

class Snake extends Sprite {

    constructor(carrot, pX, pY, direction, move, myGame) {
        super();
        this.carrot = carrot;
        this.myGame = myGame;
        this.width = 27;
        this.height = 27;
        this.pX = pX;
        this.pY = pY;
        this.color = '#fff';
        this.dx = 0;
        this.dy = 0;
        this.score = 0;
        this.counter = 80;
        this.jump = new Audio("sounds/jump.wav");
        this.bonus = new Audio("sounds/bonus.wav");

        this.loses = 0;
        this.direction = direction;
        this.move = move;    
        this.snakeBody = [];
        this.tailLength = 2;
        this.add = false;
    }

    update() {
        this.direction = direction;
        this.move = move;
        this.counter++;
        this.pX += this.dx;
        this.pY += this.dy;

        if (this.pY % 27 == 0 && this.pX % 27 == 0) {

            if (this.direction == "left") {
                this.dx = -0.5;
                this.dy = 0;

                if (this.counter >= 70) {
                    this.jump.play();
                    this.counter = 0;
                }
            } else if (this.direction == "right") {
                this.dx = 0.5;
                this.dy = 0;

                if (this.counter >= 70) {
                    this.jump.play();
                    this.counter = 0;
                }
            } else if (this.direction == "up") {
                this.dy = -0.5;
                this.dx = 0;

                if (this.counter >= 70) {
                    this.jump.play();
                    this.counter = 0;
                }
            } else if (this.direction == "down") {
                this.dy = 0.5;
                this.dx = 0;
                 
                if (this.counter >= 70) {
                    this.jump.play();
                    this.counter = 0;
                }
            }
        }
      

        if (this.pX == this.carrot.cX &&
             this.pY == this.carrot.cY) {

            this.score++;
            this.bonus.play();
            this.carrot.reset();
            this.tailLength++;
            this.add = true;
        }    

        if(this.add) {
            this.snakeBody.push(new SnakeTail(this.pX, this.pY));
            this.add = false;
        }
  
        if (this.pX < 27 || this.pX > 460 || this.pY < 81 || this.pY > 460) {
            if (this.loses < 3) {
                this.myGame.lives[this.loses].livesFound = 0;
                this.loses++;
                move = "pause";
                this.reset();
            }
        }    
    }

    reset() {
        this.pX = Math.round((Math.random() * (460 - 27)) + 27);
        this.pY = Math.round((Math.random() * (400 - 81)) + 81);

        while (this.pX % 27 != 0) {
            this.pX -= 1;
        }

        while (this.pY % 81 != 0) {
            this.pY -= 1;
        }

    }

    draw(ctx) {
        ctx.fillStyle = this.color;
        ctx.fillRect(this.pX, this.pY, this.width, this.height);
        
        for (let i = 0;i < this.snakeBody.length; i++) {
            let part = this.snakeBody[i];
            ctx.fillRect(part.x, part.y, 27, 27);
            part.x = this.pX;
            part.y = this.pY;
        } 
    }    
}   

class Carrot extends Sprite {

    constructor(canvas) {
        super();
        this.canvas = canvas;
        this.cX = Math.round((Math.random() * (460 - 27)) + 27);
        this.cY = Math.round((Math.random() * (400 - 81)) + 81);

        while (this.cX % 27 != 0) {
            this.cX -= 1;
        }

        while (this.cY % 81 != 0) {
            this.cY -= 1;
        }

        this.carrotImage = new Image();
        this.carrotReady = false;
        this.carrotImage.onload = () => {
            this.carrotReady = true;
        };
        this.carrotImage.src = "images/carrot.png";

        this.width = 22;
        this.height = 22;
    }

    reset() {
        this.cX = Math.round((Math.random() * (460 - 27)) + 27);
        this.cY = Math.round((Math.random() * (400 - 81)) + 81);

        while (this.cX % 27 != 0) {
            this.cX -= 1;
        }

        while (this.cY % 81 != 0) {
            this.cY -= 1;
        }
    }

    update() {}

    draw(ctx) {
        if (this.carrotReady) {
            ctx.beginPath();
            ctx.drawImage(this.carrotImage, this.cX, this.cY, this.width, this.height);
        }
    }
}

class SnakeTail extends Sprite {

    constructor(x, y) {
        super();
        this.x = x;
        this.y = y;
    }

    update() {
    }

    draw(ctx) {

    }
}

let myGame = new Game(move);
let carrot = new Carrot(myGame.canvas);
let snake = new Snake(carrot, 27, 81, direction, move, myGame);

myGame.addSprites(snake);
myGame.addSprites(carrot);

function animate() {
    let now = Date.now();
    let delta = now - then;

    myGame.update(delta / 1000);
    myGame.draw();
    requestAnimationFrame(animate);

    then = now;
}

let then = Date.now();
animate();