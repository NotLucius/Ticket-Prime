const {
  Client,
  CommandInteraction,
  MessageEmbed,
  MessageSelectMenu,
  MessageActionRow,
} = require("discord.js");
const { glob } = require("glob");
const { promisify } = require("util");
const globPromise = promisify(glob);

module.exports = {
  name: "help",
  description: "Shows Help Embed of the Bot!",
  premium: true,

  /**
   *
   * @param {Client} client
   * @param {CommandInteraction} interaction
   *
   */
  run: async (client, interaction) => {
    const slashCommands = await globPromise(
      `${process.cwd()}/slashCommands/*/*.js`
    );
    const arrayOfSlashCommands = [];
    slashCommands.map((value) => {
      const file = require(value);
      if (!file?.name) return;
      client.slashCommands.set(file.name, file);
      arrayOfSlashCommands.push(file);
    });
    let date = new Date();
    let timestamp = date.getTime() - Math.floor(client.uptime);

    const helpembed = new MessageEmbed()
      .setAuthor({
        name: `${client.user.username} | Help Panel | Overview Page`,
        iconURL: client.user.displayAvatarURL(),
      })
      .setColor(client.config.color.main)
      .addFields({
        name: `Bot Features:`,
        value: `>>> ***${client.user}** I'm a Ticket Bot with many feature and more coming soon!*`,
        inline: true,
      })
      .addFields({
        name: `Bot Stats:`,
        value: `>>> <a:zen_stats:992274460163981322> **Bot Ping:** \` ${
          client.ws.ping
        }ms \`\n<:zen_stats:1006769933197250600> **Bot Uptime:** *<t:${Math.floor(
          timestamp / 1000
        )}:R>*\n<:zen_slashC:1006785200505749574> **slashC:** \` ${
          arrayOfSlashCommands.length
        } \``,
        inline: true,
      })
      .addFields({
        name: `Developer:`,
        value: `> *This amazing bot was coded by, [Supreme Development](https://supremedev.xyz)*`,
        inline: true,
      })
      .setFooter({
        text: `Use the menu to view all my commands!`,
      });

    const infopage = new MessageEmbed()
      .setAuthor({ name: `${client.user.username} | Help Panel | Info Page` })
      .addFields(
        {
          name: `\`/botinfo\``,
          value: `*Gathers the bot's information*`,
          inline: true,
        },
        {
          name: `\`/help\``,
          value: `*Shows Help Embed of the Bot!*`,
          inline: true,
        },
        {
          name: `\`/invite\``,
          value: `*Invite the bot to your server*`,
          inline: true,
        },
        {
          name: `\`/ping\``,
          value: `*Shows Bots Ping*`,
          inline: true,
        },
        {
          name: `\`/uptime\``,
          value: `*Fetchs the bots total uptime*`,
          inline: true,
        }
      )
      .setColor(client.config.color.main)
      .setFooter({
        text: `Page 1 • 2`,
        iconURL: client.user.displayAvatarURL(),
      });

    const ticketpage = new MessageEmbed()
      .setAuthor({ name: `${client.user.username} | Help Panel | Ticket Page` })
      .addFields(
        {
          name: `\`/setup-ticketlogs\``,
          value: `*🎫 Setup the Ticket-Logs*`,
          inline: true,
        },
        {
          name: `\`/setup-ticket\``,
          value: `*🎫 Setup the Ticket-System*`,
          inline: true,
        },
        {
          name: `\`/ticket-adduser\``,
          value: `*🎫 Add a user to the Ticket*`,
          inline: true,
        },
        {
          name: `\`/ticket-rmuser\``,
          value: `*🎫 Remove a user to the Ticket*`,
          inline: true,
        }
      )
      .setColor(client.config.color.main)
      .setFooter({
        text: `Page 2 • 2`,
        iconURL: client.user.displayAvatarURL(),
      });

    let msgSelect = new MessageActionRow().addComponents(
      new MessageSelectMenu()
        .setCustomId("msgSelect")
        .setPlaceholder("Click me to view my options")
        .setMinValues(1)
        .setMaxValues(2)
        .addOptions(
          {
            label: "Info",
            value: "infopage",
            emoji: "1006785065700818975",
            description: "Info Commands",
          },
          {
            label: "Ticket",
            value: "ticketpage",
            emoji: "1035537128207171626",
            description: "Ticket Page",
          }
        )
    );

    var messageSent = await interaction.reply({
      embeds: [helpembed],
      components: [msgSelect],
    });

    const filter = (interaction) => {
      if (interaction.user.id === interaction.user.id) return true;
      return interaction.reply({
        content: `***You cannot use this menu***`,
        ephemeral: true,
      });
    };

    const collector = interaction.channel.createMessageComponentCollector({
      filter,
      componentType: "SELECT_MENU",
      time: 120000,
    });

    collector.on("collect", (interaction) => {
      if (interaction.values[0] === "infopage") {
        interaction.reply({ embeds: [infopage], ephemeral: true });
      } else if (interaction.values[0] === "ticketpage") {
        interaction.reply({ embeds: [ticketpage], ephemeral: true });
      }
    });
    collector.on("end", () => {
      setTimeout(function () {
        msgSelect.components[0].setDisabled(true);
        messageSent.edit({
          content: `${client.config.emoji.wrong} ***Time Ended, type: \`/help\` again***`,
          embeds: [helpembed],
          components: [msgSelect],
        });
      }, 120000);
    });
  },
};
