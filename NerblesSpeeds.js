/// api_version=2
var script = registerScript({
    name: "NerblesSpeeds",
    version: "1.3",
    authors: ["Nerbles1"]
});

var ticks = 0;
var LB = Java.type("net.ccbluex.liquidbounce.LiquidBounce");
var MovementUtils = Java.type("net.ccbluex.liquidbounce.utils.MovementUtils");
var GameSettings = Java.type("net.minecraft.client.settings.GameSettings");
var S12PacketEntityVelocity = Java.type("net.minecraft.network.play.server.S12PacketEntityVelocity");
var C03PacketPlayer = Java.type("net.minecraft.network.play.client.C03PacketPlayer")
var C04PacketPlayerPosition = Java.type("net.minecraft.network.play.client.C03PacketPlayer.C04PacketPlayerPosition")
var BlockPos = Java.type("net.minecraft.util.BlockPos");
var ItemStack = Java.type("net.minecraft.item.ItemStack");
var Blocks = Java.type("net.minecraft.init.Blocks");
var C08PacketPlayerBlockPlacement = Java.type("net.minecraft.network.play.client.C08PacketPlayerBlockPlacement");
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
            default: "Ncp",
            values: ["Ncp", "Vulcan", "Verus", "KarhuLow", "BlocksMC", "Spartan", "NoRules", "BlocksStrafeless", "Dev"]
        }),
        timerBoostValue: Setting.boolean({
            name: "TimerBoost",
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
        doTimerBoost = module.settings.timerBoostValue.get()
    })
    module.on("update", function () {
        if (mc.thePlayer.ticksExisted > combatticks) {
            inCombat = false
        }
        hasSpeed = mc.thePlayer.isPotionActive(1)
        doTimerBoost = module.settings.timerBoostValue.get()
        blocksmcTimerMode = module.settings.bmcTimerMode.get()
        switch (module.settings.jumpMode.get()) {
            case "Vulcan":
                module.tag = "Vulcan";
                if (MovementUtils.isMoving()) {
                    if (mc.thePlayer.onGround) {
                        ticks = 0
                        mc.gameSettings.keyBindJump.pressed = false
                        mc.thePlayer.jump();
                        mc.timer.timerSpeed = 0.9
                        MovementUtils.strafe(0.475)
                    } else {
                        ticks++
                        if (ticks == 4 && !mc.thePlayer.isCollidedHorizontally && mc.theWorld.getBlockState(mc.thePlayer.getPosition().add(new BlockPos(mc.thePlayer.motionX*4,mc.thePlayer.motionY,mc.thePlayer.motionZ*4))).getBlock() == Blocks.air) {
                            mc.thePlayer.motionY = -0.305
                            // mc.timer.timerSpeed = 1.24
                        }
                        if (mc.thePlayer.fallDistance > 0.8) mc.timer.timerSpeed = 1.0
                    }
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
                            MovementUtils.strafe(0.6)
                            mc.timer.timerSpeed = 1.0
                            // if (doTimerBoost && blocksmcTimerMode == "Weird") mc.timer.timerSpeed = 0.9

                        } else {
                            MovementUtils.strafe(MovementUtils.getSpeed() + 0.01)
                            // if (mc.thePlayer.fallDistance > 0) {
                            //     if (doTimerBoost && blocksmcTimerMode == "Infinite") mc.timer.timerSpeed = 1.1
                            //     if (doTimerBoost && blocksmcTimerMode == "Fast") mc.timer.timerSpeed = 1.23
                            //     if (doTimerBoost && blocksmcTimerMode == "Weird") mc.timer.timerSpeed = 1.5
                            // }
                        }
                    } else {
                        if (mc.thePlayer.onGround) {
                            mc.gameSettings.keyBindJump.pressed = false
                            mc.thePlayer.jump()
                            MovementUtils.strafe(0.48)
                            mc.timer.timerSpeed = 1.0
                            // if (doTimerBoost && blocksmcTimerMode == "Weird") mc.timer.timerSpeed = 0.9
                        } else {
                            if (mc.thePlayer.fallDistance < 1.4) {
                            MovementUtils.strafe(MovementUtils.getSpeed() + 0.0002)
                            } else mc.timer.timerSpeed = 1.0
                            // if (mc.thePlayer.fallDistance > 0) {
                            //     if (doTimerBoost && blocksmcTimerMode == "Infinite") mc.timer.timerSpeed = 1.1
                            //     if (doTimerBoost && blocksmcTimerMode == "Fast") mc.timer.timerSpeed = 1.23
                            //     if (doTimerBoost && blocksmcTimerMode == "Weird") mc.timer.timerSpeed = 1.55
                            // }
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
            case "BlocksStrafeless":

                module.tag = "BlocksStrafeless"
                if (MovementUtils.isMoving()) {
                    if (hasSpeed) {
                        if (mc.thePlayer.onGround) {
                            mc.gameSettings.keyBindJump.pressed = false
                            mc.thePlayer.jump()
                            // mc.timer.timerSpeed = 0.9
                            MovementUtils.strafe(0.64)
                            mc.timer.timerSpeed = 1.0
                        } else {
                            mc.thePlayer.motionX *= 1.029
                            mc.thePlayer.motionZ *= 1.029
                            // if (mc.thePlayer.fallDistance > 0) mc.timer.timerSpeed = 1.55
                            if (mc.thePlayer.fallDistance > 1.3) mc.timer.timerSpeed = 1.0
                        }
                    } else {
                        if (mc.thePlayer.onGround) {
                            mc.gameSettings.keyBindJump.pressed = false
                            mc.thePlayer.jump()
                            MovementUtils.strafe(0.482)
                            mc.timer.timerSpeed = 1.0
                        } else {
                            mc.thePlayer.motionX *= 1.003
                            mc.thePlayer.motionZ *= 1.003
                        }
                    }
                } else {
                    mc.thePlayer.motionX = 0.0
                    mc.thePlayer.motionZ = 0.0
                }
                break;
            case "Dev":
                module.tag = "Dev"
                if (hasSpeed) {
                    if (MovementUtils.isMoving()) {
                        if (mc.thePlayer.onGround) {
                            mc.gameSettings.keyBindJump.pressed = false
                            mc.thePlayer.jump()
                            MovementUtils.strafe(0.66)
                            mc.thePlayer.motionY = 0.4
                        } else {
                            if (mc.thePlayer.fallDistance < 1.0) MovementUtils.strafe(MovementUtils.getSpeed() + 0.0132)
                        }
                    } else {
                        mc.thePlayer.motionX = 0
                        mc.thePlayer.motionZ = 0
                    }
                } else {
                    if (MovementUtils.isMoving()) {
                        if (mc.thePlayer.onGround) {
                            mc.gameSettings.keyBindJump.pressed = false
                            mc.thePlayer.jump()
                            MovementUtils.strafe(0.48)
                            mc.thePlayer.motionY = 0.4
                        } else {
                            MovementUtils.strafe(MovementUtils.getSpeed() + 0.0015)
                        }
                    } else {
                        mc.thePlayer.motionX = 0
                        mc.thePlayer.motionZ = 0
                    }
                }
                break;
            }

    });

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