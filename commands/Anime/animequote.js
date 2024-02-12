const { Embed } = require('guilded.ts')

module.exports = {
  name: 'animequote',
  category: 'anime',
  description: 'Gives you a random anime quote',
  run: async (client, message, args) => {
    fetch('https://animechan.vercel.app/api/random').then(async (response) => {
      let res = await response.json()
      let embed = new Embed()
        .setTitle("Here's a random anime quote!")
        .setDescription(`*${res.quote}*`)
        .setFooter(`${res.character} from (${res.anime})`)
      message.reply({ embeds: [embed] })
    })
  }
}
