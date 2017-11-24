const {
    get
} = require('snekfetch');
class clever {
    constructor(key) {

        this.apikey = String(key);

        this.std = `https://www.cleverbot.com/getreply?key=${this.apikey}`;

        this.cs = false;

    };

    ask(q = "") {
        return new Promise((res, rej) => {
            get(`${this.std}&input=${q}${this.cs ? `&cs=${this.cs}`: '' }`)
                .then(r => {
                    let resp = JSON.parse(r.text)
                    this.cs = resp.cs;
                    return res(String(resp.output))
                    if (resp.status && resp.error) return rej(resp.error);
                });
        });
    };
    copyConv(respObj) {
        let ar = [];
        for (const prop in respObj) {
            if (respObj.hasOwnProperty(prop) && prop.startsWith('interaction')) {
                ar.push([prop, respObj[prop]])
            };
        };
        return ar;
    };
};

module.exports = clever;