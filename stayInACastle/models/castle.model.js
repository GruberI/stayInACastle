const mongoose = require("mongoose");
const { Schema, model } = mongoose;

const castleSchema = new Schema(
    {
      name: String,
      country: String,
      address: String,
      image: String,
      capacity: Number,
      link: String,
      description: String,
      pun: String,
      lat: Number,
      lng: Number
    },
    {
      timestamps: true,
    }
  );
  
  module.exports = model("Castle", castleSchema);