///api_version=2
var script = registerScript({
    name: "SessionStats",
    version: "1.0",
    authors: ["Nerbles1"]
});

var kills = 0;
var deaths = 0;
var wins = 0;
// var bans = 0;
var target = null;

script.import("glFunctions.js");
var Fonts = Java.type("net.ccbluex.liquidbounce.ui.font.Fonts");
var Color = Java.type("java.awt.Color");
var GL11 = Java.type("org.lwjgl.opengl.GL11");
var S02PacketChat = Java.type("net.minecraft.network.play.server.S02PacketChat");
var EntityPlayer = Java.type('net.minecraft.entity.player.EntityPlayer');
var S45PacketTitle = Java.type("net.minecraft.network.play.server.S45PacketTitle");
var sessionUtils = Java.type("net.ccbluex.liquidbounce.utils.SessionUtils");
// net.ccbluex.liquidbounce.utils.render
var S00PacketDisconnect = Java.type("net.minecraft.network.login.server.S00PacketDisconnect");
var RenderUtils = Java.type("net.ccbluex.liquidbounce.utils.render.RenderUtils");

script.registerModule({
    name: "SessionStats",
    description: "Shows your session stats",
    category: "Misc",
    settings: {
        debugValue: Setting.boolean({
            name: "Debug",
            default: false
        }),

    }
}, function (module) {
    module.on("render2D", function (event) {
        try {
            RenderUtils.originalRoundedRect(20, 50, 130, 110, 5, 0x7F000000);
            Fonts.font35.drawString("Session Stats", 50, 55, 0xFFFFFFFF);
            RenderUtils.drawRect(25, 63, 125, 64, 0xFFFFFFFF);
            Fonts.font35.drawString("Kills: " + kills, 25, 68, 0xFFFFFFFF);
            Fonts.font35.drawString("Deaths: " + deaths, 25, 78, 0xFFFFFFFF);
            Fonts.font35.drawString("Wins: " + wins, 25, 88, 0xFFFFFFFF);
            var sessionTime = sessionUtils.getFormatSessionTime();
            Fonts.font35.drawString("Playtime: " + sessionTime, 25, 98, 0xFFFFFFFF);
            // I LOVE HARDCODED VALUES
        } catch (e) {
            Chat.print(e);
        }
    });

    module.on("attack", function (event) {
		if (event.getTargetEntity() instanceof EntityPlayer) {
			target = event.getTargetEntity();
		}
    })

    module.on("world", function() {
        target = null
    })
    module.on("enable", function() {
        target = null
    })

    module.on("update", function () {
        try {
            if (target != null && target.isDead) {
                kills++;
                target = null;
            }
            if (mc.thePlayer.isDead || mc.thePlayer.getHealth() <= 0) {
                deaths++;
                // doesnt work lol
            }
            
        } catch (e) {
            Chat.print(e);
        }
    })

    module.on("packet", function (event) {
        var packet = event.getPacket();
        if (packet instanceof S02PacketChat) {
            var message = packet.getChatComponent().getUnformattedText();
            if (message.contains("winning") || message.contains("won") || message.contains("#1 " + mc.thePlayer.getName())) {
                wins++;
            }
        }

        if (packet instanceof S45PacketTitle) {
            if (packet.getType() == S45PacketTitle.Type.TITLE) {
                var message = packet.getMessage().getUnformattedText();
                if (message.contains("YOU DIED!") || message.contains("HAS MUERTO!")) {
                    deaths++;
                }
            }
        }
    })
});