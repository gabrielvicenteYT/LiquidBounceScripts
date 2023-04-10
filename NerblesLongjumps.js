///api_version=2
var script = registerScript({
    name: "NerblesLongJumps",
    version: "1.2",
    authors: ["Nerbles1"]
});

// packets
var C03PacketPlayer = Java.type("net.minecraft.network.play.client.C03PacketPlayer");
var C04PacketPlayerPosition = Java.type("net.minecraft.network.play.client.C03PacketPlayer.C04PacketPlayerPosition");
var C05PacketPlayerLook = Java.type("net.minecraft.network.play.client.C03PacketPlayer.C05PacketPlayerLook");
var C06PacketPlayerPosLook = Java.type("net.minecraft.network.play.client.C03PacketPlayer.C06PacketPlayerPosLook");
var C07PacketPlayerDigging = Java.type("net.minecraft.network.play.client.C07PacketPlayerDigging");
var C08PacketPlayerBlockPlacement = Java.type("net.minecraft.network.play.client.C08PacketPlayerBlockPlacement");
var S12PacketEntityVelocity = Java.type("net.minecraft.network.play.server.S12PacketEntityVelocity");
var S08PacketPlayerPosLook = Java.type("net.minecraft.network.play.server.S08PacketPlayerPosLook");

// utils
var MovementUtils = Java.type("net.ccbluex.liquidbounce.utils.MovementUtils");
var BlockUtils = Java.type("net.ccbluex.liquidbounce.utils.block.BlockUtils");
var PacketUtils = Java.type("net.ccbluex.liquidbounce.utils.PacketUtils");
var LB = Java.type("net.ccbluex.liquidbounce.LiquidBounce");

// values
var Glide = true;
var debug;
var mode;
var speedcheck = true
var jumped = false;
var startY = 0;
var damaged = false;
var strafeSpeed = 0.48
var jumps = 0;
var ticks = 0;
var doSpoof = false
var x;
var spoofs = 0;
var started = false;
var z;
var boost = false;

// other stuff
var BlockPos = Java.type("net.minecraft.util.BlockPos");
var EnumFacing = Java.type("net.minecraft.util.EnumFacing");
var ItemStack = Java.type("net.minecraft.item.ItemStack");
var Blocks = Java.type("net.minecraft.init.Blocks");
var AxisAlignedBB = Java.type("net.minecraft.util.AxisAlignedBB");

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
            values: ["BlocksMC", "BlocksMCGlide", "Vulcan", "Vulcan2", "Pika"]
        }),
    }
}, function (module) {
    module.on("enable", function () {
        Glide = false;
        jumped = false;
        speedcheck = true;
        boost = false;
        doSpoof = false
        damaged = false;
        ticks = 0;
        started = false;
        jumps = 0;
        spoofs = 0;
        startY = mc.thePlayer.posY;
        mc.thePlayer.isPotionActive(1) ? strafeSpeed = 0.7 : strafeSpeed = 0.48
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
                    try {
                        // if (!mc.thePlayer.onGround) ticks++;
                        var check = mc.thePlayer.getEntityBoundingBox().offset(0, 1, 0);
                        if(started) {
                            Chat.print("§b[§6§lNerblesLongjumps§b] §fLongjumping")
                            mc.thePlayer.motionY += 0.025;
                            MovementUtils.strafe(MovementUtils.getSpeed() * 0.9);
                            if (!MovementUtils.isMoving()) {
                                mc.thePlayer.motionX = 0;
                                mc.thePlayer.motionZ = 0;
                            }
                        }
                
                        if(mc.theWorld.getCollidingBoundingBoxes(mc.thePlayer, check).isEmpty() && !started && boost) {
                            started = true;
                            mc.thePlayer.jump();
                            MovementUtils.strafe(9.5);
                        } else if (!mc.theWorld.getCollidingBoundingBoxes(mc.thePlayer, check).isEmpty()) {
                            boost = true;
                        }
                        mc.timer.timerSpeed = 0.3
                    } catch (e) {
                        Chat.print("§b[§6§lNerblesLongjumps§b] §cError: " + e)
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
                    break;
                case "Vulcan2":
                    if (!damaged) {
                        mc.thePlayer.setPosition(x, mc.thePlayer.posY, z)
                    }
                    if (mc.thePlayer.hurtTime <= 9 && mc.thePlayer.hurtTime >= 8 && !damaged) {
                        mc.thePlayer.motionY = 0.95
                        mc.timer.timerSpeed = 0.8
                        if (mc.thePlayer.hurtTime == 9) MovementUtils.strafe(0.5)
                        if (mc.thePlayer.hurtTime == 8) damaged = true, MovementUtils.strafe(0.36), mc.timer.timerSpeed = 1.0
                    }
                    if (mc.thePlayer.onGround) {
                        if (!jumped) {
                            mc.thePlayer.jump()
                            mc.thePlayer.motionY = 0.38
                            mc.timer.timerSpeed = 0.4
                            jumped = true
                            boost = true
                        } else if (damaged && jumped) {
                            module.setState(false)
                        } 
                    } else {
                        if (damaged && mc.thePlayer.motionY < -0.1) {
                            MovementUtils.strafe(0.32)
                            if (mc.thePlayer.ticksExisted % 2 == 0) {
                                mc.thePlayer.motionY = -0.152
                            } else {
                                mc.thePlayer.motionY = -0.1
                            }
                        }
                        if (mc.thePlayer.fallDistance >= 0.5 && mc.thePlayer.fallDistance < 1.5 && boost) {
                            mc.timer.timerSpeed = 110.0
                            if (mc.thePlayer.ticksExisted % 2 == 0) {
                                mc.thePlayer.motionY = -0.41999998688698
                            } else {
                                mc.thePlayer.jump()
                            }
                        } else if (mc.thePlayer.fallDistance >= 1.5 && boost) {
                            mc.thePlayer.motionY = 0.41
                            mc.timer.timerSpeed = 2.0
                            boost = false
                        }
                    }
                    break;
                case "Pika":
                    if (!damaged) {
                        mc.thePlayer.setPosition(x, mc.thePlayer.posY, z)
                        if (mc.thePlayer.hurtTime > 0) {
                            mc.thePlayer.motionY = 0.41999998688697815
                            MovementUtils.strafe(0.6)
                            if (mc.thePlayer.hurtTime == 9) {
                                mc.thePlayer.motionY += 0.1
                                damaged = true
                            }
                        }
                    }
                    if (mc.thePlayer.onGround) {
                        if (damaged == false) {
                            if (jumps == 0) {
                                if (mc.thePlayer.onGround) {
                                    mc.thePlayer.jump()
                                    jumps++
                                    fallDistance = 1.145
                                }
                            } 
                        } else {
                            // module.setState(false)
                        }
                    } else {
                        if (damaged) {
                            mc.thePlayer.motionY *= 1.08
                            mc.thePlayer.motionX *= 1.0065
                            mc.thePlayer.motionZ *= 1.0065
                        } else {
                            if (mc.thePlayer.fallDistance >= fallDistance && jumps < 3) {
                                mc.thePlayer.motionY = 0.41999998688697815
                                fallDistance += 1.145
                                jumps++
                            }
                        }
                    }
                
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
            
            // mc.thePlayer.motionY = 0.49;
        }
        if (mode == "Vulcan2") {
            if (packet instanceof C03PacketPlayer && mc.thePlayer.fallDistance >= 0.5 && mc.thePlayer.fallDistance < 2 && boost) {
                packet.onGround = false
            }
        }
        if (mode == "BlocksMC") {
            
        }

    })

    module.on("disable", function () {
        mc.timer.timerSpeed = 1.0
        started = false
        if (module.settings.jumpMode.get() == "VulcanClip" || module.settings.jumpMode.get() == "BlocksMC") {
            mc.thePlayer.motionX = 0.0
            mc.thePlayer.motionZ = 0.0
        }
    })
})