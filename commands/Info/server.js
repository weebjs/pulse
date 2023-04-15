const { Embed } = require("guilded.js");
const moment = require("moment");
//////////////////////////////////////
module.exports = {
  description: "Get informations about the server",
  aliases: ["guild"],
  run: async (client, message) => {
    const server = await client.servers.fetch(message.serverId);
    const embed = new Embed()
      .addFields([
        { name: "NAME:", value: server.name, inline: true },
        { name: "DESCRIPTION:", value: server.description ? server.description : "🤫" },
      ])
      .setThumbnail(server.iconURL)
      .setImage(server.raw.banner)
      .setColor(client.settings.color.neutral)
    message.send({ embeds: [embed] })
  }
}