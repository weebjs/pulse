const { Embed } = require("guilded.js");

module.exports = {
  description: "Get informations about the bot",
  aliases : ["bot", "about-bot"],
  run: async (client, message) => {
    let msg = await message.send({ content: "loading..." });
    let ping = Date.now() - message.createdAt.getTime();
    let server = await client.servers.fetch(message.serverId);
      let embed = new Embed()
      .setDescription(`who is dogeGG's owner? well his name is (**weeb.pro**) or whatever you'd call that man. weeb.pro is a you programmer who made dogeGG using node.js and guilded.js, he also recived assistance from (**aminedev07**) an extremely smart person who knows alot about programming and has a tendency of rude/kindness. what is the future of dogeGG? well we depend on making more commands when the guilded-api gets better performance. for now you may enjoy the few commands we have creaated. :Dance:`)
      .setColor(client.settings.color.neutral)
      setTimeout(()=>{
        msg.edit({embeds : [embed]})
      },3000)
      
    
    
  }
}
// nah listen change it to "about" it shows informations of the bot and the owner of the bot