let display = document.querySelector(`#display`);
let times=[];
let misses=0;
let averageTime = 0;

function startGame(){
    updateStatistics();
    this.setAttribute(`style`, `display:none`);
    document.querySelector(`#logo`).textContent=`Rabid Rabbits Tea Time`;
    document.querySelector(`#reaction-time`).textContent=0;
    document.querySelector(`#reaction-time`).setAttribute(`style`, `display:inline`);
    let gameTimer=setInterval(createTarget, 800);
    setTimeout(finishGame,40500,gameTimer);
}

function finishGame(gameTimer){
    clearInterval(gameTimer);
    setTimeout(()=>{
        document.querySelector(`#start`).setAttribute(`style`, `display:inherit`);
        misses=0;
        averageTime=0;
        times.length=0;
    },3000);
}

function createTarget(){
    let target = createElement(`div`,display,``,`targets`);
    let XY=getRandomXY();
    let color=getRandomColor();
    target.setAttribute(`style`, `top: ${XY[1]}px; left: ${XY[0]}px; 
                                  background-color: rgb(${color[0]}, ${color[1]}, ${color[2]});`);
    target.addEventListener(`click`, stopTargetTimer);
    target.timeLeft = 3000;
    let targetTimer = setInterval(reduceTarget,10,target);
    setTimeout(()=>{clearInterval(targetTimer)},3500);
}

function getRandomXY(){
    let maxX = display.clientWidth - 100;
    let maxY = display.clientHeight - 100;
    let randomX=(getRandom(maxX));
    let randomY=(getRandom(maxY));
    return [(maxX-randomX),(maxY-randomY)];
}
function getRandomColor(){
    return [getRandom(255),getRandom(255),getRandom(255)];
}

function reduceTarget(target){
    if (!display.contains(target)) return;
    target.timeLeft-=10;
    if (target.timeLeft===0 ) {
        misses++;
        display.removeChild(target);
        updateStatistics();
        return;
    }
    target.style.width = `${target.timeLeft/30}px`;
    target.style.height = `${target.timeLeft/30}px`;
}

function stopTargetTimer(e){
    let time = 3000 - this.timeLeft;
    times.push(time);
    updateStatistics();
    display.removeChild(this);
}

function createElement(tag,parent, html,className){
    let element = document.createElement(tag);
    element.innerHTML = html;
    element.classList.add(className);
    parent.appendChild(element);
    return element;
}
function updateStatistics(){
    if(times.length>=1) averageTime = times.reduce((previousValue,currentValue) => previousValue + currentValue)/times.length;
    document.querySelector(`#reaction-time`).textContent=`${round(averageTime/1000)}`;
    document.querySelector(`#full-info`).textContent= `Попаданий: ${times.length} 
                                                       Промахов: ${misses} 
                                                       Среднее время: ${round(averageTime/1000)} с`;
}

function getRandom(max,min){
    return Math.floor(Math.random()*max);
}
function round(number){
    return +number.toFixed(4);
}