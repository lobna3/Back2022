const mongoose = require("mongoose");
const Schema = mongoose.Schema;
const Utilisateur = require('./Utilisateur');

const UserProfile = new Schema(
  {
    user: {
      type: Schema.Types.ObjectId,
      ref: Utilisateur,
      required: true
    },
  
    city: "string",
    country: "string",
    postalcode: "string",
    bio: "string",
    address: "string",
  },
  {
    timestamps: true,
  }
);

module.exports = mongoose.model("profiles", UserProfile);