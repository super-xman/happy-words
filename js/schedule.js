var durationColor = "rgb(198, 253, 198)",
    numColor = "rgb(253, 247, 198)",
    classColor = "rgb(198, 199, 253)",
    weekdayColor = "rgb(198, 253, 250)";

/********************* 拖拽 *******************/

const audios = document.querySelectorAll(".audio"),
    table = document.getElementsByTagName("table")[0],
    classItems = table.querySelectorAll("td"),
    weekdayItems = table.querySelectorAll('[scope="col"]'),
    numItems = table.querySelectorAll('[scope="row"]'),
    durationItems = table.querySelectorAll('[colspan="7"]'),
    /*--- querySelector选择器可以选择特定属性的对象 ---*/
    ul = document.querySelector(".words"),
    words = ul.querySelectorAll("li");
var isDown = false,
    canPoPlay = true,
    disX = 0,
    disY = 0,
    left = 0,
    ttop = 0,
    cx = 0,
    cy = 0,
    parentClassName = "";
var target = null;

addLoadEvent(initDrag);

function initDrag() {
    audios[1].volume = 0.5;
    audios[2].volume = 0.5;
    words.forEach(child => {
        child.addEventListener("mousedown", mousedown);
    });
}

function mousedown(e) {
    left = this.offsetLeft;
    ttop = this.offsetTop;
    disX = e.pageX - left;
    disY = e.pageY - ttop;
    this.firstElementChild.play();
    isDown = true;
    target = e.target;
    parentClassName = this.parentNode.className;
    /*--- 获取父节点的类名 ---*/

    if (parentClassName == "duration") {
        durationItems.forEach(child => {
            child.style.background = durationColor;
        });
    } else if (parentClassName == "num") {
        numItems.forEach(child => {
            child.style.background = numColor;
        });
    } else if (parentClassName == "class") {
        classItems.forEach(child => {
            child.style.background = classColor;
        });
    } else if (parentClassName == "weekday") {
        weekdayItems.forEach(child => {
            child.style.background = weekdayColor;
        });
    }

    document.addEventListener("mousemove", mousemove);
    document.addEventListener("mouseup", mouseup);
}

function mousemove(e) {
    if (!isDown) return;
    target.classList.add('active');
    target.style.left = e.pageX - disX + 'px';
    target.style.top = e.pageY - disY + 'px';
    /* .left/.top同offsetX/Y一样，是相对于带有定位的祖先元素的定位,所以如果页面有折叠需用pageX而不是clientX */
    cx = target.offsetLeft + 45 - tablePos[0];
    cy = target.offsetTop + 16.5 - tablePos[1];
    canPoPlay = true;
}

function mouseup() {
    isDown = false;
    target.className = '';
    switch (parentClassName) {
        case "duration":
            reach(arr1);
            break;
        case "num":
            reach(arr2);
            break;
        case "weekday":
            reach(arr3);
            break;
        case "class":
            reach(arr4);
            break;
    }
    parentClassName = '';
}

function reach(arr) {
    var reachedItem = arr.filter(elem => {
        if (arr == arr1) {
            return Math.abs((elem[0] - cx)) < 274.5 && Math.abs((elem[1] - cy)) < 10;
        } else {
            return (elem[0] - cx) * (elem[0] - cx) / 225 + (elem[1] - cy) * (elem[1] - cy) / 100 < 1;
        }
    })[0] || [];

    arr.items.forEach((child, index) => {
        if (arr[index][2] >= 0) {
            child.style.background = "";
        }
    });

    if (reachedItem.length) {
        /*不能用if([]),[]也会被转义成true，尽管 [] == false 会输出true*/
        if (arr !== arr4) {
            if (target.dataset.index != reachedItem[2]) {
                audios[2].play();
                return;
            }
            target.style.display = "none";
        }
        var itemThirdNum = reachedItem[2] >= 0 ? reachedItem[2] : Math.abs(reachedItem[2]) - 1; //课程单元替换
        arr.items[itemThirdNum].style.background = arr.color;
        arr.items[itemThirdNum].textContent = target.innerText;
        /* innerText，textContent可以更改或获取标签内的文本信息 */
        /* innerText更改文本时若来源文本设置了display="none"，则被改文本不会保留原有样式，而textContent依然保留。所以这里不能用.innerText=target.innerText*/
        arr[itemThirdNum][2] = -Math.abs(itemThirdNum) - 1;
        audios[1].play();
    }
}

/******************  定义单元格位置点  *******************/

var tablePos = [table.offsetLeft + table.children[1].offsetLeft, table.offsetTop + table.children[1].offsetTop];
/* 单元格的位置关系默认是相对于表格的 */
var arr1 = [],
    arr2 = [],
    arr3 = [],
    arr4 = [];

function initArrs() {
    arr1 = [
        [416, 55.2, 0],
        [416, 231.2, 1]
    ];

    for (var i = 0, j = 0; i < 8; i++) {
        if (i == 4) continue;
        let x = 50;
        let y = (i + 2) * 35.2 + 20;
        arr2.push([x, y, j]);
        j++;
    }

    for (var i = 0, j = 0; i < 7; i++) {
        let x = (i + 1) * 91.5 + 50;
        let y = 20;
        arr3.push([x, y, j]);
        j++;
    }

    for (var i = 0, j = 0; i < 56; i++) {
        if (parseInt(i / 7) == 4) continue;
        let x = (i % 7 + 1) * 91.5 + 50;
        let y = (parseInt(i / 7) + 2) * 35.2 + 20;
        arr4.push([x, y, j]);
        j++;
    }

    arr1.items = durationItems;
    arr1.color = durationColor;
    arr2.items = numItems;
    arr2.color = numColor;
    arr3.items = weekdayItems;
    arr3.color = weekdayColor;
    arr4.items = classItems;
    arr4.color = classColor;
}

addLoadEvent(initArrs);

/******************  窗口改变时触发  *******************/

window.addEventListener("resize", function () {
    tablePos = [table.offsetLeft + table.children[1].offsetLeft, table.offsetTop + table.children[1].offsetTop];
})

/******************  按键  *******************/

const backBtn = document.querySelector(".back");
backBtn.addEventListener("click", function () {
    history.back(-1);
    /* 回退 */
})
const homeBtn = document.querySelector(".home");
homeBtn.addEventListener("click", function () {
    location.href = "../html/menu.html";
    /* 打开指定链接，window.location为当前窗口url对象参考 */
    /* 任何 window属性都可以省略"window." */
})

/******************  其他  *******************/

function addLoadEvent(func) {
    var oldonload = window.onload;
    if (typeof window.onload != 'function') {
        window.onload = func;
    } else {
        window.onload = function () {
            oldonload();
            func();
        }
    }
}