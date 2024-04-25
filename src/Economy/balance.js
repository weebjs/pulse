const { Embed } = require("guilded.js");
const mongoose = require("mongoose");

// Define the user schema if it's not already defined
if (!mongoose.models.User) {
  const userSchema = new mongoose.Schema({
    userId: { type: String, required: true },
    balance: { type: Number, default: 0 },
    bankbalance: { type: Number, default: 0 },
  });

  // Create a model based on the user schema
  mongoose.model("User", userSchema);
}

// Replace 'YOUR_MONGODB_URL' with your actual MongoDB URL
const mongodbUrl =
  "mongodb+srv://weebjs:Summer8455@cluster0.ikzk44n.mongodb.net/?retryWrites=true&w=majority&appName=Cluster0";
mongoose.connect(mongodbUrl);

module.exports = {
  name: "balance",
  description: "Show user balance",
  usage: "`p!balance`",
  run: async (client, message, args) => {
    const userId = message.authorId;
    const member = await client.members.fetch(message.serverId, userId);

    try {
      const User = mongoose.model("User");
      const user = await User.findOne({ userId });

      if (user) {
        const balanceEmbed = new Embed()
          .setTitle(`${member.user.name}'s Balance`)
          .addField("Wallet 💳", `\`${user.balance}\``)
          .addField("Bank 🏦", `\`${user.bankbalance}\``)
          .setColor("#EAD5FF")
        await message.reply({ embeds: [balanceEmbed] });
    } else {
      const newUser = new User({ userId });
      await newUser.save();
      const newBalanceEmbed = new Embed()
        .setTitle("Insufficient Balance!")
        .setDescription("You have no coins yet. Start earning!")
        .setColor("BLUE");
      await message.reply({ embeds: [newBalanceEmbed] });
    }
    } catch (error) {
      const errorEmbed = new Embed()
        .setTitle("Error!")
        .setDescription("An error occurred while processing the command.")
        .setColor("RED");
      await message.reply({ embeds: [errorEmbed] });
    }
  },
};