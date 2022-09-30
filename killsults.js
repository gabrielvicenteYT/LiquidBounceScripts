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
var insultsZH_TW = [" 怎麼不去YouTube訂閱nerbles?", " 這不是外掛這是Nerbles config!", " 我聽說你是撿回來的喔", " 去死啦幹", " 你應該出去郊區呼吸一下新鮮空氣", " 我根本就沒開外掛因為它們壓根沒用", " 管管在看也沒用", " 你不是擅長這個遊戲的嗎?", " 如果你不想再遇到外掛那就不要在這個爛伺服器玩了", " 你不嘗試還是你很爛?", " 你手殘的嗎?", " 你自己訓練得這麼爛的嗎?", " 我沒在開外掛, 你自己爛而己", " 你還是去死吧!"]
var insultsZH_HK = [" 點解唔去YouTube訂閱nerbles?", " 呢個唔係外掛呢個係Nerbles config!", " 我聽講你係出面執返來㗎呀", " 收爹啦你", " 你應該出去郊外呼吸一下新鮮空氣", " 我根本就冇開外掛因為佢哋根本沒用", " 管理員就算監察我都冇用", " 你唔係擅長呢個遊戲的咩?", " 如果你不想再遇到外掛咁就唔好喺呢個伺服器玩啦", " 你不嘗試定係你好爛?", " 你係咪手殘㗎?", " 你自己訓練得咁爛㗎", " 我根本冇開外掛, 你自己爛關我咩春事", " 去死啦, On9仔!"]
var insultsZH_CN = [" 怎麽不去YouTube订阅nerbles?", " 这不是外挂这是Nerbles config!", " 我听说你是捡回来的喔", " NMSL", " 你应该出去郊区呼吸一下新鲜空气", " 我根本就没开外挂因为它们根本没用", " 管理员在看也没用", " 你不是擅长这个游戏的吗?", " 如果你不想再遇到外挂那就不要在这个烂伺服器玩了", " 你不尝试还是你很烂?", " 你手残的吗?", " 你自己训练得这麽烂的吗?", " 我没在开外挂, 你自己烂而己", " 我爱习包子, 我爱习维尼"]
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
            values: ["English", "Spanish", "Chinese, Taiwan", "Chinese, Hong Kong", "Chinese, China"]
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
            case "Chinese, Taiwan":
                module.tag = "ZH_TW";
                if (target != null && target.isDead) {
                    mc.thePlayer.sendChatMessage(target.getName() + insultsZH_TW[Math.floor(Math.random() * insults.length)])
                    target = null
                }
                break;
            case "Chinese, Hong Kong":
                module.tag = "ZH_HK";
                if (target != null && target.isDead) {
                    mc.thePlayer.sendChatMessage(target.getName() + insultsZH_HK[Math.floor(Math.random() * insults.length)])
                    target = null
                }
                break;
            case "Chinese, China":
                module.tag = "ZH_CN";
                if (target != null && target.isDead) {
                    mc.thePlayer.sendChatMessage(target.getName() + insultsZH_CN[Math.floor(Math.random() * insults.length)])
                    target = null
                }
            }
            }
    })
})
