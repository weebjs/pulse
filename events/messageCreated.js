module.exports = {
    run: async(client, message) => {
        if(!message.content.startsWith(client.settings.prefix)) return;
        const args = message.content.slice(client.settings.prefix.length).trim().split(/ +/g);
        const cmd = args.shift().toLowerCase();
        let command = client.commands.get(cmd)
        if (!command) command = client.commands.get(client.aliases.get(cmd));
        if(!command) return;
        
        try {
            await command.run(client, message, args);
        } catch (err) {
            console.error("Error while executing the command:", err);
            await message.send("An error occurred while executing the command. Please try again later.");
        }
    }
}