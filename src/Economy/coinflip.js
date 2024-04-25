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
  name: "coinflip",
  description: "Flip a coin and win or lose coins",
  usage: "`p!coinflip <amount>`",
  run: async (client, message, args) => {
    const userId = message.authorId;
    const member = await client.members.fetch(message.serverId, userId);

    try {
      const User = mongoose.model("User");
      const user = await User.findOne({ userId });

      if (!user) {
        await new User({ userId }).save();
      }

      const amount = parseInt(args[0]);

      if (!amount || amount < 1 || isNaN(amount)) {
        const invalidAmountEmbed = new Embed()
          .setTitle("Invalid Amount")
          .setDescription("Please provide a valid amount to bet.")
          .setColor("RED");
        return message.reply({ embeds: [invalidAmountEmbed] });
      }

      if (user.balance < amount) {
        const insufficientFundsEmbed = new Embed()
          .setTitle("Insufficient Funds")
          .setDescription("You don't have enough coins to place that bet.")
          .setColor("RED");
        return message.reply({ embeds: [insufficientFundsEmbed] });
      }

      const coin = Math.random() < 0.5 ? "Heads" : "Tails";
      const win = coin === "Heads"; // Randomly determine if it's a win or lose

      if (win) {
        user.balance += amount;
      } else {
        user.balance -= amount;
      }

      await user.save();

      const coinflipEmbed = new Embed()
        .setTitle("Coin Flip")
        .setDescription(`You flipped a coin and it landed on **${coin}**.`)
        .addField("Result", win ? "You win!" : "You lose!")
        .addField("Amount", amount)
        .addField("New Balance", user.balance)
        .setColor(win ? "GREEN" : "RED");

      await message.reply({ embeds: [coinflipEmbed] });
    } catch (error) {
      const errorEmbed = new Embed()
        .setTitle("Error!")
        .setDescription("An error occurred while processing the command.")
        .setColor("RED");
      await message.reply({ embeds: [errorEmbed] });
    }
  },
};