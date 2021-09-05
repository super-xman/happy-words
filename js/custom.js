//自定义配置项
var listU = [],
    listD = [],
    strokeStyle = '#00FFFF',
    offset_y = 70;

/*******************   拖拽   ******************/
const ul = document.querySelector("ul"),
      audios = document.querySelectorAll(".audio"),
      pic = document.querySelector(".picture"),
      grade = pic.querySelector(".grade");
var lists = ul.querySelectorAll("li");
var isDown = false,
    canPoPlay = true,
    hasReached = false, 
    target = lists[0],
    arr = [],
    disX = 0,
    disY = 0,
    left = 0,
    ttop = 0,
    index = -1; 

addLoadEvent(init);

function init(){
    grade.style.display = "none";
    audios[1].volume = 0.5;
    audios[2].volume = 0.5;
}

function mousedown(e){
	disX = e.clientX - this.offsetLeft; 
    disY = e.clientY - this.offsetTop; 
    left = this.offsetLeft;
    ttop = this.offsetTop;
    this.className = 'active';
    lists.forEach(list => {list.style.opacity = .1;})
    this.firstChild.play();
    this.style.opacity = .8;
    // this.firstChild.play();
    isDown = true;
    target = e.target;
    document.addEventListener("mousemove", mousemove);
    document.addEventListener("mouseup", mouseup); 
}

function mousemove(e){
    if(!isDown) return;
    target.style.boxShadow = '';
    target.style.left = e.clientX - disX + 'px'; 
    target.style.top = e.clientY - disY + 'px';
    for(let i = 0; i < listU.length + listD.length; i++){
        if(arr.indexOf(i) >= 0) continue;
        let disx = i < listU.length ? 
            target.offsetLeft - listU[i][0] - pic.offsetLeft - 16: 
            target.offsetLeft - listD[i-listU.length][0] - pic.offsetLeft - 16; //16为picture边框厚度
        let disy = i < listU.length ? 
            target.offsetTop - listU[i][1] + offset_y - pic.offsetTop - 16: 
            target.offsetTop - listD[i-listU.length][1] - offset_y - pic.offsetTop - 16;
        if(disx < -10 && disx > -170 && disy < -10 && disy > -40){
            target.style.boxShadow = '0 0 0 5px #00FFFF'; 
            if(canPoPlay){
                audios[0].currentTime = 0;
                audios[0].play();
                canPoPlay = false;  //防止单词框满足条件时持续发声
                index = i;
            }
            hasReached = true;
            return;
        }
    }
    index = -1; //防止单词框进入正确区域再移到空白区域松手还算答题正确。
    canPoPlay = true;
}

function mouseup(){
    isDown = false;
    target.className = '';
    target.style.left = left + 'px';
    target.style.top = ttop + 'px';
    lists.forEach(list => {list.style.opacity = 1; });
    target.boxShadow = target.style.boxShadow = '';
    if(!hasReached) return;
    currentGrade(target);
    hasReached = false;
}

function currentGrade(elem){
    if(!(index+1)) return;
    elem.award = elem.award || 10;
    console.log([index, target.dataset.index]);
    if(index == target.dataset.index){
        grade.innerText = parseInt(grade.innerText) + elem.award;
        audios[1].play();
        target.style.display = "none";
        arr.push(index);
        canvas.height = canvas.height;
        drawSign();
    }else{
        audios[2].play();
    }
    if(elem.award == 10){
        elem.award -= 5;
    }else if(elem.award == 5){
        elem.award -= 4;
        target.style.color = "red";
    }
}

/**********************   画标记   ***********************/
var canvas = document.getElementById('canvas'),
    ctx = canvas.getContext("2d");

function drawSign(){
    ctx.strokeStyle = strokeStyle;
    for (let i = 0; i < listU.length; i++){
        if(arr.indexOf(i) >= 0) continue; 
        makearc(listU[i][0], listU[i][1], 2.5);
        makelines(listU[i][0], listU[i][1], 1, 'up', 70);
        drawCircle(listU[i][0], listU[i][1], 2, 2, 'up', 70);
        drawCircle(listU[i][0], listU[i][1], 15, 2, 'up', 70);
    }
    for (let j = 0; j < listD.length; j++){
        if(arr.indexOf(j+listU.length) >= 0) continue;
        makearc(listD[j][0], listD[j][1], 2.5);
        makelines(listD[j][0], listD[j][1], 1, 'down', 70);
        drawCircle(listD[j][0], listD[j][1], 2, 2, 'down', 70);
        drawCircle(listD[j][0], listD[j][1], 15, 2, 'down', 70);
    }
}

function makearc(x, y, r){
    ctx.beginPath();
    ctx.arc(x, y, r, 0, 180);
    ctx.fillStyle = ctx.strokeStyle;
    ctx.fill();
    ctx.stroke();
}

function makelines(x, y, w, z){
    ctx.lineWidth = w;
    ctx.beginPath();
    ctx.moveTo(x, y);
    if(z == "up"){
        ctx.lineTo(x, y - offset_y);
    }
    if(z == "down"){
        ctx.lineTo(x, y + offset_y);
    }
    ctx.stroke();
}

function drawCircle(x, y, r, w, z, offset_y) {
    ctx.lineWidth = w;
    ctx.beginPath();
    if(z == "up"){
        ctx.arc(x, y - offset_y, r, 0, Math.PI * 2);
    }
    if(z == "down"){
        ctx.arc(x, y + offset_y, r, 0, Math.PI * 2);
    }
    ctx.stroke();
}

/**********************   按键   *********************/
const backBtn = document.querySelector(".back");
backBtn.addEventListener("click", function(){
    history.back(-1);
})
const homeBtn = document.querySelector(".home");
homeBtn.addEventListener("click", function(){
    location.href = "../html/menu.html";
})
const addBtn = document.querySelector(".add");
addBtn.addEventListener("click", addNewWord);

/**********************   自定义图片   *********************/
const addNewPic = pic.querySelector(".new_pic");
const inputNewPic = addNewPic.querySelector("input");
var hasNewPic = false;

addNewPic.addEventListener("click", function(){
    inputNewPic.click();
});

inputNewPic.addEventListener("change", function(){
    const newsrc = getObjectURL(this.files[0]);
    // ！obj.files获取input元素中上传的文件对象的集合
    const img = addNewPic.querySelector(".background");
    img.height = 630;
    img.src = newsrc;
    pic.appendChild(img);
    addNewPic.style.display = "none";
    img.onload = function(){
    // ！如果不用onload，picture大小是img没加载前的大小，因为图片加载落后于html加载
        canvas.width = pic.clientWidth;
        canvas.height = pic.clientHeight;
        pic.classList.remove("default");
        grade.style.display = "block";
        hasNewPic = true;
    }
});

function getObjectURL(file) {
    var url = null;
    // 下面函数执行的效果是一样的，只是需要针对不同的浏览器执行不同的 js 函数而已
    if (window.createObjectURL != undefined) { // basic
        url = window.createObjectURL(file);
    } else if (window.URL != undefined) { // mozilla(firefox)
        url = window.URL.createObjectURL(file);
    } else if (window.webkitURL != undefined) { // webkit or chrome
        url = window.webkitURL.createObjectURL(file);
    }
    // ！createObjectURL(file)返回文件file的地址
    return url;
}

/**********************   自定义单词   *********************/
const inputNewWord = document.querySelector(".input_word");
const hint = document.querySelector(".hint");
const submit = document.querySelector(".submit");
var isSubmited = false;

submit.addEventListener("click", function(){
    showNewWord();
    isSubmited = true;
    inputNewWord.value = '';
    submit.style.display = 'none';
    inputNewWord.placeholder = "输入单词";
    hint.style.visibility = "hidden";
    canvas.removeEventListener("click", ClickPoint);
})

function addNewWord(){
    if(!hasNewPic){
        alert("请先添加图片");
        return;
    }
    inputNewWord.style.display = "inline";
    inputNewWord.addEventListener("focus", function(){
        inputNewWord.placeholder = "";
    });

    inputNewWord.addEventListener("keyup", function(e){
        var keyCode = window.event ? e.keyCode : e.which; 
        // ！Internet Explorer/Chrome 浏览器使用 event.keyCode 取回被按下的字符，而 Netscape/Firefox/Opera 等浏览器使用 event.which。
        hint.style.visibility = "visible";
        hint.textContent = "按回车确定";
        if(keyCode == 13){ //回车键
            this.blur();
            hint.textContent = "点击右图中该单词对应物";
            canvas.addEventListener("click", ClickPoint);
        }
    });
}

function showNewWord(){
    ul.innerHTML += `<li data-index="${listU.length+listD.length-1}"><audio src="https://fanyi.baidu.com/gettts?lan=en&text=${inputNewWord.value}&spd=5&source=web" class="audio"></audio>${inputNewWord.value}</li>`
    lists = ul.querySelectorAll("li");
    lists.forEach(list => {
        list.addEventListener("mousedown", mousedown);
    });
}

/*******************   绘制点击点   ******************/
var isInListD = false;
function ClickPoint(e){
    canvas.height = canvas.height; //清空画布
    // ！改变画布的长或宽就能清空画布
    if(!isSubmited){
        isInListD ? listD.splice(listD.length-1, 1) : listU.splice(listU.length-1, 1); //删除数组最后一位元素
    }else{
        isSubmited = false;
    }
    if(e.shiftKey){
    // ！按住shift则e.shiftKey为true
        listD.push([e.offsetX, e.offsetY]);
        isInListD = true;
    }else{
        listU.push([e.offsetX, e.offsetY]);
        isInListD = false;
    }
    drawSign();
    submit.style.display = "inline";
}

/**********************   其他   *********************/
function addLoadEvent(func){
    var oldonload = window.onload;
    if(typeof window.onload != 'function'){
        window.onload = func;
    }else{
        window.onload = function(){
            oldonload();
            func();
        }
    }
}
