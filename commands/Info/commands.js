const { Embed } = require("guilded.js");
const moment = require("moment");
//////////////////////////////////////
module.exports = {
  description : "Get informations about the server",
  aliases : ["help"],
  run : async(client, message)=>{
    const server = await client.servers.fetch(message.serverId);
    const embed = new Embed()
    .addFields([
      { name : ":Loading: - doge-profile", value : "using this command, you can get the information for a single person." },
      { name : ":Loading: - doge-guild", value : "using this command, you can get the information of your guild." },

      { name : ":Loading: - doge-ping", value : "using this command, you can get the latency or **ping** for Doge." },
      { name : ":Loading: - doge-about", value : "using this command, you can get the info on Doge. and also information on who the owner and developers are." },
      { name : ":Loading: - doge-commands", value : " using this command (which is being used right now), you all commands which has been made by Doge" },

      { name : ":Loading: - doge-quote", value : "using this command, Doge shows a random quote." },
       
    ])
    .setThumbnail(server.iconURL)
    .setColor(client.settings.color.neutral)
  message.send({embeds : [embed]})
  }
}