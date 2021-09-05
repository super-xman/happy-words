// 自定义配置项
var list1Boy = [  //全身
    [256, 183],
    [266, 483],
    [330, 426],
    [388, 376],
    [325, 593],
    [344, 665],
    [265, 390, 530, 300]
];
var list2Boy = [  //头部
    [264, 160],
    [350, 355],
    [361, 293],
    [263, 417],
    [328, 486],
    [53, 440, 53, 500]
];
var list1Girl = [  //全身
    [256, 183],
    [285, 483],
    [360, 420],
    [438, 360],
    [328, 644, 530, 600],
    [335, 680],
    [285, 400, 530, 300]
];
var list2Girl = [  //头部
    [290, 167],
    [400, 370],
    [389, 312],
    [336, 395, 530, 430],
    [336, 440, 530, 490],
    [148, 400, 148, 460]
];
var strokeStyle = '#40E0D0',
    toPosX = 530;


/*******************   获取性别   ******************/
var menus = document.querySelector(".menu"),
    btns = menus.querySelectorAll(".gender"),
    ul = document.getElementsByTagName("ul")[0],
    pic = document.querySelector(".picture"),
    boyPic = pic.querySelector(".boy"),
    girlPic = pic.querySelector(".girl");
var list1 = [],
    list2 = [],
    _list1 = [],
    _list2 = [];
var gender = "";
var blurPic, overOrgans, detailOrgans;
btns.forEach(btn => btn.addEventListener("click", getList));

function getList(){
    gender = this.textContent;
    console.log(gender)
    if(gender == "male"){
        list1 = list1Boy;
        list2 = list2Boy;
        boyPic.style.display = "block";
    }else if(gender == "female"){
        list1 = list1Girl;
        list2 = list2Girl;
        girlPic.style.display = "block";
    }else{
        alert("请选择你的性别。");
        return;
    }
    removeMenu("genderBox");
    removeMenu("img");
    ul.style.visibility = "visible";

    var picSet = gender == "male" ? boyPic : girlPic;
    blurPic = picSet.querySelector(".blur");
    overOrgans = picSet.querySelectorAll(".overall");
    detailOrgans = picSet.querySelectorAll(".detail");
}

/*******************   拖拽   ******************/
var audios = document.querySelectorAll(".audio");
var detailLis = ul.querySelectorAll(".detail"),
    overLis = ul.querySelectorAll(".overall");
var isDown = false,
    canPoPlay = true,
    hasReached = false, 
    showDetail = false,
    target = overLis[0],
    arr = [],
    disX = 0,
    disY = 0,
    left = 0,
    ttop = 0,
    index = -1;
addLoadEvent(initDrag);

function initDrag(){
    audios[1].volume = 0.5;
    audios[2].volume = 0.5;
    overLis.forEach(list => {
        list.addEventListener("mousedown", mousedown);
    });
    detailLis.forEach(list => {
        list.addEventListener("mousedown", mousedown);
    });
}

function mousedown(e){
	disX = e.clientX - this.offsetLeft; 
    disY = e.clientY - this.offsetTop; 
    left = this.offsetLeft;
    ttop = this.offsetTop;
    this.classList.add('active');
    if(!showDetail){
        overLis.forEach(list => {list.style.opacity = .1;});    
    }else{
        detailLis.forEach(list => {list.style.opacity = .1;});     
    }
    this.style.opacity = .8;
    this.firstChild.play();
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
    if(!showDetail){
        var end = mousemoveStyle(list1, _list1);    
    }else{
        var end = mousemoveStyle(list2, _list2);    
    }
    if(end) return;
    index = -1;
    canPoPlay = true;
}

function mousemoveStyle(list){
    var disx,disy;
    for(let i = 0; i < list.length; i++){
        if(arr.indexOf(i) >= 0) continue;
        /*---target.style.boxShadow = ''不会更改css中定义的样式---*/
        if(list[i].length !== 2){
            disx = ul.offsetLeft + target.offsetLeft - list[i][2] - pic.offsetLeft;
            disy = ul.offsetTop + target.offsetTop - list[i][3] - pic.offsetTop;
        }else{
            disx = ul.offsetLeft + target.offsetLeft - toPosX - pic.offsetLeft;
            disy = ul.offsetTop + target.offsetTop - list[i][1] - pic.offsetTop;
        }
        if(disx < -10 && disx > -170 && disy < -10 && disy > -40){
            target.style.boxShadow = ' 0 0 10px 2px	#1E90FF'; 
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
}

function mouseup(){
    isDown = false;
    target.className = '';
    target.style.left = left + 'px';
    target.style.top = ttop + 'px';
    if(!showDetail){
        overLis.forEach(list => {list.style.opacity = 1; });
    }else{
        detailLis.forEach(list => {list.style.opacity = 1;});   
    }
    target.boxShadow = target.style.boxShadow = '';
    if(!hasReached) return;
    currentGrade(target);
    if(showDetail && arr.length >= list2.length){
        overOrgans[0].style.filter = "";
        overOrgans[0].style.visibility = "hidden";
        detailOrgans.forEach(pic => {
            pic.style.visibility = "hidden";
        });
        setTimeout(function(){
            displayMenu("pass");
            displayMenu("img");
        }, 1000);
        /*---如果不在外面套function匿名函数，会立即调用函数---*/
    }
    hasReached = false;
}

function currentGrade(elem){
    if(!(index+1)) return;
    elem.award = elem.award || 10; 
    var order = showDetail ? target.dataset.index - overLis.length : target.dataset.index;
    if(index == order){
        audios[1].play();
        target.style.display = "none";
        arr.push(index);
        displayOrgan();
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

/************************   显示器官   *************************/
function displayOrgan(){
    if(!showDetail){
        overOrgans[index].style.display = "block";
    }else{
        detailOrgans[index].style.display = "block";
    }
    if(arr.length == list1.length){
        setTimeout(function(){
            for(var i = 1; i < overOrgans.length; i++){
                overOrgans[i].style.display = "none";
            }
            blurPic.style.display = "none";
            detailLis.forEach(word => {
                word.style.display = "block";
            });
            overOrgans[0].style.display = "block"; //显示头部
            if(gender == "male"){
                overOrgans[0].style.width = "750px";
                overOrgans[0].style.height = "1170px";
                overOrgans[0].style.marginLeft = "-125px";
                detailOrgans.forEach(pic => {
                    pic.style.width = "750px";
                    pic.style.height = "1170px";
                    pic.style.marginLeft = "-125px";
                });
            }else{
                overOrgans[0].style.width = "600px";
                overOrgans[0].style.height = "936px";
                detailOrgans.forEach(pic => {
                    pic.style.width = "600px";
                    pic.style.height = "936px";
                });
            }
            overOrgans[0].style.filter = "blur(6px)";
        }, 1000);
        showDetail = true;
        arr = [];
    }
}

/************************   画标记   *************************/
var canvas = document.getElementById('canvas'),
    ctx = canvas.getContext("2d");
var backCanvas = document.createElement('canvas'),
    backCtx = backCanvas.getContext('2d');  
var radius = 0;
var newSign = false;
addLoadEvent(initDraw);

function initDraw(){
    backCanvas.width = canvas.width;
    backCanvas.height = canvas.height;
    ctx.globalAlpha = 0.95;
    backCtx.globalCompositeOperation = 'copy';
    ctx.strokeStyle = strokeStyle;
    render();
}

function render() {
    backCtx.drawImage(canvas, 0, 0, canvas.width, canvas.height); 
    ctx.clearRect(0, 0, canvas.width, canvas.height); 
    if(!showDetail){
        drawSign(list1);
        ctx.drawImage(backCanvas, 0, 0, canvas.width, canvas.height);
        setTimeout(render, 30);
    }else if(!newSign){
        setTimeout(render, 2000);
        newSign = true;
    }else{
        drawSign(list2);
        ctx.drawImage(backCanvas, 0, 0, canvas.width, canvas.height);
        setTimeout(render, 30);    
    }
}

function drawSign(list){
    for (let i = 0; i < list.length; i++){
        if(arr.indexOf(i) >= 0) continue; 
        if(list[i].length == 2){
            makearc(list[i][0], list[i][1], 2);
            makelines(list[i][0], list[i][1], toPosX, list[i][1], .3);
            drawCircle(toPosX, list[i][1], 1);  
        }else{
            makearc(list[i][0], list[i][1], 2);
            makelines(list[i][0], list[i][1], list[i][2], list[i][3], .3);
            drawCircle(list[i][2], list[i][3], 1);
        }

    }
}

function makearc(x, y, r){
    ctx.beginPath();
    ctx.arc(x, y, r, 0, 180);
    ctx.fillStyle = ctx.strokeStyle;
    ctx.fill();
    ctx.stroke();
}

function makelines(x, y, _x, _y, w){
    ctx.lineWidth = w;
    ctx.beginPath();
    ctx.moveTo(x, y);
    ctx.lineTo(_x, _y);
    ctx.stroke();
}

function drawCircle(x, y, w) {
    ctx.lineWidth = w;
    ctx.beginPath();
    ctx.arc(x, y, radius, 0, Math.PI * 2);
    radius += 0.04;
    if (radius > 20) {
        radius = 0;
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

/*********************   提示框   **********************/
function displayMenu(className){
    var menu = menus.querySelector("." + className);
    menu.style.visibility = "visible";
    menu.style.transform = "scale(1)";
}    

function removeMenu(className){
    var menu = menus.querySelector("." + className);
    menu.style.visibility = "hidden";
    menu.style.transform = "scale(0.1)";
}  

menus.querySelector(".pass_btn").addEventListener("click", function(){
    window.location.href = "index.html";
});
displayMenu("genderBox");
displayMenu("img");

/*********************   获取关键点   **********************/
function getKeyPonint(obj){
    obj.onclick = function(e){
        var x = e.offsetX;
        var y = e.offsetY;
        /*---offsetX/Y表示相对于有定位的祖先元素的位置---*/
        console.log([x,y]);
        makearc(x,y,2);
    }
}
// getKeyPonint(canvas);