const mongoose = require('mongoose');
const {Schema} = require('mongoose');
const Commande = require('./Commande');

const paiementSchema = new Schema({
  
    soldeP : {
        type: String,
        required: false
    },
    typePaiement : {
        type: String,
        required: false
    },

    regPaiement: {
        type: String,
        required: false
    },
    etatP : {
        type: String,
        required: false
    },
    reste : {
        type: String,
        required: false
    },
    avance : {
        type: String,
        required: false
    },
    mis : {
        type: String,
        required: false
    },
    nCarte: {
        type: String,
        required: false
    },
    ccv : {
        type: String,
        required: false
    },
    dateP : {
        type: String,
        required: false
    },
    montantP : {
        type: String,
        required: false
    },
     commande: { type: Schema.Types.ObjectId, ref: Commande, required: true},
      
},{timestamps: true});

module.exports =mongoose.model('Paiement',paiementSchema)