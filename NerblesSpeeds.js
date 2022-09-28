/// api_version=2
var script = registerScript({
    name: "NerblesSpeeds",
    version: "1.1",
    authors: ["Nerbles1"]
});

var recX = 0.0
var recY = 0.0
var recZ = 0.0
var jumped = false
var jumps = 0
var dist = 0.0
var noVelocityY = 0
var ticks = 0
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
            values: ["MatrixHop", "MatrixWeird", "Vulcan", "Ncp", "Verus", "Dev"]
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
        matrixStrafeMode: Setting.list({
            name: "MatrixHop-StrafeMode",
            default: "Full",
            values: ["Semi", "Full"]
        })
    }
}, function (module) {
    module.on("enable", function() {
        jumped = false
        inCombat = false
        ticks = 0
        
    })
    module.on("update", function(){
        if (mc.thePlayer.ticksExisted > combatticks) {
            inCombat = false
        }
        switch(module.settings.jumpMode.get()) {
            case "MatrixHop":
                module.tag = "MatrixHop";
                if (MovementUtils.isMoving()) {
                    if (mc.thePlayer.onGround) {
                        mc.gameSettings.keyBindJump.pressed = false
                        mc.thePlayer.jump();
                        jumped = true
                        mc.timer.timerSpeed = 0.95
                        // if (!inCombat) MovementUtils.strafe(MovementUtils.getSpeed())
                    } else {
                    if (module.settings.matrixStrafeValue.get() && inCombat == true) {
                        if (module.settings.matrixStrafeMode.get() == "Full") MovementUtils.strafe(0.21)
                    }
                }
                } else {
                    mc.timer.timerSpeed = 1.0
                    mc.thePlayer.motionX = 0.0
                    mc.thePlayer.motionZ = 0.0
                }
                if (mc.thePlayer.fallDistance > 0 < 1) {
                    if (module.settings.matrixStrafeValue.get() && inCombat == true) {
                        if (module.settings.matrixStrafeMode.get() == "Semi") MovementUtils.strafe(0.22)
                    }
                    if (module.settings.timerBoostValue.get() == true) {
                        mc.timer.timerSpeed += 0.1175
                    }
                    mc.thePlayer.motionY -= 0.00347
                }
                if (mc.thePlayer.fallDistance > 1.3) {
                    mc.timer.timerSpeed = 1.0
                }
                if (module.settings.timerBoostValue.get() == true && !mc.thePlayer.onGround && !mc.thePlayer.fallDistance >= 0 <= 1) {
                    mc.timer.timerSpeed = 1.073
                } else {
                    mc.timer.timerSpeed = 1.0
                }
                break;
            case "MatrixWeird":
                module.tag = "MatrixWeird";
                if(MovementUtils.isMoving()) {
                    if (mc.thePlayer.onGround) {
                        mc.gameSettings.keyBindJump.pressed = false
                        mc.thePlayer.jump()
                        ticks = mc.thePlayer.ticksExisted
                        jumps += 1
                    }
                } else {
                    mc.timer.timerSpeed = 1.0
                    mc.thePlayer.motionX = 0
                    mc.thePlayer.motionZ = 0
                }
                if (mc.thePlayer.ticksExisted < ticks + 2) {
                    mc.thePlayer.motionY += -0.0033
                    mc.timer.timerSpeed = 1.05
                } else {
                    mc.timer.timerSpeed = 1.0
                }
                if (mc.thePlayer.fallDistance > 0 < 1) {
                    mc.thePlayer.motionX *= 1.00154
                    mc.thePlayer.motionY -= 0.0001
                    mc.thePlayer.motionZ *= 1.00154
                }
                break;
            case "Vulcan":
                module.tag = "Vulcan";
                if(MovementUtils.isMoving()) {
                    if (mc.thePlayer.onGround) {
                        mc.gameSettings.keyBindJump.pressed = false
                        mc.thePlayer.jump()
                        MovementUtils.strafe(MovementUtils.getSpeed() + 0.00187)
                        mc.timer.timerSpeed = 1.5
                        ticks = 0
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
                    MovementUtils.strafe(MovementUtils.getSpeed() + 0.001);
                    if (mc.thePlayer.fallDistance > 0) {
                        mc.timer.timerSpeed = 1.475
                        if (mc.thePlayer.fallDistance > 1.2) {
                            mc.timer.timerSpeed = 1.0
                        }
                    }
                }
                break;
            case "Verus":
                module.tag = "Verus";
                if(MovementUtils.isMoving) {
                    MovementUtils.strafe(0.33)
                    if(mc.thePlayer.onGround) {
                        mc.thePlayer.jump();
                        MovementUtils.strafe(0.425)
                    }
                }
                break;
                }
    });

    module.on("jump", function() {
        switch (module.settings.jumpMode.get()) {
            case "Vulcan":
                mc.thePlayer.motionY = -0.41
                mc.timer.timerSpeed = 1.25
                break;
        }
    })

    module.on("attack", function (event) {
        inCombat = true
        combatticks = mc.thePlayer.ticksExisted    
    })

    module.on("disable", function() {
        mc.timer.timerSpeed = 1.0
        jumped = false
        inCombat = false
        jumps = 0
        ticks = 0
        noVelocityY = 0
        mc.thePlayer.jumpMovementFactor = 0.2
        mc.thePlayer.speedInAir = 0.02
        if (module.settings.jumpMode.get() == "Ncp" || "MatrixWeird" || "Vulcan") {
            mc.thePlayer.motionX = 0
            mc.thePlayer.motionZ = 0
            // reduces speed and motionY to prevent flags
        }
    })
});