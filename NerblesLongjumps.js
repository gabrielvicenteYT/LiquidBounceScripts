///api_version=2
var script = registerScript({
    name: "NerblesLongJumps",
    version: "1.2",
    authors: ["Nerbles1"]
});

var Glide = true;
var debug;
var mode;
var client = Java.type("net.ccbluex.liquidbounce.LiquidBounce");
var speedcheck = true
var LB = Java.type("net.ccbluex.liquidbounce.LiquidBounce");
var jumped = false;
var MovementUtils = Java.type("net.ccbluex.liquidbounce.utils.MovementUtils");
var BlockUtils = Java.type("net.ccbluex.liquidbounce.utils.block.BlockUtils");
var S12PacketEntityVelocity = Java.type("net.minecraft.network.play.server.S12PacketEntityVelocity");
var C03PacketPlayer = Java.type("net.minecraft.network.play.client.C03PacketPlayer");
var C04PacketPlayerPosition = Java.type("net.minecraft.network.play.client.C03PacketPlayer.C04PacketPlayerPosition");
var boost = false;
var jumps = 0;
var ticks = 0;
var BlockPos = Java.type("net.minecraft.util.BlockPos");
var doSpoof = false
var x;
var spoofs = 0;
var z;
script.registerModule({
    name: "NerblesLongJumps",
    description: "A BlocksMC LongJump",
    category: "Movement",
    settings: {
        debugMode: Setting.boolean({
            name: "Debug",
            default: false
        }),
        jumpMode: Setting.list({
            name: "JumpMode",
            default: "BlocksMC",
            values: ["BlocksMC", "BlocksMCGlide", "Vulcan", "VulcanClip"]
        }),
    }
}, function (module) {
    module.on("enable", function () {
        Glide = false;
        jumped = false;
        speedcheck = true;
        boost = false;
        doSpoof = false
        ticks = 0;
        jumps = 0;
        spoofs = 0;
        mc.timer.timerSpeed = 1.0;
        x = mc.thePlayer.posX;
        z = mc.thePlayer.posZ;
    })
    module.on("update", function () {
        try {
            // ticks++;
            mode = module.settings.jumpMode.get();
            debug = module.settings.debugMode.get()
            module.tag = mode;
            switch (mode) {
                case "BlocksMCGlide":
                    if (mc.thePlayer.onGround) {
                        if (jumped == false) {
                            mc.thePlayer.jump() 
                            if (mc.thePlayer.isPotionActive(1)) MovementUtils.strafe(0.66)
                            else MovementUtils.strafe(0.48)
                            Chat.print("§b[§6§lNerblesLongjumps§b] §cNote: This silent flags")
                            if (debug) Chat.print("§b[§6§lNerblesLongjumps§b] §fLongjumping")
                        } else {
                            mc.thePlayer.motionX = 0;
                            mc.thePlayer.motionZ = 0;
                            module.setState(false);
                        }
                    } else {
                        if (mc.thePlayer.fallDistance < 1.122 && mc.thePlayer.motionY < 0.0809) {
                            mc.thePlayer.motionY += 0.0366;
                            if (mc.thePlayer.isPotionActive(1)) {
                                MovementUtils.strafe(MovementUtils.getSpeed() + 0.026)
                            } else {
                                MovementUtils.strafe(MovementUtils.getSpeed() + 0.0092)
                            }
                        } else {
                            MovementUtils.strafe();
                            jumped = true;
                        }
                    }
                    break;
                case "BlocksMC":
                    if (mc.thePlayer.onGround) {
                        if (jumped == false) {
                            if (mc.thePlayer.isPotionActive(1)) mc.thePlayer.jump(), MovementUtils.strafe(0.485)
                            if (debug && mc.thePlayer.isPotionActive(1)) Chat.print("§b[§6§lNerblesLongjumps§b] §fLongjumping")
                            if (!mc.thePlayer.isPotionActive(1)) Chat.print("§b[§6§lNerblesLongjumps§b] §fYou need a speed potion to longjump!"), module.setState(false);
                        } else {
                            mc.thePlayer.motionX = 0;
                            mc.thePlayer.motionZ = 0
                            module.setState(false);
                        }
                    } else {
                        if (mc.thePlayer.fallDistance < 1.12) {
                            if (mc.thePlayer.isPotionActive(1)) {
                                if (debug && speedcheck) Chat.print("§b[§6§lNerblesLongjumps§b] §fplayer has speed"), speedcheck = false;
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
                                if (debug) Chat.print("§b[§6§lNerblesLongjumps§b] §fSlowing down")
                            }
                            mc.timer.timerSpeed = 1.0
                            jumped = true
                        }
                    }
                    break;
                case "Vulcan":
                    mc.thePlayer.jumpMovementFactor = 0.026
                    if (jumps <= 2) {
                        mc.thePlayer.setPosition(x, mc.thePlayer.posY, z)
                    }
                    if (mc.thePlayer.onGround) {
                        if (jumped == false) {
                            mc.thePlayer.jump()
                            jumps++
                            fallDistance = 1.125
                        }
                        if (jumps >= 3) module.setState(false)
                    } else {
                        if (mc.thePlayer.fallDistance >= fallDistance && jumps < 3) {
                            mc.thePlayer.motionY = 0.41;
                            if (jumps == 2) MovementUtils.strafe(0.35)
                            fallDistance += 1.125
                            jumps++
                        }
                        if (mc.thePlayer.fallDistance > 3.3 && !jumped) {
                            mc.thePlayer.fallDistance = 0
                            MovementUtils.strafe(0.5)
                            doSpoof = true
                            jumped = true
                        }
                        if (jumps >= 3 && mc.thePlayer.motionY <= -0.1) {
                            if ( mc.thePlayer.motionY <= -0.1) {
                                if (mc.thePlayer.ticksExisted % 2 == 0) {
                                    mc.thePlayer.motionY = -0.152
                                    
                                } else {
                                    mc.thePlayer.motionY = -0.1
                                }
                                if (mc.thePlayer.hurtTime <= 9 && mc.thePlayer.hurtTime >= 6) {
                                    var addY = 0.16
                                    mc.thePlayer.motionY = addY
                                    addY -= 0.001
                                    MovementUtils.strafe(0.45)
                                }
                            }
                        }
                    }
                    break
                case "VulcanClip":
                    mc.thePlayer.jumpMovementFactor = 0.026
                    if (mc.thePlayer.onGround) {
                        if (!jumped) {
                            for (i = 0; i < 5; i++) {
                                mc.thePlayer.setPosition(mc.thePlayer.posX, mc.thePlayer.posY - 0.5, mc.thePlayer.posZ)
                            }
                            // occasionally flagged without the loop so I added it 
                            jumped = true
                        } else {
                            boost = true
                            mc.timer.timerSpeed = 0.2
                        }
                    } else {
                        if (ticks <= 9) {
                            mc.timer.timerSpeed = 0.2
                            ticks++
                            if (debug) Chat.print("§b[§6§lNerblesLongjumps§b] §fBoosting")
                            if (MovementUtils.isMoving()) {
                                MovementUtils.strafe(9.5)
                            } else {
                                mc.thePlayer.motionX = 0.0
                                mc.thePlayer.motionZ = 0.0
                            }
                            if (mc.gameSettings.keyBindJump.isKeyDown()) {
                                mc.thePlayer.motionY = 3.0
                            } else {
                                mc.thePlayer.motionY = 0.0
                            }
                            if (ticks == 9) {
                                module.setState(false)
                                mc.thePlayer.motionX = 0.0
                                mc.thePlayer.motionZ = 0.0
                                mc.thePlayer.motionY = 0.0
                            }
                        }
                        // if (mc.thePlayer.motionY < -0.1) {
                        //     if (mc.thePlayer.ticksExisted % 2 == 0) {
                        //         mc.thePlayer.motionY = -0.152
                        //     } else {
                        //         mc.thePlayer.motionY = -0.1
                        //     }
                        // }
                    }
                    break;
            }
    } catch (e) {
        Chat.print(e)
    }
    })

    module.on("packet", function (event) {
        var packet = event.getPacket();
        if (packet instanceof C03PacketPlayer && doSpoof) {
            packet.onGround = true
            doSpoof = false
            spoofs++
            if (debug) Chat.print("§b[§6§lNerblesLongjumps§b] §fSpoofed")
            mc.thePlayer.fallDistance = -0.1
            if (debug) Chat.print("§b[§6§lNerblesLongjumps§b] §fResetting fall distance")
            
            mc.thePlayer.motionY = 0.49;
        }

    })

    module.on("disable", function () {
        mc.timer.timerSpeed = 1.0
        if (module.settings.jumpMode.get() == "VulcanClip") {
            mc.thePlayer.motionX = 0.0
            mc.thePlayer.motionZ = 0.0
        }
    })
})