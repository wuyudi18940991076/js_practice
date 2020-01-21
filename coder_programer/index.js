var btn = document.getElementsByClassName('btn')[0];
var bigWheel = document.getElementsByClassName('pan')[0];
//加个锁，也就是说加一个判断对错
var bool = true;
var num = 0;
//绑定一个点击事件,下面是监听器的写法
// btn.addEventListener('click',function(){
// })

btn.onclick = function () {
  if (bool) {
    num = Math.floor(Math.random() * 360); //向下取随机数的意思
    console.log(num)
    //让转盘转起来的函数
    tableRun(num); //实参
    bool = false;
  }
}

bigWheel.addEventListener('webkitTransitionEnd', function () {
  console.log('over');
  bool = true;
  //将转完的度数再回到没有八圈以前，就是乘以八以前
  bigWheel.style.transform = 'rotate(' + num + 'deg)';
  bigWheel.style.transition = 'none';
  //判断到底几等奖
  judgeFn(num);
})

//让转盘转起来的函数
function tableRun(deg) { //deg形参
  var myNum = deg + 8 * 360
  bigWheel.style.transform = 'rotate(' + myNum + 'deg)';
  bigWheel.style.transition = 'all 5s'
}

function judgeFn(deg) {
  var str = '';

  if (deg > 0 && deg < 45) {
    //二等奖
    str = "二等奖"
  } else if (deg > 90 && deg < 135 || deg > 270 && deg < 315) {
    //三等奖
    str = "三等奖"
  } else if (deg > 45 && deg < 90 || deg > 135 && deg < 180 || deg > 225 && deg < 270 || deg > 315 && deg < 360) {
    //四等奖
    str = "四等奖"
  } else if (deg > 180 && deg < 225) {
    //一等奖
    str = "一等奖"
  }
  alert('恭喜你 大吉大利 今晚获得：' + str + ' ! ')
}