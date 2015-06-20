var canvas, ctx, center, velocity, prevSeconds, ballR, mouseVelocity, mousePos;

var ball, cat, background, sand;

var assets = "assets/";

var dampening = 0.8;
var gravity = 9.8;

var lastKickTime = -10;
var kickDuration = 0.5;

function init() {

  canvas = document.getElementById('tutorial');
  canvas.width = window.innerWidth - 50;
  canvas.height = window.innerHeight - 50;

  ball = new Image();
  ball.src = assets + "ball.png";

  cat = new Image();
  cat.src = assets + "cat02.png";

  background = new Image();
  background.src = assets + "background.png";

  sand = new Image();
  sand.src = assets + "sand.png";

  mouseVelocity = [0, 0];
  mousePos = [0, 0];

  canvas.addEventListener('mousemove', function(e) {
    var rect = canvas.getBoundingClientRect();
    var curMousePos = [(e.clientX - rect.left) / canvas.width, (e.clientY - rect.top) / canvas.height]
    mouseVelocity[0] = curMousePos[0] - mousePos[0];
    mouseVelocity[1] = curMousePos[1] - mousePos[1];
    mousePos = curMousePos;
  });

  center = [0.5, 0];
  velocity = [0, 0];

  ballR = 0.05;

  prevSeconds = Date.now() * 0.001;

  ctx = canvas.getContext('2d');

  requestAnimationFrame(draw);
}


function draw(){
  var seconds = Date.now() * 0.001;
  var dt = seconds - prevSeconds;
  prevSeconds = seconds;

  // Update center
  velocity = [velocity[0], velocity[1] + gravity * dt * 0.33 * 0.1];
  center = [center[0] + velocity[0], center[1] + velocity[1]];

  if (length(mousePos, center) < ballR * 2) {
    velocity[0] += mouseVelocity[0];
    velocity[1] += mouseVelocity[1];
    lastKickTime = seconds;
  }

  if(seconds - lastKickTime < kickDuration) {
    cat.src = assets + "cat02_kick.png";
  }
  else {
    cat.src = assets + "cat02.png";
  }

  if(center[1] > 1.0 || center[1] < 0.0) {
    var side = 0.0;
    if(center[1] > 1.0) {
      side = 1.0;
    }
    center[1] = side - side * ballR;
    velocity[1] = -velocity[1] * dampening;
    console.log(center);
  }

  if(center[0] > 1.0 || center[0] < 0.0) {
    var side = 0.1;
    if(center[0] > 1.0) {
      side = 1.0;
    }
    center[0] = side - side * ballR;
    velocity[0] = -velocity[0] * dampening;
  }

  ctx = canvas.getContext('2d');
  ctx.clearRect(0, 0, canvas.width, canvas.height);

  ctx.drawImage(background, 0, 0, canvas.width, canvas.height);

  ctx.drawImage(sand, 0, canvas.height - sand.height, canvas.width, sand.height);
  ctx.drawImage(ball, center[0] * canvas.width, center[1] * canvas.height, ballR * canvas.width, ballR * canvas.width);
  ctx.drawImage(cat, mousePos[0] * canvas.width - cat.width * 0.5, mousePos[1] * canvas.height - cat.height * 0.5, cat.width, cat.height);


  // ctx.beginPath();
  // ctx.arc(center[0] * canvas.width, center[1] * canvas.height, ballR * canvas.width, 0, 2 * Math.PI);
  // ctx.fillStyle = "rgb(200,0,0)";
  // ctx.fill();
  // ctx.strokeStyle = 'rgba(0,153,255,0.4)';
  // ctx.stroke();
  // ctx.closePath();


  requestAnimationFrame(draw);
}

function length(v1, v2) {
  return Math.sqrt(Math.pow(v1[0] - v2[0], 2) + Math.pow(v1[1] - v2[1], 2));
}
