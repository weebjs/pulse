const { Embed } = require("guilded.js");

module.exports = {
  description: "Get the latency of the bot",
  aliases : ["latency"],
  run: async (client, message) => {
    let msg = await message.send({ content: "pinging..." });
    let ping = Date.now() - message.createdAt.getTime();
    let server = await client.servers.fetch(message.serverId);

    let latencyStatus;
    if (ping <= 50) {
      latencyStatus = "excellent";
    } else if (ping <= 100) {
      latencyStatus = "good";
    } else if (ping <= 200) {
      latencyStatus = "fair";
    } else if (ping <= 300) {
      latencyStatus = "poor";
    } else {
      latencyStatus = "very poor";
    }

        
    let embed = new Embed()
      .setTitle("🏓 Pong!")
      .setDescription(`oh? wanna check doge's ping? well right now i am operating at ${ping} :Loading: which is ${latencyStatus}.`)
      .setColor(client.settings.color.neutral)

    msg.edit({ embeds: [embed] });
  }
}