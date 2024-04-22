const { Embed } = require("guilded.js");

module.exports = {
  name: "kick",
  description: "Kick a member from the server.",
  usage: "`p!ban [@me]`",
  run: async (client, message, args) => {
    const server = await client.servers.fetch(message.serverId);

    if (message.authorId !== server.ownerId) {
      const embed = new Embed()
        .setColor("RED")
        .setTitle("Error!")
        .setDescription(`You need to be a server owner to execute this command. \n\nIf you aren't the owner (<@${server.ownerId}>), then you can't execute this command!`);

      return message.reply({ embeds: [embed], isSilent: true });
    }
    
    
    let targetId;
    if (message.mentions && message.mentions.users) {
      targetId = message.mentions.users[0].id;
    } else {
      targetId = args[0];
    }

    if (targetId) {
      const target = await client.members.fetch(`${message.serverId}`, targetId)
        .catch(() => {
          const embed = new Embed()
            .setColor("RED")
            .setTitle("Error!")
            .setDescription("That user does not exist.");

          return message.reply({ embeds: [embed] });
        });

      if (!target.isOwner) {
        await target.ban()
          .then(() => {
            const embed = new Embed()
              .setColor("GREEN")
              .setTitle("Success ✅")
              .setDescription(`**${target.username}** (\`${target.id}\`) has been banned!`);

            return message.reply({ embeds: [embed] });
          });
      } else {
        const embed = new Embed()
          .setColor("RED")
          .setTitle("Error!")
          .setDescription("That user cannot be banned.");

        return message.reply({ embeds: [embed] });
      }
    } else {
      const embed = new Embed()
        .setColor("RED")
        .setTitle("Error!")
        .setDescription("Please mention or provide a user ID to ban a user. Here's an example: `p!kick [@username]`");

      return message.reply({ embeds: [embed] });
    }
  },
};