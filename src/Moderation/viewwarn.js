const { Embed } = require("guilded.js");
const mongoose = require("mongoose");

// Define the warning schema if it's not already defined
if (!mongoose.models.Warning) {
  const warningSchema = new mongoose.Schema({
    userId: { type: String, required: true },
    reason: { type: String, default: "None" },
    warnedBy: { type: String, required: true },
    warningId: { type: String, required: true },
  });

  // Create a model based on the warning schema
  mongoose.model("Warning", warningSchema);
}

// Replace 'YOUR_MONGODB_URL' with your actual MongoDB URL
const mongodbUrl = 'mongodb+srv://weebjs:Summer8455@cluster0.ikzk44n.mongodb.net/?retryWrites=true&w=majority&appName=Cluster0';
mongoose.connect(mongodbUrl);

module.exports = {
  name: "viewwarn",
  description: "Check the number of warnings for a user",
  usage: "`!viewwarn [@username]`",
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

    try {
      // Check if the command has the correct number of arguments
      const targetId = message.mentions.users[0].id;
      const Warning = mongoose.model("Warning");
      const warningCount = await Warning.countDocuments({ userId: targetId });

      const embed = new Embed()
        .setTitle("User Warnings")
        .setDescription(`User: <@${targetId}> \nWarnings: \`${warningCount}\``)
        .setColor("BLUE");
      await message.reply({ embeds: [embed] });
    } catch (error) {
      const embed = new Embed()
        .setTitle("Error!")
        .setDescription("An error occurred while executing the command.")
        .setFooter("Please try again later.")
        .setColor("RED");
      return message.reply({ embeds: [embed] });
    }
  },
};