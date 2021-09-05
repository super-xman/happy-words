var btns = document.getElementsByTagName("button"),
    block = document.querySelector(".block"),
    colors = document.getElementsByName("color")[0],
    audios = document.querySelector(".audios");
var canPlay = false;

function changeSize(w, h){
    block.style.width = w +'px';
    block.style.height = h +'px';
}

function changePosition(ttop, left){
    if(ttop >= 0){
        block.style.top = ttop + 'px';
    }else{
        block.style.top = `calc(100% + ${ttop}px)`
    }
    if(left >= 0){
        block.style.left = left + 'px';
    }else{
        block.style.left = `calc(100% + ${left}px)`;
    }
}

function changeColor(){
    if(!canPlay) {
        canPlay = true;
        return;
    }
    var currentColor = colors.value;
    var currentAudio = audios.querySelector(`.${currentColor}`);
    block.style.backgroundColor = currentColor;
    currentAudio.play();
    canPlay = false;
}

function playAudio(){
    this.lastChild.currentTime = 0;
    this.lastChild.play();
    // ！函数中的this指向全局对象
}
function pressButtons(){
    var w = 100,
        h = 100,
        left = block.offsetLeft,
        ttop = block.offsetTop;

    btns[0].addEventListener("click", function wider(){
        changeSize(w += 20, h);
        playAudio.call(this);
        // ！可以用方法名后用call改变this指向
    });

    btns[1].addEventListener('click', function heigher(){
        changeSize(w, h += 20);
        changePosition(ttop -= 20, left);
        /*---可以直接在参数里赋值---*/
        playAudio.call(this);
    });

    btns[2].addEventListener('click', function bigger(){
        changeSize(w += 40, h += 40);
        changePosition(ttop -= 20, left -= 20);
        playAudio.call(this);
    });

    btns[3].addEventListener('click', function smaller(){
        if(w <= 20 || h <= 20) {
            alert("不能再小了！");
            return;
        }
        if(w <= 40 || h <= 20){
            changeSize(w -= 20, h -= 20);
        }else{
            changeSize(w -= 40, h -= 40);
            changePosition(ttop += 20, left += 20);
        }
        playAudio.call(this);
    });

    btns[4].addEventListener('click', function long(){
        changeSize(w = 400, h = 20);
        playAudio.call(this);
    });

    btns[5].addEventListener('click', function short(){
        changeSize(w = 100, h = 20);
        playAudio.call(this);
    });

    btns[6].addEventListener('mousedown', function toTop(){
        changePosition(ttop = 1, left);
        playAudio.call(this);
    });

    btns[7].addEventListener('mousedown', function toBottom(){
        changePosition(ttop = -h, left);
        playAudio.call(this);
    });

    btns[8].addEventListener('mousedown', function toLeft(){
        changePosition(ttop, left = 1);
        playAudio.call(this);
    });

    btns[9].addEventListener('mousedown', function toRight(){
        changePosition(ttop, left = -w);
        playAudio.call(this);
    });

    btns[10].addEventListener('mousedown', function reset(){
        changeSize(100, 100);
        changePosition(301, 401);
        playAudio.call(this);
    });
}

colors.addEventListener("mouseup", changeColor);
pressButtons();

/******************  按键  *******************/

const backBtn = document.querySelector(".back");
backBtn.addEventListener("click", function(){
    history.back(-1);
})
const homeBtn = document.querySelector(".home");
homeBtn.addEventListener("click", function(){
    location.href = "../index.html";
})