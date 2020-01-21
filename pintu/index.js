//首先想到的是分成多少行，多少列

// 全局配置
var config = {
  height: 480, //高
  width: 480, //宽
  row: 3, //行
  col: 3, //列
  img: "images/image.png", //图片路径
  gameDom: document.getElementById('game') //游戏的根元素
}

//每一个小块的宽度
config.blockWidth = config.width / config.col;
//每一个小块的高度
config.blockHeight = config.height / config.row;

config.total = config.row * config.col; //总的小方块数

var emptyBlock; //空白元素


//生成一个小方块的函数，直接添加到gameDom中  appendToPage表示是否要加入到dom对象
function createBlockDom(x, y, appendToPage, correctX, correctY) {
  var dom = document.createElement('div');
  dom.style.width = config.blockWidth + 'px';
  dom.style.height = config.blockHeight + 'px';
  dom.style.background = `url(${config.img})`; //背景图(模板字符串拼接)  ${js表达式}
  dom.style.border = '3px solid #fff';
  dom.style.boxSizing = 'border-box'; //设置该样式是为了让宽高包含边框的尺寸
  dom.style.position = 'absolute';
  //1.元素位置   从一个有限的坐标随机取一个
  dom.style.left = x + 'px';
  dom.style.top = y + 'px';
  dom.correctX = correctX;
  dom.correctY = correctY;
  //2.背景图的位置,根据正确位置来算
  dom.style.backgroundPosition = `-${correctX}px  -${correctY}px`;
  dom.style.cursor = 'pointer';
  dom.style.transition = 'all .3s';

  dom.onclick = function () {
    //将当前元素的坐标，与空白元素的坐标交换
    //判断是否相邻
    var xdis = Math.abs( parseFloat(dom.style.left) - parseFloat(emptyBlock.style.left) )
    xdis = parseInt(xdis);
    var ydis = Math.abs( parseFloat(dom.style.top) - parseFloat(emptyBlock.style.top) )
    ydis = parseInt(ydis);
    
    if(xdis + ydis !== parseInt(config.blockHeight) &&
    xdis + ydis !== parseInt(config.blockWidth)){
      return;
    }

    var x = dom.style.left;
    var y = dom.style.top;
    dom.style.left = emptyBlock.style.left;
    dom.style.top = emptyBlock.style.top;
    emptyBlock.style.left = x;
    emptyBlock.style.top = y;
    if (isWin()) {
      setTimeout(function () {
        alert('哦买噶的');
      }, 300);

    }
  }
  if (appendToPage) {
    config.gameDom.appendChild(dom);
  } else {
    emptyBlock = dom;
  }
}

//判断是否胜利(目前的坐标是否等于他正确的坐标)
function isWin() {
  for (let i = 0; i < config.gameDom.children.length; i++) {
    const dom = config.gameDom.children[i];
    if (parseInt(dom.correctX) !== parseInt(dom.style.left) ||
      parseInt(dom.correctY) !== parseInt(dom.style.top)) {
      return false;
    }
  }
  return true;
}

//得到一个数组，数组中包含所有正确的坐标
function getCorrectPoints() {
  var arr = [];
  //1.循环行和列
  for (var i = 0; i < config.row; i++) {
    for (var j = 0; j < config.col; j++) {
      arr.push({
        x: j * config.blockWidth,
        y: i * config.blockHeight
      })
    }
  }
  return arr;
}

//生成随机数,根据最大值和最小值(最大值取不到)得到随机数
function getRandom(min, max) {
  var dec = max - min; //最大值减最小值得到一个差值
  return Math.floor(Math.random() * dec + min);
}

//洗牌(数组乱序)
function shuffle(arr) {
  for (let i = 0; i < arr.length - 1; i++) {
    const ele = arr[i];
    //随机生成下标，然后交换
    var index = getRandom(0, arr.length - 1);
    arr[i] = arr[index];
    arr[index] = ele;
  }
}

//生成游戏区域
function setGameArea() {
  //1.初始化游戏根元素
  config.gameDom.style.width = config.width + 'px';
  config.gameDom.style.height = config.height + 'px';
  config.gameDom.style.border = '2px solid #ccc';
  config.gameDom.style.position = 'relative';
  //2.生成所有小方块（gameDom子元素）
  var points = getCorrectPoints(); //得到正确坐标的数组
  shuffle(points);
  var correctPoints = getCorrectPoints(); //没有经过洗牌的正确位置
  for (let i = 0; i < config.total; i++) {
    if (i < config.total - 1) {
      //不是最后生成的方块
      createBlockDom(points[i].x, points[i].y, true, correctPoints[i].x, correctPoints[i].y)
    } else {
      createBlockDom(points[i].x, points[i].y, false, correctPoints[i].x, correctPoints[i].y); //调用函数
    }
  }
  // createBlockDom();
}
setGameArea();