/// api_version=2
var script = registerScript({
    name: "NerblesSpeeds",
    version: "1.5",
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
var InventoryUtils = Java.type("net.ccbluex.liquidbounce.utils.InventoryUtils");
var inCombat = false
var combatticks;
var hasSpeed;
var start;
var ItemBlock = Java.type("net.minecraft.item.ItemBlock");
var doTimerBoost;
var blocksmcTimerMode;
// Chat.print("§b[§6NerblesSpeeds§b] §f" + message) for debug messages maybe
script.registerModule({
    name: "NerblesSpeeds",
    description: "Speeds Made by Nerbles",
    category: "Movement",
    settings: {
        jumpMode: Setting.list({
            name: "Mode",
            default: "Ncp",
            values: ["Ncp", "VulcanYPort", "VulcanFloat", "Verus", "KarhuLow", "BlocksMC", "Spartan", "NoRules", "Negativity", "Dev"]
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
        testSetting: Setting.boolean({
            name: "TestSetting",
            default: false
        })
    }
}, function (module) {
    module.on("enable", function () {
        inCombat = false
        ticks = 0
        start = mc.thePlayer.posY
        doTimerBoost = module.settings.timerBoostValue.get()
        if (module.settings.jumpMode.get() == "Vulcan" && !mc.thePlayer.onGround) {
            module.setState(false)
            Chat.print("§b[§6NerblesSpeeds§b] §fenabling this module mid air can flag")
        }
    })
    module.on("update", function () {
        if (mc.thePlayer.ticksExisted > combatticks + 4) {
            inCombat = false
        }
        hasSpeed = mc.thePlayer.isPotionActive(1)
        doTimerBoost = module.settings.timerBoostValue.get()
        blocksmcTimerMode = module.settings.bmcTimerMode.get()
        switch (module.settings.jumpMode.get()) {
            case "VulcanYPort":
                ticks++
                mc.thePlayer.jumpMovementFactor = 0.0252
                module.tag = "VulcanYPort";
                if (MovementUtils.isMoving()) {
                    if (mc.thePlayer.hurtTime <= 9 && mc.thePlayer.hurtTime >= 7) {
                        MovementUtils.strafe(0.48)
                    }
                    if (mc.thePlayer.onGround) {
                        if (doTimerBoost) mc.timer.timerSpeed = 0.5
                        ticks = 0
                        mc.gameSettings.keyBindJump.pressed = false
                        mc.thePlayer.jump();
                        start = mc.thePlayer.posY
                        if (hasSpeed) MovementUtils.strafe(0.62); else MovementUtils.strafe(0.48);
                    } else {
                        if (doTimerBoost && ticks >= 1) mc.timer.timerSpeed = 1.15
                        if (ticks == 1) mc.thePlayer.setPosition(mc.thePlayer.posX, start, mc.thePlayer.posZ)
                        if (ticks == 4) mc.thePlayer.motionY = -0.15
                        MovementUtils.strafe()
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
                            MovementUtils.strafe()
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
                            if (module.settings.testSetting.get() && !inCombat) {
                                mc.thePlayer.motionY = 0.4
                            } 
                            MovementUtils.strafe(0.6)
                            mc.timer.timerSpeed = 1.0
                            // if (doTimerBoost && blocksmcTimerMode == "Weird") mc.timer.timerSpeed = 0.9

                        } else {
                            MovementUtils.strafe(MovementUtils.getSpeed() + 0.01)
                            if (mc.thePlayer.fallDistance < 1.4) {
                                if (module.settings.testSetting.get() && mc.thePlayer.fallDistance > 0 && !inCombat) {
                                    mc.thePlayer.motionY += -0.004
                                } 
                            }
                            //     if (doTimerBoost && blocksmcTimerMode == "Infinite") mc.timer.timerSpeed = 1.1
                            //     if (doTimerBoost && blocksmcTimerMode == "Fast") mc.timer.timerSpeed = 1.23
                            //     if (doTimerBoost && blocksmcTimerMode == "Weird") mc.timer.timerSpeed = 1.5
                            // }
                        }
                    } else {
                        if (mc.thePlayer.onGround) {
                            mc.gameSettings.keyBindJump.pressed = false
                            mc.thePlayer.jump()
                            if (module.settings.testSetting.get() && !inCombat) {
                                mc.thePlayer.motionY = 0.4
                            } 
                            MovementUtils.strafe(0.48)
                            mc.timer.timerSpeed = 1.0
                            // if (doTimerBoost && blocksmcTimerMode == "Weird") mc.timer.timerSpeed = 0.9
                        } else {
                            if (mc.thePlayer.fallDistance < 1.4) {
                                MovementUtils.strafe(MovementUtils.getSpeed() + 0.0002)
                                if (module.settings.testSetting.get() && mc.thePlayer.fallDistance > 0 && !inCombat) {
                                    mc.thePlayer.motionY += -0.004
                                } 
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
            case "Negativity":

                module.tag = "Negativity"
                if (MovementUtils.isMoving()) {
                    if (mc.thePlayer.onGround) {
                        mc.gameSettings.keyBindJump.pressed = false
                        mc.thePlayer.jump()
                        mc.thePlayer.motionY = 0.3
                        MovementUtils.strafe(0.48)

                    } else {
                        MovementUtils.strafe(0.55)
                    }
                    
                } else {
                    mc.thePlayer.motionX = 0.0
                    mc.thePlayer.motionZ = 0.0
                }
                break;
            case "VulcanFloat":
                    module.tag = "VulcanFloat"
                    if (MovementUtils.isMoving()) {
                        // if the player is on the ground jump and setMotionY to 0
                        if (mc.thePlayer.onGround) {
                            mc.thePlayer.jump()
                            mc.thePlayer.motionY = 0.2
                            ticks = 0
                            MovementUtils.strafe(0.48)
                        } else {
                            ticks++
                            // if theres a block 1 blocks below the player setMotionY to 0
                            if (mc.theWorld.getBlockState(new BlockPos(mc.thePlayer.posX, mc.thePlayer.posY - 1, mc.thePlayer.posZ)).getBlock() != Blocks.air) {
                                if (ticks >= 1) mc.thePlayer.motionY = 0
                            }
                            if (hasSpeed) {
                                MovementUtils.strafe(0.47)
                            } else {
                                MovementUtils.strafe(0.33)
                            }
                        }
                    }
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
        if (module.settings.jumpMode.get() == "Ncp" || "Vulcan") {
            mc.thePlayer.motionX = 0
            mc.thePlayer.motionZ = 0
            // reduces speed and motionY to prevent flags
        }
    })
});