const { Embed, Member } = require("guilded.js");
const moment = require("moment");

module.exports = {
  description: "get information about the server.",
  usage: "`!serverinfo`",
  aliases: ["guild"],
  run: async (client, message) => {
    try {
      const server = await client.servers.fetch(message.serverId);
      const channel = await client.channels.fetch(message.channelId);
      const members = await client.members.fetchMany(message.serverId);

      members.forEach((value, key, map) => {
      if(value.user.type == 0 || value.user.type == 'bot') {
        members.delete(key);
      }
    });

      const memberIds = members.map((member) => member.id); // Extract member IDs

      const embed = new Embed()
      .setThumbnail(server.raw.avatar)
        .addFields([
          { name: "Name:", value: server.name, inline: false },
          { name: "Description:", value: server.description ? server.description : "None" },
          { name: "Created:", value: moment(server.createdAt).format("MMMM Do, YYYY"), inline: false },
          { name: "Verified:", value: server.isVerified ? "👍" : "👎", inline: false },
          { name: "Owner:", value: `<@${server.ownerId}>`, inline: false },
          { name: "Timezone:", value: server.timezone ? server.timezone : "Unknown", inline: false },
          { name: "URL:", value: server.url ? `[${server.name}](${server.url})` : "❔", inline: false },
          { name: "Members:", value: `${memberIds.length}`, inline: false }
        ])
        .setColor("#EAD5FF");

      return message.reply({ embeds: [embed], isSilent: true });
    } catch (error) {
      console.error(error);
    }
  },
};