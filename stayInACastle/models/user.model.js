const mongoose = require("mongoose");
const { Schema, model } = mongoose;

const userSchema = new Schema(
    {
      email: String,
      passwordHash: String,
    },
    {
      timestamps: true,
    }
  );
  
  module.exports = model("User", userSchema);