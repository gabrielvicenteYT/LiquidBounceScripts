///api_version=2

var script = registerScript({
    name: "NerblesFly",
    version: "1.0",
    authors: ["Nerbles"]
});

var MovementUtils = Java.type("net.ccbluex.liquidbounce.utils.MovementUtils");
var ticks;
var strafeSpeed;
var C03PacketPlayer = Java.type("net.minecraft.network.play.client.C03PacketPlayer");
var C04PacketPlayerPosition = Java.type("net.minecraft.network.play.client.C03PacketPlayer.C04PacketPlayerPosition");
var mode
var C0BPacketEntityAction = Java.type("net.minecraft.network.play.client.C0BPacketEntityAction");
var jumps = 0
var dist = 0
var damageJumps = 0
var canFly = true
var PacketUtils = Java.type("net.ccbluex.liquidbounce.utils.PacketUtils");
var jumped = false
var boost = false
var C08PacketPlayerBlockPlacement = Java.type("net.minecraft.network.play.client.C08PacketPlayerBlockPlacement");
var BlockPos = Java.type("net.minecraft.util.BlockPos");
var EnumFacing = Java.type("net.minecraft.util.EnumFacing");
var ItemStack = Java.type("net.minecraft.item.ItemStack");
var Blocks = Java.type("net.minecraft.init.Blocks");
var fallDistance
var LB = Java.type("net.ccbluex.liquidbounce.LiquidBounce");
var doSpoof = false
var blink = false
var x = 0
var z = 0
var PacketUtils = Java.type("net.ccbluex.liquidbounce.utils.PacketUtils");
script.registerModule({
    name: "NerblesFly",
    description: "Fly",
    category: "Movement",
    settings: {
        mode: Setting.list({
            name: "Mode",
            default: "VulcanGround",
            values: ["VulcanGround", "VulcanExploit", "VerusC08", "VulcanClip", "Negativity"]
        }),
        vulcanClipDelay: Setting.integer({
            name: "VulcanClipDelay",
            default: 62,
            min: 20,
            max: 100
        }),
        vulcanClipDistance: Setting.float({
            name: "VulcanClipDistance",
            default: 8.5,
            min: 1,
            max: 10
        }),
    }
}, function (module) {
    // make a function called damagePlayer
    var damagePlayer = function (type) {
        // take type as a string 
        switch (type) {
            case "Jump":
                // if the player is on the ground
                if (mc.thePlayer.onGround) {
                    mc.thePlayer.jump()
                    jumps++
                    fallDistance = 1.1
                } else {
                    if (mc.thePlayer.fallDistance >= fallDistance && jumps < 3) {
                        mc.thePlayer.motionY = 0.41999998688697815
                        fallDistance += 1.1
                        jumps++
                    }
                }
                if (!mc.thePlayer.hurtTime > 0) mc.thePlayer.setPosition(x, mc.thePlayer.posY, z)
                break;
            case "C04":
                PacketUtils.sendPacketNoEvent(new C04PacketPlayerPosition(mc.thePlayer.posX, mc.thePlayer.posY + 3.7, mc.thePlayer.posZ, false))
                PacketUtils.sendPacketNoEvent(new C04PacketPlayerPosition(mc.thePlayer.posX, mc.thePlayer.posY, mc.thePlayer.posZ, false))
                PacketUtils.sendPacketNoEvent(new C04PacketPlayerPosition(mc.thePlayer.posX, mc.thePlayer.posY, mc.thePlayer.posZ, true))
                break;

        }
    }
    module.on("enable", function () {
        try {
            mc.thePlayer.isPotionActive(1) ? strafeSpeed = 0.7 : strafeSpeed = 0.48
            ticks = 0
            damageJumps = 0
            mode = module.settings.mode.get()
            jumped = false
            boost = false
            doSpoof = false
            canFly = true
            blink = false
            jumps = 0
            dist = 1.1
            x = mc.thePlayer.posX
            y = mc.thePlayer.posY
            z = mc.thePlayer.posZ
            fallDistance = 3.1025
            if (mode == "Negativity") {
                boost = true
            }
        } catch (e) {
            Chat.print(e)
        }
    })
    module.on("update", function () {
        try {
            mode = module.settings.mode.get()
            module.tag = mode
            switch (module.settings.mode.get()) {
                case "VulcanGround":
                    ticks++
                    mc.thePlayer.motionY = 0.0
                    if (mc.gameSettings.keyBindJump.isKeyDown()) {
                        mc.thePlayer.motionX = 0.0
                        mc.thePlayer.motionZ = 0.0
                        mc.thePlayer.motionY = 0.0
                        if (mc.thePlayer.ticksExisted % 62 == 0) {
                            canFly = false
                            mc.thePlayer.setPosition(mc.thePlayer.posX, mc.thePlayer.posY + 3.8, mc.thePlayer.posZ)
                            Chat.print("§b[§6§lNerblesFly§b] §cWARNING: YOU WILL NOT BE ABLE TO FLY FORWARDS UNTIL YOU TOUCH THE GROUND")
                            x = mc.thePlayer.posX
                            z = mc.thePlayer.posZ
                        }

                    }
                    if (MovementUtils.isMoving()) {
                        if (canFly) {
                            if (ticks <= 3)  {
                                MovementUtils.strafe(strafeSpeed)
                                mc.timer.timerSpeed = 1.6
                                mc.thePlayer.jump()
                                mc.thePlayer.motionY = 0
                            } else {
                                MovementUtils.strafe(0.274)
                                mc.timer.timerSpeed = 1.0
                            }
                            if (ticks == 70) {
                                ticks = 0
                                if (mc.thePlayer.isPotionActive(1)) {
                                    strafeSpeed = 0.65
                                } else {
                                    strafeSpeed = 0.46
                                }
                            }
            
                            if (mc.thePlayer.hurtTime <= 9 && mc.thePlayer.hurtTime >= 7) {
                                MovementUtils.strafe(0.48)
                            }
                        } else {
                            mc.thePlayer.setPosition(x, mc.thePlayer.posY, z)
                        }
                    } else {
                        mc.thePlayer.motionX = 0.0
                        mc.thePlayer.motionZ = 0.0
                    }
                    break;
                case "VulcanExploit":
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
                                // if (debug) Chat.print("§b[§6§lNerblesLongjumps§b] §fBoosting")
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
                case "VerusC08":
                    mc.thePlayer.motionY = 0.0
                    if (MovementUtils.isMoving()) {
                        MovementUtils.strafe(0.5)
                    } else {
                        mc.thePlayer.motionX = 0.0
                        mc.thePlayer.motionZ = 0.0
                    }
                    if (mc.thePlayer.ticksExisted % 15 == 0) {
                        var C08 = new C08PacketPlayerBlockPlacement(new BlockPos(mc.thePlayer.posX, mc.thePlayer.posY - 1, mc.thePlayer.posZ), 1, new ItemStack(Blocks.stone.getItem(mc.theWorld, new BlockPos(0, 0, 0))), 0.5, 0.5, 0.5);
                        PacketUtils.sendPacketNoEvent(C08);
                    }
                    // mc.thePlayer.motionY = 0.41999998688697815
                    break;
                case "VulcanClip":
                    var delay = module.settings.vulcanClipDelay.get()
                    if (mc.thePlayer.ticksExisted % delay == 0) {
                        // canFly = false
                        var distance = module.settings.vulcanClipDistance.get()
                        mc.thePlayer.setPosition(mc.thePlayer.posX, mc.thePlayer.posY + distance, mc.thePlayer.posZ)
                        mc.thePlayer.fallDistance *= 0.95
                        // Chat.print("§b[§6§lNerblesFly§b] §cWARNING: YOU WILL NOT BE ABLE TO FLY FORWARDS UNTIL YOU TOUCH THE GROUND")
                        x = mc.thePlayer.posX
                        z = mc.thePlayer.posZ
                    }
                    if (MovementUtils.isMoving()) {
                        if (mc.thePlayer.onGround == false) MovementUtils.strafe(0.32)
                        if (mc.thePlayer.ticksExisted % 2 == 0) {
                            mc.thePlayer.motionY = -0.15
                        } else {
                            mc.thePlayer.motionY = -0.1
                        }
                    } else {
                        mc.thePlayer.motionY = 0
                    }
                    break;
                case "Negativity":
                    if (boost) {
                        mc.thePlayer.setPosition(x, mc.thePlayer.posY, z)
                        if (mc.thePlayer.hurtTime == 9) boost = false, mc.thePlayer.motionX = 0.0, mc.thePlayer.motionZ = 0.0
                        if (mc.thePlayer.onGround) {
                            if (jumped == false && jumps == 0) {
                                PacketUtils.sendPacketNoEvent(new C04PacketPlayerPosition(mc.thePlayer.posX, mc.thePlayer.posY + 3.1, mc.thePlayer.posZ, false))
                                PacketUtils.sendPacketNoEvent(new C04PacketPlayerPosition(mc.thePlayer.posX, mc.thePlayer.posY, mc.thePlayer.posZ, false))
                                PacketUtils.sendPacketNoEvent(new C04PacketPlayerPosition(mc.thePlayer.posX, mc.thePlayer.posY - 3.1, mc.thePlayer.posZ, true))
                                boost = false
                                jumps++
                                fallDistance = 1.125
                            }
                        }
                    } else {
                        if (mc.gameSettings.keyBindJump.pressed) {
                            if (mc.thePlayer.motionY <= -0.1) mc.thePlayer.motionY = 0.41999998688697815
                        } else {
                            mc.thePlayer.motionY = 0
                        }

                        if (MovementUtils.isMoving()) {
                            if (mc.thePlayer.hurtTime > 0 && mc.thePlayer.hurtTime < 6) {
                                mc.timer.timerSpeed = 0.1
                                MovementUtils.strafe(6)
                            } else {
                                mc.timer.timerSpeed = 1.0
                                mc.thePlayer.isPotionActive(1) ? MovementUtils.strafe(0.52) : MovementUtils.strafe(0.385)
                            }
                            
                        } else {
                            mc.thePlayer.motionX = 0.0
                            mc.thePlayer.motionZ = 0.0
                        }
                    }
                    break;

            }
    } catch (e) {
        Chat.print(e)
    }
    })

    module.on("disable", function () {
        mc.timer.timerSpeed = 1.0
        if (module.settings.mode.get() == "VulcanExploit" || module.settings.mode.get() == "VulcanGround") {
            mc.thePlayer.motionX = 0.0
            mc.thePlayer.motionZ = 0.0
            // mc.thePlayer.motionY = 0.0
            moduleManager.getModule("Blink").setState(false)
        }

    })


    module.on("packet", function (event) {
        var packet = event.getPacket()
        if (mode == "VulcanGround") {
            if (packet instanceof C03PacketPlayer && mc.gameSettings.keyBindJump.pressed == false && canFly) {
                packet.onGround = true
                packet.y = Math.round(mc.thePlayer.posY * 2).toDouble() / 2
                mc.thePlayer.setPosition(mc.thePlayer.posX, packet.y, mc.thePlayer.posZ)
            }
        } else if (mode == "Negativity")  {
            if (packet instanceof C03PacketPlayer) {
                if (doSpoof) {
                    packet.onGround = true
                    doSpoof = false
                }
                if (!boost ) {
                    packet.onGround = true
                }
            }
        } 
        
    })
})