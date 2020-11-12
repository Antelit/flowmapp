const mainDiv = document.getElementById("mainDiv");
const circle = document.getElementById("circle");
const runEmulationCursor = document.getElementById("runEmulationCursor");
const speed = 2000;

let curclePositionLeft = 0;
let curclePositionTop = 0;
let timeout;
let clientName;

const socket = io();
socket.on("connect", () => {
    socket.emit("hello", {
        UserAgent: window.navigator.userAgent,
        Type: 'Client'
    })
});

socket.on('disconnect', () => {
    console.log("DIS");
    circle.innerHTML = "";
})

socket.on("ID", ID => {
    clientName = ID;
    let elID = document.createElement("p");
    elID.innerHTML = clientName;
    elID.classList.add("name");
    circle.append(elID);
});


circle.addEventListener('onmove', () => {
    console.log("change");
});

runEmulationCursor.addEventListener('click', (event) => {
    if (runEmulationCursor.textContent == "Run Emulation") {
        circle.classList.remove("hide");
        runEmulationCursor.textContent = "Stop Emulation";
        changePosition();
        timeout = setInterval(changePosition, speed);
    } else {
        runEmulationCursor.textContent = "Run Emulation";
        deleteStyleElement();
        clearInterval(timeout);
    }
});

function deleteStyleElement() {
    let animationStyle = document.getElementById("animationStyle");
    if (animationStyle) {
        animationStyle.remove();
    }
}

function changePosition() {
    deleteStyleElement();
    let bufL = curclePositionLeft;
    let bufT = curclePositionTop;
    curclePositionLeft = Math.floor(getRandomArbitrary(0, mainDiv.clientWidth));
    curclePositionTop = Math.floor(getRandomArbitrary(0, mainDiv.clientHeight));

    let style = document.createElement("style");
    style.id = 'animationStyle';
    document.documentElement.appendChild(style);
    let ruleStart = ' run {0% { left: ' + bufL + 'px; top: ' + bufT + 'px; }';
    let ruleEnd = ' 100% {left: ' + curclePositionLeft + 'px; top: ' + curclePositionTop + 'px;}}';
    let rule = ruleStart + ruleEnd;
    if (CSSRule.KEYFRAMES_RULE) {
        style.sheet.insertRule("@keyframes" + rule, 0);
    } else if (CSSRule.WEBKIT_KEYFRAMES_RULE) {
        style.sheet.insertRule("@-webkit-keyframes" + rule, 0);
    }
    circle.style.left = curclePositionLeft + "px";
    circle.style.top = curclePositionTop + "px";
    sendPosition();
}

function sendPosition() {

    socket.emit("mousePosition", {
        client: clientName,
        left: curclePositionLeft,
        top: curclePositionTop
    });
}

mainDiv.addEventListener('mouseover', () => {
    mainDiv.addEventListener('mousemove', mouseMove);
    circle.classList.remove("hide");
});

function mouseMove(event) {
    curclePositionLeft = event.offsetX;
    curclePositionTop = event.offsetY;
    circle.style.left = curclePositionLeft + "px";
    circle.style.top = curclePositionTop + "px";
    sendPosition();
}

function getRandomArbitrary(min, max) {
    return Math.random() * (max - min) + min;
}

mainDiv.addEventListener('mouseout', () => {
    mainDiv.removeEventListener('mousemove', mouseMove);
});