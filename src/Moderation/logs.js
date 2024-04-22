const { Embed } = require("guilded.js");
const fs = require("fs");
const WebSocket = require('ws');

let logsEnabled = false;
let socket;

module.exports = {
  name: "logsenabled",
  description: "Enable or disable member join logs",
  usage: "`p!logs [enable/disable]`",
  run: async (client, message, args) => {
    try {
      const server = await client.servers.fetch(message.serverId);

    if (message.authorId !== server.ownerId) {
      const embed = new Embed()
        .setColor("RED")
        .setTitle("Error!")
        .setDescription(`You need to be a server owner to execute this command. \n\nIf you aren't the owner (<@${server.ownerId}>), then you cant't execute this command!`);

      return message.reply({ embeds: [embed], isSilent: true });
    }

      if (args[0] === "disable") {
        // Disable member join logs
        logsEnabled = false;
        const disabledEmbed = new Embed()
          .setTitle("Disabled!")
          .setDescription("Welcome logs have now been disabled.")
          .setColor("#FF3131");
        await message.reply({ embeds: [disabledEmbed] });
      } else if (args[0] === "enable") {
        // Enable member join logs
        logsEnabled = true;
        const enabledEmbed = new Embed()
          .setTitle("Enabled!")
          .setDescription("Welcome logs have now been enabled in this channel.")
          .setColor("GREEN");
        await message.reply({ embeds: [enabledEmbed] });
      } else {
        const usageEmbed = new Embed()
          .setTitle("Error!")
          .setDescription("Please use the correct command usage to execute this command. Here's an example: `p!logs [enable/disable]`")
          .setColor("RED");
        await message.reply({ embeds: [usageEmbed] });
      }
    } catch (error) {
      console.error(error);
    }
  },
};

// WebSocket connection
const token = 'gapi_cIDIGdmX/RZIWDm0nh5QOBRrLN3g4s9XoY9/nEKAkJviQc/rnziWtgqq8xXfPTZufFd8Akp/YBrVnjVgG+M/zg==';
socket = new WebSocket('wss://www.guilded.gg/websocket/v1', {
  headers: {
    Authorization: `Bearer ${token}`
  },
});



socket.on('message', function incoming(data) {
  const json = JSON.parse(data);
  const { t: eventType, d: eventData } = json;

  if (eventType === 'ServerMemberJoined' && logsEnabled) {
    const { member, serverId } = eventData;

    // Create an embed for the member join event
    const joinEmbed = new Embed()
      .setTitle("Member Joined!")
      .setDescription(`**${member.user.name}** has joined the server!`)
      .setColor("GREEN");

    // Send the embed for member join event
    message.reply({ embeds: [joinEmbed] });
  }

  if (eventType === 'ServerMemberRemoved' && logsEnabled) {
    const { member, serverId } = eventData;

    // Create an embed for the member leave event
    const leaveEmbed = new Embed()
      .setTitle("Member Left!")
      .setDescription(`**${member.user.name}** has left the server.`)
      .setColor("RED");

    // Send the embed for member leave event
    message.reply({ embeds: [leaveEmbed] });
  }
});