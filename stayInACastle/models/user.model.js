const mongoose = require("mongoose");
const { Schema, model } = mongoose;

const userSchema = new Schema(
    {
      username: String,
      password: String,
      favorites: [{ type: Schema.Types.ObjectId, ref: 'Castle' }]
    },
    {
      timestamps: true,
    }
  );
  
  module.exports = model("User", userSchema);