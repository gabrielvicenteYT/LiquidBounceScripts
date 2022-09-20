/// api_version=2
var script = registerScript({
    name: "HycraftAutoLogin",
    version: "1.0",
    authors: ["Nerbles1"]
});
var S02PacketChat = Java.type("net.minecraft.network.play.server.S02PacketChat")
var gotcaptcha = false
var sentmsg = false
script.registerModule({
    name: "HycraftAutoLogin",
    description: "Hycraft captcha funny",
    category: "Misc"
}, function(module) {
    module.on("world", function() {
        sentmsg = false
    })
    module.on("update", function() {
        if (mc.thePlayer.ticksExisted % 60 == 0 && sentmsg == false)  {
            mc.thePlayer.sendChatMessage("/register");
            sentmsg = true
        }
        if (gotcaptcha) {
            mc.thePlayer.sendChatMessage("/register password@123 password@123 " + funnycaptcha);
            gotcaptcha = false
        }
    })
    module.on("packet", function(e) {
        var packet = e.getPacket()
        if (packet instanceof S02PacketChat) {
            var message = packet.getChatComponent().getUnformattedText();
            if (message.contains("contraseña")){
                funnycaptcha = message.split(" ")[7]
                Chat.print(funnycaptcha)
                gotcaptcha = true
            }
        }
    })
})