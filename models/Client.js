const mongoose = require('mongoose');
const {Schema} = require('mongoose');
const Utilisateur = require('./Utilisateur');

const clientSchema =  new Schema({
    titre: {
        type: String,
        required: true
    },
    nom : {
        type: String,
        required: true
    },
    prenom : {
        type: String,
        required: true
    },

    email: {
        type: String,
        required: true
    },
    entreprise: {
        type: String,
        required: false
    },
    telephone : {
        type: String,
        required: false
    },
    siteinternet: {
        type: String,
        required: false
    },
    type: {
        type: String,
        required: true
    },
    nidentificationFiscale: {
        type: String,
        required: false
    }, 
    devis: {
        type: String,
        required: false
    }, 
    activite: {
        type: String,
        required: false
    },
    conditionPaiement: {
        type: String,
        required: false
    },
     
     utilisateur: {type: Schema.Types.ObjectId, ref: Utilisateur,required: true},
}, {timestamps: true}
); 
module.exports =  mongoose.model('Client',clientSchema)
