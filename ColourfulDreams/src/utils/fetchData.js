const qS = require('querystring'),
    curl = require('snekfetch'),
    ytRegExp = /^(?:https?:\/\/)?(?:www\.)?(?:youtu\.be\/|youtube\.com\/(?:embed\/|v\/|watch\?v=|watch\?.+&v=))((\w|-){11})(?:\S+)?$/;


async function fetchData(msg, param, key) {
    if (typeof param != 'string') return new TypeError('Param must be a string.')

    if (ytRegExp.test(param) && !/list/ig.test(param)) {

        return [param];
    } else if (/list/ig.test(param)) {
        return await new Promise((resolve, reject) => {

            curl.get('https://www.googleapis.com/youtube/v3/playlistItems?part=snippet&maxResults=50&key=' + key + '&playlistId=' + qS.parse(param).list)
                .then(r => {
                   if(r.body.nextPageToken) {
                        curl.get('https://www.googleapis.com/youtube/v3/playlistItems?part=snippet&maxResults=50&nextPageToken=' + r.body.nextPageToken + '&key=' + key + '&playlistId=' + qS.parse(param).list)
                        .then(res => {
                                resolve(r.body.items.map(i => 'https://www.youtube.com/watch?v=' + i.snippet.resourceId.videoId).concat(res.body.items.map(ii => 'https://www.youtube.com/watch?v=' + ii.snippet.resourceId.videoId)))

                        })
                    
                    } else {
                        resolve(body.items.map(i => 'https://www.youtube.com/watch?v=' + i.snippet.resourceId.videoId))
                    }


                })
        });



    } else {
        return await new Promise((resolve, reject) => {

            curl.get('https://www.googleapis.com/youtube/v3/search?q=' + param.replace(' ', '%20') + '&maxResults=4&part=snippet&key=' + key)
            .then(r => {
               msg.channel.send(`Type 1,2,3 or 4 to select a title;\n**${r.body.items.map((i, x) =>  `**${x +1}**.)${i.snippet.title}`).join('\n')}**`)
                return msg.channel.awaitMessages(resp => resp.author.id === msg.author.id && ['1', '2', '3', '4'].indexOf(resp.content) > -1, {
                    max: 1,
                    time: 20000
                }).then(col => {
                    return resolve([r.body.items.map(i => 'https://www.youtube.com/watch?v=' + i.id.videoId)[parseInt(col.first().content) - 1]])
                })
            }).catch(e => console.error(e))
        })
    }
}


module.exports = fetchData