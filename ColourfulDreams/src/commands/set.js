exports.init = async(client, msg, params = []) => {
    switch (params[0]) {
        case 'game':
            let pS = params.slice(1).join(' ');
            if (pS === []) return msg.channel.send('Can not set an empty game status!');
            client.user.setGame(pS);
            msg.channel.send(`Game set to **${pS}**!`)
            break;
        case 'status':
            if (['online', 'idle', 'invisible', 'dnd'].indexOf(params[1].toLowerCase()) === -1 || !params[1]) return msg.channel.send('Invalid status!')
            client.user.setStatus(params[1].toLowerCase())
            msg.channel.send(`Status set to **${params[1].toLowerCase()}**`)
            break;
        case 'pfp':
            if (!params[1]) return msg.channel.send('Invalid link!');
            client.user.setAvatar(params[1])
            msg.channel.send(`PFP Set!`)
            break;
        case 'username': 
            client.user.setUsername(params.slice(1).join(' '));
            msg.channel.send(`Username set to **${params.slice(1).join(' ')}**!`)
    }
};



exports.cfg = {
    enabled: true,
    name: "set",
    whitelist: ['175855522736635904', '133746689684144128'],
    description: "Sets game status, pfp and username",
};