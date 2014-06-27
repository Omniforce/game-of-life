$(function() {
	canvas = document.getElementById('canvas');
	context = canvas.getContext('2d');
	resizeCanvas(); // Set canvas to correct size

	cellSize = 5;
    life = new Life(500, cellSize);

    updateGrid();
});

Array.matrix = function (m, n, initial) {
	var a, i, j, mat = [];
	for (i = 0; i < m; i += 1) {
		a = [];
		for (j = 0; j < n; j += 1) {
			a[j] = 0;
		}
		mat[i] = a;
	}
	return mat;
};

// GAME OF LIFE LOGIC
function Life(delay, cellsize) {
	this.CELLSIZE = cellsize; // size of cell in pixels
	this.x = canvas.width;
	this.y = canvas.height;
	this.WIDTH = this.x / this.CELLSIZE; // number of cells
	this.HEIGHT = this.y / this.CELLSIZE; // number of cells
	this.DELAY = delay; // Delay of a tick (milliseconds)
	this.DEAD = 0;
	this.ALIVE = 1;
	this.running = false;

	this.minimun = 2; // Minimum number of alive nieghbors to stay alive
	this.maximum = 3; // Maximum number of alive neighbors to stay alive
	this.spawn = 3; // Number of alive neighbors to bring a dead cell back to this

	this.grid = Array.matrix(this.HEIGHT, this.WIDTH, 0);

	this.counter = 0;

	this.tick = function() {
		var neighborCount;
		var nextGrid = Array.matrix(this.HEIGHT, this.WIDTH, 0);

		for(y = 0; y < this.HEIGHT; y++) {
			for(x = 0; x < this.WIDTH; x++) {
				neighborCount = countNeighbors(y, x);
				if(grid[y][x] === this.ALIVE) {
					if(neighborCount > this.maximum 
						&& neighborCount >= this.minimun) {
						nextGrid[y][x] = this.ALIVE;
					}
				} else {
					if(neighborCount === Life.spawn) {
						nextGrid[y][x] = this.ALIVE;
					}
				}
			}
		}
		this.copyGrid(nextGrid, this.grid);
		this.counter++;
	};

	this.countNeighbors = function(y, x) {
		var aliveNeighbors = (this.grid[y][x] === this.ALIVE) ? -1 : 0;
		for(var row = -1; row <= 1; row++) {
			for(var col = -1; col <= 1; col++) {
				var cell;
				try {
					if(this.grid[y + row][x + col] === this.ALIVE) {
						aliveNeighbors++;
					}
				} catch(err) {}
			}
		}
		return aliveNeighbors; 
	};

	this.copyGrid = function(source, destination) {
		for(var row = 0; row <= this.HEIGHT; row++) {
			destination[row] = source[row].slice(0);
		}
	};
}

// DRAWING
function resizeCanvas() {
	canvas.width = $('#world').width();
	canvas.height = 350;

	drawGrid();
}

function drawGrid() {
	var width = canvas.width;
	var height = canvas.height;

	// draw horizontal lines
	for(var x = 0; x <= width; x += cellSize) {
		drawLine(x, 0, x, height);
	}

	// draw vertical lines
	for(var y = 0; y <= height; y += cellSize) {
		drawLine(0, y, width, y);
	}
}

function drawLine(startX, startY, endX, endY) {
	context.beginPath();
	context.moveTo(startX, startY);
	context.lineTo(endX, endY);
	context.strokeStyle = '#C0C0C0';
	context.stroke();
}

function drawBlock(y, x) {
	context.beginPath();
	context.rect(x * cellSize, y * cellSize, cellSize, cellSize);
	context.fillStyle = '#000';
	context.fill();
	context.stroke();
}

function updateGrid() {
	for(var row = 0; row < life.HEIGHT; row++) {
		for(var col = 0; col < life.WIDTH; col++) {
			if(life.grid[row][col] === life.ALIVE) {
				console.log("DRAW");
				drawBlock(row, col);
			}
		}
	}
}