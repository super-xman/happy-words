/*******************   绘制标记图   ******************/
var Canvas = function(canvas, strokeStyle){
    var canvas = document.querySelector(`#${canvas}`);
    var ctx = canvas.getContext('2d');
    var backCanvas = document.createElement('canvas'); // 创建一个临时canvas来缓存主canvas的历史图像
    var backCtx = backCanvas.getContext('2d');  
    var radius = 0;

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
    
    function makeCircle(x, y, w, z, offset_y) {
        ctx.lineWidth = w;
        ctx.beginPath();
        if(z == "up"){
            ctx.arc(x, y - offset_y, radius, 0, Math.PI * 2);
        }
        if(z == "down"){
            ctx.arc(x, y + offset_y, radius, 0, Math.PI * 2);
        }
        radius += 0.04;
        if (radius > 15) {
            radius = 0;
        }
        ctx.stroke();
    }

    /* 画场景标记 */
    function drawSign(listU, listD, offset_y){
        for (let i = 0; i < listU.length; i++){
            if(arr.indexOf(i) >= 0) continue; 
            // !if(-1)会执行的，0的转化布尔值是false，-1不是
            // !不能用 i in arr，i代表数组中的位置（或对象属性名）
            makearc(listU[i][0], listU[i][1], 2);
            makelines(listU[i][0], listU[i][1], .3, 'up', offset_y);
            makeCircle(listU[i][0], listU[i][1], 1, 'up', offset_y);
        }
        for (let j = 0; j < listD.length; j++){
            if(arr.indexOf(j+listU.length) >= 0) continue;
            makearc(listD[j][0], listD[j][1], 2);
            makelines(listD[j][0], listD[j][1], .3, 'down', offset_y);
            makeCircle(listD[j][0], listD[j][1], 1, 'down', offset_y);
        }
    }

    function render(listU, listD, offset_y){
        backCtx.drawImage(canvas, 0, 0, canvas.width, canvas.height); 
        // !1.先将主canvas的图像缓存到临时canvas中
        ctx.clearRect(0, 0, canvas.width, canvas.height); 
        // !2.清除主canvas上的图像
        drawSign(listU, listD, offset_y);
        ctx.drawImage(backCanvas, 0, 0, canvas.width, canvas.height); 
        // !3.等标记画完后，再把临时canvas的图像绘制回主canvas中
        setTimeout(function(){render(listU, listD, offset_y)}, 30);
    }
    
    /* 画点击点 */
    function makePoint(e){
        console.log(e.offsetX, e.offsetY);
        makearc(e.offsetX, e.offsetY, 2);
    }

    this.drawPoint = function(){
        canvas.addEventListener("click", makePoint);
    }

    /* 径向渐变动画 */
    this.radialGradient = function(listU, listD, offset_y){
        backCanvas.width = canvas.width;
        backCanvas.height = canvas.height;
        ctx.globalAlpha = 0.93;
        backCtx.globalCompositeOperation = 'copy';  
        // !显示即将绘制的图像，忽略临时canvas中已存在的图像(详解见 https:www.cnblogs.com/fangsmile/p/10132920.html)
        ctx.strokeStyle = strokeStyle;
        render(listU, listD, offset_y);
    }
}

/*******************   拖拽匹配   ******************/
var Drag = function(list, picture){
    const lenU = listU.length;
    const lenD = listD.length;
    var isDown = false,
        canPoPlay = true,
        hasReached = false, 
        target = null,
        disX = 0,
        disY = 0,
        left = 0,
        ttop = 0,
        // !top是保留字不能定义变量
        index = -1;

    function mousedown(e){
        disX = e.clientX - this.offsetLeft; 
        disY = e.clientY - this.offsetTop; 
        // !offset-元素相对于父元素（有定位）或文档的left,client-鼠标相对于窗口的位置
        // !元素的margin-top,margin-left会影响元素定位，如offsetTop是不包含margin部分到顶部距离
        left = this.offsetLeft;
        ttop = this.offsetTop;
        this.classList.add('active');
        list.forEach(list => {list.style.opacity = .1;}); 
        // !opacity会被应用到后代元素
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
        // !target.style.boxShadow = ''不会更改css中定义的样式
        target.style.left = e.clientX - disX + 'px'; 
        // !style.left的值是相对于有定位的父元素的。否则是相对于文档的。
        target.style.top = e.clientY - disY + 'px';
        for(let i = 0; i < lenU + lenD; i++){
            if(arr.indexOf(i) >= 0) continue;
            let disx = i < lenU ? 
                target.offsetLeft - listU[i][0] - picture.offsetLeft - 16: 
                target.offsetLeft - listD[i-lenU][0] - picture.offsetLeft - 16; //16为picture边框厚度
            let disy = i < lenU ? 
                target.offsetTop - listU[i][1] + offset_y - picture.offsetTop - 16: 
                target.offsetTop - listD[i-lenU][1] - offset_y - picture.offsetTop - 16;
            if(disx < -25 && disx > -100 && disy < -10 && disy > -40){
                target.style.boxShadow = `0 0 0 5px ${strokeStyle}`; 
                // !css属性box-shadow在js中写成boxShadow
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
        target.classList.remove('active');
        target.style.left = left + 'px';
        target.style.top = ttop + 'px';
        list.forEach(list => {list.style.opacity = 1; });
        target.boxShadow = target.style.boxShadow = '';
        if(!hasReached) return;
        currentGrade();
        showIncentiveInfo();
        showEndInfo();
        hasReached = false;
    }
    
    const grade = picture.querySelector(".grade");
    var multiKill = 0;

    function currentGrade(){
        if(!(index+1)) return;
        target.award = target.award || 10;
        if(index == target.dataset.index){
        // !用.dataset获取元素中的data-*属性
            grade.innerText = parseInt(grade.innerText) + target.award;
            // !用innerText获取元素中的文本的值
            audios[1].play();
            target.style.display = "none";
            arr.push(index);
            multiKill++;
        }else{
            audios[2].play();
            multiKill = 0;
        }
        if(target.award == 10){
            target.award -= 5;
        }else if(target.award == 5){
            target.award -= 4;
            target.style.color = "#FF4500";
        }
    }

    function selectIncentiveInfo(){
         if(multiKill > 1){
            switch (multiKill){
                case 2: return "Double kill!";
                case 3: return "Triple kill!";
                case 4: return "Quadra kill!";
                case 5: return "Penta kill!";
                case 6: return "Unstoppable!";
                case 7: return "Unbelievable!";
                case 8: return "God like!";
                default: return "Legend!";
            }
         }
    }

    function showIncentiveInfo(){
        if (arr.length == list.length) return;
        var incentiveInfo = selectIncentiveInfo();
        if(!incentiveInfo) return;
        const info = picture.querySelector(".incentive-info");
        info.textContent = incentiveInfo;
        info.style.transform = "translate(-50%, -50%)";
        toggleStyle(info);
        setTimeout(function(){
            toggleStyle(info);
            info.style.transform = "translate(-50%, -100%)";
        }, 500);
        // ！碰到延时执行函数程序会先执行之后的代码
        setTimeout(function(){
            info.style.transform = "translate(-50%, 0)";
        }, 1000); //保证在前面函数执行完后再执行它
        // todo: 有没有办法在前面函数调用结束后自动执行之后代码
    }

    function toggleStyle(elem){
        elem.classList.toggle(`active-info`);
        elem.classList.toggle(`hide-info`);
    }

    /* 结束提示 */
    function showEndInfo(){
        if (arr.length < list.length) return;
        const endInfo = picture.querySelector(".endInfo");
        endInfo.style.visibility = "visible";
        endInfo.style.opacity = 1;
        endInfo.style.top = "calc(50% - 55px)";
        if (parseInt(grade.textContent) < list.length * 10 * 0.8) {
            endInfo.removeChild(endInfo.children[2]);
            endInfo.children[1].textContent = "A. Yes";
            endInfo.children[0].textContent = "I'm sorry you almost made it. Please keep trying!";
        }
    }

    this.drag = function(){
        list.forEach(list => {
            list.addEventListener("mousedown", mousedown);
        });
    }
}
