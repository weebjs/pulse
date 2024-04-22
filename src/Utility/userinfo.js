const { Embed } = require("guilded.js");
const moment = require("moment");

module.exports = {
  name: "userinfo",
  description: "View someone's profile",
  usage: "`p!userinfo [@me]`",
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
      .setTitle(`<@${user}> (${user})`)
      .setColor("#EAD5FF")
      .addFields([
        { name: "Nickname", value: member.nickname ? member.nickname : "None", inline: true },
        { name: "ID", value: member.user.id, inline: false },
        { name: "Server Join", value: moment(member.joinedAt).format("M/D/YYYY h:mm A"), inline: false },
        { name: "Account Creation", value: moment(member.user.createdAt).format("M/D/YYYY h:mm A"), inline: false },
      ])
      

      return message.reply({ embeds: [embed] });
  },
};