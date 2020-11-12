const socket = io('ws://localhost:3001');

socket.on('connect', () => {
    socket.emit("hello", {
        UserAgent: window.navigator.userAgent,
        Type: "Visual"
    })
});
const mainDiv = document.getElementById("cursorePosition");
// handle the event sent with socket.send()
socket.on('message', data => {
    console.log(data);
    if (data.Type == "RenderCursor") {
        let el = document.getElementById(data.Clients.client);
        if (!el) {
            let nameClient = document.createElement("p");
            nameClient.classList.add("name");
            nameClient.innerHTML = data.Clients.client;
            let createElement = document.createElement("div");
            createElement.classList.add("circle");
            createElement.style = `left: ${data.Clients.left}px; top:${data.Clients.top}px`;
            createElement.append(nameClient);
            createElement.id = data.Clients.client;
            mainDiv.append(createElement);
        } else {
            el.style.left = `${data.Clients.left}px`;
            el.style.top = `${data.Clients.top}px`;
        }
    } else if (data.Type == 'DeleteCursore') {
        let el = document.getElementById(data.Client);
        if (el) {
            el.remove();
        }
    }
});
socket.on("WhoAreYou", mess => {
    console.log(mess);
});

// handle the event sent with socket.emit()
socket.on('greetings', (elem1, elem2, elem3) => {
    console.log(elem1, elem2, elem3);
});