const { Client, CommandInteraction, MessageEmbed } = require("discord.js");

module.exports = {
  name: "allservers",
  description: "🔒 View all servers im in.",
  developer: true,

  /**
   *
   * @param {Client} client
   * @param {CommandInteraction} interaction
   *
   */
  run: async (client, interaction) => {
    let array = [];
    client.guilds.cache.forEach(async (x) => {
      array.push(`${x.name} [${x.memberCount}]`);
      interaction.reply(`${array.join("\n")}`);
    });
  },
};
