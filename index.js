let boardDim = 500;
let dice;
let isDragging = false;
let piece;
let boardSquareDim;

let grid = [];
let gridCols = 6;
let gridRows = 6;

let pieces = [];
let pieceNames = {
  "3T": { colour: "#D6E601", fillIndex: 2 },
  "3L": { colour: "#21D7FF", fillIndex: 3 },
  "3R": { colour: "#BA5CFE", fillIndex: 3 },
  "1D": { colour: "#2878FE", fillIndex: 3 },
  "4Z": { colour: "#FD3842", fillIndex: 3 },
  "4L": { colour: "#FF9E01", fillIndex: 3 },
  "4Sq": { colour: "#00CE9A", fillIndex: 3 },
  "2S": { colour: "#AD8561", fillIndex: 3 },
  "4S": { colour: "#7D9FBA", fillIndex: 3 },
};
let draggingPiece;

function setup() {
  createCanvas(1000, 800);

  dice = rollDice();
  console.log(dice);
  boardSquareDim = boardDim / 6;
  let piecesX = 600;
  let piecesY = 100;
  let offsetY = 0;
  let offsetX = 0;
  for (const key in pieceNames) {
    pieces.push(
      new Piece(
        piecesX + 200 * offsetX,
        piecesY + 100 * offsetY,
        key,
        boardSquareDim,
        pieceNames[key].colour,
        pieceNames[key].fillIndex
      )
    );
    offsetY++;
    if (offsetY % 5 == 0) {
      offsetX++;
      offsetY = 0;
    }
  }

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
  for (let i = 0; i < pieces.length; i++) {
    pieces[i].draw();
  }
}

function mousePressed() {
  for (let i = 0; i < pieces.length; i++) {
    if (pieces[i].isMouseOver()) {
      isDragging = true;
      offsetX = mouseX - pieces[i].x;
      offsetY = mouseY - pieces[i].y;
      pieces[i].snapped = false;
      draggingPiece = pieces[i];

      // While the piece is in the air, the grid under it must be cleared so the piece can be replaced
      for (let i = 0; i < grid.length; i++) {
        for (let j = 0; j < grid[i].length; j++) {
          if (grid[i][j] === draggingPiece.fillIndex) {
            grid[i][j] = 0; // Replace with 0s
          }
        }
      }
      return;
    }
  }
}

function mouseReleased() {
  isDragging = false;
  draggingPiece.snapToGrid(grid, boardSquareDim);
}

function mouseDragged() {
  if (isDragging) {
    draggingPiece.setPosition(mouseX - offsetX, mouseY - offsetY);
  }
}

function keyPressed() {
  if (key === "r") {
    draggingPiece.rotate(grid, boardSquareDim);
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
