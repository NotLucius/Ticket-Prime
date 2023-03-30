const client = require("../../index");
const { MessageEmbed, MessageActionRow, MessageButton } = require("discord.js");

client.on("messageCreate", async (message) => {
  if (
    message.content == `<@${client.user.id}>` ||
    message.content == `<@!${client.user.id}>`
  ) {
    const embedbutton = new MessageActionRow().addComponents(
      new MessageButton()
        .setLabel(`Invite Me`)
        .setURL(
          `https://discord.com/api/oauth2/authorize?client_id=${client.user.id}&permissions=8&scope=bot%20applications.commands`
        )
        .setStyle("LINK"),

      new MessageButton()
        .setLabel(`Support Server`)
        .setURL(`https://discord.gg/ZrNzZYc7Dv`)
        .setStyle("LINK")
    );
    const embed = new MessageEmbed()
      .setColor(client.config.color.main)
      .setTitle(
        `*Hey ${message.author.username}, I'm ${client.user.username} to get started type \`/help\`, I also have message commands. My prefix is \`${client.config.env.prefix}\`*`
      );
    return message.reply({ embeds: [embed], components: [embedbutton] });
  }
});
