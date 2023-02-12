///api_version=2

var script = registerScript({
    name: "HycraftHelper",
    version: "1.0",
    authors: ["Nerbles1"]
});


var LB = Java.type("net.ccbluex.liquidbounce.LiquidBounce");
var MovementUtils = Java.type("net.ccbluex.liquidbounce.utils.MovementUtils");
var sessionUtils = Java.type("net.ccbluex.liquidbounce.utils.SessionUtils");
// var BlockUtils = Java.type("net.ccbluex.liquidbounce.utils.block.BlockUtils");
var S02PacketChat = Java.type("net.minecraft.network.play.server.S02PacketChat");
var autoSkinMode;


script.registerModule({
    name: "HycraftHelper",
    description: "A Hycraft Helper",
    category: "Misc",
    settings: {
        debugMode: Setting.boolean({
            name: "Debug",
            default: false
        }),
        AutoSkin: Setting.boolean({
            name: "AutoSkin",
            default: false
        }),
        AutoGG: Setting.boolean({
            name: "AutoGG",
            default: false
        }),
        SkinName: Setting.text({
            name: "Skin",
            default: "Nerbles1"
        })
        
    }
}, function (module) {
    try {
        module.on("update", function () {
            autoSkinMode = module.settings.AutoSkin.get();
        })

        module.on("world", function() {
            var sessionTime = sessionUtils.getFormatSessionTime();
            var parts = sessionTime.split(" ");
            var hours = parts[0].substring(0, parts[0].length - 1);
            var minutes = parts[1].substring(0, parts[1].length - 1);
            var seconds = parts[2].substring(0, parts[2].length - 1);
            hours = parseInt(hours);
            minutes = parseInt(minutes);
            seconds = parseInt(seconds);
            if (hours <= 0 && minutes <= 3) {
                if (autoSkinMode) {
                    if (module.settings.debugMode.get()) Chat.print("AutoSkin");
                    mc.thePlayer.sendChatMessage("/skin set " + module.settings.SkinName.get());
                }
            }
        })

        module.on("packet", function (e) {
            var packet = e.getPacket()
            if (packet instanceof S02PacketChat) {
                var message = packet.getChatComponent().getUnformattedText();
                if (message.contains("Ganador -")){
                    if (module.settings.AutoGG.get()) {
                        if (module.settings.debugMode.get()) Chat.print("AutoGG");
                        mc.thePlayer.sendChatMessage("GG");
                    }
                    
                }
            }
        })
    } catch (e) {
        Chat.print(e);
    }
})