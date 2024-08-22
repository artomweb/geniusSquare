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
  "3T": { colour: "#D6E601" },
  "3L": { colour: "#21D7FF" },
  "3R": { colour: "#BA5CFE" },
  "1D": { colour: "#2878FE" },
  "4Z": { colour: "#FD3842" },
  "4L": { colour: "#FF9E01" },
  "4Sq": { colour: "#00CE9A" },
  "2S": { colour: "#AD8561" },
  "4S": { colour: "#7D9FBA" },
};
let draggingPiece;

let startTime;

let firstDrag = false;

let time = 0;

function setup(forceNew = false) {
  document.getElementById("canvasContainer").innerHTML = "";
  let myCanvas = createCanvas(1000, 800);
  myCanvas.parent("canvasContainer");

  boardSquareDim = boardDim / 6;
  let piecesX = 550;
  let piecesY = 50;
  let offsetY = 0;
  let offsetX = 0;
  let fillIndex = 2;
  for (const key in pieceNames) {
    pieces.push(
      new Piece(
        piecesX + 200 * offsetX,
        piecesY + 100 * offsetY,
        key,
        boardSquareDim,
        pieceNames[key].colour,
        fillIndex++
      )
    );
    offsetY++;
    if (offsetY % 5 == 0) {
      offsetX++;
      offsetY = 0;
    }
  }

  grid = loadGame(forceNew);
  console.table(grid);

  textSize(100);
  textAlign(CENTER, CENTER);
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

  if (firstDrag) {
    time = Math.round((new Date().getTime() - startTime) / 1000);
  }
  push();

  fill("black");
  text(time, 250, 600);
  pop();

  for (let i = 0; i < grid.length; i++) {
    for (let j = 0; j < grid[i].length; j++) {
      if (grid[i][j] == 0) {
        return;
      }
    }
  }

  firstDrag = false;
}

function mousePressed() {
  for (let i = pieces.length - 1; i >= 0; i--) {
    if (pieces[i].isMouseOver()) {
      if (!firstDrag) {
        firstDrag = true;
        startTime = new Date().getTime();
      }
      isDragging = true;
      offsetX = mouseX - pieces[i].x;
      offsetY = mouseY - pieces[i].y;
      pieces[i].snapped = false;
      draggingPiece = pieces[i];

      // Move the clicked piece to the end of the array
      pieces.splice(i, 1); // Remove the piece from its current position
      pieces.push(draggingPiece); // Append the piece to the end of the array

      draggingPiece.removeFromGrid(grid);
      return;
    }
  }
}

function mouseReleased() {
  if (isDragging) {
    isDragging = false;
    draggingPiece.snapToGrid(grid, boardSquareDim);
  }
}

function mouseDragged() {
  if (isDragging) {
    draggingPiece.setPosition(mouseX - offsetX, mouseY - offsetY);
    draggingPiece.removeFromGrid(grid);
  }
}

function keyPressed() {
  if (!draggingPiece) return;
  if (key === "r") {
    draggingPiece.rotate(grid, boardSquareDim);
  } else if (key === "f") {
    draggingPiece.flip(grid, boardSquareDim);
  }
}

function rollDiceAndSetParams(url) {
  dice = rollDice();
  diceAlpha = numericToAlphaGame(dice);
  url.searchParams.set("game", diceAlpha);

  window.history.pushState({}, "", url.toString());
}

function loadGame(forceNew) {
  const url = new URL(window.location.href);
  if (url.searchParams.has("game") && !forceNew) {
    dice = alphaToNumericGame(url.searchParams.get("game"));
    if (dice.length !== 7) {
      rollDiceAndSetParams(url);
    }
  } else {
    rollDiceAndSetParams(url);
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
  return grid;
}

function alphaToNumericGame(gameID) {
  let dice = [];
  for (let i = 0; i < gameID.length; i += 2) {
    dice.push([gameID[i].toUpperCase().charCodeAt(0) - 65, +gameID[i + 1] - 1]);
  }
  return dice;
}

function numericToAlphaGame(dice) {
  let gameID = "";

  for (let i = 0; i < dice.length; i++) {
    gameID += String.fromCharCode(dice[i][0] + 65) + (dice[i][1] + 1);
  }

  return gameID;
}

function newGame() {
  firstDrag = false;
  pieces = [];
  time = 0;
  setup(true);
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
