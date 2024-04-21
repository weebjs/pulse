const { Embed, Role } = require("guilded.js");
const fs = require("fs");

module.exports = {
  name: "help",
  description: "*View every command for the bot.*",
  usage: "`$help [command name]`",
  run: async (client, message, args) => {
    try {
      const commandName = args[0]; // Get the command name from the user's input

      // If a command name is provided, display information about that command
      if (commandName) {
        const command = client.commands.get(commandName); // Get the command object based on the name

        if (!command) {
          const embed = new Embed()
            .setTitle("Uh Oh ❗")
            .setDescription("This command doesn't exist.")
            .setColor("#FF3131");

          const errorembed = await message.reply({ embeds: [embed], isSilent: true });
        } else {
          // Create an embed with the command name and description
          const embed = new Embed()
            .setTitle(command.name)
            .setDescription(`*${command.description}* \n\n**Usage:** \`${command.usage || 'None'}\` \n**Aliases:** \`${command.aliases || 'None'}\``);

          // Send the embed as a reply
          const helpMessage = await message.reply({ embeds: [embed], isSilent: true });
        }
      } else {
        // If no command name is provided, display information about all available commands
        const commandsPath = "./commands"; // Path to the commands folder
        const folders = fs.readdirSync(commandsPath); // Get the list of folders in the commands folder

        const embed = new Embed()
          .setTitle("Welcome to the Help Menu!")
          .setDescription("The prefix for this server is `p!` \nHere are the available commands:")
          .setColor("#EAD5FF");

        for (const folder of folders) {
          const folderPath = `${commandsPath}/${folder}`;
          const files = fs.readdirSync(folderPath);

          const commandList = files
            .filter(file => file.endsWith(".js"))
            .map(file => `\`${file.slice(0, -3)}\``)
            .join(", ");

          embed.addField(`${folder.charAt(0).toUpperCase() + folder.slice(1)}`, `${commandList}`, false);
        }

        // Send the embed as a reply
        const helpMessage = await message.reply({ embeds: [embed], isSilent: true });
      }
    } catch (error) {
      console.error(error);
    }
  },
};