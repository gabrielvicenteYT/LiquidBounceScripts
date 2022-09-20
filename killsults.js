/// api_version=2
var script = registerScript({
    name: "KillSults",
    version: "1.0",
    authors: ["Nerbles1"]
});

var EntityPlayer = Java.type('net.minecraft.entity.player.EntityPlayer');
var target;
var insults = [" wasnt subbed to nerbles on YT", " its not hacks its a Nerbles config!", " was dropped as a child", " L", " should go outside and touch grass", " is definetly not hacking, because they're shit", " hows spectating?", " isn't very good at the game", " if you don't want to be cheated on then play on a actually good server", " are you not trying? or just bad", " is handicapped", " do you practice being this ugly", " im not hacking, you're just bad", " get good"]
var insultsES = [" No estaba subscrito a nerbles en YT", " No son hacks, es una configuracion de Nerbles!", " fue tirado de nino", " L", " deberia salir fuera y tocar hierba", " definitivamente no es hacker, porque juega fatal", " Que tal como espectador", " No es muy bueno en el juego", " si no quieres jugar con hackers entonces juega en un server realmente bueno", " no lo estas intentando? o simplemente eres malo", " Es discapacitado", " Practicas ser tan feo", " mejora"]
// Google Translate go brrr
// feel free to edit this and add/remove killsults as needed - Nerbles
// also remember to add a space before each message
script.registerModule({
    name: "KillSults",
    description: "Insults players you kill",
    category: "Misc",
    settings: {
        insultLang: Setting.list({
            name: "Language",
            default: "English",
            values: ["English", "Spanish"]
        })
    }
}, function(module) {
    module.on("world", function() {
        target = null
    })
    module.on("enable", function() {
        target = null
    })
    module.on("attack", function (event) {
		if (event.getTargetEntity() instanceof EntityPlayer) {
			target = event.getTargetEntity();
		}
    })
    module.on("update", function() {
        switch (module.settings.insultLang.get()) {
            case "English":
                module.tag = "EN";
                if (target != null && target.isDead) {
                    mc.thePlayer.sendChatMessage(target.getName() + insults[Math.floor(Math.random() * insults.length)])
                    target = null
                }
                break;
            case "Spanish":
                module.tag = "ES";
                if (target != null && target.isDead) {
                    mc.thePlayer.sendChatMessage(target.getName() + insultsES[Math.floor(Math.random() * insults.length)])
                    target = null
                }
                break;
            }
    })
})