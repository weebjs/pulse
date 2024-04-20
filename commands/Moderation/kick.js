const { Embed } = require("guilded.js");

module.exports = {
  name: "kick",
  description: "Kick a member from the server.",
  run: async ({ client, message, args }) => {
    if (message.author.id !== message.server?.ownerId) {
      return message.reply("You need to be a server owner to execute this command.");
    }o

    let targetId;
    if (message.mentions && message.mentions.users) {
      targetId = message.mentions.users[0].id;
    } else {
      targetId = args[0];
    }

    if (targetId) {
      const target = await client.members.fetch(`${message.serverId}`, targetId)
        .catch(() => {
          return message.reply("That user does not exist.");
        });

      if (!target.isOwner) {
        await target.kick()
          .then(() => {
            const embed = new Embed()
              .setColor("GREEN")
              .setDescription(`✅ **${target.username}** (${target.id}) has been kicked!`)
              .setTimestamp();
            return message.reply({ embeds: [embed] });
          });
      } else {
        return message.reply("That user cannot be kicked.");
      }
    } else {
      return message.reply("Mention a user or provide an ID to kick.");
    }
  },
};