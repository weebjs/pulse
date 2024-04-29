const { Embed } = require("guilded.js");
const { Warning } = require("lib/warndb.js");

module.exports = {
  name: "delwarn",
  description: "Delete warnings for a user",
  usage: "`p!delwarn [@username] [number]`",
  run: async (client, message, args) => {
    const server = await client.servers.fetch(message.serverId);

    if (message.authorId !== server.ownerId) {
      const embed = new Embed()
        .setColor("RED")
        .setTitle("Insufficient Permissions!")
        .setDescription(
          `You need to be a server owner to execute this command. \n\nIf you aren't the owner (<@${server.ownerId}>), then you can't execute this command!`
        );

      return message.reply({ embeds: [embed], isSilent: true });
    }

    try {
      const targetId = message.mentions.users[0]?.id;
      const target = await client.members.fetch(message.serverId, targetId);

      // Check if the command format is correct
      const secondArg = args[2];
      const numToDelete = parseInt(secondArg);
      const warnings = await Warning.find({ userId: targetId })
        .sort({ _id: 1 })
        .limit(numToDelete);

      if (warnings.length > 0) {
        const warningIds = warnings.map((warning) => warning.warningId);
        await Warning.deleteMany({ _id: { $in: warnings.map((warning) => warning._id) } });

        const deletedEmbed = new Embed()
          .setTitle("Deleted!")
          .setDescription(`Deleted ${warnings.length} warning(s) for <@${targetId}>.`)
          .setColor("GREEN");
        await message.reply({ embeds: [deletedEmbed] });
      } else {
        const noWarningsEmbed = new Embed()
          .setTitle("Warning!")
          .setDescription(`No warnings found for <@${targetId}>.`)
          .setColor("YELLOW");
        await message.reply({ embeds: [noWarningsEmbed] });
      }
    } catch (error) {
      const errorEmbed = new Embed()
        .setTitle("Error!")
        .setDescription(
          "An error occurred while processing the command. \n\n**Please make sure your command format is correct. Otherwise if it isn't, Please report to our [Support Server](https://guilded.gg/pulse)** \n\nHere's an example: \n`p!delwarn [username] [number]`"
        )
        .setColor("RED");
      await message.reply({ embeds: [errorEmbed] });
    }
  },
};