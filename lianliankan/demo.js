//1.初始化小方块
//2.生成小方块数字
//3.创建小方块
//4.点击事件
//5.渲染
//6.检查连接
//7.获取坐标点
//8.判断位置是否存在小方块
//9.清除小方块
//Math.random()打乱
window.onload = function () {
  init();
}
var rows = 7;
var cols = 12;
var wrap;
var types = 20; //用来标记取到多少种图片
// 存放两次点击的图片
var chooseOne = null;
var chooseTwo = null;
// 存放四个方向的行和列
var Toward = {
  NODE: null,
  UP: {
    row: -1,
    col: 0
  },
  RIGHT: {
    row: 0,
    col: 1
  },
  DOWN: {
    row: 1,
    col: 0
  },
  LEFT: {
    row: 0,
    col: -1
  }
}
var squareSet;

function init() {
  wrap = document.getElementById('wrap');
  if (rows * cols % 2 != 0) { //必须都是成队出现的，所以行乘以列能除以2
    alert('展示数量不能为奇数');
  }
  initSquareSet(); //初始化小格子
}

function initSquareSet() {
  //square width:86px height:76px;
  wrap.style.width = 86 * cols + 'px';
  wrap.style.height = 76 * rows + 'px';
  // [1,4,5,3,6,8,7,9,2]
  var tempArr = createRandomNum(); //生成随机数字
  // createSquare(); //生成小方块
  squareSet = new Array(rows + 2);
  for (var i = 0; i < squareSet.length; i++) {
    squareSet[i] = new Array(cols + 2)
  }


  for (var i = 1; i <= rows; i++) {
    for (var j = 1; j <= cols; j++) {
      var temp = createSquare(tempArr.pop(), i, j);
      squareSet[i][j] = temp;
      wrap.append(temp);
      temp.onclick = function () {
        if (chooseOne == null || chooseOne.num != this.num) {
          chooseOne = this;
        } else {
          chooseTwo = this;
          if (chooseOne != chooseTwo && checkLink(chooseOne.row, chooseOne.col, 0, Toward.NODE, [])) {
            clearSquare(chooseOne.row, chooseOne.col);
            clearSquare(chooseTwo.row, chooseTwo.col);
          }
          chooseOne = null;
          chooseTwo = null;
        }
        render();
        if (checkFinish()) {
          alert('恭喜恭喜');
        }
      }
    }
  }
}

function createRandomNum() {
  var temp = [];
  for (var i = 0; i < rows * cols / 2; i++) {
    var num = Math.floor(Math.random() * 20);
    temp.push(num);
    temp.push(num); //push两次就是42乘以2
  }
  // console.log(temp);
  //打乱数组
  temp.sort(function () {
    return Math.random() - 0.5
  })
  // console.log(temp);
  return temp;
}

function createSquare(num, row, col) {
  var temp = document.createElement('div');
  temp.classList.add('square');
  temp.style.backgroundImage = "url('./images1/" + num + ".png')";
  temp.style.left = 86 * col + 'px';
  temp.style.top = 76 * row + 'px';
  temp.num = num;
  temp.row = row;
  temp.col = col;
  return temp;
}
//样式切换
function render() {
  for (var i = 0; i < squareSet.length; i++) {
    for (var j = 0; j < squareSet[i].length; j++) {
      if (squareSet[i][j] && squareSet[i][j] == chooseOne) {
        squareSet[i][j].style.opacity = '0.5';
      } else if (squareSet[i][j]) {
        squareSet[i][j].style.opacity = '1';
      }
    }
  }
}

function checkFinish() {
  for (var i = 0; i < squareSet.length; i++) {
    for (var j = 0; j < squareSet[i].length; j++) {
      if (squareSet[i][j]) {
        return false;
      }
    }
  }
  //所有都被清除
  return true;
}

function clearSquare(x, y) {
  wrap.removeChild(squareSet[x][y]);
  squareSet[x][y] = null;
}

function checkLink(row, col, changeTimes, nowToward, path) {
  // return true/false
  if (isExits(row, col) && squareSet[row][col] == chooseTwo && changeTimes <= 3) {
    return true;
  }
  if (isExits(row, col) && squareSet[row][col] != chooseOne ||
    changeTimes > 3 ||
    // row < 0 || col < 0 || row >= squareSet.length || col < squareSet[0].length ||
    path.indexOf(getLocation(row, col)) > -1) {
    // path.pop();
    return false;
  }
  path.push(getLocation(row, col));
  //上 || 右 || 下 || 左
  return checkLink(row - 1, col, nowToward == Toward.UP ? changeTimes : changeTimes + 1, Toward.UP, path) ||
    checkLink(row, col + 1, nowToward == Toward.RIGHT ? changeTimes : changeTimes + 1, Toward.RIGHT, path) ||
    checkLink(row + 1, col, nowToward == Toward.DOWN ? changeTimes : changeTimes + 1, Toward.DOWN, path) ||
    checkLink(row, col - 1, nowToward == Toward.LEFT ? changeTimes : changeTimes + 1, Toward.LEFT, path)
}

//判断当前位置是否存放
function isExits(x, y) {
  if (x > 0 && y > 0 && x < squareSet.length && y < squareSet[0].length && squareSet[x][y]) {
    return true;
  }
  return false;
}
//返回路径字符串
function getLocation(x, y) {
  return " " + x + ',' + y;
}