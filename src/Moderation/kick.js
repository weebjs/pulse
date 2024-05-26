const { Embed } = require("guilded.js");

module.exports = {
  name: "kick",
  description: "Kick a member from the server.",
  usage: "`!kick [@me]`",
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
        await target.kick()
          .then(() => {
            const embed = new Embed()
              .setColor("GREEN")
              .setTitle("Success ✅")
              .setDescription(`**${target.username}** (\`${target.id}\`) has been kicked!`);

            return message.reply({ embeds: [embed] });
          });
      } else {
        const embed = new Embed()
          .setColor("RED")
          .setTitle("Error!")
          .setDescription("That user cannot be kicked.");

        return message.reply({ embeds: [embed] });
      }
    } else {
      const embed = new Embed()
        .setColor("RED")
        .setTitle("Incorrect Command Usage!")
        .setDescription("Please mention or provide a user ID to kick a user.")
        .addField("Usage", `?kick [@username]`);

      return message.reply({ embeds: [embed] });
    }
  },
};
