const mongoose = require("mongoose");
const { Schema, model } = mongoose;

const userSchema = new Schema(
    {
      username: {type: String, required: true, unique: true },
      password: {type: String, required: true },
      role: {
        type: String,
        enum: ['GUEST', 'ADMIN'],
        default: 'GUEST'
      },
      favorites: [{ type: Schema.Types.ObjectId, ref: 'Castle' }]
    },
    {
      timestamps: true,
    }
  );
  
  module.exports = model("User", userSchema);
