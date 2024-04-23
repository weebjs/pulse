const { Embed } = require("guilded.js");
const fs = require("fs");
const WebSocket = require('ws');

let logsEnabled = false;
let socket;
let message; // Define message variable

module.exports = {
  name: "logs",
  description: "Enable or disable member join logs",
  run: async (client, msg, args) => {
    const server = await client.servers.fetch(msg.serverId);

    if (msg.authorId !== server.ownerId) {
      const embed = new Embed()
        .setColor("RED")
        .setTitle("Insufficient Permissions!")
        .setDescription(`You need to be a server owner to execute this command. \n\nIf you aren't the owner (<@${server.ownerId}>), then you can't execute this command!`);

      return msg.reply({ embeds: [embed], isSilent: true });
    }

    try {
      message = msg; // Assign message to the variable
      if (args[0] === "disable") {
        // Disable member join logs
        logsEnabled = false;
        const disabledEmbed = new Embed()
          .setTitle("Disabled!")
          .setDescription("Logs for this server have now been disabled.")
          .setColor("RED");
        await message.reply({ embeds: [disabledEmbed] });
      } else if (args[0] === "enable") {
        // Enable member join logs
        logsEnabled = true;
        const enabledEmbed = new Embed()
          .setTitle("Enabled!")
          .setDescription("Logs for this server have now been enabled.")
          .setColor("GREEN");
        await message.reply({ embeds: [enabledEmbed] });
      } else {
        const usageEmbed = new Embed()
          .setTitle("Incorrect Command Usage!")
          .setDescription("Please use the correct command usage to execute this command. \n\nHere's an example: `p!logs [enable/disable]`")
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
      .setDescription(`<@${member.user.id}> has joined the server!`)
      .setColor("GREEN");

    // Send the embed for member join event
    message.send({ embeds: [joinEmbed] });
  }

  if (eventType === 'ServerMemberRemoved' && logsEnabled) {
    const { userId, serverId } = eventData;

    // Create an embed for the member leave event
    const leaveEmbed = new Embed()
      .setTitle("Member Left!")
      .setDescription(`<@${userId}> has left the server.`)
      .setColor("RED");

    // Send the embed for member leave event
    message.send({ embeds: [leaveEmbed] });
  }
});

if (eventType === 'BotServerMembershipCreated') {
  const { server: { defaultChannelId } } = eventData;
  // posts welcome message
  fetch(`https://www.guilded.gg/api/v1/channels/${defaultChannelId}/messages`, {
    method: 'POST',
    headers: {
      Authorization: `Bearer ${token}`,
      "Content-Type": "application/json"
    },
    body: JSON.stringify({
      embeds: [{
        title: "Hello, I'm Pulse!",
        description: `If you would like to know more use the \`p!help\` command.\n\n**Links**\n[Support Server](https://www.guilded.gg/i/pW14q1v2)\n[Invite Link](https://www.guilded.gg/b/f298100e-a76a-48e1-ba8f-e11008af8250)`,
      }]
    }),
  });
}