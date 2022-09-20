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

script.registerModule({
    name: "NerblesSpeeds",
    description: "Speeds Made by Nerbles",
    category: "Movement",
    settings: {
        jumpMode: Setting.list({
            name: "Mode",
            default: "MatrixHop",
            values: ["MatrixHop", "MatrixTimer", "MatrixWeird", "Vulcan", "Ncp", "Verus"]
        }),
        timerBoostValue: Setting.boolean({
            name: "TimerBoost",
            default: true
        }),
    }
}, function (module) {
    module.on("enable", function() {
        jumped = false
        ticks = 0
        Chat.print(mc.thePlayer.jumpMovementFactor())
    })
    module.on("update", function(){
        switch(module.settings.jumpMode.get()) {
            case "MatrixHop":
                module.tag = "MatrixHop";
                // mc.thePlayer.jumpMovementFactor = 0.02605
                if (MovementUtils.isMoving()) {
                    if (mc.thePlayer.onGround) {
                        mc.gameSettings.keyBindJump.pressed = false
                        mc.timer.timerSpeed = 2.0
                        mc.thePlayer.jump();
                        jumped = true
                        MovementUtils.strafe(MovementUtils.getSpeed())
                    }
                } else {
                    mc.timer.timerSpeed = 1.0
                    mc.thePlayer.motionX = 0.0
                    mc.thePlayer.motionZ = 0.0
                }
                if (mc.thePlayer.fallDistance > 0 < 1) {
                    if (module.settings.timerBoostValue.get() == true) {
                        mc.timer.timerSpeed += 0.117
                    }
                    mc.thePlayer.motionY -= 0.00345
                }
                if (mc.thePlayer.fallDistance > 1.3) {
                    mc.timer.timerSpeed = 1.0
                }
                if (module.settings.timerBoostValue.get() == true && !mc.thePlayer.onGround && !mc.thePlayer.fallDistance >= 0 <= 1) {
                    mc.timer.timerSpeed = 1.072
                } else {
                    mc.timer.timerSpeed = 1.0
                }
                break;
            case "MatrixTimer":
                module.tag = "MatrixTimer";
                if (MovementUtils.isMoving()) {
                    if (mc.thePlayer.motionY > 0.2) {
                        mc.thePlayer.motionY += -0.0025
                    }
                    if (mc.thePlayer.onGround) {
                        mc.thePlayer.setSprinting(true)
                        mc.timer.timerSpeed = 0.55
                        mc.thePlayer.jump()
                        MovementUtils.strafe(MovementUtils.getSpeed() + 0.003)
                    }
                } else {
                    mc.timer.timerSpeed = 1.0
                    mc.thePlayer.motionX = 0
                    mc.thePlayer.motionZ = 0
                }
                if (mc.thePlayer.fallDistance > 0) {
                    mc.timer.timerSpeed = 7.0
                    mc.thePlayer.motionY -= 0.0034
                }
                if (mc.thePlayer.fallDistance > 1.2) {
                    mc.timer.timerSpeed = 1.0
                }
                break;
            case "MatrixWeird":
                module.tag = "MatrixWeird";
                if(MovementUtils.isMoving()) {
                    if (mc.thePlayer.onGround) {
                        mc.gameSettings.keyBindJump.pressed = false
                        mc.thePlayer.jump()
                        mc.timer.timerSpeed = 0.1
                        jumps += 1
                    }
                } else {
                    mc.timer.timerSpeed = 1.0
                    mc.thePlayer.motionX = 0
                    mc.thePlayer.motionZ = 0
                }
                if (mc.thePlayer.fallDistance > 0 < 1) {
                    mc.thePlayer.motionX *= 1.00154
                    mc.thePlayer.motionY -= 0.0034
                    mc.thePlayer.motionZ *= 1.00154
                    mc.timer.timerSpeed = 0.45
                    if (jumps % 5 == 0) mc.timer.timerSpeed = 0.42
                }
                if (mc.thePlayer.fallDistance == 0 && mc.thePlayer.onGround == false) {
                    mc.timer.timerSpeed = 1.1
                    if (jumps % 5 == 0) mc.timer.timerSpeed = 1.275
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
                        mc.thePlayer.motionX *= 1.002
                        mc.thePlayer.motionZ *= 1.002
                        mc.timer.timerSpeed = 0.9
                    }
                    MovementUtils.strafe(MovementUtils.getSpeed() + 0.001);
                    if (mc.thePlayer.fallDistance > 0) {
                        mc.timer.timerSpeed = 1.443
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
            case "Ncp":
                mc.thePlayer.motionY += -0.1
        }
    })

    module.on("disable", function() {
        mc.timer.timerSpeed = 1.0
        jumped = false
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