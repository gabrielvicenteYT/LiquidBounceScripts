///api_version=2

var script = registerScript({
    name: "NerblesDisablers",
    version: "1.0",
    authors: ["Nerbles"]
});

var C07PacketPlayerDigging = Java.type("net.minecraft.network.play.client.C07PacketPlayerDigging");
var PacketUtils = Java.type("net.ccbluex.liquidbounce.utils.PacketUtils");
var BlockPos = Java.type("net.minecraft.util.BlockPos");
var EnumFacing = Java.type("net.minecraft.util.EnumFacing");
var C08PacketPlayerBlockPlacement = Java.type("net.minecraft.network.play.client.C08PacketPlayerBlockPlacement");
var ItemStack = Java.type("net.minecraft.item.ItemStack");
var Blocks = Java.type("net.minecraft.init.Blocks");
var C09PacketHeldItemChange = Java.type("net.minecraft.network.play.client.C09PacketHeldItemChange");

script.registerModule({
    name: "NerblesDisablers",
    description: "random disablers, known methods",
    category: "Exploit",
    settings: {
        disablerMode: Setting.list({
            name: "Mode",
            default: "VulcanStrafe",
            values: ["VulcanStrafe", "VerusC08", "VerusScaffold", "MushMC"]
        }),
        scaffoldFixValue: Setting.boolean({
            name: "ScaffoldFix",
            default: true
        }),
        debugMode: Setting.boolean({
            name: "Debug",
            default: false
        }),
    }
}, function (module) {
    module.on("update", function() {
        cfg = module.settings;
        module.tag = cfg.disablerMode.get();
        switch (cfg.disablerMode.get()) {
            case "VulcanStrafe":
                module.tag = "VulcanStrafe"
                if (mc.thePlayer.ticksExisted % 4 == 0) PacketUtils.sendPacketNoEvent(new C07PacketPlayerDigging(C07PacketPlayerDigging.Action.STOP_DESTROY_BLOCK, new BlockPos(mc.thePlayer.posX, mc.thePlayer.posY, mc.thePlayer.posZ), EnumFacing.UP));
                if (cfg.debugMode.get()) Chat.print("sent C07")
                break;
            case "VerusC08":
                module.tag = "VerusC08"
                if (mc.thePlayer.ticksExisted % 15 == 0) {
                    var C08 = new C08PacketPlayerBlockPlacement(new BlockPos(mc.thePlayer.posX, mc.thePlayer.posY - 1, mc.thePlayer.posZ), 1, new ItemStack(Blocks.stone.getItem(mc.theWorld, new BlockPos(0, 0, 0))), 0.5, 0.5, 0.5);
                    PacketUtils.sendPacketNoEvent(C08);
                    if (cfg.debugMode.get()) Chat.print("sent C08")
                }
                break;
            case "VerusScaffold":
                break;
            case "MushMC":
        }
    })

    module.on("packet", function(event) {
        var packet = event.getPacket();
        if (packet instanceof C09PacketHeldItemChange && module.settings.scaffoldFixValue.get()) {
            e.getPacket().getSlotId() == prevSlot ? e.cancelEvent() : (prevSlot = e.getPacket().getSlotId())
            if (module.settings.debugMode.get()) Chat.print("C09 fixed")
        }

        if (packet instanceof C08PacketPlayerBlockPlacement) {
            if (module.settings.disablerMode.get() == "VerusScaffold") {
                var p = packet;
                event.cancelEvent();
                if (module.settings.debugMode.get()) Chat.print("modifying C08")
                // re send the packet but with null as the itemstack
                PacketUtils.sendPacketNoEvent(new C08PacketPlayerBlockPlacement(p.getPosition(), p.getPlacedBlockDirection(), null, p.getPlacedBlockOffsetX(), p.getPlacedBlockOffsetY(), p.getPlacedBlockOffsetZ()));
                if (module.settings.debugMode.get()) Chat.print("sent new C08")
            }
        }
        if (module.settings.disablerMode.get() == "MushMC") {
            if (packet instanceof C03PacketPlayer) {
                if (mc.thePlayer.ticksExisted % 20 == 0) {
                    packet.y -= 11.015625;
                    packet.onGround = true;
                    packet.isMoving = false;
                }
            }
            if (packet instanceof C0FPacketConfirmTransaction) {
                event.cancelEvent();
            }
            if (packet instanceof S08PacketPlayerPosLook) {
                var packetx = packet.x - mc.thePlayer.posX
                var packety = packet.y - mc.thePlayer.posY
                var packetz = packet.z - mc.thePlayer.posZ
                var diff = Math.sqrt(packetx * packetx + packety * packety + packetz * packetz)
                if (diff <= 8) {
                    event.cancelEvent()
                    PacketUtils.sendPacketNoEvent(C06PacketPlayerPosLook(packet.x, packet.y, packet.z, packet.getYaw(), packet.getPitch(), false))
                }
            }
        }
    })
})
