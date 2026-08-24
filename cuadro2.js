let cuadro2Squares = [];
let cuadro2HoveredIndex = -1;
let cuadro2Frame = null;

const cuadro2Palette = [
  '#7ef9ff', '#6ea8fe', '#4d5dfc', '#9d7bff', '#c084fc',
  '#8b5cf6', '#6d28d9', '#5eead4', '#7dd3fc', '#a78bfa',
  '#d8b4fe', '#67e8f9', '#60a5fa', '#818cf8', '#b794f4',
  '#7c3aed', '#38bdf8', '#93c5fd', '#c4b5fd', '#bfdbfe'
];

function setupCuadro2() {
  const cellW = width / 3;
  const cellH = height / 3;
  cuadro2Frame = { x: cellW, y: 0, w: cellW, h: cellH };
  initCircles();
}

function initCircles() {
  if (!cuadro2Frame) return;

  const padding = min(cuadro2Frame.w, cuadro2Frame.h) * 0.12;
  const center = createVector(
    cuadro2Frame.x + cuadro2Frame.w / 2,
    cuadro2Frame.y + cuadro2Frame.h / 2
  );
  const innerW = cuadro2Frame.w - padding * 2;
  const innerH = cuadro2Frame.h - padding * 2;
  const baseSize = min(innerW, innerH) * 0.07;
  const ringRadius = min(innerW, innerH) * 0.4;
  const ringCounts = [1, 8, 14, 20];
  const ringScales = [0, 0.34, 0.67, 1];

  cuadro2Squares = [];
  let colorIndex = 0;

  for (let ring = 0; ring < ringCounts.length; ring++) {
    const count = ringCounts[ring];
    for (let index = 0; index < count; index++) {
      const angle = ring === 0 ? 0 : TWO_PI * index / count - HALF_PI + ring * 0.14;
      const x = center.x + cos(angle) * ringRadius * ringScales[ring];
      const y = center.y + sin(angle) * ringRadius * ringScales[ring];
      cuadro2Squares.push(new Cuadro2Square(
        x,
        y,
        baseSize,
        cuadro2Palette[colorIndex % cuadro2Palette.length],
        center,
        cuadro2Frame
      ));
      colorIndex++;
    }
  }
}

function drawCuadro2() {
  if (!cuadro2Frame) setupCuadro2();

  cuadro2HoveredIndex = -1;
  for (let index = 0; index < cuadro2Squares.length; index++) {
    if (cuadro2Squares[index].isHovered(mouseX, mouseY)) {
      cuadro2HoveredIndex = index;
      break;
    }
  }

  noStroke();
  fill(255);
  rect(cuadro2Frame.x, cuadro2Frame.y, cuadro2Frame.w, cuadro2Frame.h);

  noFill();
  stroke(0);
  strokeWeight(2);
  rect(cuadro2Frame.x, cuadro2Frame.y, cuadro2Frame.w, cuadro2Frame.h);

  for (let index = 0; index < cuadro2Squares.length; index++) {
    cuadro2Squares[index].update(cuadro2HoveredIndex, cuadro2Squares);
    cuadro2Squares[index].display(index === cuadro2HoveredIndex);
  }
}

class Cuadro2Square {
  constructor(x, y, size, fillColor, center, frame) {
    this.baseX = x;
    this.baseY = y;
    this.x = x;
    this.y = y;
    this.baseSize = size;
    this.size = size;
    this.fillColor = fillColor;
    this.center = center;
    this.frame = frame;
  }

  update(activeIndex, squares) {
    let targetX = this.baseX;
    let targetY = this.baseY;
    let targetSize = this.baseSize;

    if (activeIndex !== -1) {
      const active = squares[activeIndex];
      if (active === this) {
        targetSize = this.baseSize * 1.8;
      } else {
        targetSize = this.baseSize * 0.5;
        const direction = createVector(this.baseX - active.baseX, this.baseY - active.baseY);
        if (direction.mag() === 0) direction.set(this.baseX - this.center.x, this.baseY - this.center.y);
        if (direction.mag() === 0) direction.set(0, 1);
        direction.normalize();
        const distance = max(this.baseSize * 2.5, min(this.frame.w, this.frame.h) * 0.12);
        targetX += direction.x * distance;
        targetY += direction.y * distance;
      }
    }

    targetX = constrain(targetX, this.frame.x + targetSize / 2, this.frame.x + this.frame.w - targetSize / 2);
    targetY = constrain(targetY, this.frame.y + targetSize / 2, this.frame.y + this.frame.h - targetSize / 2);
    this.x = lerp(this.x, targetX, 0.15);
    this.y = lerp(this.y, targetY, 0.15);
    this.size = lerp(this.size, targetSize, 0.15);
  }

  display(active) {
    if (active) drawCuadro2Glow(this.x, this.y, this.size);
    noStroke();
    fill(this.fillColor);
    rectMode(CENTER);
    rect(this.x, this.y, this.size, this.size);
    rectMode(CORNER);
  }

  isHovered(mousePositionX, mousePositionY) {
    return mousePositionX >= this.x - this.size / 2 &&
      mousePositionX <= this.x + this.size / 2 &&
      mousePositionY >= this.y - this.size / 2 &&
      mousePositionY <= this.y + this.size / 2;
  }
}

function drawCuadro2Glow(x, y, size) {
  const glowColor = color('#ff9f1c');
  for (let layer = 8; layer >= 1; layer--) {
    const scale = 1 + layer * 0.24;
    const opacity = 34 * (1 - layer / 9);
    noStroke();
    fill(red(glowColor), green(glowColor), blue(glowColor), opacity);
    rectMode(CENTER);
    rect(x, y, size * scale, size * scale);
  }
}