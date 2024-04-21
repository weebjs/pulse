module.exports = {
  run: async (client) => {

    console.log(`✅ Logged in as ${client.user.name}`);
    await client.fetchServers();
    const status = {
      content: `Moderating ${client.servers.cache.size} servers!`,
      emoteId: 90002554,
    };
    await client.setStatus(status); 
    console.log(`✨ In ${client.servers.cache.size} servers!`);

  },
};