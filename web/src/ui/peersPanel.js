import { emitName, getClientId } from "../net/socketClient.js";
import { setPeerVolume, setPeerMuted, onPeerSpeaking } from "../net/rtcClient.js";

const peersList = document.getElementById("peersList");
const peersCount = document.getElementById("peersCount");
const nameInput = document.getElementById("nameInput");
const btnSaveName = document.getElementById("btnSaveName");

const uiState = new Map(); // peerId -> { volume, muted }

function getOrInit(id) {
    if (!uiState.has(id)) {
        uiState.set(id, { volume: 1, muted: false, speaking: false });
    }
    return uiState.get(id);
}

function teamChip(team) {
    if (!team || team === "none") return null;
    const chip = document.createElement("span");
    chip.className = `team-chip team-${team}`;
    chip.innerText = team;
    return chip;
}

export function initPeersUI() {
    const saved = localStorage.getItem("subvoice_name");
    if (saved) {
        nameInput.value = saved;
        emitName(saved);
    }

    btnSaveName.addEventListener("click", () => {
        const name = nameInput.value.trim();
        if (!name) return;
        localStorage.setItem("subvoice_name", name);
        emitName(name);
    });

    onPeerSpeaking((peerId, speaking) => {
        const badge = peersList.querySelector(`[data-peer="${peerId}"] .badge`);
        if (badge) {
            badge.classList.toggle("speaking", speaking);
        }
    });
}

export function updatePeersList(rawList) {
    const entries = Object.entries(rawList || {});
    peersCount.innerText = entries.length;
    const myId = getClientId();

    peersList.innerHTML = "";
    entries.forEach(([id, data]) => {
        const card = document.createElement("div");
        card.className = "peer-card";
        card.dataset.peer = id;

        const state = getOrInit(id);
        state.muted = state.muted || data.voiceMode === "mute";

        const badge = document.createElement("span");
        badge.className = "badge" + (state.muted ? " muted" : "");

        const title = document.createElement("div");
        title.className = "peer-header";
        title.appendChild(badge);

        const name = document.createElement("span");
        name.innerText = data.name || id;
        title.appendChild(name);

        const chip = teamChip(data.team);
        if (chip) title.appendChild(chip);

        const actions = document.createElement("div");
        actions.className = "peer-actions";

        const muteBtn = document.createElement("button");
        muteBtn.className = "pill-btn";
        muteBtn.innerText = state.muted ? "Unmute" : "Mute";
        muteBtn.disabled = id === myId;
        muteBtn.addEventListener("click", () => {
            state.muted = !state.muted;
            setPeerMuted(id, state.muted);
            muteBtn.innerText = state.muted ? "Unmute" : "Mute";
            badge.classList.toggle("muted", state.muted);
        });

        actions.appendChild(muteBtn);

        card.appendChild(title);
        card.appendChild(actions);

        const volumeRow = document.createElement("div");
        volumeRow.className = "peer-volume";
        const volLabel = document.createElement("span");
        volLabel.innerText = "Vol.";
        const slider = document.createElement("input");
        slider.type = "range";
        slider.min = "0";
        slider.max = "100";
        slider.value = Math.round((state.volume ?? 1) * 100);
        slider.disabled = id === myId;
        slider.addEventListener("input", e => {
            const v = Number(e.target.value) / 100;
            state.volume = v;
            setPeerVolume(id, v);
        });
        volumeRow.appendChild(volLabel);
        volumeRow.appendChild(slider);

        card.appendChild(volumeRow);

        peersList.appendChild(card);
    });
}
