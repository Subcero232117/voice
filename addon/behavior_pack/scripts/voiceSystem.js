import { world, system } from "@minecraft/server";
import { sendToServer } from "./network.js";

export const playersState = {}; 
// Ej: { "SubCero": { mute:false, team:true, x:0, y:0, z:0, dim:"minecraft:overworld" } }

// ======== INICIALIZAR PLAYER ========
function initPlayer(player){
    const n = player.name;
    if(!playersState[n]) {
        playersState[n] = {
            mute: false,
            team: true
        };
    }
    sendToServer("state", playersState[n], n);
}

// ======== MUTEO ========
function toggleMute(player){
    const n = player.name;
    const state = playersState[n];
    state.mute = !state.mute;
    sendToServer("mute", state.mute, n);
    player.sendMessage(state.mute ? "§c🎤 Mic Muted" : "§a🎤 Mic Active");
}

// ======== VOZ SOLO PARA TEAM ========
function toggleTeamV(player){
    const n = player.name;
    const state = playersState[n];
    state.team = !state.team;
    sendToServer("teamv", state.team, n);
    player.sendMessage(state.team ? "§b🎧 Team Voice ON" : "§e📢 Chat con todos");
}

// ======== EVENTOS DE CHAT ========
world.beforeEvents.chatSend.subscribe((msg) => {
    const args = msg.message.split(" ");
    const sender = msg.sender;

    switch(args[0]){
        case "/mic":
            msg.cancel = true;
            toggleMute(sender);
        break;

        case "/teamv":
            msg.cancel = true;
            toggleTeamV(sender);
        break;
    }
});

// ======== ENVIAR POSICIÓN PARA PROXIMITY ========
system.runInterval(() => {
    for (const player of world.getPlayers()) {
        const n = player.name;
        if(!playersState[n]) continue;

        const loc = player.location;
        const rot = player.getRotation();
        const dim = player.dimension.id;

        playersState[n].x = loc.x;
        playersState[n].y = loc.y;
        playersState[n].z = loc.z;
        playersState[n].rot = rot.y;
        playersState[n].dim = dim;

        sendToServer("pos", {
            x: loc.x,
            y: loc.y,
            z: loc.z,
            rot: rot.y,
            dim: dim
        }, n);
    }
}, 5); // cada 0.25s

// ======== DETECTAR SPAWN ========
world.afterEvents.playerSpawn.subscribe(({ player }) => initPlayer(player));
world.getPlayers().forEach(p => initPlayer(p));
