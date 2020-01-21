// 该对象存放所有需要用到的dom元素
var doms = {
    imgContainer: document.querySelector(".img-container"),
    time: document.querySelector(".time"), //倒计时
    divWin: document.getElementById("divwin"),
    divFail: document.getElementById("divfail"),
    divBegin: document.getElementById("divbegin"),
    container: document.querySelector(".container"),
    audBg: document.getElementById("audbg"),
    audRight: document.getElementById("audright"),
    audLose: document.getElementById("audlose"),
    audWin: document.getElementById("audwin"),
};

var cards = []; //用于存放所有卡片对象
var cardNumber = 24; //卡片总数
var maxTime = 30; //总时间：单位秒
var curTime = maxTime; //当前剩余时间
/**
 * 开始游戏
 */
function startGame() {
    //1. 控制元素的显示隐藏
    doms.divBegin.style.display = "none";
    doms.container.style.display = "block";
    //2. 初始化所有卡片
    initCards();
    //3. 启动计时器
    startTime();
    //4. 启动声音
    doms.audBg.play();
}

/**
 * 根据最小值和最大值产生一个随机数
 * @param {*} min 
 * @param {*} max 最大值取不到
 */
function getRandom(min, max) {
    return Math.floor(Math.random() * (max - min) + min);
}

/**
 * 初始化所有卡片
 */
function initCards() {
    for (var i = 0; i < cardNumber; i += 2) {
        var n = getRandom(1, 13);
        cards.push(new Card(n))
        cards.push(new Card(n))
    }
    //随机排序
    cards.sort(function () {
        return Math.random() - 0.5;
    })

    //显示
    for (var i = 0; i < cards.length; i++) {
        doms.imgContainer.appendChild(cards[i].dom)
    }
}

/**
 * 创建卡片的构造函数
 */
function Card(n) {
    this.number = n;
    this.isActive = false; //卡片默认没有选中
    this.isClear = false; //卡片是否已被消除
    //用于显示到页面上的元素
    this.dom = document.createElement("div");
    this.dom.className = "item";
    this.dom.innerHTML = `<img src="images/${n}.png" alt="">`;
    var that = this;
    this.dom.onclick = function () {
        setActive(that)
    }
}

/**
 * 传递一个card对象，该函数控制该对象的选中
 * @param {*} card 
 */
function setActive(card) {
    if (card.isClear) {
        return;//如果卡片已经被消除了，该操作没有任何意义
    }
    //得到之前选中的card对象
    var before = getActiveCard();
    //设置当前卡片的选中状态
    card.isActive = true;
    card.dom.classList.add("active");
    if (!before) {
        //之前没有任何卡片被选中
        return;
    }
    //判断是否能够消除
    if (before.number === card.number) {
        before.isClear = true;
        card.isClear = true;
        before.dom.style.opacity = 0;
        card.dom.style.opacity = 0;
        //从数组中移除
        removeCard(card);
        removeCard(before);
        //播放消除声音
        doms.audRight.currentTime = 0;//让音频的播放时间回到最开始
        doms.audRight.play();
        //成功消除了
        if (cards.length === 0) {
            gameWin();
        }
    }
    else {
        before.isActive = false; //之前的卡片状态变为false
        before.dom.classList.remove("active");
    }
}

/**
 * 从数组中移除一个卡片对象
 * @param {*} card 
 */
function removeCard(card) {
    var index = cards.indexOf(card);
    cards.splice(index, 1);
}

/**
 * 找到选中的并且没有消失的卡片
 */
function getActiveCard() {
    for (var i = 0; i < cards.length; i++) {
        if (cards[i].isActive && !cards[i].isClear) {
            return cards[i];
        }
    }
}


/**
 * 游戏胜利
 */
function gameWin() {
    doms.container.style.display = "none";
    doms.divWin.style.display = "block";
    clearInterval(timer);
    doms.audWin.play();//播放游戏胜利的音乐
    doms.audBg.pause(); //停止播放背景音乐
}

/**
 * 游戏失败
 */
function gameFail() {
    doms.container.style.display = "none";
    doms.divFail.style.display = "block";
    clearInterval(timer);
    doms.audLose.play();//播放游戏失败的音乐
    doms.audBg.pause(); //停止播放背景音乐
}

var timer; //用于保存计时器的id
/**
 * 启动倒计时
 */
function startTime() {
    doms.time.innerText = `${curTime}s`;
    timer = setInterval(function () {
        curTime--;//当前剩余时间-1
        doms.time.innerText = `${curTime}s`;
        if (curTime === 0) {
            //游戏失败
            gameFail();
        }
    }, 1000);
}

doms.divBegin.onclick = function () {
    startGame();
};