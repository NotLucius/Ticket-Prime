const { MessageEmbed, CommandInteraction, Client } = require("discord.js");
const DB = require(`../../Models/ticket`);

module.exports = {
  name: "ticket-rmvuser",
  description: "🎫 Remove a user to the Ticket",
  cooldown: 5,
  options: [
    {
      name: "user",
      description: "Mention the user you want to add in the Ticket!",
      type: "USER",
      required: true,
    },
  ],

  /**
   * @param {Client} client
   * @param {CommandInteraction} interaction
   *
   */
  run: async (client, interaction) => {
    let user = interaction.options.getUser("user");
    const data = await DB.findOne({
      Guild: interaction.guild.id,
    });

    if (interaction.member.roles.cache.has(data.Admin)) {
      interaction.channel.permissionOverwrites.edit(user, {
        SEND_MESSAGES: false,
        VIEW_CHANNEL: false,
        ATTACH_FILES: false,
        READ_MESSAGE_HISTORY: false,
      });

      const Embed = new MessageEmbed()
        .setDescription(`***Removed ${user} to the Ticket!***`)
        .setColor(client.config.color.main);

      interaction.reply({
        embeds: [Embed],
        ephemeral: true,
      });
    }
  },
};
