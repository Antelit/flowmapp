const mainDiv = document.getElementById("mainDiv");
const circle = document.getElementById("circle");
const runEmulationCursor = document.getElementById("runEmulationCursor");
const speed = 2000;

let curclePositionLeft = 0;
let curclePositionTop = 0;
let timeout;
let clientName;

const socket = io();
let spanUniq = document.getElementById("uniq");
let PositionX = document.getElementById("cursorX");
let PositionY = document.getElementById("cursorY");

socket.on("connect", () => {
    socket.emit("hello", {
        UserAgent: window.navigator.userAgent,
        Type: 'Client'
    });
});

socket.on('disconnect', () => {
    console.log("Disconnet");
    circle.innerHTML = "";
    spanUniq.innerHTML = "IS NOT CONNECT!";
});

socket.on("ID", message => {
    clientName = message.id;
    spanUniq.innerHTML = clientName;
    let elID = document.createElement("p");
    elID.innerHTML = clientName;
    elID.classList.add("name");
    circle.append(elID);
});

runEmulationCursor.addEventListener('click', (event) => {
    if (runEmulationCursor.textContent == "Run Emulation") {
        circle.classList.remove("hide");
        runEmulationCursor.textContent = "Stop Emulation";
        changePosition();
        timeout = setInterval(changePosition, speed);
    } else {
        stopEmulation();
    }
});

function deleteStyleElement() {
    let animationStyle = document.getElementById("animationStyle");
    if (animationStyle) {
        animationStyle.remove();
    }
}

function stopEmulation(){
    deleteStyleElement();
    clearInterval(timeout);
    runEmulationCursor.textContent = "Run Emulation";
}
function changePosition() {
    deleteStyleElement();
    let bufL = curclePositionLeft;
    let bufT = curclePositionTop;
    curclePositionLeft = Math.floor(getRandom(0, mainDiv.clientWidth));
    curclePositionTop = Math.floor(getRandom(0, mainDiv.clientHeight));

    let ruleStart = ` run {0% {left: ${bufL}px; top: ${bufT}px;}`;
    let ruleEnd = ` 100% {left: ${curclePositionLeft}px; top: ${curclePositionTop}px;}}`;
    let rule = ruleStart +  ruleEnd;

    let style = document.createElement("style");
    style.id = 'animationStyle';
    document.documentElement.appendChild(style);
    
    if (CSSRule.KEYFRAMES_RULE) {
        style.sheet.insertRule("@keyframes" + rule, 0);
    } else if (CSSRule.WEBKIT_KEYFRAMES_RULE) {
        style.sheet.insertRule("@-webkit-keyframes" + rule, 0);
    }
    setNewPosition();
    sendPosition();
}

function sendPosition() {
    socket.emit("mousePosition", {
        client: clientName,
        left: curclePositionLeft,
        top: curclePositionTop
    });
}

function setNewPosition(){
    circle.style.left = curclePositionLeft + "px";
    circle.style.top = curclePositionTop + "px";
    PositionX.innerHTML = curclePositionLeft + "px";
    PositionY.innerHTML = curclePositionTop + "px";
}

function mouseMove(event) {
    curclePositionLeft = event.offsetX;
    curclePositionTop = event.offsetY;
    setNewPosition();
    sendPosition();
}

function getRandom(min, max) {
    return Math.random() * (max - min) + min;
}

mainDiv.addEventListener('mouseover', () => {
    mainDiv.addEventListener('mousemove', mouseMove);
    circle.classList.remove("hide");
    stopEmulation();
});

mainDiv.addEventListener('mouseout', () => {
    mainDiv.removeEventListener('mousemove', mouseMove);
});