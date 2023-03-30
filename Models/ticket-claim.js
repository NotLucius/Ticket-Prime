const { model, Schema } = require("mongoose");

const sch = new Schema({
  Guild: String,
  Channel: String,
  Opener: String,
  Claimer: String,
  System: String,
  Date: String,
});

module.exports = model("ticket_claim", sch);
