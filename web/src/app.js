/* =====================================================
   SUBVOICE - APP CORE
   Inicializa controles, WebRTC, sockets y eventos UI.
   ===================================================== */

import { initMic, setVolume } from "./net/rtcClient.js";
import { emitVolume } from "./net/socketClient.js";
import "./ui/micButton.js";
import "./ui/teamControl.js";
import "./ui/statusPanel.js";
import { initVolumeBar } from "./utils/volumeBar.js";
import { initPeersUI } from "./ui/peersPanel.js";

/* ============================
   VOLUMEN GLOBAL DEL SISTEMA
   ============================ */
const volSlider = document.getElementById("volSlider");
initVolumeBar(volSlider, v => {
    setVolume(v);
    emitVolume(v);
});

/* ============================
   INICIALIZACIÓN GLOBAL
   ============================ */
async function boot() {
    console.log("%c🎙️ SubVoice Init...", "color:#39dfff;font-size:14px;");

    // Activar micrófono al entrar
    await initMic();

    // Mostrar valores iniciales
    setVolume(0.5);
    emitVolume(0.5);

    console.log("%c🔥 SubVoice Ready", "color:#93ffb8;font-size:14px;");
}

boot();
initPeersUI();
