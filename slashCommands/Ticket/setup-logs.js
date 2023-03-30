const { Client, CommandInteraction, MessageEmbed } = require("discord.js");
const model = require("../../Models/ticket-log");

let cat;

module.exports = {
  name: "setup-ticketlogs",
  description: "🎫 Setup the Ticket-Logs",
  options: [
    {
      name: "system",
      description: "Select which Ticket-System you want to manage",
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
      name: "channel",
      description: "Channel where Ticket Logs will be sent!",
      type: "CHANNEL",
      channelTypes: ["GUILD_TEXT"],
      required: true,
    },
  ],

  /**
   *
   * @param {Client} client
   * @param {CommandInteraction} interaction
   * @returns
   */

  run: async (client, interaction) => {
    let s = interaction.options.getString("system");
    let channel = interaction.options.getChannel("channel");
    let check = await interaction.guild.channels.cache.get(channel.id);

    if (!interaction.member.permissions.has("ADMINISTRATOR"))
      return interaction.followUp({
        content: `${client.config.emoji.wrong} **You cannot use this command!**`,
        ephemeral: true,
      });

    model.findOne(
      { Guild: interaction.guild.id, System: s },
      async (err, data) => {
        if (!check)
          return interaction.followUp({
            content: `${client.config.emoji.wrong} The args you provide either isn't a channel, or I can't view the selected channel.`,
          });

        const panel = new MessageEmbed()
          .setColor(client.config.color.main)
          .setDescription(`\`\`\`Ticket Logs will be sent here!\`\`\``);

        const embed = new MessageEmbed()
          .setColor(client.config.color.main)
          .setAuthor({ name: `Ticket Logs` })
          .addFields({
            name: `${client.config.emoji.systemicon} Ticket Number:`,
            value: `\` ${s} \``,
          })
          .addFields({
            name: `${client.config.emoji.channelicon} Ticket Logging:`,
            value: `${channel}`,
          })
          .setFooter({
            text: `TicketManager.gq`,
            iconURL: interaction.guild.iconURL(),
          });

        if (data) {
          data.delete();
        }
        new model({
          Guild: interaction.guild.id,
          System: s,
          Logging: channel.id,
        }).save();

        interaction.reply({ embeds: [embed] });

        client.channels.cache.get(channel.id).send({ embeds: [panel] });
      }
    );
  },
};
