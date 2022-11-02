/// api_version=2
var script = registerScript({
    name: "NerblesSpeeds",
    version: "1.1",
    authors: ["Nerbles1"]
});

var ticks = 0;
var LB = Java.type("net.ccbluex.liquidbounce.LiquidBounce");
var MovementUtils = Java.type("net.ccbluex.liquidbounce.utils.MovementUtils");
var GameSettings = Java.type("net.minecraft.client.settings.GameSettings");
var S12PacketEntityVelocity = Java.type("net.minecraft.network.play.server.S12PacketEntityVelocity");
var C03PacketPlayer = Java.type("net.minecraft.network.play.client.C03PacketPlayer")
var C04PacketPlayerPosition = Java.type("net.minecraft.network.play.client.C03PacketPlayer.C04PacketPlayerPosition")
var inCombat = false
var combatticks;
// Chat.print("§b[§5NerblesSpeeds§b] §f" + message) for debug messages maybe
script.registerModule({
    name: "NerblesSpeeds",
    description: "Speeds Made by Nerbles",
    category: "Movement",
    settings: {
        jumpMode: Setting.list({
            name: "Mode",
            default: "MatrixHop",
            values: ["MatrixHop", "Vulcan", "Ncp", "Verus", "KarhuLow", "Pika", "Dev"]
        }),
        // Removed the MatrixTimer mode as it is just a waste of space at the moment
        timerBoostValue: Setting.boolean({
            name: "TimerBoost",
            default: true
        }),
        matrixStrafeValue: Setting.boolean({
            name: "MatrixHop-CombatStrafe",
            default: true
        }),
        KarhuMode: Setting.list({
            name: "KarhuLow-Mode",
            default: "Normal",
            values: ["Normal", "Pika"]
        }),
    }
}, function (module) {
    module.on("enable", function () {
        inCombat = false
        ticks = 0
    })
    module.on("update", function () {
        if (mc.thePlayer.ticksExisted > combatticks) {
            inCombat = false
        }
        switch (module.settings.jumpMode.get()) {
            case "MatrixHop":
                module.tag = "MatrixHop";
                if (MovementUtils.isMoving()) {
                    if (mc.thePlayer.onGround) {
                        mc.gameSettings.keyBindJump.pressed = false
                        mc.thePlayer.jump();
                        mc.thePlayer.motionY = 0.417
                        mc.timer.timerSpeed = 1.0
                        if (!inCombat) MovementUtils.strafe(MovementUtils.getSpeed() + 0.0005)
                    } else {
                        if (module.settings.matrixStrafeValue.get() && inCombat == true) {
                            MovementUtils.strafe(0.21)
                        }
                    }
                } else {
                    mc.timer.timerSpeed = 1.0
                    mc.thePlayer.motionX = 0.0
                    mc.thePlayer.motionZ = 0.0
                }
                if (mc.thePlayer.fallDistance > 0 < 1) {
                    if (module.settings.timerBoostValue.get() == true) mc.timer.timerSpeed = 1.1
                    mc.thePlayer.motionY -= 0.0005
                    // Chat.print("a")
                }
                if (mc.thePlayer.fallDistance > 1.3) {
                    mc.timer.timerSpeed = 1.0
                }
                if (module.settings.timerBoostValue.get() == true && !mc.thePlayer.onGround && !mc.thePlayer.fallDistance >= 0 <= 1) {
                    mc.timer.timerSpeed = 1.0
                } else {
                    mc.timer.timerSpeed = 1.0
                }
                break;
            case "Vulcan":
                module.tag = "Vulcan";
                if (MovementUtils.isMoving()) {
                    if (mc.thePlayer.onGround) {
                        mc.gameSettings.keyBindJump.pressed = false
                        mc.thePlayer.jump()
                        MovementUtils.strafe(MovementUtils.getSpeed() + 0.00187)
                        mc.timer.timerSpeed = 1.5
                        mc.timer.timerSpeed = 1.0
                    }

                    if (mc.thePlayer.fallDistance > 0) {
                        mc.thePlayer.motionY = -0.275
                        mc.timer.timerSpeed = 1.045
                    }
                } else {
                    mc.timer.timerSpeed = 1.0
                    mc.thePlayer.motionX = 0
                    mc.thePlayer.motionZ = 0
                }
                break;
            case "Ncp":
                module.tag = "Ncp";
                if (MovementUtils.isMoving()) {
                    mc.gameSettings.keyBindJump.pressed = false;
                    if (mc.thePlayer.onGround) {
                        mc.thePlayer.jump();
                        mc.timer.timerSpeed = 0.9
                        MovementUtils.strafe(0.48);
                        mc.thePlayer.motionX *= 1.0021
                        mc.thePlayer.motionZ *= 1.0021
                    }
                    // Chat.print(MovementUtils.getSpeed() + 0.0015)
                    if (!mc.thePlayer.onGround) MovementUtils.strafe(MovementUtils.getSpeed() + 0.00125);
                    if (mc.thePlayer.fallDistance > 0) {
                        mc.timer.timerSpeed = 1.445
                        if (mc.thePlayer.fallDistance > 1.2) {
                            mc.timer.timerSpeed = 1.0
                            Chat.print("§b[§6§lNerblesSpeeds§b] §f lowered timer to prevent flags")
                        }
                    }
                }
                break;
            case "Verus":
                module.tag = "Verus";
                if (MovementUtils.isMoving) {
                    MovementUtils.strafe(0.33)
                    if (mc.thePlayer.onGround) {
                        mc.thePlayer.jump();
                        MovementUtils.strafe(0.425)
                    }
                }
                break;
            case "KarhuLow":
                module.tag = "KarhuLow, " + module.settings.KarhuMode.get()
                switch (module.settings.KarhuMode.get()) {
                    case "Normal":
                        if (mc.thePlayer.onGround && MovementUtils.isMoving()) {
                            mc.gameSettings.keyBindJump.pressed = false
                            mc.thePlayer.jump()
                            mc.thePlayer.motionY = 0.3888
                        } else if (MovementUtils.isMoving()) {
                            mc.thePlayer.motionX *= 1.0037
                            mc.thePlayer.motionZ *= 1.0037
                            if (mc.thePlayer.fallDistance <= 1) mc.thePlayer.motionY += -0.00499
                        }
                        if (!MovementUtils.isMoving()) {
                            mc.thePlayer.motionX = 0.0
                            mc.thePlayer.motionZ = 0.0
                        }
                }
                break;
            case "Pika":
                module.tag = "pika"
                if (mc.thePlayer.onGround && MovementUtils.isMoving()) {
                    mc.gameSettings.keyBindJump.pressed = false
                    mc.timer.timerSpeed = 1.0
                    mc.thePlayer.jump()
                }
                if (MovementUtils.isMoving()) {
                    if (mc.thePlayer.onGround == false) {
                        // mc.thePlayer.motionX *= 1.002
                        mc.thePlayer.motionY -= 0.000001
                        // mc.thePlayer.motionZ *= 1.002
                    }
                }
                if (!MovementUtils.isMoving()) {
                    mc.thePlayer.motionX = 0.0
                    mc.thePlayer.motionZ = 0.0
                }
                break
            case "Dev":
                module.tag = "Dev"
                if (MovementUtils.isMoving()) {
                    if (mc.thePlayer.onGround) {
                        mc.gameSettings.keyBindJump.pressed = false
                        mc.thePlayer.jump()
                        MovementUtils.strafe(0.485)
                        mc.timer.timerSpeed = 1.0
                        mc.thePlayer.motionY *= 0.951
                        // Chat.print(mc.thePlayer.motionY)
                    } else {
                        MovementUtils.strafe(MovementUtils.getSpeed() + 0.0002)
                        if (mc.thePlayer.fallDistance > 0 < 1) {
                            mc.thePlayer.motionY -= 0.00002
                            mc.timer.timerSpeed = 1.07
                        } else if (mc.thePlayer.fallDistance > 1.25) { mc.timer.timerSpeed = 1.0, Chat.print("§b[§6§lNerblesSpeeds§b] §f lowered timer to prevent flags") }
                        // if (mc.thePlayer.motionY >= 0.39) mc.thePlayer.motionY -= 0.01
                        // Chat.print("a")
                    }

                } else {
                    mc.thePlayer.motionX = 0.0
                    mc.thePlayer.motionZ = 0.0
                }
                break
        }

    });

    module.on("jump", function () {
        switch (module.settings.jumpMode.get()) {
            case "Vulcan":
                mc.thePlayer.motionY = -0.41
                mc.timer.timerSpeed = 1.25
                break;
            case "KarhuLow":
                // ticks++
                // mc.thePlayer.motionY = -0.2
                // Chat.print(mc.thePlayer.motionY)
                break;
        }
    })

    module.on("attack", function (event) {
        inCombat = true
        combatticks = mc.thePlayer.ticksExisted
    })

    module.on("disable", function () {
        mc.timer.timerSpeed = 1.0
        inCombat = false
        ticks = 0
        mc.thePlayer.jumpMovementFactor = 0.2
        mc.thePlayer.speedInAir = 0.02
        if (module.settings.jumpMode.get() == "Ncp" || "MatrixWeird" || "Vulcan") {
            mc.thePlayer.motionX = 0
            mc.thePlayer.motionZ = 0
            // reduces speed and motionY to prevent flags
        }
    })
});