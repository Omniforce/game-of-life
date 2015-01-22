$(function() {
	canvas = document.getElementById('canvas');
	context = canvas.getContext('2d');

	runnerID = 0;
	delay = 300; // ms
	cellSize = 10; // pixels

	resizeCanvas(); // Set canvas to correct size
	life = new Life(cellSize);

	updateView();

	// -------------------------------------------------------------------

	// BUTTON HANDLERS
	$("#run").click(function() {
		if(life.running) {
			clearInterval(runnerID);
			life.running = false;
			setButtonText($("#run"), "Run")
			$("#step").prop("disabled",false);
		} else {
			runnerID = window.setInterval(function(){
				life.tick();
				updateView();
			}, delay);
			life.running = true;
			setButtonText($("#run"), "Stop")
			$("#step").prop("disabled",true);
		}
	});
	$("#step").click(function() {
		life.tick();
		updateView();
	});
	$("#clear").click(function() {
		life.reset();
		updateView();
	});

	// CANVAS CLICK HANDLER
	$("#canvas").click(function(e) {
		addNewCellFromClick(e);
	});
});

Array.matrix = function(m, n, initial) {
	var a, i, j, mat = [];
	for(i = 0; i < m; i++) {
		a = [];
		for(j = 0; j < n; j++) {
			a[j] = initial;
		}
		mat[i] = a;
	}
	return mat;
}

// LOGIC
function Life(cellSize) {
	this.DEAD = 0;
	this.ALIVE = 1;
	this.running = false;

	this.minimum = 2; // Minimum number of alive neighboring cells to stay alive
	this.maximum = 3; // Maximum number of alive neighboring cells to stay alive
	this.spawn = 3;   // Number of alive neighboring cells to revive a dead cell

	this.CELLSIZE = cellSize;
	this.WIDTH = canvas.width / this.CELLSIZE;
	this.HEIGHT = canvas.height / this.CELLSIZE;

	this.grid = Array.matrix(this.HEIGHT, this.WIDTH, this.DEAD);
	this.counter = 0;
	this.aliveCount = 0;

	this.tick = function() {
		var neighborCount;
		var nextGrid = Array.matrix(this.HEIGHT, this.WIDTH, this.DEAD);
		var aliveCountTemp = 0; 

		for(y = 0; y < this.HEIGHT; y++) {
			for(x = 0; x < this.WIDTH; x++) {
				neighborCount = this.countNeighbors(y, x);
				if(this.grid[y][x] === this.ALIVE) {
					if(neighborCount >= this.minimum && neighborCount <= this.maximum) {
						nextGrid[y][x] = this.ALIVE;
						aliveCountTemp++;
					}
				} else {
					if(neighborCount === this.spawn) {
						nextGrid[y][x] = this.ALIVE;
						aliveCountTemp++;
					}
				}
			}
		}

		this.copyGrid(nextGrid, this.grid);
		this.aliveCount = aliveCountTemp;
		this.counter++;
	}

	this.countNeighbors = function(y, x) {
		var aliveNeighbors = (this.grid[y][x] === this.ALIVE) ? -1 : 0;
		for(var row = -1; row <= 1; row++) {
			for(var col = -1; col <= 1; col++) {
				var cell;
				try {
					if(this.grid[y + row][x + col] === this.ALIVE) { aliveNeighbors++; }	
				} catch(err) {}
			}
		}
		return aliveNeighbors;
	}

	this.copyGrid = function(source, destination) {
		for(var row = 0; row <= this.HEIGHT; row++) {
			destination[row] = source[row].slice(0);
		}
	}

	this.reset = function() {
		this.grid = Array.matrix(this.HEIGHT, this.WIDTH, this.DEAD);
		this.counter = 0;
		this.aliveCount = 0;
	}
}

// DRAWING
function resizeCanvas() {
	canvas.width = $('#world').width();
	canvas.height = 400;

	drawGrid();
}

function updateView() {
	context.clearRect(0, 0, canvas.width, canvas.height);
	drawGrid();
	updateGrid();
	updateCounters();
}

function drawGrid() {
	var width = canvas.width;
	var height = canvas.height;

	for(var x = 0; x < canvas.width; x+= cellSize) {
		drawLine(x, 0, x, height);
	}
	for(var y = 0; y < canvas.height; y+= cellSize) {
		drawLine(0, y, width, y);
	}
}

function updateGrid() {
	for(var row = 0; row < life.HEIGHT; row++) {
		for(var col = 0; col < life.WIDTH; col++) {
			if(life.grid[row][col] === life.ALIVE) {
				drawBlock(row, col);
			}
		}
	}
}

function updateCounters() {
	var genNumber = $('#genNumber');
	var liveNumber = $('#liveNumber');

	genNumber.text(life.counter);
	liveNumber.text(life.aliveCount);
}

function drawLine(startX, startY, endX, endY) {
	context.beginPath();
	context.moveTo(startX, startY);
	context.lineTo(endX, endY);
	context.strokeStyle = '#d3d3d3';
	context.stroke();
}

function drawBlock(y, x) {
	context.beginPath();
	context.rect(x * cellSize, y * cellSize, cellSize, cellSize);
	context.fillStyle = '#000';
	context.fill();
	context.stroke();
}

// CLICK LOCATION LOGIC

function relMouseCoords(event){
    var totalOffsetX = 0;
    var totalOffsetY = 0;
    var canvasX = 0;
    var canvasY = 0;
    var currentElement = this;

    do{
        totalOffsetX += currentElement.offsetLeft - currentElement.scrollLeft;
        totalOffsetY += currentElement.offsetTop - currentElement.scrollTop;
    }
    while(currentElement = currentElement.offsetParent)

    canvasX = event.pageX - totalOffsetX;
    canvasY = event.pageY - totalOffsetY;

    return {x:canvasX, y:canvasY}
}
HTMLCanvasElement.prototype.relMouseCoords = relMouseCoords;

function addNewCellFromClick(event) {
	var coords = canvas.relMouseCoords(event);
	var cellX = Math.floor(coords.x / cellSize);
	var cellY = Math.floor(coords.y / cellSize);
	var status = life.grid[cellX][cellY];

	console.log(cellY, cellX, status);

	if(status) {
		life.grid[cellY][cellX] = life.DEAD;
		life.aliveCount -= 1;
	} else {
		life.grid[cellY][cellX] = life.ALIVE;
		life.aliveCount += 1;
	}
	updateView();
}

// MISC
function setButtonText($button, text) {
	$button.text(text);
}