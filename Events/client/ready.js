const Discord = require("discord.js");
const moment = require("moment");
const client = require("../../index");

client.on("ready", () => {
  console.table({
    "BOT USER": `${client.user.tag}`,
    "GUILD(S)": `${client.guilds.cache.size} Servers`,
    USERS: `${client.guilds.cache.reduce(
      (a, b) => a + b?.memberCount,
      0
    )} Members`,
    PREFIX: `${config.prefix}`,
    COMMANDS: `${client.commands.size}`,
    "DISCORD.JS": `v${Discord.version}`,
    "NODE.JS": `${process.version}`,
    PLATFORM: `${process.platform} ${process.arch}`,
    MEMORY: `${(process.memoryUsage().heapUsed / 1024 / 1024).toFixed(
      2
    )} MB / ${(process.memoryUsage().rss / 1024 / 1024).toFixed(2)} MB`,
  });
  console.log("\n");
  console.log(`✅ [ ${client.user.username} IS NOW ONLINE ]`);
  const stringlength = 69;
  console.log("\n");
  console.log(
    `                                                  ┏━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━┓`
      .bold.cyan
  );
  console.log(
    `                                                  ┃ `.bold.cyan +
      " ".repeat(-1 + stringlength - ` ┃ `.length) +
      "┃".bold.cyan
  );
  console.log(
    `                                                  ┃ `.bold.cyan +
      `POWERED BY:`.bold.cyan +
      " ".repeat(-1 + stringlength - ` ┃ `.length - `POWERED BY:`.length) +
      "┃".bold.cyan
  );
  console.log(
    `                                                  ┃ `.bold.cyan +
      ` / ⊗ / https://discord.supremedev.xyz / ⊗ / `.bold.cyan +
      " ".repeat(
        -1 +
          stringlength -
          ` ┃ `.length -
          ` / ⊗ / https://discord.supremedev.xyz / ⊗ / `.length
      ) +
      "┃".bold.cyan
  );
  console.log(
    `                                                  ┃ `.bold.cyan +
      " ".repeat(-1 + stringlength - ` ┃ `.length) +
      "┃".bold.cyan
  );
  console.log(
    `                                                  ┗━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━┛`
      .bold.cyan
  );

  client.user.setActivity(`/help | on ${client.guilds.cache.size} servers`, {
    type: "PLAYING",
  });
  client.user.setStatus(client.config.env.status);
});
