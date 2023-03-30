const { model, Schema } = require("mongoose");

const sch = new Schema({
  Guild: String,
  Channel: String,
  Opener: String,
  Claimer: String,
  System: String,
  Date: String,
  Type: String,
});

module.exports = model("ticket_open", sch);
