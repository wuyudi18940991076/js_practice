//点击开始游戏--》startpage消失--》游戏开始
//随机出现实物，出现三节蛇开始运动
//上下左右--》改变方向运动,都是坐标控制
//判断是否吃到食物，食物消失，蛇加一
//判断游戏结束，弹出框

var startP = document.getElementById('startP');
var startPage = document.getElementById('startPage');
var lose = document.getElementById('lose');
var scoreBox = document.getElementById('score');
var content = document.getElementById('content');
var startPage = document.getElementById('startPage');
var snakeMove;
var close = document.getElementById('close');
var loserScore = document.getElementById('loserScore');
var speed = 200;
var startGameBool = true;
var startPaushBool = true;
var startBtn = document.getElementById('startBtn');
init();
bindEvent();
// 初始化
function init() {
  //地图属性
  this.mapW = parseInt(getComputedStyle(content).width);
  this.mapH = parseInt(getComputedStyle(content).height);
  this.mapDiv = content;

  //食物属性，宽高
  this.foodW = 20;
  this.foodH = 20;
  //坐标的位置
  this.foodX = 0;
  this.foodY = 0;

  //蛇的属性
  this.snakeW = 20;
  this.snakeH = 20;
  this.snakeBody = [
    [4, 3, 'head'],
    [3, 3, 'body'],
    [2, 3, 'body']
  ]; //蛇的位置


  //游戏属性
  this.direct = 'right'; //最开始进来时候有一个默认方向
  this.left = false;
  this.right = false;
  this.up = true;
  this.down = true;

  this.score = 0;
}

function startGame() {
  //开始游戏之后startpage需要消失
  startPage.style.display = 'none';
  startP.style.display = 'block';
  food();
  snake();
  // bindEvent();
}

function food() {
  var food = document.createElement('div'); //创建一个div元素
  food.style.width = this.foodW + 'px';
  food.style.height = this.foodH + 'px';
  food.style.position = 'absolute';
  this.foodX = Math.floor(Math.random() * (this.mapW / 20)); //生成随机数  ,向下取整
  this.foodY = Math.floor(Math.random() * (this.mapH / 20));
  food.style.left = this.foodX * 20 + 'px';
  food.style.top = this.foodY * 20 + 'px';
  //插入到map区域,再起一个class类名是food
  this.mapDiv.appendChild(food).setAttribute('class', 'food');
}

function snake() {
  // 蛇的位置
  for (var i = 0; i < this.snakeBody.length; i++) {
    var snake = document.createElement('div');
    snake.style.width = this.snakeW + 'px';
    snake.style.height = this.snakeH + 'px';
    snake.style.position = 'absolute';
    snake.style.left = this.snakeBody[i][0] * 20 + 'px';
    snake.style.top = this.snakeBody[i][1] * 20 + 'px';
    snake.classList.add(this.snakeBody[i][2]);
    this.mapDiv.appendChild(snake).classList.add('snake');
    // 蛇头的变化
    // switch (this.direct) {
    //   case 'right':
    //     break;
    //   case 'up':
    //     snake.style.transform = 'rotate(270deg)';
    //     break;
    //   case 'left':
    //     snake.style.transform = 'rotate(180deg)';
    //     break;
    //   case 'down':
    //     snake.style.transform = 'rotate(90deg)';
    //     break;
    //   default:
    //     break;
    // }
  }
}

// 蛇移动的位置变化
function move() {
  for (var i = this.snakeBody.length - 1; i > 0; i--) {
    this.snakeBody[i][0] = this.snakeBody[i - 1][0];
    this.snakeBody[i][1] = this.snakeBody[i - 1][1];
  }
  switch (this.direct) {
    case 'right':
      this.snakeBody[0][0] += 1;
      break;
    case 'up':
      this.snakeBody[0][1] -= 1;
      break;
    case 'left':
      this.snakeBody[0][0] -= 1;
      break;
    case 'down':
      this.snakeBody[0][1] += 1;
      break;
    default:
      break;
  }
  removeClass('snake'); //删除原来位置的蛇，紧接着渲染新的一条蛇
  snake();
  // 下面是每次吃到食物的状态
  if (this.snakeBody[0][0] == this.foodX && this.snakeBody[0][1] == this.foodY) {
    var snakeEndX = this.snakeBody[this.snakeBody.length - 1][0];
    var snakeEndY = this.snakeBody[this.snakeBody.length - 1][1];
    switch (this.direct) {
      case 'right':
        this.snakeBody.push([snakeEndX + 1, snakeEndY, 'body'])
        break;
      case 'up':
        this.snakeBody.push([snakeEndX, snakeEndY - 1, 'body'])
        break;
      case 'left':
        this.snakeBody.push([snakeEndX - 1, snakeEndY, 'body'])
        break;
      case 'down':
        this.snakeBody.push([snakeEndX, snakeEndY + 1, 'body'])
        break;
      default:
        break;
    }

    this.score += 1;
    scoreBox.innerHTML = this.score;
    removeClass('food');
    food();
  }
  if (this.snakeBody[0][0] < 0 || this.snakeBody[0][0] >= this.mapW / 20) {
    relodGame();
  }
  if (this.snakeBody[0][1] < 0 || this.snakeBody[0][1] >= this.mapH / 20) {
    relodGame();
  }
  var snakeHX = this.snakeBody[0][0];
  var snakeHY = this.snakeBody[0][1];
  for (var i = 1; i < this.snakeBody.length; i++) {
    if (snakeHX == snakeBody[i][0] && snakeHY == snakeBody[i][1]) {
      relodGame();
    }
  }
}

//游戏结束重新初始化
function relodGame() {
  removeClass('snake');
  removeClass('food');
  clearInterval(snakeMove);
  this.snakeBody = [
    [4, 3, 'head'],
    [3, 3, 'body'],
    [2, 3, 'body']
  ];
  this.direct = 'right';
  this.left = false;
  this.right = false;
  this.up = true;
  this.down = true;
  lose.style.display = 'block';
  loserScore.innerHTML = this.score;
  this.score = 0;
  scoreBox.innerHTML = this.score;
  startGameBool = true;
  startPaushBool = true;
  startP.setAttribute('src', './images/start1.png');
}


// 移出的函数
function removeClass(className) {
  var ele = document.getElementsByClassName(className);
  while (ele.length > 0) {
    ele[0].parentNode.removeChild(ele[0])
  }
}

// 键盘控制蛇移动
function setDerict(code) {
  switch (code) {
    case 37:
      if (this.left) {
        this.direct = 'left';
        this.left = false;
        this.right = false;
        this.up = true;
        this.down = true;
      }
      break;
    case 38:
      if (this.up) {
        this.direct = 'up';
        this.left = true;
        this.right = true;
        this.up = false;
        this.down = false;
      }
      break;
    case 39:
      if (this.right) {
        this.direct = 'right';
        this.left = false;
        this.right = false;
        this.up = true;
        this.down = true;
      }
      break;
    case 40:
      if (this.down) {
        this.direct = 'down';
        this.left = true;
        this.right = true;
        this.up = false;
        this.down = false;
      }
      break;
    default:
      break;
  }
}

function bindEvent() {
  close.onclick = function () {
    lose.style.display = 'none';
  }

  startBtn.onclick = function () {
    startAndPaush();
  }
  startP.onclick = function () {
    startAndPaush();
  }
}

function startAndPaush() {
  if (startPaushBool) {
    if (startGameBool) {
      startGame();
      startGameBool = false;
    }
    // 改变背景图片
    startP.setAttribute('src', './images/suspend.png');
    document.onkeydown = function (e) {
      var code = e.keyCode
      setDerict(code);
    }
    snakeMove = setInterval(function () {
      move()
    }, speed);

    startPaushBool      = false;
  } else {
    startP.setAttribute('src', './images/start1.png');
    clearInterval(snakeMove);
    // clearInterval清理定时器
    document.onkeydown = function (e) {
      e.returnValue = false;
      return false;
    };
    startPaushBool = true;
  }
}