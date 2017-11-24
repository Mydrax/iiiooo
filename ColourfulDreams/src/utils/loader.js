const fs = require('fs');
class Loader {

    constructor(client) {


        this.client = client;

        this.client.commands = new Map;

        this.client.queue = {};

    }

    init() {
        Promise.all([this.cmds(),
            this.events()
        ]).catch((e) => console.error(e));
    }



    cmds() {
        fs.readdir(`./src/commands`, async(err, files) => {
            console.time('CmdsDur')
            await Promise.all([files.map(f => {

                let mod = require(`../commands/${f}`);

                this.client.commands.set(mod.cfg.name, mod);


            })]);
            console.timeEnd('CmdsDur')
        });
    }

    events() {
        fs.readdir(`./src/events`, async(err, files) => {
            console.time('EventDur')

            await Promise.all([files.map(f => {

                let [func, event] = [require(`../events/${f}`), f.split(".")[0]]
                
                 this.client.on(event, (...args) => func.init(this.client, ...args));

            })]);
            console.timeEnd('EventDur')
        });
    }

}

module.exports = Loader;