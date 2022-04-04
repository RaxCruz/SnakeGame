var BLOCK_SIZE = 50;
var BLOCK_COUNT_H = 18;
var BLOCK_COUNT_W = 30;
var canvasHeight = BLOCK_SIZE * BLOCK_COUNT_H;
var canvasWidth = BLOCK_SIZE * BLOCK_COUNT_W;

var gameInterval;
var snack;
var people;
var score;
var level;
var direction; //上1下2左3右4
var animate;
var up;
var up_1;
var down;
var down_1;
var left;
var left_1;
var right;
var right_1;
var wall;
var grass;
var apple;

loadImage();
function gameStart() {
  snack = {
    body: [{ x: 5, y: 10 }],
    size: 5,
    direction: { x: 0, y: -1 },
  };
  direction = [1, 1, 1, 1, 1];
  animate = [0, 0, 0, 0, 0];
  putApple();
  updateScore(0);
  updateGameLevel(1);
}
function loadImage() {
  up = image("p_up.svg");
  up_1 = image("p_up_1.svg");
  down = image("p_down.svg");
  down_1 = image("p_down_1.svg");
  left = image("p_left.svg");
  left_1 = image("p_left_1.svg");
  right = image("p_right.svg");
  right_1 = image("p_right_1.svg");
  wall = image("wall.svg");
  grass = image("grass.svg");
  people = image("people.svg");
}

function image(fileName) {
  const img = new Image();
  img.src = `images/${fileName}`;
  return img;
}

function updateGameLevel(newLevel) {
  level = newLevel;

  if (gameInterval) {
    clearInterval(gameInterval);
  }
  gameInterval = setInterval(gameRoutine, 1000 / (5 + level));
}

function updateScore(newScore) {
  score = newScore;
  document.getElementById("score_id").innerHTML = score;
}

function putApple() {
  apple = {
    x: Math.floor(Math.random() * (BLOCK_COUNT_W - 2)) + 1,
    y: Math.floor(Math.random() * (BLOCK_COUNT_H - 2)) + 1,
  };
  for (var i = 0; i < snack.body.length; i++) {
    if (snack.body[i].x === apple.x && snack.body[i].y === apple.y) {
      putApple();
      break;
    }
  }
}

function eatApple() {
  snack.size += 1;
  direction.push(direction[direction.length - 1]);
  animate.push(animate[animate.length - 1]);
  putApple();
  updateScore(score + 1);
}

function gameRoutine() {
  moveSnack();

  if (snackIsDead()) {
    ggler();
    return;
  }

  if (snack.body[0].x === apple.x && snack.body[0].y === apple.y) {
    eatApple();
  }

  updateCanvas();
}

function snackIsDead() {
  // hit walls
  if (snack.body[0].x < 1) {
    return true;
  } else if (snack.body[0].x >= BLOCK_COUNT_W - 1) {
    return true;
  } else if (snack.body[0].y < 1) {
    return true;
  } else if (snack.body[0].y >= BLOCK_COUNT_H - 1) {
    return true;
  }

  // hit body
  for (var i = 1; i < snack.body.length; i++) {
    if (
      snack.body[0].x === snack.body[i].x &&
      snack.body[0].y === snack.body[i].y
    ) {
      return true;
    }
  }

  return false;
}

function ggler() {
  clearInterval(gameInterval);
}

function moveSnack() {
  var newBlock = {
    x: snack.body[0].x + snack.direction.x,
    y: snack.body[0].y + snack.direction.y,
  };

  snack.body.unshift(newBlock);

  while (snack.body.length > snack.size) {
    snack.body.pop();
  }
}

function updateCanvas() {
  var canvas = document.getElementById("canvas_id");
  var context = canvas.getContext("2d");
  canvas.setAttribute("width", canvasWidth); //改變寬度
  canvas.setAttribute("height", canvasHeight); //改變高度

  for (var i = 0; i < BLOCK_COUNT_W; i++) {
    for (var j = 0; j < BLOCK_COUNT_H; j++) {
      context.drawImage(
        grass,
        i * BLOCK_SIZE,
        j * BLOCK_SIZE,
        BLOCK_SIZE,
        BLOCK_SIZE
      );
    }
  }
  for (var i = 0; i < BLOCK_COUNT_W; i++) {
    context.drawImage(wall, i * BLOCK_SIZE, 0, BLOCK_SIZE, BLOCK_SIZE);
    context.drawImage(
      wall,
      i * BLOCK_SIZE,
      BLOCK_COUNT_H * BLOCK_SIZE - BLOCK_SIZE,
      BLOCK_SIZE,
      BLOCK_SIZE
    );
  }
  for (var i = 0; i < BLOCK_COUNT_H; i++) {
    context.drawImage(wall, 0, i * BLOCK_SIZE, BLOCK_SIZE, BLOCK_SIZE);
    context.drawImage(
      wall,
      BLOCK_COUNT_W * BLOCK_SIZE - BLOCK_SIZE,
      i * BLOCK_SIZE,
      BLOCK_SIZE,
      BLOCK_SIZE
    );
  }

  context.fillStyle = "lime";

  direction.pop();
  direction.unshift(direction[0]);
  for (var i = 0; i < animate.length; i++) {
    animate[i] = !animate[i];
  }
  for (var i = 0; i < direction.length; i++) {
    var image = null;
    switch (direction[i]) {
      case 1:
        image = animate[i] ? up : up_1;
        break;
      case 2:
        image = animate[i] ? down : down_1;
        break;
      case 3:
        image = animate[i] ? left : left_1;
        break;
      case 4:
        image = animate[i] ? right : right_1;
        break;
    }
    if (snack.body[i]) {
      context.drawImage(
        image,
        snack.body[i].x * BLOCK_SIZE,
        snack.body[i].y * BLOCK_SIZE,
        BLOCK_SIZE,
        BLOCK_SIZE
      );
    }
  }
  context.drawImage(
    people,
    apple.x * BLOCK_SIZE,
    apple.y * BLOCK_SIZE,
    BLOCK_SIZE,
    BLOCK_SIZE
  );
}

window.onload = onPageLoaded;

function onPageLoaded() {
  document.addEventListener("keydown", handleKeyDown);
}

function handleKeyDown(event) {
  if (event.keyCode === 37) {
    // left arrow
    snack.direction.x = -1;
    snack.direction.y = 0;
    direction[0] = 3;
  } else if (event.keyCode === 38) {
    // up arrow
    snack.direction.x = 0;
    snack.direction.y = -1;
    direction[0] = 1;
  } else if (event.keyCode === 39) {
    // right arrow
    snack.direction.x = 1;
    snack.direction.y = 0;
    direction[0] = 4;
  } else if (event.keyCode === 40) {
    // down arrow
    snack.direction.x = 0;
    snack.direction.y = 1;
    direction[0] = 2;
  }
}
