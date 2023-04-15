module.exports = {
    run: async(client, message) => {
        if(!message.content.startsWith(client.settings.prefix)) return;
        const args = message.content.slice(client.settings.prefix.length).trim().split(/ +/g);
        const cmd = args.shift().toLowerCase();
        let command = client.commands.get(cmd)
        if (!command) command = client.commands.get(client.aliases.get(cmd));
        if(!command) return;
        
        command.run(client, message, args)
    }
}