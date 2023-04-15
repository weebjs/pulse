const { Client } = require("guilded.js"),
  { Collection } = require("discord.js"),
  { token, prefix, color, ownerId } = require("./settings.json"),
  functions = require("./handlers/functions"),
  client = new Client({token : token});

const express = require('express')
const app = express()
const port = 3000

app.get('/', (req, res) => {
  res.send('doge is online!')
})

app.listen(port, () => {
  console.log(`Example app listening on port ${port}`)
})


client.commands = new Collection();
client.aliases = new Collection();
client.settings = { prefix, color, ownerId }
client.functions = functions
for(let handler of  ["command", "event"]) require(`./handlers/${handler}`)(client);

client.login();