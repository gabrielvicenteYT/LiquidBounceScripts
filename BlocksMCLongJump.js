///api_version=2
var script = registerScript({
    name: "NerblesTests",
    version: "1.0",
    authors: ["Nerbles1"]
});

var printGlide = true;
var debug;
var mode;
var speedcheck = true
var jumped = false;
var MovementUtils = Java.type("net.ccbluex.liquidbounce.utils.MovementUtils");
var S12PacketEntityVelocity = Java.type("net.minecraft.network.play.server.S12PacketEntityVelocity");
script.registerModule({
    name: "BlocksMCLongJump",
    description: "A BlocksMC LongJump",
    category: "Movement",
    settings: {
        debugMode: Setting.boolean({
            name: "Debug",
            default: false
        }),
        jumpMode: Setting.list({
            name: "JumpMode",
            default: "Flagless",
            values: ["Flagless", "SilentFlag"]
        })
    }
}, function (module) {
    module.on("enable", function () {
        printGlide = true;
        jumped = false;
        speedcheck = true;
        mc.timer.timerSpeed = 1.0
    })
    module.on("update", function () {
        try {
            mode = module.settings.jumpMode.get();
            debug = module.settings.debugMode.get()
            module.tag = mode;
            switch (mode) {
                case "SilentFlag":
                    if (mc.thePlayer.onGround) {
                        if (jumped == false) {
                            mc.thePlayer.jump() 
                            MovementUtils.strafe(0.48)
                            Chat.print("§b[§6§lBlocksMC Longjump§b] §cNote: This silent flags")
                            if (debug) Chat.print("§b[§6§lBlocksMC Longjump§b] §fLongjumping")
                        } else {
                            mc.thePlayer.motionX = 0;
                            mc.thePlayer.motionZ = 0
                            module.setState(false);
                        }
                    } else {
                        if (mc.thePlayer.fallDistance < 1.122 && mc.thePlayer.motionY < 0.0809) {
                            mc.thePlayer.motionY += 0.029;
                            if (mc.thePlayer.isPotionActive(1)) {
                                MovementUtils.strafe(MovementUtils.getSpeed() + 0.038)
                            } else {
                                MovementUtils.strafe(MovementUtils.getSpeed() + 0.0092)
                            }
                        } else {
                            jumped = true;
                        }
                    }
                    break;
                case "Flagless":
                    if (mc.thePlayer.onGround) {
                        if (jumped == false) {
                            if (mc.thePlayer.isPotionActive(1)) mc.thePlayer.jump(), MovementUtils.strafe(0.485)
                            if (debug && mc.thePlayer.isPotionActive(1)) Chat.print("§b[§6§lBlocksMC Longjump§b] §fLongjumping")
                            if (!mc.thePlayer.isPotionActive(1)) Chat.print("§b[§6§lBlocksMC Longjump§b] §fYou need a speed potion to longjump!"), module.setState(false);
                        } else {
                            mc.thePlayer.motionX = 0;
                            mc.thePlayer.motionZ = 0
                            module.setState(false);
                        }
                    } else {
                        if (mc.thePlayer.fallDistance < 1.12) {
                            if (mc.thePlayer.isPotionActive(1)) {
                                if (debug && speedcheck) Chat.print("§b[§6§lBlocksMC Longjump§b] §fplayer has speed"), speedcheck = false;
                                if (mc.thePlayer.motionY < 0.0809) {
                                    MovementUtils.strafe(MovementUtils.getSpeed() + 0.037)
                                } else {
                                    MovementUtils.strafe(MovementUtils.getSpeed() + 0.0342)
                                }
                            } 
                        } else if (mc.thePlayer.fallDistance > 1.0) {
                            if (mc.thePlayer.fallDistance = 8.0) {
                                mc.thePlayer.motionX *= 0.965;
                                mc.thePlayer.motionZ *= 0.965;
                                if (debug) Chat.print("§b[§6§lBlocksMC Longjump§b] §fSlowing down")
                            }
                            mc.timer.timerSpeed = 1.0
                            jumped = true
                        }
                    break;
            }
    }} catch (e) {
        Chat.print(e)
    }
    })

    module.on("disable", function () {
        mc.timer.timerSpeed = 1.0
    })
})