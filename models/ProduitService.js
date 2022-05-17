const mongoose = require('mongoose');
const {Schema} = require('mongoose');


const produitServiceSchema = new Schema({
  
    titre : {
        type: String,
        required: true
    },
    prix : {
        type: String,
        required: true
    },

    description: {
        type: String,
        required: true
    },

});


module.exports =  mongoose.model('ProduitService',produitServiceSchema)