'use strict';
const yt = require('ytdl-core'),
    fetchData = require('../utils/fetchData'),
    {
        RichEmbed
    } = require("discord.js");

const config = require('../config.json');


exports.init = async(client, msg, params = []) => {
    
        let queue = client.queue;

        if (!msg.member.voiceChannel) return msg.channel.send(`⚙ | **${msg.author.tag}**, you must be in a voice channel to listen to music!`);

        client.channels.get(msg.member.voiceChannelID).join();


        await fetchData(msg, params.join(' '), config.YTAPIKEY).then((urlAr) => {

            return new Promise((resolve, reject) => {
                if (urlAr.length === 0) return msg.channl.send('No matching results found!')

                for (let url of urlAr) {


                    yt.getInfo(url, (err, info) => {

                        if (info && info.length_seconds >= 1800) return msg.channel.send(`**${info.title.length > 21 ? 
                            info.title.substring(0, 20) : info.title}** is over 30 minutes long! Due to performance reasons tracks longer than 30 minutes are not quened.`);

                        if (!queue.hasOwnProperty('tracks')) queue.playing = false, queue.tracks = [];

                        queue.tracks.push({
                            title: info.title,
                            thumbnail: info.iurlmaxres,
                            url: url,
                            desc: info.description.length > 121 ? `${info.description.substring(0, 120)}...` : (info.description !== undefined || info.description.length === 0) ? info.description : 'None',
                            requester: msg.author.tag

                        });


                        resolve(queue)
                        urlAr.length >= 15 ? msg.channel.send(`Added **${urlAr.length}** tracks to the queue!`) : msg.channel.send(`Added **${info.title}** to the queue`);
                    });


                };

            }).then(queue => {

                if (!queue.playing) {


                    (function play(track) {
                        let dispatcher;

                        queue.playing = true;

                        if (track === undefined) {

                            return msg.channel.send('I have finished playing all the songs!').then(() => {
                                queue.playing = false;
                                msg.guild.member(client.user).voiceChannel.leave()

                            });
                        };


                        msg.channel.send(`Playing: **${track.title}** as requested by: **${track.requester}**`);


                        dispatcher = msg.guild.voiceConnection.playStream(yt(track.url, {
                            audioonly: true
                        }), {
                            passes: 4
                        });
    

    let collector = msg.channel.createMessageCollector(m => m.author.id === msg.author.id)
    collector.on('collect', async(m) => {

        switch (m.content.split(' ')[0]) {



            case `${config.prefix}pause`:

                m.channel.send('Queue has been paused!');
                 dispatcher.pause();

                break;



            case `${config.prefix}resume`:

                m.channel.send('Queue has been resumed!');
                  dispatcher.resume();

                break;



                case `${config.prefix}volume`:

                 let vol = m.content.split(' ')[1];
                  if (!parseInt(vol) || !/^[1-9][0-9]?$|^100$/.test(vol)) return m.channel.send('Volume Parameter must be an integer between 0 ~ 100!');
                  dispatcher.setVolumeLogarithmic(vol / 5);

                  break;



                   case `${config.prefix}now`:

                                let embed = new RichEmbed();
                                embed
                                    .setAuthor(track.title, track.url)
                                    .setColor('#D20000')
                                    .setDescription(`${track.desc}\n**Currently At:** ${Math.floor(dispatcher.time / 60000)}:${Math.floor((dispatcher.time % 60000)/1000) <10 ? '0'+Math.floor((dispatcher.time % 60000)/1000) : Math.floor((dispatcher.time % 60000)/1000)} `) //
                                    .setThumbnail(track.thumbnail)
                                    .setFooter(client.user.username)
                                msg.channel.send({
                                    embed
                                }).catch(e => console.error(e))

                                break;



            case `${config.prefix}queue`:

                msg.channel.send('Here\'s the queue!\n' + queue.map(k => ` \`[${queue.keys().next().value}]\` *${k.title}*`).splice((index * 10), 10).join('\n'));

                break;



            case `${config.prefix}stop`:

                if (!msg.guild.member(msg.author).hasPermission('MANAGE_MESSAGES')) return msg.channel.send('Only users with `MANAGE_MESSAGES` permissions are capable of this action!')
                collector.stop();
                msg.channel.send('Alrighto, I stopped! Leaving the voice channel now...')
                queue.playing = false
                queue.tracks = []
                msg.guild.member(client.user).voiceChannel.leave()

                break;



            case `${config.prefix}skip`:

                msg.channel.send(`**${track.title}** skipped under the request of **${msg.author.tag}**!`)
                collector.stop()

                await play(queue.tracks.shift())


                break;

        };


    });

    
                    dispatcher.on('end', () => {

                        collector.stop();
                        play(queue.tracks.shift());

                    });


                    dispatcher.on('error', (err) => {

                        return msg.channel.send('error: ' + err).then(() => {
                            collector.stop();
                            play(queue.tracks.shift());

                        });
                    });

                })(queue.tracks.shift());

            };

        }).catch(e => console.error(e))

    });
    

};

exports.cfg = {
    enabled: true,
    name: "play",
    description: "Commands to stream music through youtube.",
};