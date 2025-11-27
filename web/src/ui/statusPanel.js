/* ======================================
   SUBVOICE - Status Panel Controller
   Animación y estado de conexión
   ====================================== */

const connStatus = document.getElementById("connStatus");

/* =======================
   Animación con CSS dinámico
   ======================= */
function setBlinking(state) {
    if (state) {
        connStatus.classList.add("blink");
    } else {
        connStatus.classList.remove("blink");
    }
}

/* =======================
   Actualizar UI desde socket
   ======================= */
export function setConnectedUI() {
    connStatus.innerText = "🟢 Conectado";
    connStatus.style.color = "#93ffb8";
    setBlinking(false);
}

export function setDisconnectedUI() {
    connStatus.innerText = "🔴 Desconectado";
    connStatus.style.color = "#ff8b8b";
    setBlinking(true);
}
