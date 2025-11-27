import { world, DynamicPropertiesDefinition, MinecraftEntityTypes } from "@minecraft/server";
import "./voiceSystem.js";
import "./uiManager.js";
import "./network.js";

// Registrar propiedad dinámica usada por el HUD de voz
world.afterEvents.worldInitialize.subscribe(({ propertyRegistry }) => {
    const def = new DynamicPropertiesDefinition();
    def.defineString("voice_icon", 16);
    propertyRegistry.registerEntityTypeDynamicProperties(def, MinecraftEntityTypes.player);
});

world.afterEvents.playerSpawn.subscribe(({ player }) => {
    player.sendMessage("§a[SubVoice] §7Sistema de voz activado, usa §e/teamv §7y §e/mic");
});
