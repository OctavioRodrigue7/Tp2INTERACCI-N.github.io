let frame5Data = null;
let cuadro5Circle = null;
let cuadro5PreviousMouse = { x: 0, y: 0 };
let cuadro5DisplayedColor = null;
let cuadro5TargetColor = null;
let cuadro5QuietFrames = 0;
let cuadro5BreathingPhase = 0;

const cuadro5Gray = '#808080';
const cuadro5Blue = '#3498db';
const cuadro5Red = '#e74c3c';

function setupCuadro5() {
  const cellW = width / 3;
  const cellH = height / 3;
  frame5Data = { x: cellW, y: cellH, w: cellW, h: cellH };
  cuadro5Circle = {
    x: frame5Data.x + frame5Data.w / 2,
    y: frame5Data.y + frame5Data.h / 2,
    diameter: min(frame5Data.w, frame5Data.h) * 0.18
  };
  cuadro5PreviousMouse.x = mouseX;
  cuadro5PreviousMouse.y = mouseY;
  cuadro5DisplayedColor = color(cuadro5Gray);
  cuadro5TargetColor = color(cuadro5Gray);
  cuadro5QuietFrames = 0;
  cuadro5BreathingPhase = 0;
}

function drawCuadro5() {
  if (!frame5Data || !cuadro5Circle) {
    setupCuadro5();
  }

  const mouseSpeed = dist(mouseX, mouseY, cuadro5PreviousMouse.x, cuadro5PreviousMouse.y);
  const mouseInsideFrame = mouseX >= frame5Data.x && mouseX <= frame5Data.x + frame5Data.w &&
    mouseY >= frame5Data.y && mouseY <= frame5Data.y + frame5Data.h;
  const targetX = constrain(mouseX, frame5Data.x + cuadro5Circle.diameter / 2, frame5Data.x + frame5Data.w - cuadro5Circle.diameter / 2);
  const targetY = constrain(mouseY, frame5Data.y + cuadro5Circle.diameter / 2, frame5Data.y + frame5Data.h - cuadro5Circle.diameter / 2);
  const previousX = cuadro5Circle.x;
  const previousY = cuadro5Circle.y;
  const followAmount = 0.08;

  cuadro5Circle.x = lerp(cuadro5Circle.x, targetX, followAmount);
  cuadro5Circle.y = lerp(cuadro5Circle.y, targetY, followAmount);

  const circleSpeed = dist(cuadro5Circle.x, cuadro5Circle.y, previousX, previousY);
  const mouseIsFaster = mouseSpeed > circleSpeed + 0.5 && mouseSpeed > 1;
  const mouseIsQuiet = mouseSpeed < 0.5 && mouseInsideFrame;

  if (mouseIsFaster) {
    cuadro5QuietFrames = 0;
    cuadro5Circle.diameter = min(cuadro5Circle.diameter + 0.35, min(frame5Data.w, frame5Data.h) * 0.32);
    cuadro5TargetColor = color(cuadro5Blue);
  } else if (mouseIsQuiet) {
    cuadro5QuietFrames++;
    cuadro5Circle.diameter = max(cuadro5Circle.diameter - 0.2, min(frame5Data.w, frame5Data.h) * 0.1);
    cuadro5TargetColor = color(cuadro5Red);
  } else {
    cuadro5QuietFrames = 0;
    cuadro5TargetColor = color(cuadro5Gray);
  }

  cuadro5DisplayedColor = lerpColor(cuadro5DisplayedColor, cuadro5TargetColor, 0.1);
  cuadro5PreviousMouse.x = mouseX;
  cuadro5PreviousMouse.y = mouseY;

  const mouseOverCircle = dist(mouseX, mouseY, cuadro5Circle.x, cuadro5Circle.y) <= cuadro5Circle.diameter * 0.54;
  const breathedDiameter = respirarCuadro5(dist(mouseX, mouseY, cuadro5Circle.x, cuadro5Circle.y), mouseIsQuiet, mouseOverCircle);

  noStroke();
  fill(cuadro5DisplayedColor);
  circle(cuadro5Circle.x, cuadro5Circle.y, breathedDiameter);
}

function respirarCuadro5(distanceToMouse, circleIsRed, mouseOverCircle) {
  const maximumDistance = dist(0, 0, frame5Data.w, frame5Data.h);
  let breathingSpeed = map(constrain(distanceToMouse, 0, maximumDistance), 0, maximumDistance, 0.035, 0.18);

  if (circleIsRed && mouseOverCircle) {
    breathingSpeed = 0.025;
  }

  cuadro5BreathingPhase += breathingSpeed;
  const breathingPercentage = sin(cuadro5BreathingPhase) * 0.14;
  return cuadro5Circle.diameter * (1 + breathingPercentage);
}