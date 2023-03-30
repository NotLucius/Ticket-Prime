const {
  Client,
  CommandInteraction,
  MessageEmbed,
  MessageActionRow,
  MessageButton,
} = require("discord.js");
const ms = require("ms");

module.exports = {
  name: "invite",
  cooldown: 5,
  description: "Invite the bot to your server",

  /**
   *
   * @param {Client} client
   * @param {CommandInteraction} interaction
   * @param {String[]} args
   */
  run: async (client, interaction, args) => {
    const inviteembed = new MessageEmbed()
      .setColor(client.config.color.main)
      .setDescription(
        `*Thanks for choosing **${client.user}** as your ticket bot, you can invite me clicking the invite button bellow.*`
      )
      .setFooter({ text: `Invite ${client.user.tag}` });

    const invitebutton = new MessageActionRow().addComponents(
      new MessageButton()
        .setLabel("Invite Me")
        .setURL(
          `https://discord.com/api/oauth2/authorize?client_id=${client.user.id}&permissions=8&scope=bot%20applications.commands`
        )
        .setStyle("LINK")
    );

    interaction.reply({ embeds: [inviteembed], components: [invitebutton] });
  },
};
