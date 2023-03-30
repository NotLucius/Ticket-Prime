const Discord = require("discord.js");
const client = require("../../index.js");

const cooldowns = new Map();
const prefix = client.config.env.prefix;

client.on("messageCreate", async (message) => {
  if (message.author.bot) return;
  if (!message.guild) return;

  if (!message.content.startsWith(prefix)) return;

  const args = message.content.slice(prefix.length).trim().split(/ +/g);
  const cmd = args.shift().toLowerCase();
  if (cmd.length == 0) return;
  let command = client.commands.get(cmd);
  if (!command) return;

  if (!cooldowns.has(command.name)) {
    cooldowns.set(command.name, new Discord.Collection());
  }

  const current_time = Date.now();
  const time_stamps = cooldowns.get(command.name);
  const cooldown_amount = command.cooldown * 1000;

  if (time_stamps.has(message.author.id)) {
    const expiration_time =
      time_stamps.get(message.author.id) + cooldown_amount;

    if (current_time < expiration_time) {
      const time_left = (expiration_time - current_time) / 1000;
      const cooldownEmbed = new Discord.MessageEmbed()
        .setDescription(
          `**Please wait ${time_left.toFixed(
            0
          )} second(s) before using the command ${command.name} again.**`
        )
        .setColor("#2f3136");
      return message.reply({ embeds: [cooldownEmbed] });
    }
  }

  //If the author's id is not in time_stamps then add them with the current time.
  time_stamps.set(message.author.id, current_time);
  //Delete the user's id once the cooldown is over.
  setTimeout(() => time_stamps.delete(message.author.id), cooldown_amount);

  if (command) command.run(client, message, Discord, args);
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