/// api_version=2
var script = registerScript({
    name: "NerblesSpeeds",
    version: "1.2",
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
var hasSpeed;
var doTimerBoost;
var blocksmcTimerMode;
// Chat.print("§b[§5NerblesSpeeds§b] §f" + message) for debug messages maybe
script.registerModule({
    name: "NerblesSpeeds",
    description: "Speeds Made by Nerbles",
    category: "Movement",
    settings: {
        jumpMode: Setting.list({
            name: "Mode",
            default: "MatrixHop",
            values: ["MatrixHop", "Vulcan", "Ncp", "Verus", "KarhuLow", "BlocksMC", "Spartan", "NoRules", "Dev"]
        }),
        timerBoostValue: Setting.boolean({
            name: "TimerBoost",
            default: true
        }),
        matrixStrafeValue: Setting.boolean({
            name: "MatrixHop-CombatStrafe",
            default: true
        }),
        bmcTimerMode: Setting.list({
            name: "BlocksMCTimerMode",
            default: "Normal",
            values: ["Infinite", "Fast", "Weird"]
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
        hasSpeed = mc.thePlayer.isPotionActive(1)
        doTimerBoost = module.settings.timerBoostValue.get()
        blocksmcTimerMode = module.settings.bmcTimerMode.get()
        switch (module.settings.jumpMode.get()) {
            case "MatrixHop":
                module.tag = "MatrixHop";
                if (MovementUtils.isMoving()) {
                    if (mc.thePlayer.onGround) {
                        mc.gameSettings.keyBindJump.pressed = false
                        mc.thePlayer.jump();
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
                    if (doTimerBoost) mc.timer.timerSpeed = 1.1
                    mc.thePlayer.motionY -= 0.0034
                    // Chat.print("a")
                }
                if (mc.thePlayer.fallDistance > 1.3) {
                    mc.timer.timerSpeed = 1.0
                }
                if (doTimerBoost && !mc.thePlayer.onGround && !mc.thePlayer.fallDistance >= 0 <= 1) {
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
                module.tag = "KarhuLow" 
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
                break;
            case "BlocksMC":
                module.tag = "BlocksMC"
                if (MovementUtils.isMoving()) {
                    if (hasSpeed) {
                        if (mc.thePlayer.onGround) {
                            mc.gameSettings.keyBindJump.pressed = false
                            mc.thePlayer.jump()
                            MovementUtils.strafe(0.485)
                            mc.timer.timerSpeed = 1.0
                            if (doTimerBoost && blocksmcTimerMode == "Weird") mc.timer.timerSpeed = 0.9

                        } else {
                            MovementUtils.strafe(MovementUtils.getSpeed() + 0.0107)
                            if (mc.thePlayer.fallDistance > 0) {
                                mc.thePlayer.motionX *= 1.013
                                mc.thePlayer.motionZ *= 1.013
                                if (doTimerBoost && blocksmcTimerMode == "Infinite") mc.timer.timerSpeed = 1.1
                                if (doTimerBoost && blocksmcTimerMode == "Fast") mc.timer.timerSpeed = 1.23
                                if (doTimerBoost && blocksmcTimerMode == "Weird") mc.timer.timerSpeed = 1.5
                            }
                        }
                    } else {
                        if (mc.thePlayer.onGround) {
                            mc.gameSettings.keyBindJump.pressed = false
                            mc.thePlayer.jump()
                            MovementUtils.strafe(0.485)
                            mc.timer.timerSpeed = 1.0
                            if (doTimerBoost && blocksmcTimerMode == "Weird") mc.timer.timerSpeed = 0.9
                        } else {
                            if (mc.thePlayer.fallDistance < 1.4) {
                            MovementUtils.strafe(MovementUtils.getSpeed() + 0.0002)
                            } else mc.timer.timerSpeed = 1.0
                            if (mc.thePlayer.fallDistance > 0) {
                                mc.thePlayer.motionX *= 1.009
                                mc.thePlayer.motionZ *= 1.009
                                if (doTimerBoost && blocksmcTimerMode == "Infinite") mc.timer.timerSpeed = 1.1
                                if (doTimerBoost && blocksmcTimerMode == "Fast") mc.timer.timerSpeed = 1.23
                                if (doTimerBoost && blocksmcTimerMode == "Weird") mc.timer.timerSpeed = 1.55
                            }
                        }
                    }
                } else {
                    mc.timer.timerSpeed = 1.0
                    mc.thePlayer.motionX = 0
                    mc.thePlayer.motionZ = 0
                }
                break;
            case "Spartan":
                module.tag = "Spartan"
                if (MovementUtils.isMoving()) {
                    if (mc.thePlayer.onGround) {
                        mc.gameSettings.keyBindJump.pressed = false
                        mc.thePlayer.jump()
                        MovementUtils.strafe(0.48)
                        // mc.timer.timerSpeed = 1.1
                    } else {
                        if (mc.thePlayer.fallDistance > 0) {
                            if (mc.thePlayer.fallDistance < 1.1) {
                                mc.timer.timerSpeed = 1.0
                                mc.thePlayer.motionY -= 0.005
                                mc.thePlayer.motionX *= 1.005
                                mc.thePlayer.motionZ *= 1.005
                                MovementUtils.strafe(MovementUtils.getSpeed())
                            }
                        } else {
                            MovementUtils.strafe(MovementUtils.getSpeed())
                            mc.thePlayer.motionX *= 1.004
                            mc.thePlayer.motionZ *= 1.004
                        }
                    }
                } else {
                    mc.timer.timerSpeed = 1.0
                    mc.thePlayer.motionX = 0
                    mc.thePlayer.motionZ = 0
                }
                break;
            case "NoRules":
                module.tag = "NoRules";
                if (MovementUtils.isMoving()) {
                    if (mc.thePlayer.fallDistance < 0.5) {
                        if (!mc.gameSettings.keyBindJump.pressed) {
                        MovementUtils.strafe(MovementUtils.getSpeed() + 0.022)
                        if (module.settings.timerBoostValue.get()) mc.timer.timerSpeed = 1.1
                    }
                    } else {
                        mc.timer.timerSpeed = 1.0
                    }
                    if (mc.thePlayer.onGround) {
                        if (mc.gameSettings.keyBindJump.pressed == false) {
                            mc.thePlayer.jump()
                            MovementUtils.strafe(0.66)
                            mc.timer.timerSpeed = 1.0
                        }
                    } else {
                        if (mc.thePlayer.fallDistance < 0.6 && mc.gameSettings.keyBindJump.pressed == false) mc.thePlayer.motionY -= 0.06
                    }
                }
                break;
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
                            // mc.thePlayer.motionY -= 0.000032
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