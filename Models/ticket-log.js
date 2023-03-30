const { model, Schema } = require("mongoose");

const sch = new Schema({
  Guild: String,
  Channel: String,
  Type: String,
  Opener: String,
  Category: String,
  Claimer: String,
  System: String,
  Admin: String,
  OpenMsg: String,
  Logging: String,
});

module.exports = model("ticket_log", sch);
