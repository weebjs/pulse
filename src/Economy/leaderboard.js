const { Embed } = require("guilded.js");
const mongoose = require("mongoose");

// Define the user schema if it's not already defined
if (!mongoose.models.User) {
  const userSchema = new mongoose.Schema({
    userId: { type: String, required: true },
    balance: { type: Number, default: 0 },
    bankbalance: { type: Number, default: 0 },
    lastHourly: { type: Date, default: null },
  });

  // Create a model based on the user schema
  mongoose.model("User", userSchema);
}

// Replace 'YOUR_MONGODB_URL' with your actual MongoDB URL
const mongodbUrl =
  "mongodb+srv://weebjs:Summer8455@cluster0.ikzk44n.mongodb.net/?retryWrites=true&w=majority&appName=Cluster0";
mongoose.connect(mongodbUrl);

module.exports = {
  name: "leaderboard",
  description: "Display the top users based on their balance",
  usage: "`p!leaderboard`",
  run: async (client, message, args) => {
    try {
      const User = mongoose.model("User");
      const users = await User.find()
        .sort({ balance: -1 })
        .limit(10); // Change the limit as per your requirement

      if (users.length === 0) {
        const noUsersEmbed = new Embed()
          .setTitle("Leaderboard")
          .setDescription("No users found.")
          .setColor("RED");
        return message.reply({ embeds: [noUsersEmbed] });
      }

      const leaderboardEmbed = new Embed()
        .setTitle("Leaderboard")
        .setColor("#EAD5FF");

      let leaderboardDescription = "";

      for (let i = 0; i < users.length; i++) {
        const user = users[i];
        const member = await client.members.fetch(message.serverId, user.userId);
        leaderboardDescription += `\`${i + 1}.\` ${member.user.name} \`$${user.balance}\`\n`;
      }

      leaderboardEmbed.setDescription(leaderboardDescription);

      await message.reply({ embeds: [leaderboardEmbed] });
    } catch (error) {
      const errorEmbed = new Embed()
        .setTitle("Error!")
        .setDescription("An error occurred while processing the command.")
        .setColor("RED");
      await message.reply({ embeds: [errorEmbed] });
    }
  },
};