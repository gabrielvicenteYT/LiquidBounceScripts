/// api_version=2
var script = registerScript({
    name: "NerblesSpeeds",
    version: "1.1",
    authors: ["Nerbles1"]
});

var ticks;
var LB = Java.type("net.ccbluex.liquidbounce.LiquidBounce");
var MovementUtils = Java.type("net.ccbluex.liquidbounce.utils.MovementUtils");
var GameSettings = Java.type("net.minecraft.client.settings.GameSettings");
var S12PacketEntityVelocity = Java.type("net.minecraft.network.play.server.S12PacketEntityVelocity");
var C03PacketPlayer = Java.type("net.minecraft.network.play.client.C03PacketPlayer")
var C04PacketPlayerPosition = Java.type("net.minecraft.network.play.client.C03PacketPlayer.C04PacketPlayerPosition")
var inCombat = false
var combatticks;
script.registerModule({
    name: "NerblesSpeeds",
    description: "Speeds Made by Nerbles",
    category: "Movement",
    settings: {
        jumpMode: Setting.list({
            name: "Mode",
            default: "MatrixHop",
            values: ["MatrixHop", "MatrixWeird", "Vulcan", "Ncp", "Verus", "KarhuLow"]
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
        // matrixStrafeMode: Setting.list({
        //     name: "MatrixHop-StrafeMode",
        //     default: "Full",
        //     values: ["Semi", "Full"]
        // })
    }
}, function (module) {
    module.on("enable", function () {
        inCombat = false

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
                    if (module.settings.timerBoostValue.get() == true) mc.timer.timerSpeed = 1.7
                    mc.thePlayer.motionY -= 0.00347
                    // Chat.print("a")
                }
                if (mc.thePlayer.fallDistance > 1.3) {
                    mc.timer.timerSpeed = 1.0
                }
                if (module.settings.timerBoostValue.get() == true && !mc.thePlayer.onGround && !mc.thePlayer.fallDistance >= 0 <= 1) {
                    mc.timer.timerSpeed = 1.075
                } else {
                    mc.timer.timerSpeed = 1.0
                }
                break;
            // case "MatrixWeird":
            //     module.tag = "MatrixWeird";
            //     if(MovementUtils.isMoving()) {
            //         if (mc.thePlayer.onGround) {
            //             mc.gameSettings.keyBindJump.pressed = false
            //             mc.thePlayer.jump()
            //         }
            //     } else {
            //         mc.timer.timerSpeed = 1.0
            //         mc.thePlayer.motionX = 0
            //         mc.thePlayer.motionZ = 0
            //     }
            //     if (mc.thePlayer.ticksExisted < ticks + 2) {
            //         mc.thePlayer.motionY += -0.0033
            //         mc.timer.timerSpeed = 1.05
            //     } else {
            //         mc.timer.timerSpeed = 1.0
            //     }
            //     if (mc.thePlayer.fallDistance > 0 < 1) {
            //         mc.thePlayer.motionX *= 1.00154
            //         mc.thePlayer.motionY -= 0.0001
            //         mc.thePlayer.motionZ *= 1.00154
            //     }
            //     break;
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
                        MovementUtils.strafe(0.48);
                        mc.thePlayer.motionX *= 1.0021
                        mc.thePlayer.motionZ *= 1.0021
                        mc.timer.timerSpeed = 0.9
                    }
                    // Chat.print(MovementUtils.getSpeed() + 0.0015)
                    if (!mc.thePlayer.onGround) MovementUtils.strafe(MovementUtils.getSpeed() + 0.00125);
                    if (mc.thePlayer.fallDistance > 0) {
                        mc.timer.timerSpeed = 1.455
                        if (mc.thePlayer.fallDistance > 1.2) {
                            mc.timer.timerSpeed = 1.0
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
                } else if (MovementUtils.isMoving()){
                    mc.thePlayer.motionX *= 1.0037
                    mc.thePlayer.motionZ *= 1.0037
                    if (mc.thePlayer.fallDistance <= 1) mc.thePlayer.motionY += -0.00499
                }
                if (!MovementUtils.isMoving()) {
                    mc.thePlayer.motionX = 0.0
                    mc.thePlayer.motionZ = 0.0
                }
        }

    });

    module.on("jump", function () {
        switch (module.settings.jumpMode.get()) {
            case "Vulcan":
                mc.thePlayer.motionY = -0.41
                mc.timer.timerSpeed = 1.25
                break;
            case "Dev":
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
        mc.thePlayer.jumpMovementFactor = 0.2
        mc.thePlayer.speedInAir = 0.02
        if (module.settings.jumpMode.get() == "Ncp" || "MatrixWeird" || "Vulcan") {
            mc.thePlayer.motionX = 0
            mc.thePlayer.motionZ = 0
            // reduces speed and motionY to prevent flags
        }
    })
});