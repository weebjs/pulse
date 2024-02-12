const { Client } = require("guilded.js");
const { Collection } = require("discord.js");
const { token, prefix, color, ownerId, mongoURI } = require("./settings.json");
const functions = require("./handlers/functions");
const client = new Client({token : token});

const express = require('express');
const app = express();
let port = 3000;
app.get('/', (req, res) => {
  res.send(`Ready`)
})
app.listen(port, () => {
  console.log(`Doge's API is listening to port : ${port}`)
})

client.commands = new Collection();
client.aliases = new Collection();
client.settings = { prefix, color, ownerId };
client.functions = functions;

for(let handler of  ["command", "event"]) require(`./handlers/${handler}`)(client);

client.login();