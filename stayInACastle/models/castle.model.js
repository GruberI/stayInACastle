const mongoose = require("mongoose");
const { Schema, model } = mongoose;

const castleSchema = new Schema(
    {
      name: String,
      address: String,
      image: String, //?ask lloyd
      link: String
    },
    {
      timestamps: true,
    }
  );
  
  module.exports = model("Castle", castleSchema);