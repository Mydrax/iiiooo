let clever = require('../utils/cleverapi.js');
let config = require('../config.json');

let bot = new clever(config.cleverToken)
exports.init = async(client, msg) => {

    if (msg.isMemberMentioned(client.user) && msg.channel.type === 'text') {
        msg.channel.startTyping()
        return bot.ask(msg.content.split(' ').slice(1).join(' '))
            .then(r => msg.channel.send(r) && msg.channel.stopTyping());
          
    }
    if (!msg.content.startsWith(config.prefix) || msg.channel.type !== 'text' || msg.author.id === client.user.id || msg.author.bot) return;


    var command = msg.content.split(" ")[0].slice(config.prefix.length);

    var params = msg.content.split(" ").slice(1)
    let cmd;

    if (client.commands.has(command)) cmd = client.commands.get(command)
    if(cmd === undefined || cmd.cfg.whitelist && cmd.cfg.whitelist.indexOf(msg.author.id) === -1) return;

    if (cmd) cmd.init(client, msg, params).catch(e => {
        console.error(e)
        msg.channel.send(`💥 | Oopsie! This command failed! Please report this to <>`)

    });

}