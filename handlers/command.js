const { readdirSync } = require("fs"),
  ascii = require("ascii-table");

let table = new ascii("Commands");
table.setHeading("Command", "Load status");

module.exports = (client) => {
  readdirSync("./src").forEach(dir => {
    const commands = readdirSync(`./src/${dir}/`).filter(file => file.endsWith(".js"));

    for (let file of commands) {
      let pull = require(`../src/${dir}/${file}`);
      pull.name = file.replace(".js", "")
      pull.category = dir
      client.commands.set(pull.name, pull);
      table.addRow(file, '✅');

      if (pull.aliases && Array.isArray(pull.aliases)) pull.aliases.forEach(alias => client.aliases.set(alias, pull.name));
    }
  });
  console.log(table.toString());
}