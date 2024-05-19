const { Embed } = require("guilded.js");
module.exports = {
  name: "purge",
  description: "purge x amount of messages",
  usage: "`!purge [amount]`",
  run: async (client, message, args) => {
    const server = await client.servers.fetch(message.serverId);
    try {
      if (message.authorId !== server.ownerId) {
        const embed = new Embed()
          .setColor("RED")
          .setTitle("Insufficient Permissions!")
          .setDescription(`You need to be a server owner to execute this command. \n\nIf you aren't the owner (<@${server.ownerId}>), then you can't execute this command!`);
  
        return message.reply({ embeds: [embed] });
      }

      // Check if the user provided an amount to delete
      if (!args[0] || isNaN(args[0])) {
        const embed = new Embed()
          .setTitle("Oh no!")
          .setDescription("Please add an ammount of messages to delete.")
          .addField("Usage", `\`\`\`?purge [number]\`\`\``)
          .setColor("RED");

        return message.reply({ embeds: [embed] });
      }

      // Get the amount of messages to delete
      const amount = parseInt(args[0]);

      // Check if the amount is within the valid range
      if (amount > 50) {
        const embed = new Embed()
          .setTitle("Oh no!")
          .setDescription("The maximum number of messages to delete is 50. Please try again.")
          .addField("Usage", `\`\`\`?purge [number]\`\`\``)
          .setColor("RED");

        return message.reply({ embeds: [embed] });
      }

      const channel = await client.channels.fetch(message.channelId);
      const messages = await channel.fetchMessages({ limit: amount + 1 });

      // Delete the messages
      await Promise.all(messages.map(m => m.delete()));

      // Send a message confirming the deletion
      const embed = new Embed()
        .setTitle("Success!")
        .setDescription(`Deleted \`${amount}\` messages. \nExecuted by <@${message.authorId}>.`)
        .setColor("GREEN");

      return message.send({ embeds: [embed], isSilent: true });
    } catch (err) {
      // Log the error
      console.error("Error while executing the 'purge' command:", err);

      // Send an error message to the user
      const embed = new Embed()
        .setTitle("Error!")
        .setDescription("An error occurred while executing the `purge` command. Please try again later.")
        .setColor("RED");
      return message.reply({ embeds: [embed] });
    }
  }
};