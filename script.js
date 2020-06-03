const rulesBtn = document.getElementById('rules-btn');
const closeBtn = document.getElementById('close-btn');
const rules = document.getElementById('rules');
const canvas = document.getElementById('canvas');
const ctx = canvas.getContext('2d');

let score = 0;
const brickRowCount = 9;
const brickColumnCount = 5;

//create ball props
const ball = {
  x: canvas.width / 2,
  y: canvas.height / 2,
  size: 10,
  speed: 4,
  dx: 4,
  dy: -4,
};

//create paddle props
const paddle = {
  x: canvas.width / 2 - 40,
  y: canvas.height - 20,
  w: 80,
  h: 10,
  speed: 8,
  dx: 0
};

//create brick props
const brickInfo = {
  w: 70,
  h: 20,
  padding: 10,
  offsetX: 45,
  offsetY: 60,
  visible: true,
};

// create bricks
const bricks = [];
for (let i = 0; i < brickRowCount; i++) {
  bricks[i] = [];
  for (let j = 0; j < brickColumnCount; j++) {
    const x = i * (brickInfo.w + brickInfo.padding) + brickInfo.offsetX;
    const y = j * (brickInfo.h + brickInfo.padding) + brickInfo.offsetY;
    bricks[i][j] = { x, y, ...brickInfo };
  }
};

//draw a ball on canvas
const drawBall = () => {
  const { x, y, size } = ball
  ctx.beginPath();
  ctx.arc(x, y, size, 0, Math.PI * 2);
  ctx.fillStyle = '#0095dd';
  ctx.fill();
  ctx.closePath();
};

//draw a paddle on canvas
const drawPaddle = () => {
  const { x, y, w, h } = paddle;
  ctx.beginPath();
  ctx.rect(x, y, w, h);
  ctx.fillStyle = '#0095dd';
  ctx.fill();
  ctx.closePath();
};

// draw score on canvas
const drawScore = () => {
  ctx.font = '20px Arial';
  ctx.fillText(`Score:${score}`, canvas.width - 100, 30);
};

//draw of bricks
const drawBricks = () => {
  bricks.forEach(column => {
    column.forEach(brick => {
      ctx.beginPath();
      ctx.rect(brick.x, brick.y, brick.w, brick.h);
      ctx.fillStyle = brick.visible ? '#0095dd' : 'transparent';
      ctx.fill();
      ctx.closePath();
    });
  });
};

//move paddle on canvas
const movePaddle = () => {
  paddle.x += paddle.dx;

  //wall detection
  if (paddle.x + paddle.w > canvas.width) {
    paddle.x = canvas.width - paddle.w;
  };
  if (paddle.x < 0) {
    paddle.x = 0;
  };
};

//move ball on canvas
const moveBall = () => {
  ball.x += ball.dx;
  ball.y += ball.dy;

  // wall collision(right/left)
  if (ball.x + ball.size > canvas.width || ball.x - ball.size < 0) {
    ball.dx *= -1;
  };

  //wall collision (top /bottom)
  if (ball.y + ball.size > canvas.height || ball.y - ball.size < 0) {
    ball.dy *= -1;
  };

  //paddle collision
  if (
    ball.x - ball.size > paddle.x &&
    ball.x + ball.size < paddle.x + paddle.w &&
    ball.y + ball.size > paddle.y
  ) {
    ball.dy = -ball.speed;
  };

  //brick collision
  bricks.forEach(column => {
    column.forEach(brick => {
      if (brick.visible) {
        if (ball.x - ball.size > brick.x && //left brick side check
          ball.x + ball.size < brick.x + brick.w && //right brick side check
          ball.y + ball.size > brick.y && //top brick side
          ball.y - ball.size < brick.y + brick.h //bottom brick side
        ) {
          ball.dy *= -1;
          brick.visible = false;
          increaseScore();
        };
      };
    });
  });

  // hit bottom wall and lose
  if (ball.y + ball.size > canvas.height) {
    showAllBricks();
    score = 0;
  };
};

// increase score
const increaseScore = () => {
  score++
  if (score % (brickRowCount * brickColumnCount) === 0)
    showAllBricks();
};

//make all bricks appear
const showAllBricks = () => {
  bricks.forEach(column => {
    column.forEach(brick => (brick.visible = true))
  });
};

//draw everything 
const draw = () => {
  //clear the canvas
  ctx.clearRect(0, 0, canvas.width, canvas.height);
  drawPaddle();
  drawBall();
  drawScore();
  drawBricks();
};

//update canvas and drawing
const update = () => {
  movePaddle();
  moveBall();
  //draw everyThing
  draw();
  requestAnimationFrame(update);
};

update();

//keyDown event
const keyDown = (e) => {
  if (e.key === 'Right' || e.key === 'ArrowRight') {
    paddle.dx = paddle.speed;
  } else if (e.key === 'Left' || e.key === 'ArrowLeft') {
    paddle.dx = -paddle.speed;
  }
};

//keyUp event 
const keyUp = (e) => {
  if (e.key === 'Right' ||
    e.key === 'ArrowRight' ||
    e.key === 'Left' ||
    e.key === 'ArrowLeft') {
    paddle.dx = 0;
  };
};

//keyboard event handler
document.addEventListener('keydown', keyDown);
document.addEventListener('keyup', keyUp);

//rules and close button event listeners
rulesBtn.addEventListener('click', () => {
  rules.classList.add('show');
});

closeBtn.addEventListener('click', () => {
  rules.classList.remove('show');
});