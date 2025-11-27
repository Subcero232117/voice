/* ======================================
   SUBVOICE - Team Voice Controller (TeamV)
   ====================================== */

import { emitTeamVState } from "../net/socketClient.js";

const btnTeamV   = document.getElementById("btnTeamV");
const teamLabel  = document.getElementById("teamLabel");
const teamIcon   = document.getElementById("teamIcon");

let teamVEnabled = false; // Estado inicial (habla con todos)

/* ==============================
   Evento click para cambiar modo
   ============================== */
btnTeamV.addEventListener("click", () => {
    teamVEnabled = !teamVEnabled;
    emitTeamVState(teamVEnabled);   // Enviar al servidor MC/Node
    changeTeamVUI(teamVEnabled);    // Cambiar interfaz
});

/* ==============================
   Función para actualizar UI
   ============================== */
function changeTeamVUI(state) {
    if (state) {
        teamLabel.innerText = "TeamV: ON";
        teamIcon.src = "team_voice.png";
        teamIcon.style.opacity = "1";
    } else {
        teamLabel.innerText = "TeamV: OFF";
        teamIcon.src = "mute.png";
        teamIcon.style.opacity = ".4";
    }
}

/* ==============================
   Permitir que el servidor cambie UI
   (por ejemplo si el admin fuerza modo)
   ============================== */
export function updateTeamV(state) {
    teamVEnabled = state;
    changeTeamVUI(state);
}
