let boardDim = 500;
let dice;
let isDragging = false;
let piece;
let boardSquareDim;

let grid = [];
let gridCols = 6;
let gridRows = 6;

function setup() {
  createCanvas(800, 600);

  dice = rollDice();
  console.log(dice);
  boardSquareDim = boardDim / 6;
  piece = new Piece(600, 200, "3T", boardSquareDim);

  for (let i = 0; i < gridRows; i++) {
    grid[i] = [];
    for (let j = 0; j < gridCols; j++) {
      let thisPair = [i, j];
      if (
        dice.some((item) => item[0] === thisPair[0] && item[1] === thisPair[1])
      ) {
        grid[i][j] = 1; // Mark as occupied based on dice
      } else {
        grid[i][j] = 0; // Otherwise, it's available
      }
    }
  }

  console.table(grid);
}

function draw() {
  background(255);
  noFill();

  for (let i = 0; i < gridRows; i++) {
    for (let j = 0; j < gridCols; j++) {
      if (grid[i][j] == 1) {
        push();
        fill(0);
        circle(
          j * boardSquareDim + boardSquareDim / 2,
          i * boardSquareDim + boardSquareDim / 2,
          50
        );
        pop();
      } else {
        rect(
          j * boardSquareDim,
          i * boardSquareDim,
          boardSquareDim,
          boardSquareDim,
          4
        );
      }
    }
  }
  piece.draw();
}

function mousePressed() {
  if (piece.isMouseOver()) {
    isDragging = true;
    offsetX = mouseX - piece.x;
    offsetY = mouseY - piece.y;
  }
}

function mouseReleased() {
  isDragging = false;
  piece.snapToGrid(grid, boardSquareDim);
}

function mouseDragged() {
  if (isDragging) {
    piece.setPosition(mouseX - offsetX, mouseY - offsetY);
  }
}

function keyPressed() {
  if (key === "r") {
    piece.rotate();
  }
}

function rollDice() {
  const die1 = [
    [0, 0],
    [2, 0],
    [3, 0],
    [3, 1],
    [4, 1],
    [5, 2],
  ];

  const die2 = [
    [0, 1],
    [1, 1],
    [2, 1],
    [0, 2],
    [1, 0],
    [1, 2],
  ];

  const die3 = [
    [2, 2],
    [3, 2],
    [4, 2],
    [1, 3],
    [2, 3],
    [3, 3],
  ];

  const die4 = [
    [4, 0],
    [5, 1],
    [5, 1],
    [1, 5],
    [0, 4],
    [0, 4],
  ];

  const die5 = [
    [0, 3],
    [1, 4],
    [2, 5],
    [2, 4],
    [3, 5],
    [5, 5],
  ];

  const die6 = [
    [4, 3],
    [5, 3],
    [4, 4],
    [5, 4],
    [3, 4],
    [4, 5],
  ];

  const die7 = [
    [5, 0],
    [5, 0],
    [5, 0],
    [0, 5],
    [0, 5],
    [0, 5],
  ];

  return [
    random(die1),
    random(die2),
    random(die3),
    random(die4),
    random(die5),
    random(die6),
    random(die7),
  ];
}
