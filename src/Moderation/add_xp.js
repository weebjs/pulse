const { Embed } = require("guilded.js");

const MAX_XP = 1000; // 1 billion

module.exports = {
  name: "add_xp",
  description: "add xp to a user.",
  usage: "`!add_xp [@user] [amount]`",
  aliases: ["setxp"],
  run: async (client, message, args) => {
    try {
      // Get the mentioned user
      const server = await client.servers.fetch(message.serverId);
      const mentionedUser = message?.mentions?.users[0].id;


      if (message.authorId !== server.ownerId) {
        const embed = new Embed()
          .setColor("RED")
          .setTitle("Insufficient Permissions!")
          .setDescription("You don't have the required permissions to execute this command!")
          .setFooter("This command is only for server owners only.");

        return message.reply({ embeds: [embed] });
      }

      
      if (!mentionedUser) {
        return message.reply({
          embeds: [
            new Embed()
              .setTitle("Error")
              .setDescription("Please mention a user to set their XP.")
              .setColor("RED")
              .addField("Usage", "\`\`\`!set_xp [@username] [ammount]\`\`\`")
          ]
        });
      }

      // Get the new XP amount from the arguments
      const newXP = parseInt(args[1]);
      if (isNaN(newXP) || newXP <= 0) {
        return message.reply({
          embeds: [
            new Embed()
              .setTitle("Error")
              .setDescription("Please provide a valid positive number for the new XP amount.")
              .setColor("RED")
              .addField("Usage", "\`\`\`!set_xp [@username] [ammount]\`\`\`")
          ]
        });
      }

      // Check if the new XP amount exceeds the maximum
      if (newXP > MAX_XP) {
        return message.reply({
          embeds: [
            new Embed()
              .setTitle("Error")
              .setDescription(`The ammount of xp cannot exceed \`${MAX_XP}\`.`)
              .addField("Usage", "\`\`\`!set_xp [@username] [ammount]\`\`\`")
              .setColor("RED")
          ]
        });
      }

      // Make the API request to update the user's XP
      const response = await fetch(
        `https://www.guilded.gg/api/v1/servers/${message.serverId}/members/${mentionedUser}/xp`,
        {
          method: "POST",
          headers: {
            "Authorization": `Bearer ${client.token}`,
            "Accept": "application/json",
            "Content-Type": "application/json"
          },
          body: JSON.stringify({ amount: newXP })
        }
      );

      if (response.ok) {
        const embed = new Embed()
          .setTitle("Updated!")
          .setDescription(`<@${mentionedUser}>'s XP has been set to \`${newXP}\``)
          .setColor("GREEN");

        return message.reply({ embeds: [embed] });
      } else {
        const errorData = await response.json();
        console.error("Error while setting XP:", errorData);

        const embed = new Embed()
          .setTitle("Error!")
          .setDescription("An error occurred while trying to set the XP.")
          .setColor("RED")
          .setFooter("Please try again later.");

        return message.reply({ embeds: [embed] });
      }
    } catch (err) {
      console.error("Error executing !set_xp command:", err);

      const embed = new Embed()
        .setTitle("Error!")
        .setDescription("An error occurred while executing the command.")
        .setFooter("Please try again later.")
        .setColor("RED");
      return message.reply({ embeds: [embed] });
    }
  }
};