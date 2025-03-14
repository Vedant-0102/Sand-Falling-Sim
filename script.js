let w = 5;
let cols, rows;
let grid, velocityGrid;
let hueValue = 200;
let gravity = 0.1;

function make2DArray(cols, rows, fillValue = 0) {
  return Array.from({ length: cols }, () => Array.from({ length: rows }, () => fillValue));
}

function withinBounds(i, j) {
  return i >= 0 && i < cols && j >= 0 && j < rows;
}

function setup() {
  createCanvas(600, 500);
  colorMode(HSB, 360, 255, 255);
  cols = width / w;
  rows = height / w;
  grid = make2DArray(cols, rows);
  velocityGrid = make2DArray(cols, rows, 1);
}

function draw() {
  background(0);

  if (mouseIsPressed) {
    let mouseCol = floor(mouseX / w);
    let mouseRow = floor(mouseY / w);
    let radius = 3; 

    for (let i = -radius; i <= radius; i++) {
      for (let j = -radius; j <= radius; j++) {
        let col = mouseCol + i;
        let row = mouseRow + j;

        let distance = sqrt(i * i + j * j);
        if (distance <= radius && withinBounds(col, row) && grid[col][row] === 0) {
          if (random(1) < 0.75) {
            grid[col][row] = hueValue;
            velocityGrid[col][row] = 1;
          }
        }
      }
    }
    hueValue = (hueValue + 0.5) % 360;
  }

  for (let i = 0; i < cols; i++) {
    for (let j = 0; j < rows; j++) {
      if (grid[i][j] > 0) {
        fill(grid[i][j], 255, 255);
        noStroke();
        square(i * w, j * w, w);
      }
    }
  }

  let nextGrid = make2DArray(cols, rows);
  let nextVelocityGrid = make2DArray(cols, rows);

  for (let j = rows - 1; j >= 0; j--) {
    for (let i = 0; i < cols; i++) {
      let state = grid[i][j];
      let velocity = velocityGrid[i][j];

      if (state > 0) {
        let newY = min(j + ceil(velocity), rows - 1);

        while (newY > j && grid[i][newY] !== 0) {
          newY--;
        }

        if (newY !== j) {
          nextGrid[i][newY] = state;
          nextVelocityGrid[i][newY] = velocity + gravity;
        } else {
          let dir = random(1) < 0.5 ? -1 : 1;
          let sideA = withinBounds(i + dir, j + 1) && grid[i + dir][j + 1] === 0;
          let sideB = withinBounds(i - dir, j + 1) && grid[i - dir][j + 1] === 0;

          if (sideA) {
            nextGrid[i + dir][j + 1] = state;
            nextVelocityGrid[i + dir][j + 1] = velocity + gravity;
          } else if (sideB) {
            nextGrid[i - dir][j + 1] = state;
            nextVelocityGrid[i - dir][j + 1] = velocity + gravity;
          } else {
            nextGrid[i][j] = state;
            nextVelocityGrid[i][j] = velocity;
          }
        }
      }
    }
  }

  grid = nextGrid;
  velocityGrid = nextVelocityGrid;
}