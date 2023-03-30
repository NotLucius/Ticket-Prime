const { Client, Collection } = require("discord.js");
const chalk = require("chalk");
const colors = require("colors");
const Cluster = require("discord-hybrid-sharding");
const client = new Client({
  shards: Cluster.data.SHARD_LIST,
  shardCount: Cluster.data.TOTAL_SHARDS,
  intents: 32767,
});
module.exports = client;

// =================< Global Variables >================= //

client.commands = new Collection();
client.events = new Collection();
client.slashCommands = new Collection();
const fs = require(`fs`);
client.config = require("./config.json");
client.cluster = new Cluster.Client(client);
global.config = require("./config.json");
client.userSettings = new Collection();

// =================< Initializing The Project >================= //

require("./Handler")(client);
require("./Handler/slashCommands")(client);

// =====================< LOGIN >===================== //

client.login(process.env.token || client.config.token);

// =================< Anti-Crash System >================= //
process.on("unhandledRejection", (reason, p) => {
  console.log(
    "\n\n\n\n\n[ Anti-Crash ] unhandled Rejection:".toUpperCase().red.dim
  );
  console.log(
    reason.stack.yellow.dim ? String(reason.stack).yellow.dim : String(reason).yellow.dim
  );
  console.log("=== unhandled Rejection ===\n\n\n\n\n".toUpperCase().red.dim);
});
process.on("uncaughtException", (err, origin) => {
  console.log(
    "\n\n\n\n\n\n[ Anti-Crash ] uncaught Exception".toUpperCase().red.dim
  );
  console.log(err.stack.yellow.dim ? err.stack.yellow.dim : err.yellow.dim);
  console.log("=== uncaught Exception ===\n\n\n\n\n".toUpperCase().red.dim);
});
process.on("uncaughtExceptionMonitor", (err, origin) => {
  console.log("[ Anti-Crash] uncaught Exception Monitor".toUpperCase().red.dim);
});
process.on("beforeExit", (code) => {
  console.log("\n\n\n\n\n[ Anti-Crash ] before Exit".toUpperCase().red.dim);
  console.log(code.yellow.dim);
  console.log("=== before Exit ===\n\n\n\n\n".toUpperCase().red.dim);
});
process.on("exit", (code) => {
  console.log("\n\n\n\n\n[ Anti-Crash ] exit".toUpperCase().red.dim);
  console.log(code.yellow.dim);
  console.log("=== exit ===\n\n\n\n\n".toUpperCase().red.dim);
});
process.on("multipleResolves", (type, promise, reason) => {
  console.log(
    "\n\n\n\n\n[ Anti-Crash ] multiple Resolves".toUpperCase().red.dim
  );
  console.log(type, promise, reason.yellow.dim);
  console.log("=== multiple Resolves ===\n\n\n\n\n".toUpperCase().red.dim);
});
