const canvasGrid = {
  columns: 3,
  rows: 3,

  cell(column, row) {
    return {
      x: width * column / this.columns,
      y: height * row / this.rows,
      w: width / this.columns,
      h: height / this.rows
    };
  },

  size() {
    return min(width / this.columns, height / this.rows);
  },

  pointInside(cell, x, y) {
    return x >= cell.x && x <= cell.x + cell.w &&
      y >= cell.y && y <= cell.y + cell.h;
  }
};

function resizeCanvasGrid() {
  resizeCanvas(windowWidth, windowHeight);
}
