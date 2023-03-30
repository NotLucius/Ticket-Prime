const { model, Schema } = require("mongoose");

const sch = new Schema({
  Guild: String,
  Channel: String,
  Style: String,
  Opener: String,
  Type: String,
  Category: String,
  Claimer: String,
  System: String,
  Admin: String,
  OpenMsg: String,
  Type: String,
});

module.exports = model("ticket", sch);
