const { readdirSync } = require("fs");
const Ascii = require("ascii-table");
const fs = require("fs");

// Create a new Ascii table
let table = new Ascii("COMMANDS");
table.setHeading("SLASHCOMMANDS", "STATUS");

module.exports = (client) => {
  readdirSync(`${process.cwd()}/slashCommands/`).forEach((dir) => {
    const commands = fs
      .readdirSync(`${process.cwd()}/slashCommands/${dir}/`)
      .filter((file) => file.endsWith(".js"));

    for (let file of commands) {
      let pull = require(`${process.cwd()}/slashCommands/${dir}/${file}`);

      if (pull.name) {
        client.commands.set(pull.name, pull);
        table.addRow(file, "✅ SUCCESS");
      } else {
        table.addRow(
          file,
          `🟥 Missing a help.name, or help.name is not a string.`
        );
        continue;
      }

      if (pull.aliases && Array.isArray(pull.aliases))
        pull.aliases.forEach((alias) => client.aliases.set(alias, pull.name));
    }
  });
  console.log(table.toString());
};

/**
// ================< ==================== >================= //
//                                                           //
//            Handlers Coded by benzmeister#5843             //
//                                                           //
//                  Work for Omega Studios™                  //
//                                                           //
//                    All Right Reserved!                    //
//                                                           //
// ================< ==================== >================= //
*/