import { world, system } from "@minecraft/server";
import { playersState } from "./voiceSystem.js";

system.runInterval(() => {
    for(const p of world.getPlayers()){
        const data = playersState[p.name];
        if(!data) continue;

        if(data.mute)       p.setDynamicProperty("voice_icon", "mic_mute");
        else if(data.team)  p.setDynamicProperty("voice_icon", "team");
        else                p.setDynamicProperty("voice_icon", "mic_on");
    }
}, 10);
