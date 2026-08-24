let frame6Data = null;
let cuadro6Circles = [];
let cuadro6CircleDiameter = 0;
let cuadro6CircleGap = 8;
let cuadro6Columns = 0;
let cuadro6Rows = 0;
let cuadro6CenterColor = '';
let cuadro6DisplayedCenterColor = null;
let cuadro6TargetCenterColor = null;
let cuadro6CenterPulse = 0;
let draggedCuadro6Circle = null;
let cuadro6DragOffset = { x: 0, y: 0 };
const cuadro6Colors = ['#e74c3c', '#3498db', '#2ecc71'];

function setupCuadro6() {
  const cols = 3;
  const rows = 3;
  const cellW = width / cols;
  const cellH = height / rows;
  frame6Data = { x: 2 * cellW, y: cellH, w: cellW, h: cellH };
  createCuadro6Circles();
}

function createCuadro6Circles() {
  const frame6 = frame6Data;
  cuadro6Columns = max(1, floor(frame6.w / 55));
  cuadro6Rows = max(1, floor(frame6.h / 55));
  const availableWidth = frame6.w - (cuadro6Columns - 1) * cuadro6CircleGap;
  const availableHeight = frame6.h - (cuadro6Rows - 1) * cuadro6CircleGap;
  cuadro6CircleDiameter = min(availableWidth / cuadro6Columns, availableHeight / cuadro6Rows);
  const gridWidth = cuadro6Columns * cuadro6CircleDiameter + (cuadro6Columns - 1) * cuadro6CircleGap;
  const gridHeight = cuadro6Rows * cuadro6CircleDiameter + (cuadro6Rows - 1) * cuadro6CircleGap;
  const gridStartX = frame6.x + (frame6.w - gridWidth) / 2;
  const gridStartY = frame6.y + (frame6.h - gridHeight) / 2;
  cuadro6Circles = [];

  const centerColumn = floor(cuadro6Columns / 2);
  const centerRow = floor(cuadro6Rows / 2);
  const centerIndex = centerRow * cuadro6Columns + centerColumn;
  cuadro6CenterColor = random(cuadro6Colors);
  cuadro6DisplayedCenterColor = color(cuadro6CenterColor);
  cuadro6TargetCenterColor = color(cuadro6CenterColor);

  for (let index = 0; index < cuadro6Columns * cuadro6Rows; index++) {
    const column = index % cuadro6Columns;
    const row = floor(index / cuadro6Columns);
    const circleX = gridStartX + (column + 0.5) * cuadro6CircleDiameter + column * cuadro6CircleGap;
    const circleY = gridStartY + (row + 0.5) * cuadro6CircleDiameter + row * cuadro6CircleGap;
    cuadro6Circles.push({
      x: circleX,
      y: circleY,
      baseX: circleX,
      baseY: circleY,
      diameter: cuadro6CircleDiameter,
      gridIndex: index,
      color: cuadro6CenterColor,
      important: index === centerIndex
    });
  }

  assignCuadro6Colors();
}

function assignCuadro6Colors() {
  const centerCircle = cuadro6Circles.find((circleData) => circleData.important);
  const alternateColors = cuadro6Colors.filter((colorName) => colorName !== cuadro6CenterColor);
  const candidates = cuadro6Circles.filter((circleData) => !circleData.important);
  const firstException = floor(random(candidates.length));
  let secondException = floor(random(candidates.length - 1));
  if (secondException >= firstException) secondException++;

  for (let index = 0; index < candidates.length; index++) {
    candidates[index].color = cuadro6CenterColor;
  }
  candidates[firstException].color = alternateColors[0];
  candidates[secondException].color = alternateColors[1];
  centerCircle.color = cuadro6CenterColor;
}

function drawCuadro6() {
  if (!frame6Data) {
    setupCuadro6();
  }

  const frame6 = frame6Data;
  cuadro6DisplayedCenterColor = lerpColor(cuadro6DisplayedCenterColor, cuadro6TargetCenterColor, 0.12);
  cuadro6CenterPulse = max(0, cuadro6CenterPulse - 0.035);

  noStroke();
  fill(248);
  rect(frame6.x, frame6.y, frame6.w, frame6.h);

  for (const circleData of cuadro6Circles) {
    if (!circleData.important) {
      fill(circleData.color);
      circle(circleData.x, circleData.y, circleData.diameter);
    }
  }

  const centerCircle = cuadro6Circles.find((circleData) => circleData.important);
  fill(cuadro6DisplayedCenterColor);
  const centerDiameter = centerCircle.diameter * (2.1 + sin(frameCount * 0.16) * 0.04 + cuadro6CenterPulse * 0.22);
  circle(centerCircle.x, centerCircle.y, centerDiameter);
  noFill();
  stroke(0, 100);
  strokeWeight(max(3, centerCircle.diameter * 0.06));
  circle(centerCircle.x, centerCircle.y, centerDiameter);

  noFill();
  stroke(0);
  strokeWeight(2);
  rect(frame6.x, frame6.y, frame6.w, frame6.h);
}

function mousePressedCuadro6() {
  if (!frame6Data) return;

  for (let index = cuadro6Circles.length - 1; index >= 0; index--) {
    const circleData = cuadro6Circles[index];
    if (circleData.important) continue;
    if (dist(mouseX, mouseY, circleData.x, circleData.y) <= circleData.diameter / 2) {
      draggedCuadro6Circle = circleData;
      cuadro6DragOffset.x = mouseX - circleData.x;
      cuadro6DragOffset.y = mouseY - circleData.y;
      break;
    }
  }
}

function mouseDraggedCuadro6() {
  if (!draggedCuadro6Circle) return;

  draggedCuadro6Circle.x = mouseX - cuadro6DragOffset.x;
  draggedCuadro6Circle.y = mouseY - cuadro6DragOffset.y;
}

function mouseReleasedCuadro6() {
  if (!draggedCuadro6Circle) return;

  const centerCircle = cuadro6Circles.find((circleData) => circleData.important);
  const reachedCenter = dist(draggedCuadro6Circle.x, draggedCuadro6Circle.y, centerCircle.x, centerCircle.y) < cuadro6CircleDiameter;

  if (reachedCenter && draggedCuadro6Circle.color !== cuadro6CenterColor) {
    cuadro6CenterColor = draggedCuadro6Circle.color;
    cuadro6TargetCenterColor = color(cuadro6CenterColor);
    cuadro6CenterPulse = 1;
    assignCuadro6Colors();
  }

  draggedCuadro6Circle.x = draggedCuadro6Circle.baseX;
  draggedCuadro6Circle.y = draggedCuadro6Circle.baseY;
  draggedCuadro6Circle = null;
}