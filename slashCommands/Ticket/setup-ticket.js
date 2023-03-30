const {
  Client,
  CommandInteraction,
  MessageEmbed,
  MessageButton,
  MessageActionRow,
} = require("discord.js");
const model = require("../../Models/ticket");

let cat;

module.exports = {
  name: "setup-ticket",
  description: "🎫 Setup the Ticket-System",
  admin: true,
  options: [
    {
      name: "system",
      description: "Select which Ticket-System you want to setup",
      type: "STRING",
      required: true,
      choices: [
        { name: `Ticket-System #1`, value: `1` },
        { name: `Ticket-System #2`, value: `2` },
        { name: `Ticket-System #3`, value: `3` },
        { name: `Ticket-System #4`, value: `4` },
        { name: `Ticket-System #5`, value: `5` },
        { name: `Ticket-System #6`, value: `6` },
        { name: `Ticket-System #7`, value: `7` },
        { name: `Ticket-System #8`, value: `8` },
        { name: `Ticket-System #9`, value: `9` },
        { name: `Ticket-System #10`, value: `10` },
      ],
    },
    {
      name: "style",
      description: "Select a style you want for ticket names",
      type: "STRING",
      required: true,
      choices: [
        { name: `ticket-{username}`, value: `ticket-` },
        { name: `📁 | t・{username}`, value: `📁│t・` },
        { name: `🎫 | t・{username}`, value: `🎫│t・` },
        { name: `📁・{username}`, value: `📁・` },
        { name: `🎫・{username}`, value: `🎫・` },
      ],
    },
    {
      name: "type",
      description: "Ticket Type: [General, Support, Claim]",
      type: "STRING",
      required: true,
      choices: [
        { name: `General`, value: `General` },
        { name: `Support`, value: `Support` },
        { name: `Claim`, value: `Claim` },
      ],
    },
    {
      name: "channel",
      description: "The channel where the ticket panel is sent!",
      type: "CHANNEL",
      channelTypes: ["GUILD_TEXT"],
      required: true,
    },

    {
      name: "support_role",
      description: "Support Role: Admin/Staff",
      type: "ROLE",
      required: true,
    },
    {
      name: "category",
      description: "The Category where ticket is opened.",
      type: "CHANNEL",
      channelTypes: ["GUILD_CATEGORY"],
      required: true,
    },
    {
      name: "button_label",
      description: "Create Button Name",
      type: "STRING",
      required: false,
    },
    {
      name: "embed_desc",
      description: "The description of the Ticket Panel",
      type: "STRING",
      required: false,
    },
    {
      name: "ticket_open_msg",
      description: "Input a message when a ticket is open.",
      type: "STRING",
      required: false,
    },
  ],

  /**
   *
   * @param {Client} client
   * @param {CommandInteraction} interaction
   *
   * @returns
   */
  run: async (client, interaction) => {
    let s = interaction.options.getString("system");
    let style = interaction.options.getString("style");
    let ss = interaction.options.getString("type");
    let channel = interaction.options.getChannel("channel");
    let category = interaction.options.getChannel("category");
    let role = interaction.options.getRole("support_role");
    let message =
      interaction.options.getString("embed_desc") ||
      `If you need any help then open a Ticket with 📩`;
    let msg =
      interaction.options.getString("ticket_open_msg") ||
      `*A staff member will be here as soon as possible\nmean while tell us about your issue!*`;
    let label =
      interaction.options.getString("button_label") || `Create a Ticket`;
    let check = await interaction.guild.channels.cache.get(channel.id);

    if (!interaction.member.permissions.has("ADMINISTRATOR"))
      return interaction.reply({
        content: `${client.config.emoji.wrong} **You cannot use this command!**`,
        ephemeral: true,
      });

    model.findOne(
      { Guild: interaction.guild.id, System: s },
      async (err, data) => {
        if (!check)
          return interaction.reply({
            content: `${client.emoji.wrong} The args you provide either isn't a channel, or I can't view the selected channel.`,
          });

        const panel = new MessageEmbed()
          .setColor(client.config.color.main)
          .setAuthor({
            name: `Open a Ticket`,
            iconURL: client.user.displayAvatarURL(),
          })
          .setDescription(`${message}`)
          .setFooter({
            text: `TicketManager.gq - Ticketing without clutter`,
            iconrURL: interaction.guild.iconURL(),
          });

        const button = new MessageActionRow().addComponents([
          new MessageButton()
            .setLabel(label)
            .setStyle(`SECONDARY`)
            .setEmoji(`📩`)
            .setCustomId(`create_ticket${s}`),
        ]);
        const embed = new MessageEmbed()
          .setColor(client.config.color.main)
          .setDescription(
            `${client.config.emoji.right} ***Setup the Ticket System ${channel}***`
          );

        if (category) {
          cat = category.id;
        } else {
          cat = null;
        }

        if (data) {
          data.delete();
          new model({
            Guild: interaction.guild.id,
            Style: style,
            System: s,
            Admin: role.id,
            OpenMsg: msg,
            Category: cat,
            Type: ss,
          }).save();
        }
        if (!data)
          new model({
            Guild: interaction.guild.id,
            Style: style,
            System: s,
            Admin: role.id,
            OpenMsg: msg,
            Category: cat,
            Type: ss,
          }).save();

        interaction.reply({ embeds: [embed], ephemeral: true });

        client.channels.cache
          .get(channel.id)
          .send({ embeds: [panel], components: [button] })
          .catch((e) => {
            interaction.channel.send(
              `${client.config.emoji.wrong} I cant send the Embed to that channel! Check my perms!`
            );
          });
      }
    );
  },
};
