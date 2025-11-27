import { world } from "@minecraft/server";
import { WebSocket } from "@minecraft/server-net";

let socket;

try {
    socket = new WebSocket("ws://127.0.0.1:8000");
    socket.onopen = () => console.warn("[SubVoice] Socket conectado");
    socket.onerror = () => console.error("[SubVoice] error de WS");
} catch(err){
    console.error("Error creando WebSocket:", err);
}

export function sendToServer(type, data, player){
    if (!socket || socket.readyState !== WebSocket.OPEN) return;
    try{
        socket.send(JSON.stringify({
            player,
            type,
            data
        }));
    }catch(e){
        console.warn("[SubVoice] no se pudo enviar al server");
    }
}
export function onServerMessage(callback){
    socket.onmessage = (event) => {
        try{
            const msg = JSON.parse(event.data);
            callback(msg);
        }catch(e){
            console.error("Error parsing server message:", e);
        }
    };  
}
