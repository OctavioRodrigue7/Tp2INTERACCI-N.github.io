let smallTriSize = 30;
let largeTriSize = 220;
let growingSmall = false;
let frame3Data = null;

function setupCuadro7() {
  const cols = 3;
  const cellW = width / cols;
  const cellH = height / 3;
  const frame3 = { x: 0, y: 2 * cellH, w: cellW, h: cellH };
  frame3Data = frame3;
  smallTriSize = 30;
  largeTriSize = 220;
  growingSmall = false;
}

function drawCuadro7() {
  if (!frame3Data) {
    setupCuadro7();
  }

  const frame3 = frame3Data;
  noFill();
  stroke(0);
  strokeWeight(2);
  rect(frame3.x, frame3.y, frame3.w, frame3.h);

  const smallX = frame3.x + frame3.w * 0.25;
  const largeX = frame3.x + frame3.w * 0.75;
  const centerY = frame3.y + frame3.h / 2;

  if (growingSmall) {
    smallTriSize += 0.7;
  }

  const maxSmallSize = largeTriSize * 0.90;
  if (smallTriSize >= maxSmallSize) {
    smallTriSize = 30;
  }

  drawTriangle(smallX, centerY, smallTriSize);
  drawTriangle(largeX, centerY, largeTriSize);
}

function drawTriangle(x, y, size) {
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

function mousePressedCuadro7() {
  if (!frame3Data) return;

  const frame3 = frame3Data;
  const smallX = frame3.x + frame3.w * 0.25;
  const centerY = frame3.y + frame3.h / 2;
  const hitDist = dist(mouseX, mouseY, smallX, centerY);

  if (mouseX >= frame3.x && mouseX <= frame3.x + frame3.w && mouseY >= frame3.y && mouseY <= frame3.y + frame3.h && hitDist < smallTriSize) {
    growingSmall = true;
  }
}

function mouseReleasedCuadro7() {
  growingSmall = false;
}
