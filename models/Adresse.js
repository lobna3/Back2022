const mongoose = require('mongoose');
const {Schema} = require('mongoose');
const Client = require('./Client');

const adresseSchema = new Schema({
  
    adresse: {
        type: String,
        required: true
    },
    codePostal: {
        type: String,
        required: false
    },

    etat: {
        type: String,
        required: false
    },
    pays : {
        type: String,
        required: false
    },
  
    client: {type: Schema.Types.ObjectId, ref: Client,required: true},
   
},{timestamps: true});

module.exports =  mongoose.model('Adresee',adresseSchema)