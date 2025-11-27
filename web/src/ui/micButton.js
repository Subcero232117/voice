/* ======================================
   SUBVOICE - UI Mic Controller
   ====================================== */

import { initMic, setMicState } from "../net/rtcClient.js";

const btnMic    = document.getElementById("btnMic");
const micLabel  = document.getElementById("micLabel");
const micIcon   = document.getElementById("micIcon");

let micActive = true;   // Estado inicial

/* ==============================
   Inicializar el mic al cargar
   ============================== */
window.addEventListener("DOMContentLoaded", async () => {
    await initMic();          // Pide permiso y enciende el mic
    changeMicUI(true);
});

/* ==============================
   Evento: Click al botón del mic
   ============================== */
btnMic.addEventListener("click", () => {
    micActive = !micActive;
    setMicState(micActive);   // Activar/Desactivar audio real
    changeMicUI(micActive);   // Actualiza UI
});

/* ==============================
   Función para cambiar la UI
   ============================== */
function changeMicUI(state) {
    if (state) {
        micLabel.innerText = "Micrófono: ON";
        micIcon.src = "mic.png";
        micIcon.style.opacity = "1";
    } else {
        micLabel.innerText = "Micrófono: OFF";
        micIcon.src = "mute.png";
        micIcon.style.opacity = "0.4";
    }
}
export function updateMicStatus(state) {
    micActive = state;
    setMicState(micActive);  // Asegura el estado real
    changeMicUI(micActive);  // Actualiza UI
}