
// ideas
// user dies when running into self
// user scores 100pts after each meal
// user scores -5pts after each keypress
// food moves to a new location after meal
// all food moves to new locations after meal
// bad food shrinks snake && -50 ponts
// once snake eats first meal, if score goes negative, they lose
// meal worth bonus points if it's touching an edge ("touching")
// add hole in canvas to make game harder (level 2?)
// self leaderboard for each game
// sound effects
// increase or decrease food in each level
// meals move after too many turns
// save rankings history to local storage and relaod each time page refreshes
// add more levels (figure out math to make level incrimenting dynamic, maybe only change variables when certain levels are acheived)
// add enemies (enemies could move each frame or each keystorke)

let arrow = ""
let snakeCanvasHeight = 100 // px
let snakeCanvasWidth = 100  // px
let speed = 500 // ms
let snakeCanvas = document.getElementById('snakeCanvas');
let ctx = snakeCanvas.getContext('2d');
let snakeDirection = "r"; // r,l,u,d
let snakeI = 8;
let userFeedback = document.getElementById('user_feedback')
let newSnakeSegment = []
let gameOn = 1
let snake = [[16,16],[24,16],[32,16],[40,16]];
let snakeFood = [] 
let snakeFoodItem = [] 
let snakeFoodCount = 4
let mealHealth = 25
let mealScore = 20
let arrowHealth = -5
let enemyHealth = -50
let enemies = []
let enemy = []
let enemyCount = 0 
let enemyInterval = 10000
let defaultHealth = 100
let health = 100
let userScore = 0
let startTime = new Date();
let level = 1
//let div =""
let keyPressed =0


let scoreKeeper = (event) => {
	switch(event) {
		case "arrow":
			if(gameOn){health += arrowHealth;}
			break;
		case "meal":
			if(gameOn){health += mealHealth;}
			userScore += mealScore;
			break;
		case "enemy":
			if(gameOn){health += enemyHealth;}
			break;
		default:
	}
	if (health > defaultHealth) {health = defaultHealth}
		updatePageById('snake_health',health,false);
		updatePageById('user_score',userScore,false);
	if (userScore > level*100) {
		snakeCanvasWidth = snakeCanvasWidth *1.2
		snakeCanvasHeight = snakeCanvasHeight *1.2
		level += 1
		mealHealth -= 4
		arrowHealth -= 1
		updatePageById('user_feedback',`Level Up! You're on level ${level}`,false)
		updatePageById('user_level',level,false)
		buildSnakeCanvas();
		enemyCount = level
		enemyRefresh();
	}
	if (level > 2) {
		speed = 400
	}
	// if ( something to make snake go faster)
}


let randomCoordinate = () => {
		let cordX = Math.floor(Math.random()*snakeCanvasWidth/10 + 1)*snakeI
		let cordY = Math.floor(Math.random()*snakeCanvasHeight/10 +1)*snakeI
		let randCord = [cordX,cordY];
		return randCord
		
}

let createFood = (isNew) => {
	while (snakeFood.length < snakeFoodCount) {
		snakeFood.push(randomCoordinate())
		//console.log(snakeFood)
	}
}

let createEnemies = () => {
	enemies = []
	while (enemies.length < enemyCount) {
		enemies.push(randomCoordinate())
	}
}

let drawEnemies = () => {
		enemies.forEach((enemy) =>{
		let enemyX = enemy[0];
		let enemyY = enemy[1];
		ctx.beginPath();
		ctx.arc(enemyX, enemyY,2,0,2*Math.PI);
		ctx.fillStyle ="purple";
		//enemies[index].style.border="black"
		ctx.fill();
		
	})
}

createFood();

let buildSnakeCanvas = (ctx) => {
	snakeCanvas.setAttribute('height', snakeCanvasHeight);
	snakeCanvas.setAttribute('width', snakeCanvasWidth);
	snakeCanvas.style.backgroundColor = '#f4f4f4';
	//snakeCanvas.style.border = '1px solid grey';
	// ctx.moveTo(snakeCanvasWidth, 0);
	// ctx.lineTo(snakeCanvasWidth, snakeCanvasHeight)
	// ctx.strokeStyle = "green"
	// ctx.stroke()
	// ctx.save()
	
}
buildSnakeCanvas();

let drawFood = () => {
	snakeFood.forEach((meal, index) => {
		let mealX = snakeFood[index][0];
		let mealY = snakeFood[index][1];
		ctx.beginPath();
		ctx.arc(mealX, mealY,2,0,2*Math.PI);
		ctx.fillStyle ="green";
		ctx.fill();		
	})
}

let editSnake = () => {
	snakeFood.forEach((meal,index) => {
		if(meal.toString() === snake[snake.length -1].toString()) {
			updatePageById('user_feedback',`A meal, Yum!  +${mealHealth} Health`,true);
			createSnakeSegment(true)
			snakeFood[index] = randomCoordinate()
			scoreKeeper('meal');
		}
	})
}


let createSnakeSegment = (grow) => {
	if(gameOn){
		switch(snakeDirection) {
				case "r": 
					var newSnakeX = snake[snake.length -1][0] + snakeI
					var newSnakeY = snake[snake.length -1][1]
					newSnakeSegment = [newSnakeX,newSnakeY]
					snake.push(newSnakeSegment)
					if(!grow) {snake.shift()}			
					break;
				case "l":
					var newSnakeX = snake[snake.length -1][0] - snakeI
					var newSnakeY = snake[snake.length -1][1]
					newSnakeSegment = [newSnakeX,newSnakeY]
					snake.push(newSnakeSegment)
					if(!grow) {snake.shift()}					
					break;
				case "u":
					var newSnakeX = snake[snake.length -1][0]
					var newSnakeY = snake[snake.length -1][1] - snakeI
					newSnakeSegment = [newSnakeX,newSnakeY]
					snake.push(newSnakeSegment)
					if(!grow) {snake.shift()}
					break;
				case "d":
					var newSnakeX = snake[snake.length -1][0]
					var newSnakeY = snake[snake.length -1][1] + snakeI
					newSnakeSegment = [newSnakeX,newSnakeY]
					snake.push(newSnakeSegment)
					if(!grow) {snake.shift()}
					break;
		
				}
				drawSnake(false)
			}
		grow =""
}

let drawSnake = (createSegment) => {
	ctx.clearRect(0, 0, snakeCanvasWidth, snakeCanvasHeight)
	ctx.restore()
	drawFood();
	if(enemyCount > 0){drawEnemies();}
	snake.forEach((segment, index) => {
		let segmentX = snake[index][0];
		let segmentY = snake[index][1];
		ctx.beginPath();
		ctx.arc(segmentX, segmentY,2,0,4*Math.PI);
		//ctx.stroke();
		ctx.fillStyle = "red";
		ctx.fill();
		})
		if(createSegment){
			createSnakeSegment()
			keyPressed = 1
		};
		
			
	}

window.addEventListener('keyup', event => {
	let arrow = event.keyCode;
	switch(arrow) {
		case 38:
			snakeDirection = "u"
			scoreKeeper('arrow');
			break;
		case 40:
			snakeDirection = "d"
			scoreKeeper('arrow');
			break;
		case 37:
			snakeDirection = "l"
			scoreKeeper('arrow');
			break;
		case 39:
			snakeDirection = "r"
			scoreKeeper('arrow');
			break;
		case 32:
			reloadPage()
			break;
	}
	
	drawSnake(true);
	keyPressed=1
})

let deathCheck = () => {
		let headX = snake[snake.length -1][0]
		let headY = snake[snake.length -1][1]
	if(headX >= snakeCanvasWidth || headX <= 0 || headY >= snakeCanvasHeight || headY <= 0) {
		gameOver("Game Over - You hit a wall!")
	}


	// health should never be less than zero
	if (health <= 0) {
		health = 0;
		gameOver('Game Over - You starved!')
	}

	// snake dies if it goes on top of self
	snake.forEach((segment, index) => {
		if (index < snake.length - 2) {
			if(headX === segment[0] && headY === segment[1]) {
				gameOver("Game Over - You ate yourself!")
			}
		}
	})

	enemies.forEach((enemy) => {
		if(headX === enemy[0] && headY === enemy[1]) {
			gameOver("Game Over - You hit an enemy!")
		} 
	})
}

let gameOver = (content) => {
	updatePageById('user_feedback',content,false);
	updatePageById('retry','Retry! (spacebar)',false);
	updatePageById('snake_health',health,false)
	gameOn = 0;
}

// types: primary, secondary, success, danger, warning, info, light, dark
let bootStrap = (pageElementId,content, type) => {
		let div = document.createElement('div')
			div.setAttribute('class',`alert alert-${type}`)
			div.setAttribute('role','alert')
			div.innerHTML = content
			console.log(div)
			updatePageById(pageElementId,div,false)

	}

let updatePageById = (pageElementId, content, timeout) => {
	let pageElement = document.getElementById(pageElementId)
	pageElement.innerHTML = content
	if (timeout === true) {
		setTimeout(function(){userFeedback.innerHTML = ""}, 3000)
		}
	}

	//bootStrap('alert_container','yay an alert', 'success')
	

let elapsedTime = () => {
		let currentTime = new Date()
		let elapsedTime = Math.floor((currentTime - startTime)/1000);
		let userTime = `${elapsedTime} sec`
		setTimeout(function(){
			updatePageById('user_time',userTime,false),1000
		})
	}

function timeOut(){
	setTimeout(function() {
	editSnake();	
	deathCheck();
	elapsedTime();
	if(keyPressed === 0){
		drawSnake(true);}
	keyPressed=0
	if (gameOn) {timeOut()};
	}, speed);
};

function enemyRefresh(){
	setTimeout(function() {
		if(gameOn && enemyCount > 0) {
			createEnemies()
			drawEnemies()
			enemyRefresh()
		}
			
	}, enemyInterval)
}


let reloadPage = () => {
	window.location.reload();
}



timeOut();