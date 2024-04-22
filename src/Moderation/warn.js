const { Embed } = require("guilded.js");
const mongoose = require("mongoose");
const { v4: uuidv4 } = require('uuid');

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
  name: "warn",
  description: "Warn a user",
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

      const targetId = message.mentions.users[0].id;
      const target = await client.members.fetch(message.serverId, targetId);
      
      const reason = args.slice(1).join(" ") || "None"; // Set reason to "None" if not provided
      const warnedBy = message.authorId;

      // Save the warning to MongoDB
      const Warning = mongoose.model("Warning");
      const warning = new Warning({
        userId: message.mentions.users[0].id,
        reason,
        warnedBy,
        warningId: uuidv4().substr(0, 8), // Generate a short warning ID using UUID
      });
      await warning.save();

      const warningCount = await Warning.countDocuments({ userId: message.mentions.users[0].id });

      const successEmbed = new Embed()
        .setTitle(`Warning! (${warning.warningId})`)
        .setDescription(`<@${targetId}> has been warned: \n\nReason: \`${reason}\` \nWarned By: <@${server.ownerId}>`)
        .setColor("GREEN")
        .setFooter(`Total Warnings: ${warningCount}`);
      await message.reply({ embeds: [successEmbed] });

      if (warningCount >= 3) {
        await target.kick();

        const kickedEmbed = new Embed()
          .setTitle("User Kicked!")
          .setDescription(`<@${targetId}> has been kicked for having too many warnings.`)
          .setColor("GREEN");
        await message.reply({ embeds: [kickedEmbed] });
      }
    } catch (error) {
      const errorEmbed = new Embed()
        .setTitle("Error!")
        .setDescription("An error occurred while processing the command. \n\n**Please make sure your command format is correct. Otherwise if it isn't, Please report to our [Support Server](https://guilded.gg/pulse)** \n\nHere's an example: \n`p!warn [@username]` or `p!warn [@username] [reason]`")
        .setColor("RED");
      await message.reply({ embeds: [errorEmbed] });
    }
  },
};