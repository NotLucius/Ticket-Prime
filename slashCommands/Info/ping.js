const { Client, CommandInteraction, MessageEmbed } = require("discord.js");
const ms = require("ms");
const database = require("../../Models/language");
const { ping } = require("../../language/locale");

module.exports = {
  name: "ping",
  cooldown: 5,
  description: "Shows Bots Ping",
  type: "CHAT_INPUT",

  /**
   *
   * @param {Client} client
   * @param {CommandInteraction} interaction
   *
   */
  run: async (client, interaction) => {
    // Latency Check

    let webLatency = new Date() - interaction.createdAt;
    let apiLatency = client.ws.ping;

    // Emoji
    let emLatency = {
      Green: "🟢 FAST",
      Yellow: "🟡 SLOW",
      Red: "🔴 SLOW AF",
    };

    const embed = new MessageEmbed()
      .setAuthor({
        name: `Returns Latency and API Ping!`,
        iconURL: client.user.displayAvatarURL(),
      })
      .setColor(client.config.color.main)
      .addFields({
        name: `Websocket Latency:`,
        value: `\`${
          webLatency <= 200
            ? emLatency.Green
            : webLatency <= 400
            ? emLatency.Yellow
            : emLatency.Red
        } - ${webLatency}ms\``,
      })
      .addFields({
        name: `API Latency:`,
        value: `\`${
          apiLatency <= 200
            ? emLatency.Green
            : apiLatency <= 400
            ? emLatency.Yellow
            : emLatency.Red
        } - ${apiLatency}ms\``,
      })
      .setFooter({ text: `⚡ Powered by Supreme Development` });

    interaction.reply({ embeds: [embed] });
  },
};

/**
// ================< ==================== >================= //
//                                                           //
//            Handlers Coded by benzmeister#5843             //
//                                                           //
//     Work for Zen Developments | https://zen-dev.xyz       //
//                                                           //
//                    All Right Reserved!                    //
//                                                           //
// ================< ==================== >================= //
*/
