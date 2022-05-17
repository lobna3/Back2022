const mongoose = require('mongoose');
const {Schema} = require('mongoose');

const utilisateurSchema = new Schema({
  
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
    password : {
        type: String,
        required: true
    },
    numTelp : {
        type: String,
        required: true
    },
    role: {
        type: String,
        required: true
    } 
 
}, {timestamps: true});

module.exports  =  mongoose.model('Utilisateur',utilisateurSchema)