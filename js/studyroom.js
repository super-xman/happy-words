//自定义配置项
const listU = [[199, 229], [302, 162], [290, 323], [347, 412], [430, 580], [497, 351], [563, 563], [689, 493]],
    listD = [[101, 187], [232, 447]],
    strokeStyle = '#00FFFF',
    offset_y = 70;

/*******************   调节音量   ******************/
const audios = document.querySelectorAll(".audio");
audios[1].volume = 0.5;
audios[2].volume = 0.5;
// ！音量调节

/*******************   拖拽   ******************/
const list = document.querySelectorAll("li");
const picture = document.querySelector(".picture");
const grade = picture.querySelector(".grade");
var arr = [];
var dragItems = new Drag(list, picture);
dragItems.drag();

/********************   画标记   *********************/
var canvas = new Canvas("canvas", strokeStyle);
canvas.radialGradient(listU, listD, offset_y);

/**********************   按键   *********************/
const backBtn = document.querySelector(".back");
backBtn.addEventListener("click", function(){
    history.back(-1);
})
const homeBtn = document.querySelector(".home");
homeBtn.addEventListener("click", function(){
    location.href = "../html/menu.html";
})

/********************   结束提示   *******************/

const endInfo = picture.querySelector(".endInfo");
const endInfoText = endInfo.querySelector("p");
function displayEndInfo(){
    if(arr.length < list.length) return;
    endInfo.style.visibility = "visible";
    endInfo.style.opacity = 1;
    endInfo.style.top = "calc(50% - 55px)";
    console.log(endInfo.lastChild)
    if(parseInt(grade.textContent) < list.length * 10 * 0.8){
        endInfo.removeChild(endInfo.children[2]);
        endInfo.children[1].textContent = "A. Yes";
        endInfoText.textContent = "I'm sorry you almost made it. Please keep trying!";
    }
}

/******************   绘制点击点   *******************/
// canvas.drawPoint();

