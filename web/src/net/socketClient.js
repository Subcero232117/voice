/* ============================================
   SUBVOICE - WebSocket Client
   Manejo de conexión con el servidor Node
   ============================================ */

import { setConnectedUI, setDisconnectedUI } from "../ui/statusPanel.js";
import { updateTeamV } from "../ui/teamControl.js";
import { createPingSmoother } from "../utils/ping.js";
import { updatePeersList } from "../ui/peersPanel.js";

let socket = null;
let connected = false;
let roomId = null;
let clientId = `cli_${Math.random().toString(36).slice(2, 10)}`;

let signalHandler = null;
let nameToSend = null;
let playersHandler = null;

/* ======== UI Elements ======== */
const pingLabel  = document.getElementById("ping");
const roomLabel  = document.getElementById("room");
const pingSmoother = createPingSmoother();

/* ======== Conectar al servidor ======== */
function connectToServer() {
    const HOST = `${window.location.hostname}:8000`; 
    socket = new WebSocket(`ws://${HOST}`);

    socket.onopen = () => {
        connected = true;
        setConnectedUI();

        socket.send(JSON.stringify({
            type: "hello_web",
            clientId
        }));

        if (nameToSend) {
            emitName(nameToSend);
        }
    };

    socket.onclose = () => {
        connected = false;
        setDisconnectedUI();
        pingSmoother.reset();
        pingLabel.innerText = "Ping: -- ms";
        setTimeout(connectToServer, 3000);
    };

    socket.onmessage = ({ data }) => {
        try {
            handleServer(JSON.parse(data));
        } catch {}
    };
}

/* ======== Manejo de mensajes ======== */
function handleServer(msg) {
    switch (msg.type) {
        case "room":
            roomId = msg.value;
            roomLabel.innerText = `Room: ${roomId}`;
            break;

        case "ping":
            pingLabel.innerText = `Ping: ${pingSmoother(msg.value)} ms`;
            break;

        case "teamv":
            updateTeamV(msg.enabled);
            break;

        case "players":
            updatePeersList(msg.list);
            if (playersHandler) playersHandler(msg.list);
            break;

        case "signal":
            if (signalHandler) {
                signalHandler(msg);
            }
            break;
    }
}

/* ======== Emitir comandos básicos ======== */
export function emitMicState(state) {
    if (!connected) return;
    socket.send(JSON.stringify({
        type: "mic",
        clientId,
        state
    }));
}

export function emitTeamVState(enabled) {
    if (!connected) return;
    socket.send(JSON.stringify({
        type: "teamv",
        clientId,
        enabled
    }));
}

export function emitVolume(vol) {
    if (!connected) return;
    socket.send(JSON.stringify({
        type: "volume",
        clientId,
        value: vol
    }));
}

/* ======== WebRTC signaling ======== */
export function sendSignal(to, action, payload) {
    if (!connected) return;
    socket.send(JSON.stringify({
        type: "signal",
        from: clientId,
        to,
        action,
        payload
    }));
}

export function onSignal(handler) {
    signalHandler = handler;
}

/* ======== Helpers ======== */
export function getRoomId() {
    return roomId;
}

export function getClientId() {
    return clientId;
}

export function onPlayers(handler) {
    playersHandler = handler;
}

export function emitName(name) {
    nameToSend = name;
    if (!connected) return;
    socket.send(JSON.stringify({
        type: "set_name",
        name
    }));
}

connectToServer();
