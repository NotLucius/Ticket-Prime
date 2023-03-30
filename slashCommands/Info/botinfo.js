const { Client, CommandInteraction, MessageEmbed } = require("discord.js");

module.exports = {
  name: "botinfo",
  description: "Gathers the bot's information",
  type: "bot",

  /**
   *
   * @param {Client} client
   * @param {CommandInteraction} interaction
   * @param {String[]} args
   * @returns
   */
  run: async (client, interaction, args) => {
    const version = "v1.10.1";

    embeds = [];
    let totalguilds;

    let date = new Date();
    let timestamp = date.getTime() - Math.floor(client.uptime);

    const data = await client.cluster.broadcastEval((c) => {
      let date = new Date();
      let timestamp = date.getTime() - Math.floor(c.uptime);
      return {
        guilds: c.guilds.cache.size,
        members: c.guilds.cache
          .map((g) => g.memberCount)
          .reduce((a, b) => a + b, 0),
        cluster: c.cluster.id,
        shards: c.cluster.ids.map((d) => `#${d.id}`).join(", "),
        uptime: timestamp,
        ping: c.ws.ping,
        ram: (process.memoryUsage().heapUsed / 1024 / 1024).toFixed(0),
      };
    });

    const shardField = data.map((d) => {
      const { cluster, shards, guilds, members, ping, uptime } = d;
      let ifGuild;

      if (cluster == client.cluster.id) {
        ifGuild = `\n> **__This Guild__**`;
      } else {
        ifGuild = "\n> **__Not This Guild__**";
      }

      return {
        name: `\`Cluster #${cluster}\` (<t:${Math.floor(
          uptime / 1000
        )}:R>) ${ifGuild}`,
        value: `\`\`\`yml\nCluster: #${cluster}\nShards: ${shards}\nGuilds: ${guilds}\nMembers: ${members}\nPing: ${Math.round(
          ping
        )} ms\n\`\`\``,
        inline: true,
      };
    });

    const embed = new MessageEmbed()
      .setAuthor({
        name: `Bot Information of: ${client.user.tag}`,
        iconURL: client.user.displayAvatarURL(),
      })
      .addFields({
        name: `**Developer**`,
        value: `\`\`\`yml\nDeveloper: benzmeister#0001\nServer: discord.supremedev.xyz\nBot-Version: ${version}\n\`\`\``,
      })
      .addFields(shardField)
      .setThumbnail(interaction.guild.iconURL())
      .setColor(client.config.color.main)
      .setFooter({
        text: `Bot Information`,
        iconURL: interaction.guild.iconURL(),
      });

    return interaction.reply({ embeds: [embed] });
  },
};
