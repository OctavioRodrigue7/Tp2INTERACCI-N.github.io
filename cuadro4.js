const circles = [];
let draggedCircle = null;
let dragOffset = { x: 0, y: 0 };
const groups = [
  { label: 'Grupo A', color: '#e74c3c' },
  { label: 'Grupo B', color: '#3498db' },
  { label: 'Grupo C', color: '#2ecc71' }
];

function setup() {
  createCanvas(windowWidth, windowHeight);
  textAlign(CENTER, CENTER);
  textSize(14);

  const cols = 3;
  const rows = 3;
  const cellW = width / cols;
  const cellH = height / rows;

  const frame1 = { x: 0, y: cellH, w: cellW, h: cellH };

  for (let i = 0; i < 12; i++) {
    const group = groups[i % groups.length];
    const baseRadius = 20;
    circles.push({
      x: random(frame1.x + baseRadius, frame1.x + frame1.w - baseRadius),
      y: random(frame1.y + baseRadius, frame1.y + frame1.h - baseRadius),
      baseRadius,
      label: group.label,
      color: group.color,
      groupIndex: i % groups.length,
      connected: false
    });
  }
  if (typeof setupCuadro8 === 'function') setupCuadro8();
  if (typeof setupCuadro2 === 'function') setupCuadro2();
  if (typeof setupCuadro3 === 'function') setupCuadro3();
  if (typeof setupCuadro7 === 'function') setupCuadro7();
  if (typeof setupCuadro5 === 'function') setupCuadro5();
  if (typeof setupCuadro6 === 'function') setupCuadro6();
  if (typeof setupCuadro1 === 'function') setupCuadro1();
  if (typeof setupCuadro9 === 'function') setupCuadro9();
}

function draw() {
  background(240);
  stroke(0);
  strokeWeight(2);
  noFill();

  const cols = 3;
  const rows = 3;
  const cellW = width / cols;
  const cellH = height / rows;

  for (let y = 0; y < rows; y++) {
    for (let x = 0; x < cols; x++) {
      const px = x * cellW;
      const py = y * cellH;
      rect(px, py, cellW, cellH);
    }
  }

  drawGroupCircles();
  if (typeof drawCuadro1 === 'function') drawCuadro1();
  if (typeof drawCuadro8 === 'function') drawCuadro8();
  if (typeof drawCuadro2 === 'function') drawCuadro2();
  if (typeof drawCuadro3 === 'function') drawCuadro3();
  if (typeof drawCuadro7 === 'function') drawCuadro7();
  if (typeof drawCuadro5 === 'function') drawCuadro5();
  if (typeof drawCuadro6 === 'function') drawCuadro6();
  if (typeof drawCuadro9 === 'function') drawCuadro9();
}

function drawGroupCircles() {
  const connectDistance = 120;
  const adjacency = circles.map(() => []);

  for (let i = 0; i < circles.length; i++) {
    for (let j = i + 1; j < circles.length; j++) {
      const a = circles[i];
      const b = circles[j];
      if (a.groupIndex !== b.groupIndex) continue;
      const d = dist(a.x, a.y, b.x, b.y);
      if (d < connectDistance) {
        adjacency[i].push(j);
        adjacency[j].push(i);
        stroke(a.color);
        strokeWeight(2);
        line(a.x, a.y, b.x, b.y);
      }
    }
  }

  const visited = new Array(circles.length).fill(false);
  const componentSize = new Array(circles.length).fill(1);

  for (let i = 0; i < circles.length; i++) {
    if (visited[i]) continue;
    const stack = [i];
    const component = [];
    while (stack.length) {
      const idx = stack.pop();
      if (visited[idx]) continue;
      visited[idx] = true;
      component.push(idx);
      for (const neighbor of adjacency[idx]) {
        if (!visited[neighbor]) stack.push(neighbor);
      }
    }
    const size = component.length;
    for (const idx of component) componentSize[idx] = size;
  }

  for (let i = 0; i < circles.length; i++) {
    const c = circles[i];
    const multiplier = max(1, componentSize[i]);
    const displayRadius = c.baseRadius * multiplier;
    fill(c.color);
    noStroke();
    circle(c.x, c.y, displayRadius * 2);
  }
}

function mousePressed() {
  for (let i = circles.length - 1; i >= 0; i--) {
    const c = circles[i];
    const d = dist(mouseX, mouseY, c.x, c.y);
    if (d < c.baseRadius) {
      draggedCircle = c;
      dragOffset.x = mouseX - c.x;
      dragOffset.y = mouseY - c.y;
      break;
    }
  }
  if (typeof mousePressedCuadro7 === 'function') mousePressedCuadro7();
  if (typeof mousePressedCuadro3 === 'function') mousePressedCuadro3();
  if (typeof mousePressedCuadro6 === 'function') mousePressedCuadro6();
}

function mouseDragged() {
  if (typeof mouseDraggedCuadro6 === 'function') mouseDraggedCuadro6();
  if (!draggedCircle) return;

  const cols = 3;
  const rows = 3;
  const cellW = width / cols;
  const cellH = height / rows;
  const padding = draggedCircle.baseRadius * 1.5;
  draggedCircle.x = constrain(mouseX - dragOffset.x, padding, cellW - padding);
  draggedCircle.y = constrain(mouseY - dragOffset.y, cellH + padding, cellH * 2 - padding);
}

function mouseReleased() {
  draggedCircle = null;
  if (typeof mouseReleasedCuadro7 === 'function') mouseReleasedCuadro7();
  if (typeof mouseReleasedCuadro6 === 'function') mouseReleasedCuadro6();
}

function windowResized() {
  resizeCanvas(windowWidth, windowHeight);
  if (typeof setupCuadro6 === 'function') setupCuadro6();
  if (typeof setupCuadro5 === 'function') setupCuadro5();
  if (typeof setupCuadro7 === 'function') setupCuadro7();
  if (typeof setupCuadro1 === 'function') setupCuadro1();
  if (typeof setupCuadro3 === 'function') setupCuadro3();
}
