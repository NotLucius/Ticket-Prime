const {
  CommandInteraction,
  MessageEmbed,
  MessageActionRow,
  MessageButton,
} = require("discord.js");
const client = require("../../index");
const User = require("../../Models/premium-user");

client.on("interactionCreate", async (interaction) => {
  // ======================< Slash Command Handling >====================== \\
  if (!interaction.isCommand()) return;

  //await interaction.deferReply({ ephemeral: false }).catch(() => {});

  if (!client.commands.get(interaction.commandName)) return;
  interaction.selectedValue = interaction.options._hoistedOptions[0]
    ? interaction.options._hoistedOptions[0].value
    : undefined;
  const command = client.commands.get(interaction.commandName);
  //command.run(client, interaction);

  if (command.developer && interaction.user.id !== "928640467619434526") {
    return interaction.reply({
      content: `${client.config.emoji.wrong} *You cannot use this command!*`,
      ephemeral: true,
    });
  }

  if (command.admin && !interaction.member.permissions.has("ADMINISTRATOR")) {
    return interaction.reply({
      content: `${client.config.emoji.wrong} *You cannot use this command*`,
      ephemeral: true,
    });
  }

    command.run(client, interaction);
});

/**
// ================< ==================== >================= //
//                                                           //
//            Handlers Coded by benzmeister#5843             //
//                                                           //
//                  Work for Omega Studios™                  //
//                                                           //
//                    All Right Reserved!                    //
//                                                           //
// ================< ==================== >================= //
*/
