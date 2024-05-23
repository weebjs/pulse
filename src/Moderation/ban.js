const { Embed } = require("guilded.js");

module.exports = {
  name: "ban",
  description: "Ban a member from the server.",
  usage: "`p!ban [@me]`",
  run: async (client, message, args) => {
    const server = await client.servers.fetch(message.serverId);

    if (message.authorId !== server.ownerId) {
      const embed = new Embed()
        .setColor("RED")
        .setTitle("Insufficient Permissions!")
        .setDescription("You don't have the required permissions to execute this command!")
        .setFooter("This command is only for server owners only.");

      return message.reply({ embeds: [embed] });
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
        .setTitle("Oh no!")
        .setDescription("Please mention or provide a user ID to ban a user.")
        .addField("Usage", `?ban [@username]`);

      return message.reply({ embeds: [embed] });
    }
  },
};
