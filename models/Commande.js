const mongoose = require("mongoose");
const { Schema } = require("mongoose");
const Client = require("./Client");

const commandeSchema = new Schema({
  dateEmission: {
    type: Date,
    required: true,
    default: Date.now,
  },
  dateEcheance: {
    type: Date,
    required: true,
    default: Date.now,
  },

  condition: {
    type: String,
    required: true,
  },
  nFacture: {
    type: String,
    required: true,
  },
  nReference: {
    type: String,
    required: true,
  },
  total: {
    type: String,
    required: true,
  },
  taxes: {
    type: String,
    required: true,
  },
  remise: {
    type: String,
    required: true,
  },
  totalTtc: {
    type: String,
    required: true,
  },
  paye: {
    type: String,
    required: true,
  },
  solde: {
    type: String,
    required: true,
  },
  note: {
    type: String,
    required: false,
  },
  remarque: {
    type: String,
    required: false,
  },

  recurrente: {
    type: String,
    required: false,
  },
  status: {
    type: String,
    required: false,
  },
  etat: {
    type: String,
    required: false,
  },
  adresseFacturation: {
    type: String,
    required: false,
  },
  adresseLivraison: {
    type: String,
    required: false,
  },
  client: { type: Schema.Types.ObjectId, ref: Client, required: true },
  documentUrl: {
    type: String,
    required: false,
    default: "",
  },
});

module.exports = mongoose.model("Commande", commandeSchema);
