const { Embed } = require("guilded.js");

module.exports = {
  name: "invite",
  description: "Generate an invite link for the bot.",
  run: async (client, message, args) => {
    try {
      const inviteLink = `https://www.guilded.gg/b/f298100e-a76a-48e1-ba8f-e11008af8250`;

      const embed = new Embed()
        .setTitle("Invite Link")
        .setDescription(`[Click here](${inviteLink}) to invite the bot to your server.`)
        .setColor("#EAD5FF");

      // Send the embed as a reply
      const inviteMessage = await message.reply({ embeds: [embed], isSilent: true });
    } catch (error) {
      console.error(error);
    }
  },
};