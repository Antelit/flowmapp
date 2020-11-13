const socket = io('ws://localhost:3001');

socket.on('connect', () => {
    socket.emit("hello", {
        UserAgent: window.navigator.userAgent,
        Type: "Visual"
    });
});

socket.on('Stats', msgStats => {
    var date = new Date(0);
    date.setSeconds(msgStats.data.secondOnStart);
    document.getElementById('timeWork').innerHTML = date.toISOString().substr(11, 8);
    document.getElementById('cnt_vis').innerHTML = msgStats.data.countVisuals;
    document.getElementById('cnt_cli').innerHTML = msgStats.data.countClients;
});

const mainDiv = document.getElementById("cursorePosition");
const clientsDiv = document.getElementById("clients");

socket.on('message', data => {
    if (data.Type == "RenderCursor") {
        let el = document.getElementById(data.Clients.client);
        let elVis = document.getElementById("vs_" + data.Clients.client);
        const ID = data.Clients.client;
        const left = data.Clients.left;
        const top = data.Clients.top;

        if (!el && !elVis) {
            let nameClient = document.createElement("p");
            nameClient.classList.add("name");
            nameClient.innerHTML = ID;
            let createElement = document.createElement("div");
            createElement.classList.add("circle");
            createElement.style = `left: ${left}px; top:${top}px`;
            createElement.append(nameClient);
            createElement.id = ID;
            mainDiv.append(createElement);

            let client = document.createElement("div");
            client.id = "vs_" + ID;
            client.innerHTML = `${ID} -> X: ${left} Y: ${top}`;
            clientsDiv.append(client);
        } else {
            el.style.left = `${left}px`;
            el.style.top = `${top}px`;
            elVis.innerHTML = `${ID} -> X: ${left} Y: ${top}`;
        }
    } else if (data.Type == 'DeleteCursore') {
        let el = document.getElementById(data.Client);
        let elVis = document.getElementById("vs_" + data.Client);
        if (el) {
            el.remove();
            elVis.remove();
        }
    }
});