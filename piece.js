class Piece {
  constructor(x, y, shape, size, colour, fillIndex) {
    this.x = x;
    this.y = y;
    this.home = createVector(x, y);
    this.shape = shape;
    this.squareSize = size;
    this.rotation = 0;
    this.shapeMatrix = typesOfPieces[this.shape];
    this.colour = colour;
    this.fillIndex = fillIndex;
  }

  draw() {
    let thisShape = this.shapeMatrix;
    push();

    // circle(this.x, this.y, this.squareSize);
    for (let row = 0; row < thisShape.length; row++) {
      for (let col = 0; col < thisShape[row].length; col++) {
        if (thisShape[row][col] === 1) {
          fill(this.colour);
          if (this.snapped) {
            rect(
              this.x + this.squareSize * col + 4,
              this.y + this.squareSize * row + 4,
              this.squareSize - 8,
              this.squareSize - 8,
              4
            );
          } else {
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
    }

    pop();
  }
  rotate(grid, squareSize) {
    this.rotation += PI / 2;
    this.shapeMatrix = this.rotate90Clockwise(this.shapeMatrix);
    this.snapToGrid(grid, squareSize);
  }

  getCenter() {
    let thisShape = this.shapeMatrix;

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
    let thisShape = this.shapeMatrix;
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
    let thisShape = this.shapeMatrix;
    let canSnap = true;

    // Calculate top-left corner of the piece in grid coordinates
    let gridX = Math.round(this.x / squareSize);
    let gridY = Math.round(this.y / squareSize);

    // Iterate over the shape matrix to check if it can snap to the grid
    for (let i = 0; i < thisShape.length; i++) {
      for (let j = 0; j < thisShape[i].length; j++) {
        // Check if the shape part is filled
        if (thisShape[i][j] === 1) {
          // Calculate the corresponding grid position
          const checkX = gridX + j;
          const checkY = gridY + i;

          console.log(checkX, checkY);

          // Check if it's within the bounds of the grid
          if (
            checkX < 0 ||
            checkX >= grid[0].length ||
            checkY < 0 ||
            checkY >= grid.length ||
            grid[checkY][checkX] !== 0 // Assuming 0 means empty
          ) {
            canSnap = false;
          }
        }
      }
    }
    // If canSnap is true, set the position to snap the shape to the grid
    if (canSnap) {
      console.log("snap");
      this.setPosition(gridX * squareSize, gridY * squareSize);
      this.snapped = true;

      // Mark the grid positions as filled
      for (let i = 0; i < thisShape.length; i++) {
        for (let j = 0; j < thisShape[i].length; j++) {
          if (thisShape[i][j] === 1) {
            const markX = gridX + j;
            const markY = gridY + i;

            grid[markY][markX] = this.fillIndex; // Mark as filled (use a specific value if needed)
          }
        }
      }
    } else {
      this.snapped = false;
      console.log("no snap");

      for (let i = 0; i < grid.length; i++) {
        for (let j = 0; j < grid[i].length; j++) {
          if (grid[i][j] === this.fillIndex) {
            grid[i][j] = 0; // Replace with 0s
          }
        }
      }
    }

    console.table(grid);
  }
  setPosition(mx, my) {
    this.x = mx;
    this.y = my;
  }

  rotate90Clockwise(matrix) {
    const n = matrix.length;
    const rotated = Array.from({ length: n }, () => Array(n).fill(0));

    for (let i = 0; i < n; i++) {
      for (let j = 0; j < n; j++) {
        rotated[j][n - i - 1] = matrix[i][j];
      }
    }

    return this.moveToTopLeft(rotated);
  }

  moveToTopLeft(matrix) {
    const n = matrix.length;

    // Find the first row and column containing a 1
    let firstRow = n;
    let firstCol = n;

    for (let i = 0; i < n; i++) {
      for (let j = 0; j < n; j++) {
        if (matrix[i][j] === 1) {
          firstRow = Math.min(firstRow, i);
          firstCol = Math.min(firstCol, j);
        }
      }
    }

    // Create a new matrix and shift the shape
    const newMatrix = Array.from({ length: n }, () => Array(n).fill(0));

    for (let i = firstRow; i < n; i++) {
      for (let j = firstCol; j < n; j++) {
        newMatrix[i - firstRow][j - firstCol] = matrix[i][j];
      }
    }

    return newMatrix;
  }
}

const typesOfPieces = {
  "3T": [
    [1, 0, 0, 0],
    [1, 1, 0, 0],
    [1, 0, 0, 0],
    [0, 0, 0, 0],
  ],
  "3L": [
    [1, 0, 0, 0],
    [1, 0, 0, 0],
    [1, 0, 0, 0],
    [0, 0, 0, 0],
  ],
  "3R": [
    [1, 1, 0, 0],
    [0, 1, 0, 0],
    [0, 0, 0, 0],
    [0, 0, 0, 0],
  ],
  "1D": [
    [1, 0, 0, 0],
    [0, 0, 0, 0],
    [0, 0, 0, 0],
    [0, 0, 0, 0],
  ],
  "4Z": [
    [1, 0, 0, 0],
    [1, 1, 0, 0],
    [0, 1, 0, 0],
    [0, 0, 0, 0],
  ],
  "4L": [
    [1, 1, 0, 0],
    [0, 1, 0, 0],
    [0, 1, 0, 0],
    [0, 0, 0, 0],
  ],
  "4Sq": [
    [1, 1, 0, 0],
    [1, 1, 0, 0],
    [0, 0, 0, 0],
    [0, 0, 0, 0],
  ],
  "2S": [
    [1, 0, 0, 0],
    [1, 0, 0, 0],
    [0, 0, 0, 0],
    [0, 0, 0, 0],
  ],
  "4S": [
    [1, 0, 0, 0],
    [1, 0, 0, 0],
    [1, 0, 0, 0],
    [1, 0, 0, 0],
  ],
};
