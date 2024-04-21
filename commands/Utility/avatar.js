const { Embed } = require("guilded.js");
const moment = require("moment");

module.exports = {
  name: "userinfo",
  description: "View someone's profile",
  usage: "`re userinfo [@me]`",
  run: async (client, message, args) => {
    let user;
    if (!args[0]) {
      user = message.author.id;
    } else {
      user = message.mentions.users[0].id;
    }

    const member = await client.members.fetch(message.serverId, user);
    const server = await client.servers.fetch(message.serverId);

    const embed = new Embed()
      .setTitle(`<@${user}>'s avatar`)
      .setColor("#EAD5FF")

      return message.reply({ embeds: [embed] });
  },
};