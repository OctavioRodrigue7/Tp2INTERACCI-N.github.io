let frame9Data = null;
let lightPos = { x: 0, y: 0 };
let maze = [];
let mazeCols = 15;
let mazeRows = 11;
let mazeCellW = 0;
let mazeCellH = 0;

function setupCuadro9() {
  const cols = 3;
  const rows = 3;
  const cellW = width / cols;
  const cellH = height / rows;
  const frame9 = { x: 2 * cellW, y: 2 * cellH, w: cellW, h: cellH };
  frame9Data = frame9;
  mazeCellW = frame9.w / mazeCols;
  mazeCellH = frame9.h / mazeRows;
  generateMaze();
  lightPos = { x: frame9.w / 2, y: frame9.h / 2 };
}

function drawCuadro9() {
  if (!frame9Data) {
    setupCuadro9();
  }

  const frame9 = frame9Data;
  push();
  translate(frame9.x, frame9.y);

  noStroke();
  fill(0);
  rect(0, 0, frame9.w, frame9.h);

  drawMazeBackground();
  drawMazeWalls();
  updateLightPosition();
  drawLightGlow();
  drawLightTriangle();

  if (mouseX >= frame9.x && mouseX <= frame9.x + frame9.w && mouseY >= frame9.y && mouseY <= frame9.y + frame9.h) {
    noCursor();
  } else {
    cursor(ARROW);
  }

  pop();
}

function generateMaze() {
  maze = Array.from({ length: mazeCols }, () => Array(mazeRows).fill(1));
  const startX = 1;
  const startY = 1;
  maze[startX][startY] = 0;
  const stack = [[startX, startY]];

  while (stack.length) {
    const [cx, cy] = stack[stack.length - 1];
    const neighbors = [];
    const directions = [
      { x: 0, y: -2 },
      { x: 2, y: 0 },
      { x: 0, y: 2 },
      { x: -2, y: 0 }
    ];

    for (const dir of directions) {
      const nx = cx + dir.x;
      const ny = cy + dir.y;
      if (nx > 0 && nx < mazeCols - 1 && ny > 0 && ny < mazeRows - 1 && maze[nx][ny] === 1) {
        neighbors.push(dir);
      }
    }

    if (neighbors.length === 0) {
      stack.pop();
      continue;
    }

    const dir = random(neighbors);
    const nx = cx + dir.x;
    const ny = cy + dir.y;
    maze[cx + dir.x / 2][cy + dir.y / 2] = 0;
    maze[nx][ny] = 0;
    stack.push([nx, ny]);
  }
}

function drawMazeBackground() {
  fill(8);
  rect(0, 0, frame9Data.w, frame9Data.h);
  for (let x = 0; x < mazeCols; x++) {
    for (let y = 0; y < mazeRows; y++) {
      if (maze[x][y] === 0) {
        fill(18);
        rect(x * mazeCellW, y * mazeCellH, mazeCellW, mazeCellH);
      }
    }
  }
}

function drawMazeWalls() {
  noStroke();
  fill(14);
  for (let x = 0; x < mazeCols; x++) {
    for (let y = 0; y < mazeRows; y++) {
      if (maze[x][y] === 1) {
        rect(x * mazeCellW, y * mazeCellH, mazeCellW, mazeCellH);
      }
    }
  }
}

function updateLightPosition() {
  const frame9 = frame9Data;
  const desiredX = constrain(mouseX - frame9.x, 0, frame9.w);
  const desiredY = constrain(mouseY - frame9.y, 0, frame9.h);

  const dx = desiredX - lightPos.x;
  const dy = desiredY - lightPos.y;
  const distance = sqrt(dx * dx + dy * dy);
  if (distance < 1) return;

  const step = min(6, distance);
  const nextX = lightPos.x + (dx / distance) * step;
  const nextY = lightPos.y + (dy / distance) * step;

  if (isPath(nextX, nextY)) {
    lightPos.x = nextX;
    lightPos.y = nextY;
  }
}

function isPath(px, py) {
  const ix = floor(px / mazeCellW);
  const iy = floor(py / mazeCellH);
  if (ix < 0 || ix >= mazeCols || iy < 0 || iy >= mazeRows) return false;
  return maze[ix][iy] === 0;
}

function drawLightGlow() {
  const maxRadius = min(frame9Data.w, frame9Data.h) * 0.6;
  for (let r = maxRadius; r > 0; r -= 18) {
    const alpha = map(r, 0, maxRadius, 255, 0);
    fill(255, alpha * 0.12);
    circle(lightPos.x, lightPos.y, r * 2);
  }
}

function drawLightTriangle() {
  fill(255);
  noStroke();
  const size = 32;
  const x = lightPos.x;
  const y = lightPos.y;
  const h = size * sqrt(3) / 2;
  beginShape();
  vertex(x - size / 2, y + h / 3);
  vertex(x + size / 2, y + h / 3);
  vertex(x, y - 2 * h / 3);
  endShape(CLOSE);
}
