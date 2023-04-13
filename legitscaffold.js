///api_version=2

var script = registerScript({
    name: "LegitScaffold",
    version: "1.0",
    authors: ["Nerbles1"]
});

var Blocks = Java.type("net.minecraft.init.Blocks");
var BlockPos = Java.type("net.minecraft.util.BlockPos");
var ItemBlock = Java.type("net.minecraft.item.ItemBlock");
var Vec3 = Java.type("net.minecraft.util.Vec3");
var EnumFacing = Java.type("net.minecraft.util.EnumFacing");
var placeInfo = Java.type("net.ccbluex.liquidbounce.utils.block.BlockUtils");
Math.toRadians = function (degrees) {
    return degrees * Math.PI / 180;
};


script.registerModule({
    name: "LegitScaffold",
    description: "Automatically places blocks under you and sneaks when needed",
    category: "World",
}, function (module) {
    module.on("enable", function() {
        mc.thePlayer.rotationYaw += 180
    })
    module.on("update", function() {
        try {
        var shouldSneak = mc.theWorld.getBlockState(new BlockPos(mc.thePlayer.posX, mc.thePlayer.posY - 1.0, mc.thePlayer.posZ)).getBlock() == Blocks.air;
        mc.gameSettings.keyBindSneak.pressed = shouldSneak;
        var item = mc.thePlayer.inventory.getCurrentItem()
        if (item !== null && item.getItem() instanceof ItemBlock) {
            mc.thePlayer.rotationPitch = 82.5
            mc.gameSettings.keyBindUseItem.pressed = true
            
        } else {
            mc.gameSettings.keyBindUseItem.pressed = false
        }
        } catch (e) {
            Chat.print("§f[§6Grimscaffold§f] §cError: " + e)
            
        }
    })

    // module.on("motion", function(event) {
    //     event.setPitch(82.5)
    // })

    module.on("disable", function() {
        mc.gameSettings.keyBindUseItem.pressed = false
        mc.gameSettings.keyBindSneak.pressed = false
    })
});
