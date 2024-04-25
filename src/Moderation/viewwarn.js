const { Embed } = require("guilded.js");
const Warning = require("./uwu/db");

module.exports = {
  name: "viewwarn",
  description: "Check the number of warnings for a user",
  usage: "`p!viewwarn [@username]`",
  run: async (client, message, args) => {
    const server = await client.servers.fetch(message.serverId);

    if (message.authorId !== server.ownerId) {
      const embed = new Embed()
        .setColor("RED")
        .setTitle("Insufficient Permissions!")
        .setDescription(`You need to be a server owner to execute this command. \n\nIf you aren't the owner (<@${server.ownerId}>), then you can't execute this command!`);

      return message.reply({ embeds: [embed], isSilent: true });
    }

    try {
      // Check if the command has the correct number of arguments
      const targetId = message.mentions.users[0].id;
      const warningCount = await Warning.countDocuments({ userId: targetId });

      const embed = new Embed()
        .setTitle("User Warnings")
        .setDescription(`User: <@${targetId}> \nWarnings: \`${warningCount}\``)
        .setColor("BLUE");
      await message.reply({ embeds: [embed] });
    } catch (error) {
      const errorEmbed = new Embed()
        .setTitle("Error!")
        .setDescription("An error occurred while processing the command. \n\n**Please make sure your command format is correct. Otherwise, if it isn't, please report it to our [Support Server](https://guilded.gg/pulse)** \n\nHere's an example: \n`p!viewwarn [@username]`")
        .setColor("RED");
      await message.reply({ embeds: [errorEmbed] });
    }
  },
};