const mongoose = require('mongoose');
const {Schema} = require('mongoose');
const Commande = require('./Commande');

const suivieSchema = new Schema({
    typeS: {
        type: String,
        required: true
    },
  
    titreS: {
        type: String,
        required: true
    },
    descriptionS : {
        type: String,
       // required: true
    },
     commande : { type: Schema.Types.ObjectId, ref: Commande,required: true } , 
}, {timestamps: true});

module.exports = mongoose.model('Suivie',suivieSchema)