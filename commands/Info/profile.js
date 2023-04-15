const { Embed } = require("guilded.js");
const moment = require("moment");

module.exports = {
  description : "View the profile someone",
  alises : ["user", "user-info"],
  run : async(client, message, args)=>{
    let user;
    if(!args[0]){
      user = message.authorId
    } else {
      user = message.mentions.users[0].id
    }
    const member = await client.members.fetch(message.serverId, user);
    const server = await client.servers.fetch(message.serverId)
    const embed = new Embed()
    .setTitle(``)
      .setDescription(`oh? seems you just requested for ${member.username}'s profile. here you go :BlobThumbsUp:`)
    .setThumbnail(member.user.avatar || null)
  .setImage(member.user.banner)  .setColor(client.settings.color.neutral)
    message.send({embeds : [embed]})
  }  
}
