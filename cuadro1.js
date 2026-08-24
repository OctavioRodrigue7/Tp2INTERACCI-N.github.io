let frame7Data = null;
let cuadro7Square = null;
let cuadro7Trail = [];
let cuadro7Color = null;
let cuadro7ColorValue = '';
let cuadro7PreviousMouse = { x: 0, y: 0 };

const cuadro7Palette = [
  '#8e44ad',
  '#3498db',
  '#ff69b4',
  '#e67e22',
  '#4b1f5f',
  '#f1c40f'
];
const cuadro7TrailLifetime = 1500;
const cuadro7InitialSizeRatio = 0.38;
const cuadro7TrailAmount = 1;

function setupCuadro1() {
  const cellW = width / 3;
  const cellH = height / 3;
  frame7Data = { x: 0, y: 0, w: cellW, h: cellH };
  cuadro7ColorValue = random(cuadro7Palette);
  cuadro7Color = color(cuadro7ColorValue);
  cuadro7Square = {
    x: frame7Data.w / 2,
    y: frame7Data.h / 2,
    size: min(frame7Data.w, frame7Data.h) * cuadro7InitialSizeRatio
  };
  cuadro7Trail = [];
  cuadro7PreviousMouse.x = mouseX;
  cuadro7PreviousMouse.y = mouseY;
}

function drawCuadro1() {
  if (!frame7Data || !cuadro7Square) {
    setupCuadro1();
  }

  const now = millis();
  const mouseMoved = dist(mouseX, mouseY, cuadro7PreviousMouse.x, cuadro7PreviousMouse.y) > 1;
  const mouseInsideFrame = mouseX >= frame7Data.x && mouseX <= frame7Data.x + frame7Data.w &&
    mouseY >= frame7Data.y && mouseY <= frame7Data.y + frame7Data.h;
  const previousX = cuadro7Square.x;
  const previousY = cuadro7Square.y;

  cuadro7Square.size = max(0, cuadro7Square.size - 0.16);
  if (mouseMoved && cuadro7Square.size <= 1) {
    reiniciarCuadro7Square();
  }

  const invisibleLimit = cuadro7Square.size / 2;
  const targetX = mouseInsideFrame
    ? constrain(mouseX, frame7Data.x + invisibleLimit, frame7Data.x + frame7Data.w - invisibleLimit)
    : frame7Data.x + frame7Data.w / 2;
  const targetY = mouseInsideFrame
    ? constrain(mouseY, frame7Data.y + invisibleLimit, frame7Data.y + frame7Data.h - invisibleLimit)
    : frame7Data.y + frame7Data.h / 2;
  cuadro7Square.x = lerp(cuadro7Square.x, targetX, 0.1);
  cuadro7Square.y = lerp(cuadro7Square.y, targetY, 0.1);

  if (dist(cuadro7Square.x, cuadro7Square.y, previousX, previousY) > 0.5) {
    const awayX = previousX - mouseX;
    const awayY = previousY - mouseY;
    const awayDistance = max(0.001, dist(0, 0, awayX, awayY));
    const awayAngle = atan2(awayY, awayX) + random(-0.35, 0.35);
    for (let index = 0; index < cuadro7TrailAmount; index++) {
      cuadro7Trail.push({
        x: previousX,
        y: previousY,
        velocityX: cos(awayAngle) * random(0.5, 1.4) * min(1, awayDistance / 40),
        velocityY: sin(awayAngle) * random(0.5, 1.4) * min(1, awayDistance / 40),
        size: max(12, cuadro7Square.size * random(0.5, 0.8)),
        born: now
      });
    }
  }

  cuadro7Trail = cuadro7Trail.filter((trailSquare) => now - trailSquare.born < cuadro7TrailLifetime);

  push();
  rectMode(CENTER);
  noStroke();

  for (const trailSquare of cuadro7Trail) {
    const age = now - trailSquare.born;
    const progress = age / cuadro7TrailLifetime;
    const opacity = 150 * (1 - progress);
    const size = trailSquare.size * (1 - progress * 0.8);
    trailSquare.x += trailSquare.velocityX;
    trailSquare.y += trailSquare.velocityY;
    drawCuadro7Glow(trailSquare.x, trailSquare.y, size, opacity * 0.45);
    fill(red(cuadro7Color), green(cuadro7Color), blue(cuadro7Color), opacity);
    rect(trailSquare.x, trailSquare.y, size, size);
  }

  if (cuadro7Square.size > 0) {
    drawCuadro7Glow(cuadro7Square.x, cuadro7Square.y, cuadro7Square.size, 110);
    fill(cuadro7Color);
    rect(cuadro7Square.x, cuadro7Square.y, cuadro7Square.size, cuadro7Square.size);
  }

  pop();

  cuadro7PreviousMouse.x = mouseX;
  cuadro7PreviousMouse.y = mouseY;
}

function reiniciarCuadro7Square() {
  const availableColors = cuadro7Palette.filter((paletteColor) => paletteColor !== cuadro7ColorValue);
  cuadro7ColorValue = random(availableColors);
  cuadro7Color = color(cuadro7ColorValue);
  cuadro7Square.size = min(frame7Data.w, frame7Data.h) * cuadro7InitialSizeRatio;
}

function drawCuadro7Glow(x, y, size, opacity) {
  noStroke();
  for (let scale = 2.2; scale >= 1.05; scale -= 0.15) {
    const warmth = map(scale, 1.05, 2.2, 0, 1);
    const glowRed = lerp(255, 196, warmth);
    const glowGreen = lerp(215, 125, warmth);
    const glowBlue = lerp(145, 95, warmth);
    fill(glowRed, glowGreen, glowBlue, opacity * (1 - warmth * 0.65));
    rect(x, y, size * scale, size * scale);
  }
}
