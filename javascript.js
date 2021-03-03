var characterPosition = {
	top: 60,
	left: 70,
	direction: 1,
};
var upgradePosition = {
	top: 0,
	left: 0,
};


var characterSize = 10;
var playingSize = 500;
var playing = false;
var points = 0;
var totalWalls = 0;
var maxWalls = 100;
var walls = [];
var playingInterval = 60;
var enemies = [];
var numberOfEnemies = 0;
var timeToMove = 0;
var gameOver = false;
var timer;
var easterTimer;

function theresAWallThere(x, y)
{
	for (var i = walls.length - 1; i >= 0; i--) {
		if (walls[i].top == y && walls[i].left == x)
			return true;
	}
	return false;
}

function canMove(top, left, direction, enemy)
{
	var nextTop = top;
	var nextLeft = left;
	if (direction == 1)
		nextTop = nextTop - characterSize;
	else if (direction == 2)
		nextLeft = nextLeft + characterSize;
	else if (direction == 3)
		nextTop = nextTop + characterSize;
	else
		nextLeft = nextLeft - characterSize;
	//we have determined the next position, lets check if it is valid.
	if ((nextTop >= characterSize && nextTop <= playingSize) && (nextLeft >= characterSize && nextLeft <= playingSize))
	{
		//it is successfully in the board, and good to go.
		if (theresAWallThere(nextLeft, nextTop))
		{
			return false;
		}
		else
		{
			if (enemy)
			{
				for (var i = enemies.length - 1; i >= 0; i--) {
					if (enemies[i].top == nextTop && enemies[i].left == nextLeft)
					{
						return false;
						break;
					}
				}
			}
			return true;
		}
	}
	else
	{
		return false;
	}
}
function getRandomFour(previousDirection)
{
	var sucess = false;
	var solution;
	while (sucess == false)
	{
		sucess = true;
		solution =  Math.floor(Math.random() * 4);
		if(previousDirection == 1 && solution == 3)
		{
			sucess = false;
		}
		else if (previousDirection == 3 && solution == 1)
		{
			sucess = false;
		}
		else if (previousDirection == 4 && solution == 2)
		{
			sucess = false;
		}
		else if (previousDirection == 2 && solution == 4)
		{
			sucess = false;
		}
	}
	return solution
		
}
function createAWall(topx, leftx, previousDirection)
{
	if ((topx >= characterSize && topx <= playingSize) && (leftx >= characterSize && leftx <= playingSize))
	{
		if (theresAWallThere(topx, leftx) == false)
		{
			if (totalWalls < maxWalls)
			{
				var div = document.createElement("div");
				div.className = "wall";
				div.style.top = topx + "px";
				div.style.left = leftx + "px";
				div.id = "wall"+totalWalls;
				document.getElementById("playingField").appendChild(div);

				var wall = {
					top: topx,
					left: leftx,
					wallId: "wall"+totalWalls,
				}
				walls.push(wall);
				totalWalls++;



				//The higher the list of possible numbers, the more likely the if statement will be called.
				var random = Math.floor(Math.random() * 30);
				if (random != 0)
				{
					//then lets add another wall!
					var continueOnPath = Math.floor(Math.random() * 3);
					var random2 = 0;
					if (continueOnPath != 0 && previousDirection != 0)
					{
						random2 = previousDirection;
					}
					else{
						random2 = getRandomFour(previousDirection)
					}

					if (random2 == 1)
						createAWall(topx - characterSize, leftx, 1);
					else if (random2 == 2)
						createAWall(topx, leftx + characterSize, 2);
					else if (random2 == 3)
						createAWall(topx + characterSize, leftx, 3);
					else if (random2 == 4)
						createAWall(topx, leftx - characterSize, 4);
				}
			}
		}
	}

}
function checkIfTouchedUpgrade()
{
	if (characterPosition.top == upgradePosition.top && characterPosition.left == upgradePosition.left)
	{
		//got it!
		points++;
		document.getElementById("points").innerHTML = "Points: " + points;
		createEnemy();
		createUpgrade();
	}
	enemies.forEach(function(enemy)
	{
		if (characterPosition.top == enemy.top && characterPosition.left == enemy.left)
		{
			playing = false;
			gameOver = true;

			//set previousHighscore to: "Highscore: XX";
			var previousHighscore = document.getElementById("highScore").innerHTML;
			//remove all non-digits so previousHighscore = "34";
			var previousHighscore = previousHighscore.replace( /^\D+/g, '');
			if (previousHighscore < points || !previousHighscore)
			{
				//The game we just had was better than the highscore!!
				var div = document.getElementById("highScore");
				div.innerHTML = "Highscore: " + points + "\n\nPress Space to save.";
				div.style.color = "#E82C0C";
			}
			document.getElementById("selector").style.visibility='visible'
			document.getElementById("points").innerHTML = "GAME OVER Points: " + points;
			clearInterval(timer);
		}
	})
}
function createWalls()
{
	var x = characterSize, y = characterSize;
	while (y < playingSize)
	{
		if (x < playingSize)
		{
			var random = Math.floor(Math.random() * 150);
			if (random == 15)
			{
				createAWall(x, y, 0);
				if (totalWalls == maxWalls)
				{
					break;
				}
			}
			x = x + characterSize;
		}
		else {
			y = y + characterSize;
			x = characterSize;
		}
		
	}
}
function actuallyMove(character, enemy)
{
	if (canMove(character.top, character.left, character.direction, enemy))
	{
		if (character.direction == 1)
			character.top = character.top - characterSize;
		else if (character.direction == 2)
			character.left = character.left + characterSize;
		else if (character.direction == 3)
			character.top = character.top + characterSize;
		else
			character.left = character.left - characterSize;
	}
}

function move()
{
	if (playing == true)
	{
		actuallyMove(characterPosition, false);
		if (timeToMove != 2)
		{
			adjustEnemiesDirection();
			enemies.forEach(function(enemy)
			{
				actuallyMove(enemy, true);
			});
			timeToMove++;
		}
		else {
			timeToMove = 0;
		}
		checkIfTouchedUpgrade();
		draw();
	}
}
function createUpgrade()
{
	//we need to edit these random functions so that the upgrade is always on a mulitple of 10. Currently it can go anywhere. 
	var randomX = Math.floor(Math.random() * (playingSize - characterSize) + characterSize); 
	var randomY = Math.floor(Math.random() * (playingSize - characterSize) + characterSize);

	randomX = Math.ceil(randomX / characterSize) * characterSize;
	randomY = Math.ceil(randomY / characterSize) * characterSize;
	if (!theresAWallThere(randomX, randomY))
	{
		upgradePosition.top = randomY;
		upgradePosition.left = randomX;
		if (randomX == 350)
		{
			document.getElementById("playingField").className = "playingField-black"
			walls.forEach(function(theWall)
			{
				document.getElementById(theWall.wallId).className = "wall-white";
			});
			easterTimer = window.setTimeout(resetEaster, 30000);
		}
	}
	else {
		createUpgrade();
	}
}
function resetEaster()
{
	document.getElementById("playingField").className = "playingField"
	walls.forEach(function(theWall)
	{
		document.getElementById(theWall.wallId).className = "wall";
	});
}
function adjustEnemiesDirection()
{
	enemies.forEach(function(enemy)
	{
		if (characterPosition.top < enemy.top)
		{
			enemy.direction = 1;
		}
		else if (characterPosition.top > enemy.top)
		{
			enemy.direction = 3;
		}

		var verticalDirection = enemy.direction;
		var canMoveVertical = canMove(enemy.top, enemy.left, enemy.direction, true);

		if (characterPosition.left < enemy.left)
		{
			enemy.direction = 4;
		}
		else if (characterPosition.left > enemy.left)
		{
			enemy.direction = 2;
		}

		var horizontalDirection = enemy.direction;
		var canMoveHorizontal = canMove(enemy.top, enemy.left, enemy.direction, true);

		if (canMoveHorizontal && canMoveVertical)
		{
			var horizontalDistance = characterPosition.left - enemy.left;
			horizontalDistance = (horizontalDistance > 0 ? horizontalDistance : horizontalDistance * -1);

			var verticalDistance = characterPosition.top - enemy.top;
			verticalDistance = (verticalDistance > 0 ? verticalDistance : verticalDistance * -1);
				
			if (verticalDistance > horizontalDistance)
			{
				enemy.direction = verticalDirection
			}
			else if (verticalDistance < horizontalDistance) {
				enemy.direction = horizontalDirection;
			}
		}
		else if (canMoveHorizontal)
		{
			enemy.direction = horizontalDirection;
		}
		else if (canMoveVertical)
		{
			enemy.direction = verticalDirection;
		}


	});
}

function draw()
{
	var player = document.getElementById("player");
	player.style.top = characterPosition.top + "px";
	player.style.left = characterPosition.left + "px";

	var upgrade = document.getElementById("upgrade");
	upgrade.style.top = upgradePosition.top + "px";
	upgrade.style.left = upgradePosition.left + "px";

	enemies.forEach(function(enemy)
	{
		var nextEnemy = document.getElementById(enemy.enemyId);
		nextEnemy.style.top = enemy.top + "px";
		nextEnemy.style.left = enemy.left + "px";
	});
}

document.addEventListener('keydown', function(event) {
	if(event.keyCode == 37) {
	    //alert('Left was pressed');
	    characterPosition.direction = 4;
	}
	else if (event.keyCode == 38)
	{
		//up was pressed
		characterPosition.direction = 1;
	}
	else if(event.keyCode == 39) {
	    //alert('Right was pressed');
	    characterPosition.direction = 2;
	}
	else if (event.keyCode == 40) {
		//down was pressed.
		characterPosition.direction = 3;
	}
	else if (event.keyCode == 32)
	{
		//spaceBarwasPressed
		if (playing == false && gameOver == false)
		{
			start();
		}
		else if (playing == true && gameOver == false) 
		{
			playing = false;
			clearInterval(timer);
		}
		else if (gameOver == true)
		{
			var url = "/store.php?points=" + points + "&walls=" + walls.length;
			window.location.replace(url);
		}
	}
});
function createEnemy()
{	
	var enemyLeft = playingSize - characterSize;
	var enemyTop = playingSize - characterSize;


	var noGoZone = playingSize - (characterSize * 10);
	// the noGoZone is the area where Enemies normally spawn. If the player is in that zone, then don't spawn then enemy right on top of himm.
	if (characterPosition.top >= noGoZone && characterPosition.left >= noGoZone)
	{
		enemyTop = characterSize * 2;
		enemyLeft = playingSize - characterSize;
	}

	var Enemy = {
		top: enemyTop,
		left: enemyLeft,
		direction: 1,
		enemyId: numberOfEnemies++,
	}
	enemies.push(Enemy);

	var div = document.createElement("div");
	div.className = "enemy";
	div.style.top = Enemy.top;
	div.style.left = Enemy.left;
	div.id = Enemy.enemyId;
	document.getElementById("playingField").appendChild(div);
}
function moveInCharacter()
{
	var randomX = Math.floor(Math.random() * (playingSize / 4 - characterSize) + characterSize); 
	var randomY = Math.floor(Math.random() * (playingSize / 4 - characterSize) + characterSize);

	randomX = Math.ceil(randomX / characterSize) * characterSize;
	randomY = Math.ceil(randomY / characterSize) * characterSize;
	if (!theresAWallThere(randomX, randomY))
	{
		characterPosition.top = randomY;
		characterPosition.left = randomX;
	}
	else {
		moveInCharacter();
	}
}
function roundOffWalls()
{
	walls.forEach(function(wall)
	{
		var ourWall = document.getElementById(wall.wallId);

		var wallLeft = !theresAWallThere(wall.left - characterSize, wall.top);
		var wallTop = !theresAWallThere(wall.left, wall.top - characterSize);
		var wallRight = !theresAWallThere(wall.left + characterSize, wall.top);
		var wallDown = !theresAWallThere(wall.left, wall.top + characterSize);

		if (wallLeft && wallTop)
		{
			ourWall.style.borderTopLeftRadius = (characterSize / 2) + "px";
		}
		if (wallTop && wallRight)
		{
			ourWall.style.borderTopRightRadius = (characterSize / 2) + "px";
		}
		if (wallRight && wallDown)
		{
			ourWall.style.borderBottomRightRadius = (characterSize / 2) + "px";
		}
		if (wallDown && wallLeft)
		{
			ourWall.style.borderBottomLeftRadius = (characterSize / 2) + "px";
		}
	});
}
function changeDifficulty()
{
	var select = document.getElementById("selector");
	if(select.selectedIndex == 0) //easy
	{
		playingInterval = 80;
	}
	else if(select.selectedIndex == 1) // medium
	{
		playingInterval = 60;
	}
	else if(select.selectedIndex == 2) // Nancy Drew
	{
		playingInterval = 40;
	}
}
function start()
{
	playing = true;
	document.getElementById("selector").style.visibility='hidden'
	timer = window.setInterval(move, playingInterval);
}
createWalls();
roundOffWalls();
createUpgrade();
moveInCharacter();
createEnemy();
draw();


/*

Direction: 

	    1
	 4	   2
	    3



	    Functions for implementing Trees!

function Node(data)
{
	this.data = data;
	this.children = [];
}

function Tree(data)
{
	var node = new Node(data);
	this.root = node;
}

Tree.prototype.add = function(data, parent)
{
	if (parent.data > data)
	{
		if(parent.children[0]){
			this.add(data, parent.children[0]);
		}
		else
		{
			parent.children[0] = new Node(data);
		}
	}
	else if (parent.data < data)
	{
		if(parent.children[1]){
			this.add(data, parent.children[1]);
		}
		else
		{
			parent.children[1] = new Node(data);
		}
	}
};

Tree.prototype.search = function(data,parent)
{
	console.log("enter");
	console.log("Searching for: " + data + " Parent " + (parent ? true : false));
	if (parent.data > data)
	{
		if(parent.children[0]){
			this.search(data, parent.children[0]);
		}
		else
		{
			return false;
		}
	}
	else if (parent.data < data)
	{
		console.log("She's bigger");
		if(parent.children[1]){
			this.search(data, parent.children[1]);
		}
		else
		{
			return false;
		}
	}
	else{
		console.log(parent.data);
		return true;
	}
};


Searching doesn't work, but everything else does.

var myTree = new Tree(4);
myTree.add(5, myTree.root);
myTree.add(2, myTree.root);
myTree.add(3, myTree.root);
myTree.add(1, myTree.root);
myTree.add(6, myTree.root);
myTree.add(7, myTree.root);

console.log(myTree);
var output = myTree.search(5, myTree.root);
console.log(output);

*/