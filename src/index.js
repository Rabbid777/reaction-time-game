const display = document.querySelector(`#display`);
const targetTime = 1200;
const gameTime = 36500;
let times = [];
let misses = 0;

document.querySelector(`#start`).addEventListener(`click`,startGame);
window.addEventListener(`blur`,() => { location.reload();});

//Igra
function startGame() {
  updateStatistics();
  document.querySelector(`#logo`).textContent = `Rabid Rabbits Tea Time`;
  this.classList.toggle(`hide`);
  document.querySelector(`#reaction-time`).classList.toggle(`hide`);
  let gameTimer = setInterval(createTarget, targetTime);
  setTimeout(finishGame, gameTime, gameTimer);
}

function updateStatistics() {
  let averageTime = 0;
  let percentageResult = 0;
  if (times.length >= 1) {
    averageTime = times.reduce((previousValue, currentValue) => previousValue + currentValue) / times.length;
    percentageResult = round(round(times.length / (times.length + misses)) * 100);
  }
  document.querySelector(`#reaction-time`).textContent = `${round(averageTime / 1000)}`;
  document.querySelector(`#full-info`).textContent = `Попаданий: ${times.length} Промахов: ${misses}
                                                       Точность: ${percentageResult}%
                                                       Среднее время: ${round(averageTime / 1000)} с`;
}

function createTarget() {
  let target = createElement(`div`, display, ``, `targets`);
  let XY = getRandomXY();
  let color = getRandomColor();
  target.setAttribute(`style`, `top: ${XY[1]}px; left: ${XY[0]}px; 
                                background-color: rgb(${color[0]}, ${color[1]}, ${color[2]});`);
  target.addEventListener(`click`, stopTargetTimer);
  target.timeLeft = targetTime;
  let targetTimer = setInterval(reduceTarget, 10, target);
  setTimeout(() => { clearInterval(targetTimer);}, targetTime + 200);
}

function getRandomXY() {
  let maxX = display.clientWidth - 100;
  let maxY = display.clientHeight - 100;
  let randomX = getRandom(maxX);
  let randomY = getRandom(maxY);
  return [maxX - randomX, maxY - randomY];
}

function getRandomColor() {
  return [getRandom(255), getRandom(255), getRandom(255)];
}

function reduceTarget(target) {
  if (!display.contains(target)) return;
  target.timeLeft -= 10;
  if (target.timeLeft === 0) {
    misses++;
    display.removeChild(target);
    updateStatistics();
    return;
  }
  target.style.width = `${target.timeLeft / (targetTime / 100)}px`;
  target.style.height = `${target.timeLeft / (targetTime / 100)}px`;
}

function stopTargetTimer(e) {
  let time = targetTime - this.timeLeft;
  times.push(time);
  updateStatistics();
  display.removeChild(this);
}

function finishGame(gameTimer) {
  clearInterval(gameTimer);
  if (times.length + misses === Math.floor(gameTime / targetTime)) {
    createResultMessage();
    resetInfo();
  } else {
    setTimeout(() => {
      createResultMessage();
      resetInfo();
    }, targetTime);
  }
}

function resetInfo() {
  document.querySelector(`#start`).classList.toggle(`hide`);
  document.querySelector(`#reaction-time`).textContent = 0;
  document.querySelector(`#reaction-time`).classList.toggle(`hide`);
  misses = 0;
  times.length = 0;
}

function createResultMessage() {
  let percentageResult = round((times.length / (times.length + misses)) * 100);
  if (percentageResult > 85) {
    document.querySelector(`#logo`).textContent = `Победа!`;
  } else {
    document.querySelector(`#logo`).textContent = `Попробуй еще........`;
  }
}

function createElement(tag, parent, html, className) {
  let element = document.createElement(tag);
  element.innerHTML = html;
  element.classList.add(className);
  parent.appendChild(element);
  return element;
}

function getRandom(max, min) {
  return Math.floor(Math.random() * max);
}

function round(number) {
  return +number.toFixed(4);
}
