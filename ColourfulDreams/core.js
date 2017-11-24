const { Client } = require("discord.js");
const client = new Client();
const Loader = require('./src/utils/loader');
const loader = new Loader(client);

client.on('ready', () => console.log(`Ready with ${client.commands.size} commands!`));

loader.init()
client.login(require('./src/config.json').token)



