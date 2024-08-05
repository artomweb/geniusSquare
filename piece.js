class Piece {
  constructor(x, y, shape, size) {
    this.x = x;
    this.y = y;
    this.shape = shape;
    this.squareSize = size;
    this.rotation = 0;
  }

  draw() {
    let thisShape = typesOfPieces[this.shape];
    push();
    let axis = this.getCenter();
    translate(axis.x, axis.y);
    rotate(this.rotation);
    translate(-axis.x, -axis.y);

    circle(this.x, this.y, this.squareSize);
    for (let row = 0; row < thisShape.length; row++) {
      for (let col = 0; col < thisShape[row].length; col++) {
        if (thisShape[row][col] === 1) {
          fill("pink");
          rect(
            this.x + this.squareSize * col,
            this.y + this.squareSize * row,
            this.squareSize,
            this.squareSize,
            4
          );
        }
      }
    }

    pop();
  }
  rotate() {
    this.rotation += PI / 2;
  }

  getCenter() {
    let thisShape = typesOfPieces[this.shape];

    // Calculate the width and height of the bounding box
    let numRows = thisShape.length;
    let numCols = thisShape[0].length;
    let bboxWidth = numCols * this.squareSize;
    let bboxHeight = numRows * this.squareSize;

    // Calculate the center of the bounding box
    let centerX = this.x + bboxWidth / 2;
    let centerY = this.y + bboxHeight / 2;

    return createVector(centerX, centerY, 0);
  }

  isMouseOver() {
    // Check if the mouse is over any of the squares in the piece
    let thisShape = typesOfPieces[this.shape];
    for (let row = 0; row < thisShape.length; row++) {
      for (let col = 0; col < thisShape[row].length; col++) {
        if (thisShape[row][col] === 1) {
          let px = this.x + this.squareSize * col;
          let py = this.y + this.squareSize * row;
          if (
            mouseX >= px &&
            mouseX < px + this.squareSize &&
            mouseY >= py &&
            mouseY < py + this.squareSize
          ) {
            return true;
          }
        }
      }
    }
    return false;
  }

  snapToGrid(grid, squareSize) {
    let thisShape = typesOfPieces[this.shape];
    let canSnap = true;
    let snapPosition = { x: 0, y: 0 };

    // Calculate top-left corner of the piece in grid coordinates
    let gridX = Math.round(this.x / squareSize);
    let gridY = Math.round(this.y / squareSize);

    console.log(gridX, gridY);
  }
  setPosition(mx, my) {
    this.x = mx;
    this.y = my;
  }
}

const typesOfPieces = {
  "3T": [
    [1, 0],
    [1, 1],
    [1, 0],
  ],
};
