///api_version=2
var script = registerScript({
    name: "VulcanGlide",
    version: "1.0",
    authors: ["Nerbles1"]
});

script.registerModule({
    name: "VulcanGlide",
    description: "Vulcan glide",
    category: "Movement",
}, function (module) {
    module.on("update", function() {
        if (!mc.thePlayer.onGround && mc.thePlayer.fallDistance > 0) {
            if (mc.thePlayer.ticksExisted % 2 == 0) {
                mc.thePlayer.motionY = -0.155
                mc.thePlayer.motionX *= 1.002
                mc.thePlayer.motionZ *= 1.002
                
            } else {
                mc.thePlayer.motionY = -0.1
                mc.thePlayer.motionX *= 1.002
                mc.thePlayer.motionZ *= 1.002
            }
        }
    })
})