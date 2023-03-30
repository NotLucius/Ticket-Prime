const client = require("../../index.js");
const moment = require("moment");

client.on("rateLimit", (info) => {
  console.log(
    `[` +
      ` 🟥 `.red.bold +
      `]` +
      `${` |`.white.bold}` +
      `${` [ ${moment().format("dddd")} ]`.yellow.bold}${` |`.white.bold}${
        ` [ ${moment().format("DD-MM-YYYY HH:mm:ss")} ]`.blue.bold
      }${` -`} [ RATE LIMIT ] -`.green +
      ` [` +
      `>>`.magenta +
      `]` +
      ` ${
        info.timeDifference
          ? info.timeDifference
          : info.timeout
          ? info.timeout
          : "Unknown timeout"
      }`
  );
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