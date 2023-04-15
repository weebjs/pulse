const { Embed } = require('guilded.js');
const axios = require('axios');

module.exports = {
  description: 'Displays a random quote',
  aliases: ['quote'],
  run: async (client, message, args) => {
    // Fetch a random quote from the API
    const response = await axios.get('https://api.quotable.io/random');
    const quote = response.data;

    // Create an embed message with the quote information
    const embed = new Embed()
      .setDescription(quote.content)
      .setColor(client.settings.color.neutral);
message.send({ embeds: [embed] })
  },
};