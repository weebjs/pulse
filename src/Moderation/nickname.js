const { Embed } = require("guilded.js");

module.exports = {
  name: "nickname",
  description: "Change a user's nickname",
  usage: "`!nickname [@user] (new_nickname)`",
  run: async (client, message, args) => {
    try {
      // Get the mentioned user
      const mentionedUser = message.mentions.users[0].id;

      if (message.authorId !== server.ownerId) {
        const embed = new Embed()
          .setColor("RED")
          .setTitle("Insufficient Permissions!")
          .setDescription("You don't have the required permissions to execute this command!")
          .setFooter("This command is only for server owners only.");

        return message.reply({ embeds: [embed] });
      }

      // Check if a user was mentioned
      if (!mentionedUser) {
        const embed = new Embed()
          .setTitle("Oh no!")
          .setDescription("Please mention a user to change their nickname.")
          .addField("Usage", "```!nickname [@user] (new_nickname)```")
          .setColor("RED");

        return message.reply({ embeds: [embed] });
      }

      // Get the new nickname from the arguments
      const newNickname = args.slice(1).join(" ");

      // Check if a new nickname was provided
      if (!newNickname) {
        const embed = new Embed()
          .setTitle("Oh no!")
          .setDescription("Please provide a new nickname.")
          .addField("Usage", "```!nickname [@user] (new_nickname)```")
          .setColor("RED");

        return message.reply({ embeds: [embed] });
      }

      // Make the cURL request to update the user's nickname
      const response = await fetch(
        `https://www.guilded.gg/api/v1/servers/${message.serverId}/members/${mentionedUser}/nickname`,
        {
          method: "PUT",
          headers: {
            "Authorization": `Bearer ${client.token}`,
            "Accept": "application/json",
            "Content-Type": "application/json"
          },
          body: JSON.stringify({ nickname: newNickname })
        }
      );

      if (response.ok) {
        const embed = new Embed()
          .setTitle("Success!")
          .setDescription(`The nickname for <@${mentionedUser}> has been changed to **${newNickname}**`)
          .setColor("GREEN");

        return message.reply({ embeds: [embed] });
      } else {
        const embed = new Embed()
          .setTitle("Error!")
          .setDescription("An error occurred while trying to change the nickname.")
          .setColor("RED")
          .setFooter("Please try again later.");

        return message.reply({ embeds: [embed] });
      }
    } catch (err) {
      const embed = new Embed()
        .setTitle("Error!")
        .setDescription("An error occurred while executing the command.")
        .setFooter("Please try again later.")
        .setColor("RED");
      return message.reply({ embeds: [embed] });
    }
  }
};
