var list =[
    [110, 53],
    [210, 53],
    [10, 193],
    [110, 193],
    [210, 193],
    [310, 193],
    [110, 333],
    [210, 333],
    [310, 333],
    [-90, 333],
    [-90, 473],
    [10, 473],
    [10, 333]
];

/********************* 拖拽 *******************/
var audios = document.querySelectorAll(".audio"),
    container = document.querySelector(".container"),
    items = Array.prototype.slice.call(document.querySelectorAll(".item")),
    ul = document.querySelector(".words"),
    words = Array.prototype.slice.call(ul.getElementsByTagName("li")),
    others = Array.prototype.slice.call(document.querySelectorAll(".other")),
    menu = document.querySelector(".menu");
var isDown = false,
    canPoPlay = true,
    hasReached = false, 
    arr = [],
    disX = 0,
    disY = 0,
    left = 0,
    ttop = 0,
    index = -1;
var target = words[0];
addLoadEvent(initDrag);

function initDrag(){
    audios[1].volume = 0.5;
    audios[2].volume = 0.5;
    words.forEach(child => {
        child.addEventListener("mousedown", mousedown);
    });
}

function mousedown(e){
    disX = e.clientX - this.offsetLeft; 
    disY = e.clientY - this.offsetTop; 
    left = this.offsetLeft;
    ttop = this.offsetTop;
    console.log(this.firstChild);
    /*---firstChild会获取包括文本节点在内的子节点，换行符也算文本子节点---*/
    this.firstElementChild.play();
    isDown = true;
    target = e.target;
    document.addEventListener("mousemove", mousemove);
    document.addEventListener("mouseup", mouseup); 
}

function mousemove(e){
    if(!isDown) return;
    target.classList.add('active');
    target.style.boxShadow = '';
    target.style.left = e.clientX - disX + 'px'; 
    target.style.top = e.clientY - disY + 'px';
    var end = mousemoveStyle(list);    
    if(end) return;
    index = -1;
    canPoPlay = true;
}

function mousemoveStyle(list){
    var disx,disy;
    if(arr.length < 9){
        for(let i = 0; i < 10; i++){
            if(arr.indexOf(i) >= 0) continue;
            disx = target.offsetLeft - list[i][0] - container.offsetLeft;
            disy = target.offsetTop - list[i][1] - container.offsetTop;
            if(disx < -20 && disx > -80 && disy < 10 && disy > -50){
                items[i].firstChild.style.boxShadow = "0 0 10px 5px rgba(243,158,6,1)";
                if(canPoPlay){
                    audios[0].currentTime = 0;
                    audios[0].play();
                    canPoPlay = false;
                    index = i;
                }
                hasReached = true;
                return true;
            }
            items[i].firstChild.style.boxShadow = "";
        }
    }else{
        for(let i = 9; i < 13; i++){
            if(arr.indexOf(i) >= 0) continue;
            disx = target.offsetLeft - list[i][0] - container.offsetLeft;
            disy = target.offsetTop - list[i][1] - container.offsetTop;
            if(disx < -20 && disx > -80 && disy < 10 && disy > -50){
                items[i].firstChild.style.boxShadow = "3px -3px 5px 2px #FF8C00";
                if(canPoPlay){
                    audios[0].currentTime = 0;
                    audios[0].play();
                    canPoPlay = false;
                    index = i;
                }
                hasReached = true;
                return true;
            }
        }
        items[i].firstChild.style.boxShadow = "";
    }
}

function mouseup(){
    isDown = false;
    target.className = '';
    target.style.left = left + 'px';
    target.style.top = ttop + 'px';
    if(hasReached){
        items[index].firstChild.style.boxShadow = "";
    }
    if(!hasReached) return;
    currentGrade(target);
    if(arr.length == 9){
        showOther();
        setTimeout(function(){
            linesOfMates(9);
            linesOfChildren(13, 2);
        },500);
        var me = document.querySelector(".me").lastChild;
        me.style.left = "60px";
        ul.style.marginTop = "120px";
    }else if(arr.length == 13){
        displayMenu("menu");
    }
    hasReached = false;
}

function currentGrade(elem){
    if(!(index+1)) return;
    elem.award = elem.award || 10; 
    var order = target.dataset.index - 1;
    if(index == order){
        audios[1].play();
        target.style.display = "none";
        items[index].style.opacity = "0.5";
        items[index].firstChild.style.boxShadow = "none";
        arr.push(index);
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

function showOther(){
    others.forEach(child => {
        child.style.opacity = "1";
        child.style.zIndex = "0";
        child.style.transition = "transform 0.2s";
    });
}

/********************* 画线框 *******************/
var canvas = document.getElementById("canvas");
var ctx = canvas.getContext("2d");
addLoadEvent(initDraw);

function initDraw(){
    ctx.lineWidth = 1;
    ctx.strokeStyle = "white";
    linesOfMates(3);
    linesOfMates(6);
    linesOfMates(8);
    linesOfChildren(7, 2);
    linesOfChildren(11, 3);
    linesOfChildren(12, 1);
}

function linesOfMates(num){
    var posx = (num - 1) % 4 * 100 + 50 + 100;
    var posy = parseInt((num - 1) / 4) * 140 + 96;
    ctx.beginPath();
    ctx.moveTo(posx, posy);
    ctx.lineTo(posx, posy + 10);
    ctx.lineTo(posx - 100, posy + 10);
    ctx.lineTo(posx - 100, posy);
    ctx.moveTo(posx - 50, posy + 10);
    ctx.lineTo(posx - 50, posy + 24.5);
    ctx.stroke();
}

function linesOfChildren(num, count){
    var posx = (num - 1) % 4 * 100 + 50 + 100;
    var posy = parseInt((num - 1) / 4) * 140;
    ctx.beginPath();
    if(count > 1){
        ctx.moveTo(posx, posy - 5);
        ctx.lineTo(posx - (count - 1) * 100, posy - 5);
    }
    for(var i = 0; i < count; i++){
        ctx.moveTo(posx - i * 100, posy + 10);
        ctx.lineTo(posx - i * 100, posy - 5);
    }
    ctx.moveTo(posx - 50 * (count - 1), posy - 5);
    ctx.lineTo(posx - 50 * (count - 1), posy - 19);
    if(count != 2){
        ctx.lineTo(posx - 50 * (count - 1) - 51, posy - 19);
    }
    ctx.stroke();
}

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

/******************  提示框  *******************/
function displayMenu(className){
    var menu = document.querySelector("." + className);
    menu.style.visibility = "visible";
    menu.style.opacity = 1;
}    

/******************  按键  *******************/
const backBtn = document.querySelector(".back");
backBtn.addEventListener("click", function(){
    history.back(-1);
})
const homeBtn = document.querySelector(".home");
homeBtn.addEventListener("click", function(){
    location.href = "../index.html";
})