const {
  MessageEmbed,
  Collection,
  MessageButton,
  MessageActionRow,
} = require("discord.js");
const discordTranscripts = require("discord-html-transcripts");
const client = require("../../index.js");
const dayjs = require("dayjs");
const cooldowns = new Map();

const db1 = require("../../Models/ticket");
const db2 = require("../../Models/ticket-claim");
const db3 = require("../../Models/ticket-log");
const db = require("../../Models/ticket-open");

const wait = require("util").promisify(setTimeout);

let logs;

console.log(`✅ [ LOADED TICKET CREATE SYSTEM] `.green.bold);
client.on("interactionCreate", async (interaction) => {
  if (interaction.isCommand()) return;
  let systemnum = interaction.customId;
  let s = systemnum.match(/\d/g);
  if (s == null) return;
  s = s.join("");

  function msToTime(duration) {
    var milliseconds = parseInt((duration % 500) / 100),
      seconds = Math.floor((duration / 500) % 60),
      minutes = Math.floor((duration / (500 * 60)) % 60),
      hours = Math.floor((duration / (500 * 60 * 60)) % 24);

    hours = hours < 10 ? "0" + hours : hours;
    minutes = minutes < 10 ? "0" + minutes : minutes;
    seconds = seconds < 10 ? "0" + seconds : seconds;

    return seconds + "s";
  }

  if (!cooldowns.has(`ticket_usage`)) {
    cooldowns.set(`ticket_usage`, new Collection());
  }
  let currentDate = Date.now();
  let userCooldowns = cooldowns.get(`ticket_usage`);
  let cooldownAmount = 2000;

  db3.findOne(
    {
      Guild: interaction.guild.id,
      System: s,
    },
    async (err, data) => {
      if (!data) return;
      logs = data.Logging || null;
    }
  );

  if (interaction.customId == `create_ticket${s}`) {
    if (userCooldowns.has(interaction.user.id)) {
      let expirationDate =
        userCooldowns.get(interaction.user.id) + cooldownAmount;
      if (currentDate < expirationDate) {
        let timeLeft = Math.round(expirationDate - currentDate);
        return interaction.reply({
          content: `${
            client.config.emoji.wrong
          } *Not too fast, please wait **${msToTime(
            timeLeft.toString()
          )}** before interacting!*`,
          ephemeral: true,
        });
      } else {
        userCooldowns.set(interaction.user.id, currentDate);
      }
    } else {
      userCooldowns.set(interaction.user.id, currentDate);
    }
    opener = interaction.user.id;
    let x = dayjs(new Date()).unix();
    db1.findOne(
      {
        Guild: interaction.guild.id,
        System: s,
      },
      async (err, data) => {
        if (!data) return;

        interaction.reply({
          content: `${client.config.emoji.loading} *Creating your ticket...*`,
          ephemeral: true,
        });

        interaction.guild.channels
          .create(`${data.Style}${interaction.user.username}`, {
            permissionOverwrites: [
              {
                id: interaction.user.id,
                allow: ["SEND_MESSAGES", "VIEW_CHANNEL"],
              },
              {
                id: data.Admin,
                allow: ["SEND_MESSAGES", "VIEW_CHANNEL"],
              },
              {
                id: interaction.guild.roles.everyone,
                deny: ["VIEW_CHANNEL"],
              },
            ],
            type: "text",
            parent: data.Category,
            topic: `📨 Ticket for: ${interaction.user.tag} / (${interaction.user.id}), Ticket Type: ${data.Type}`,
          })
          .catch(async (e) => {
            console.log(e);
            return interaction.editReply({
              content: `${client.config.emoji.wrong} **An Error Occured While Creating Your Ticket!**\n> \`\`\`${e}\`\`\``,
              ephemeral: true,
            });
          })
          .then(async function (channel) {
            db.findOne(
              {
                Guild: interaction.guild.id,
                Opener: interaction.user.id,
                Type: data.Type,
              },
              async (err, data_) => {
                if (data_) {
                  const check = await interaction.guild.channels.cache.get(
                    data_.Channel
                  );
                  if (!check) {
                    data_.delete();
                    interaction.editReply({
                      content: `${client.config.emoji.wrong} Seems your channel was deleted manually... *clearing your Database*\n _Click the button again to open your ticket_`,
                      ephemeral: true,
                    });
                  } else {
                    interaction.editReply({
                      content: `${client.config.emoji.wrong} *You already have a Ticket opened at <#${data_.Channel}>!*`,
                      ephemeral: true,
                    });
                  }
                  channel.delete();
                } else {
                  db1.findOne(
                    {
                      Guild: interaction.guild.id,
                      System: s,
                    },
                    async (err, data_1) => {
                      if (!data_1) return;
                      interaction.editReply({
                        content: `${client.config.emoji.right} **Successfuly created your ticket in <#${channel.id}>**`,
                        ephemeral: true,
                      });

                      const embed = new MessageEmbed()
                        .setColor(client.config.color.main)
                        .setAuthor({
                          name: `Ticket created for: ${interaction.user.tag}`,
                          iconURL: interaction.user.displayAvatarURL(),
                        })
                        .setDescription(`${data.OpenMsg}`)
                        .addFields({
                          name: `Ticket type:`,
                          value: `> **${data.Type}**`,
                        })
                        .setFooter({
                          text: `TicketManager.gq - Ticketing without clutter`,
                          iconURL: client.user.displayAvatarURL(),
                        });

                      const row = new MessageActionRow().addComponents([
                        new MessageButton()
                          .setLabel(`Delete`)
                          .setStyle(`DANGER`)
                          .setCustomId(`tc_close${s}`),
                      ]);

                      channel.send({
                        content: `:wave: <@${interaction.user.id}> | <@&${data.Admin}>`,
                        embeds: [embed],
                        components: [row],
                      });

                      new db({
                        Guild: interaction.guild.id,
                        Opener: interaction.user.id,
                        Channel: channel.id,
                        Date: `<t:${x}:R>`,
                        System: s,
                        Type: data.Type || `General`,
                      }).save();
                    }
                  );
                }
              }
            );
          });
      }
    );
  }
  if (interaction.customId == `tc_close${s}`) {
    if (userCooldowns.has(interaction.user.id)) {
      let expirationDate =
        userCooldowns.get(interaction.user.id) + cooldownAmount;
      if (currentDate < expirationDate) {
        let timeLeft = Math.round(expirationDate - currentDate);
        return interaction.reply({
          content: `${
            client.config.emoji.wrong
          } *Not too fast, please wait **${msToTime(
            timeLeft.toString()
          )}** before interacting!*`,
          ephemeral: true,
        });
      } else {
        userCooldowns.set(interaction.user.id, currentDate);
      }
    } else {
      userCooldowns.set(interaction.user.id, currentDate);
    }
    db.findOne(
      {
        Guild: interaction.guild.id,
        Channel: interaction.channel.id,
        System: s,
      },
      async (err, data_) => {
        if (!data_)
          return interaction.reply({
            content: `${client.config.emoji.wrong} *I cant find this ticket in Database! Please contact the developers!*`,
            ephemeral: true,
          });
        const opener = await client.users.cache.get(data_.Opener);

        db1.findOne(
          {
            Guild: interaction.guild.id,
            System: s,
          },
          async (err, data) => {
            if (!data) return;

            if (!interaction.member.roles.cache.has(data.Admin))
              return interaction.reply({
                content: `${client.config.emoji.wrong} *You need the <@&${data.Admin}> role to manage this ticket!*`,
                ephemeral: true,
              });

            const row = new MessageActionRow().addComponents(
              new MessageButton()
                .setCustomId(`delete-ticket${s}`)
                .setLabel("Close")
                .setStyle("DANGER"),
              new MessageButton()
                .setCustomId(`cancel-delete${s}`)
                .setLabel("Cancel")
                .setStyle("SECONDARY")
            );

            const areyousure = new MessageEmbed()
              .setDescription(
                "```Are you sure you want to close the ticket?```"
              )
              .setColor(client.config.color.main);
            await interaction.reply({
              embeds: [areyousure],
              components: [row],
            });

            if (interaction.member.roles.cache.has(data.Admin)) {
              interaction.channel.permissionOverwrites.edit(opener, {
                SEND_MESSAGES: false,
                VIEW_CHANNEL: false,
                ATTACH_FILES: false,
                READ_MESSAGE_HISTORY: false,
              });
            }

            const collector =
              interaction.channel.createMessageComponentCollector({
                componentType: "BUTTON",
                time: 10000,
              });

            collector.on("collect", async (i) => {
              if (i.customId == `cancel-delete${s}`) {
                const abortembed = new MessageEmbed()
                  .setDescription("```Aborting Closure!```")
                  .setColor(client.config.color.red);
                interaction.editReply({
                  embeds: [abortembed],
                  components: [],
                });
                collector.stop();
              }

              collector.on("end", (i) => {
                if (i.size < 1) {
                  interaction.editReply({
                    content: "Aborting closure!",
                    components: [],
                  });
                }
              });
            });
          }
        );
      }
    );
  }
  if (interaction.customId == `delete-ticket${s}`) {
    if (userCooldowns.has(interaction.user.id)) {
      let expirationDate =
        userCooldowns.get(interaction.user.id) + cooldownAmount;
      if (currentDate < expirationDate) {
        let timeLeft = Math.round(expirationDate - currentDate);
        return interaction.reply({
          content: `${
            client.config.emoji.wrong
          } *Not too fast, please wait **${msToTime(
            timeLeft.toString()
          )}** before interacting!*`,
          ephemeral: true,
        });
      } else {
        userCooldowns.set(interaction.user.id, currentDate);
      }
    } else {
      userCooldowns.set(interaction.user.id, currentDate);
    }
    db.findOne(
      {
        Guild: interaction.guild.id,
        Channel: interaction.channel.id,
        System: s,
      },
      async (err, data_) => {
        if (!data_)
          return interaction.reply({
            content: `${client.config.emoji.wrong} *I cant find this ticket in Database! Please contact the developers!*`,
            ephemeral: true,
          });
        const opener = await client.users.cache.get(data_.Opener);

        db1.findOne(
          {
            Guild: interaction.guild.id,
            System: s,
          },
          async (err, data) => {
            if (!data) return;

            if (!interaction.member.roles.cache.has(data.Admin))
              return interaction.reply({
                content: `${client.config.emoji.wrong} *You need the <@&${data.Admin}> role to manage this ticket!*`,
                ephemeral: true,
              });

            db2.findOne({
              Guild: interaction.guild.id,
              Channel: interaction.channel.id,
              Claimer: interaction.user.id,
            });

            const f = await discordTranscripts.createTranscript(
              interaction.channel,
              {
                returnType: "attachment", // Valid options: 'buffer' | 'string' | 'attachment' Default: 'attachment'
                fileName: `ticket-transcript.html`, // Only valid with returnBuffer false. Name of attachment.
              }
            );

            const embed_user = new MessageEmbed()
              .setColor(client.config.color.main)
              .setAuthor({ name: `Ticket Closed` })
              .addFields({
                name: `${client.config.emoji.openedicon} Opened Time:`,
                value: `${data_.Date}`,
              })
              .addFields({
                name: `${client.config.emoji.openedby} Opened By:`,
                value: `${opener}`,
              })
              .addFields({
                name: `${client.config.emoji.closedby} Closed By:`,
                value: `${interaction.user}`,
              })
              .addFields({
                name: `${client.config.emoji.claimicon} Claimer:`,
                value: `${data.Claimer || `None`}`,
              })
              .addFields({
                name: `${client.config.emoji.tickettype} Ticket Type:`,
                value: `${data.Type}`,
              })
              .setFooter({
                text: `TicketManager.gq - Ticketing without clutter`,
                iconURL: client.user.displayAvatarURL(),
              });

            opener
              .send({
                embeds: [embed_user],
                files: [f],
              })
              .catch((e) => {});

            const embed = new MessageEmbed()
              .setColor(client.config.color.main)
              .setDescription(
                `\`\`\`Deleting the ticket in 5 seconds...\`\`\``
              );

            await interaction.reply({
              embeds: [embed],
            });

            data_.delete();

            await wait(3000);
            interaction.channel.delete();

            if (logs) {
              const ch = await interaction.guild.channels.cache.get(logs);
              if (!ch) return;
              ch.send({
                embeds: [embed_user],
                files: [f],
              });
            }
          }
        );
      }
    );
  }
});
