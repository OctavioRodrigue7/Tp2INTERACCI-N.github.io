let cuadro3Frame = null;
let cuadro3CentralSquare = null;
let cuadro3SpawnedSquares = [];
let cuadro3ColorPhase = 0;
let cuadro3Color = null;

const cuadro3Palette = [
  '#7ef9ff', '#6ea8fe', '#4d5dfc', '#9d7bff', '#c084fc',
  '#8b5cf6', '#6d28d9', '#5eead4', '#7dd3fc', '#a78bfa',
  '#d8b4fe', '#67e8f9', '#60a5fa', '#818cf8', '#b794f4',
  '#7c3aed', '#38bdf8', '#93c5fd', '#c4b5fd', '#bfdbfe'
];

function setupCuadro3() {
  const cellW = width / 3;
  const cellH = height / 3;
  const padding = min(cellW, cellH) * 0.16;
  cuadro3Frame = {
    x: cellW * 2,
    y: 0,
    w: cellW,
    h: cellH,
    padding
  };

  cuadro3CentralSquare = {
    x: cuadro3Frame.x + cuadro3Frame.w / 2,
    y: cuadro3Frame.y + cuadro3Frame.h / 2,
    size: min(cellW, cellH) * 0.16,
    velocityX: 0.85,
    velocityY: 0.62
  };
  cuadro3SpawnedSquares = [];
  cuadro3ColorPhase = 0;
  cuadro3Color = color(cuadro3Palette[0]);
}

function drawCuadro3() {
  if (!cuadro3Frame || !cuadro3CentralSquare) {
    setupCuadro3();
  }

  updateCuadro3Color();
  updateCuadro3CentralSquare();
  updateCuadro3SpawnedSquares();

  noStroke();
  fill(255);
  rect(cuadro3Frame.x, cuadro3Frame.y, cuadro3Frame.w, cuadro3Frame.h);

  noFill();
  stroke(0);
  strokeWeight(2);
  rect(cuadro3Frame.x, cuadro3Frame.y, cuadro3Frame.w, cuadro3Frame.h);

  for (const square of cuadro3SpawnedSquares) {
    drawCuadro3Square(square.x, square.y, square.size, square.color, false);
  }

  const centralIsHovered = isCuadro3Hovered(cuadro3CentralSquare);
  drawCuadro3Square(
    cuadro3CentralSquare.x,
    cuadro3CentralSquare.y,
    cuadro3CentralSquare.size,
    cuadro3Color,
    centralIsHovered
  );
}

function updateCuadro3Color() {
  cuadro3ColorPhase = (cuadro3ColorPhase + 0.012) % cuadro3Palette.length;
  const firstIndex = floor(cuadro3ColorPhase);
  const secondIndex = (firstIndex + 1) % cuadro3Palette.length;
  const blend = cuadro3ColorPhase - firstIndex;
  cuadro3Color = lerpColor(
    color(cuadro3Palette[firstIndex]),
    color(cuadro3Palette[secondIndex]),
    blend
  );
}

function updateCuadro3CentralSquare() {
  const square = cuadro3CentralSquare;
  const halfSize = square.size / 2;
  square.x += square.velocityX;
  square.y += square.velocityY;

  if (square.x - halfSize <= cuadro3Frame.x + cuadro3Frame.padding ||
      square.x + halfSize >= cuadro3Frame.x + cuadro3Frame.w - cuadro3Frame.padding) {
    square.velocityX *= -1;
    square.x = constrain(square.x, cuadro3Frame.x + cuadro3Frame.padding + halfSize, cuadro3Frame.x + cuadro3Frame.w - cuadro3Frame.padding - halfSize);
  }
  if (square.y - halfSize <= cuadro3Frame.y + cuadro3Frame.padding ||
      square.y + halfSize >= cuadro3Frame.y + cuadro3Frame.h - cuadro3Frame.padding) {
    square.velocityY *= -1;
    square.y = constrain(square.y, cuadro3Frame.y + cuadro3Frame.padding + halfSize, cuadro3Frame.y + cuadro3Frame.h - cuadro3Frame.padding - halfSize);
  }
}

function updateCuadro3SpawnedSquares() {
  for (const square of cuadro3SpawnedSquares) {
    square.velocityX *= 0.992;
    square.velocityY *= 0.992;
    square.x += square.velocityX;
    square.y += square.velocityY;

    const halfSize = square.size / 2;
    if (square.x - halfSize <= cuadro3Frame.x + cuadro3Frame.padding ||
        square.x + halfSize >= cuadro3Frame.x + cuadro3Frame.w - cuadro3Frame.padding) {
      square.velocityX *= -0.9;
      square.x = constrain(square.x, cuadro3Frame.x + cuadro3Frame.padding + halfSize, cuadro3Frame.x + cuadro3Frame.w - cuadro3Frame.padding - halfSize);
    }
    if (square.y - halfSize <= cuadro3Frame.y + cuadro3Frame.padding ||
        square.y + halfSize >= cuadro3Frame.y + cuadro3Frame.h - cuadro3Frame.padding) {
      square.velocityY *= -0.9;
      square.y = constrain(square.y, cuadro3Frame.y + cuadro3Frame.padding + halfSize, cuadro3Frame.y + cuadro3Frame.h - cuadro3Frame.padding - halfSize);
    }
  }
}

function drawCuadro3Square(x, y, size, fillColor, hovered) {
  if (hovered) {
    drawCuadro3Glow(x, y, size, fillColor);
  }

  rectMode(CENTER);
  noStroke();
  fill(fillColor);
  rect(x, y, size, size);
  rectMode(CORNER);
}

function drawCuadro3Glow(x, y, size, fillColor) {
  const glowColor = color(fillColor);
  for (let layer = 9; layer >= 1; layer--) {
    const scale = 1 + layer * 0.22;
    const opacity = 35 * (1 - layer / 10);
    noStroke();
    fill(red(glowColor), green(glowColor), blue(glowColor), opacity);
    rectMode(CENTER);
    rect(x, y, size * scale, size * scale);
  }
}

function isCuadro3Hovered(square) {
  return mouseX >= square.x - square.size / 2 &&
    mouseX <= square.x + square.size / 2 &&
    mouseY >= square.y - square.size / 2 &&
    mouseY <= square.y + square.size / 2;
}

function mousePressedCuadro3() {
  if (!cuadro3Frame || !isCuadro3Hovered(cuadro3CentralSquare)) return;

  const angle = random(TWO_PI);
  const speed = random(1.2, 2.4);
  const squareSize = cuadro3CentralSquare.size * 0.45;
  const colorIndex = floor(random(cuadro3Palette.length));
  cuadro3SpawnedSquares.push({
    x: cuadro3CentralSquare.x,
    y: cuadro3CentralSquare.y,
    size: squareSize,
    velocityX: cos(angle) * speed,
    velocityY: sin(angle) * speed,
    color: color(cuadro3Palette[colorIndex])
  });
}