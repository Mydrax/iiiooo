exports.init = async (client, msg, params = []) => {
  await Promise.resolve(msg.channel.send('Pinging...').then(m =>   m.edit(`Pong! (took: ${m.createdTimestamp - msg.createdTimestamp}ms)`)));
};

exports.cfg = {
  enabled: true,
  name: "ping",
};
