const cf = require("cfonts");
const Cluster = require("discord-hybrid-sharding");
const moment = require("moment");
const { Manager } = require("discord-hybrid-sharding");
const totalShards = "auto";
const colors = require("colors");
const shardsPerCluster = 2;
const config = require(`./config.json`);
const manager = new Cluster.Manager(`./index.js`, {
  totalShards: totalShards, // Use 'auto' if u want it to be Auto.
  shardsPerClusters: shardsPerCluster,
  mode: "process",
  token: process.env.token || config.env.token,
  respawn: true,
  usev13: true,
});

manager.on("clusterCreate", (cluster) => {
  const b = cf.render(`Ticket Prime`, {
    font: "block",
    color: "white",
    align: "center",
    lineHeight: 1,
  });
  console.log(b.string);
  console.log(
    `[ CREDITS ]: Made by Omega Studios™ | https://supremedev.xyz`
  );
  console.log("\n");

  console.log(
    `[` +
      ` 🟩 `.green.bold +
      `]` +
      `${` |`.white.bold}` +
      `${` [ ${moment().format("dddd")} ]`.yellow.bold}${` |`.white.bold}${
        ` [ ${moment().format("DD-MM-YYYY HH:mm:ss")} ]`.blue.bold
      }${` -`} [ SHARDING-MANAGER ]`.green
  );
  console.log(
    `[` +
      ` 🟩 `.green.bold +
      `]` +
      `${` |`.white.bold}` +
      `${` [ ${moment().format("dddd")} ]`.yellow.bold}${` |`.white.bold}${
        ` [ ${moment().format("DD-MM-YYYY HH:mm:ss")} ]`.blue.bold
      }${` -`.white.bold} [ LAUNCHED CLUSTER ${cluster.id} ] | [ ${
        cluster.id + 1
      }/${cluster.manager.totalClusters} ] | [ ${
        cluster.manager.shardsPerClusters
      }/${cluster.manager.totalShards} Shards ]`.green
  );

  cluster.on("death", function () {
    console.log(
      `[` +
        ` 🟥 `.red.bold +
        `]` +
        `${`[ ${moment().format("dddd")} ]`.yellow.bold}${` |`.white.bold}${
          ` [ ${moment().format("DD-MM-YYYY HH:mm:ss")} ]`.blue.bold
        }${` -`} [ CLUSTER #${cluster.id} DIED ]`.red.bold
    );
  });

  cluster.on("message", async (msg) => {
    if (!msg._sCustom) return;
    if (msg.dm) {
      const { interaction, message, dm, packet } = msg;
      await manager.broadcast({ interaction, message, dm, packet });
    }
  });
  cluster.on("error", (e) => {
    console.log(
      `[` +
        ` 🟥 `.red.bold +
        `]` +
        `${`[ ${moment().format("dddd")} ]`.yellow.bold}${` |`.white.bold}${
          ` [ ${moment().format("DD-MM-YYYY HH:mm:ss")} ]`.blue.bold
        }${` -`} [ CLUSTER #${cluster.id} ERROR ]`.red.bold
    );
    console.error(e);
  });

  cluster.on("disconnect", function () {
    console.log(
      `[` +
        ` 🟥 `.red.bold +
        `]` +
        `${`[ ${moment().format("dddd")} ]`.yellow.bold}${` |`.white.bold}${
          ` [ ${moment().format("DD-MM-YYYY HH:mm:ss")} ]`.blue.bold
        }${` -`} [ CLUSTER #${cluster.id} DISONNECTED ]`.red.bold
    );
  });

  cluster.on("reconnecting", function () {
    console.log(
      `[` +
        ` 🟥 `.red.bold +
        `]` +
        `${`[ ${moment().format("dddd")} ]`.yellow.bold}${` |`.white.bold}${
          ` [ ${moment().format("DD-MM-YYYY HH:mm:ss")} ]`.blue.bold
        }${` -`} [ CLUSTER #${cluster.id} RECONNECTING ]`.red.bold
    );
  });

  cluster.on("close", function (code) {
    console.log(
      `[` +
        ` 🟥 `.red.bold +
        `]` +
        `${`[ ${moment().format("dddd")} ]`.yellow.bold}${` |`.white.bold}${
          ` [ ${moment().format("DD-MM-YYYY HH:mm:ss")} ]`.blue.bold
        }${` -`} [ CLUSTER #${cluster.id} CLOSED ]`.red.bold
    );
  });

  cluster.on("exit", function (code) {
    console.log(
      `[` +
        ` 🟥 `.red.bold +
        `]` +
        `${`[ ${moment().format("dddd")} ]`.yellow.bold}${` |`.white.bold}${
          ` [ ${moment().format("DD-MM-YYYY HH:mm:ss")} ]`.blue.bold
        }${` -`} [ CLUSTER #${cluster.id} EXITED ]`.red.bold
    );
  });
});
manager.on("debug", (d) =>
  d.includes(`[` + ` 🟩 `.green.bold + `]` + "[ CLUSTER MANAGER (LIST): ]")
    ? console.log(d)
    : ""
);
manager.spawn({ timeout: -1 });
