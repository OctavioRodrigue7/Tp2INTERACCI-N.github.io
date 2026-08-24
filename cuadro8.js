const cuadro8Triangles = [];
let cuadro8VibrationIntensity = 1;

function setupCuadro8() {
  const cols = 3;
  const cellW = width / cols;
  const cellH = height / 3;
  const frame2 = { x: cellW, y: 2 * cellH, w: cellW, h: cellH };

  cuadro8Triangles.length = 0;
  for (let i = 0; i < 35; i++) {
    const size = random(14, 24);
    const baseX = random(frame2.x + size, frame2.x + frame2.w - size);
    const baseY = random(frame2.y + size, frame2.y + frame2.h - size);
    cuadro8Triangles.push({
      baseX,
      baseY,
      size,
      offset: random(0, TWO_PI),
      speed: random(0.12, 0.22),
      axisShift: random(0.5, 1.5)
    });
  }
}

function drawCuadro8() {
  const cols = 3;
  const cellW = width / cols;
  const cellH = height / 3;
  const frame2 = { x: cellW, y: 2 * cellH, w: cellW, h: cellH };

  noStroke();
  fill(255);
  rect(frame2.x, frame2.y, frame2.w, frame2.h);

  noFill();
  stroke(0);
  strokeWeight(2);
  rect(frame2.x, frame2.y, frame2.w, frame2.h);

  for (const triangle of cuadro8Triangles) {
    const dx = cos(frameCount * triangle.speed + triangle.offset) * cuadro8VibrationIntensity * 2;
    const dy = sin(frameCount * triangle.speed * triangle.axisShift + triangle.offset * 1.3) * cuadro8VibrationIntensity * 2;
    let tx = triangle.baseX + dx;
    let ty = triangle.baseY + dy;

    const hoverDist = dist(mouseX, mouseY, tx, ty);
    const repelRadius = triangle.size * 4;
    if (hoverDist < repelRadius && mouseX >= frame2.x && mouseX <= frame2.x + frame2.w && mouseY >= frame2.y && mouseY <= frame2.y + frame2.h) {
      const repelStrength = (repelRadius - hoverDist) * 0.35;
      const angle = atan2(ty - mouseY, tx - mouseX);
      tx += cos(angle) * repelStrength;
      ty += sin(angle) * repelStrength;
    }

    tx = constrain(tx, frame2.x + triangle.size / 2, frame2.x + frame2.w - triangle.size / 2);
    ty = constrain(ty, frame2.y + triangle.size / 2, frame2.y + frame2.h - triangle.size / 2);
    drawCuadro8Triangle(tx, ty, triangle.size);
  }
}

function drawCuadro8Triangle(x, y, size) {
  fill(255);
  stroke(0);
  strokeWeight(2);
  const h = size * sqrt(3) / 2;
  push();
  translate(x, y);
  beginShape();
  vertex(-size / 2, h / 3);
  vertex(size / 2, h / 3);
  vertex(0, -2 * h / 3);
  endShape(CLOSE);
  pop();
}

function mouseClicked() {
  const cols = 3;
  const cellW = width / cols;
  const cellH = height / 3;
  const frame2 = { x: cellW, y: 2 * cellH, w: cellW, h: cellH };

  if (mouseX >= frame2.x && mouseX <= frame2.x + frame2.w && mouseY >= frame2.y && mouseY <= frame2.y + frame2.h) {
    cuadro8VibrationIntensity += 1;
  }
}
