const { Client, CommandInteraction, MessageEmbed } = require("discord.js");

module.exports = {
  name: "uptime",
  description: "Fetchs the bots total uptime",
  type: "bot",

  /**
   *
   * @param {Client} client
   * @param {CommandInteraction} interaction
   * @param {String[]} args
   */
  run: async (client, interaction, args) => {
    let date = new Date();
    let timestamp = date.getTime() - Math.floor(client.uptime);

    setTimeout(() => {
      interaction.reply({
        embeds: [
          new MessageEmbed()
            .setAuthor({
              name: `Uptime of: ${client.user.tag}`,
              iconURL: client.user.displayAvatarURL(),
            })
            .setColor(client.config.color.main)
            .addFields({
              name: `__Up Since:__`,
              value: `_<t:${Math.floor(timestamp / 1000)}:R>_`,
            })
            .addFields({
              name: `__Launched at:__`,
              value: `_<t:${Math.floor(timestamp / 1000)}:F>_`,
            })
            .setFooter({
              text: `Uptime System\n↳ Powered by Supreme Development`,
              iconURL: client.user.displayAvatarURL(),
            }),
        ],
      });
    }, 1000);
  },
};
