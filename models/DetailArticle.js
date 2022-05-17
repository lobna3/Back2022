const mongoose = require('mongoose');
const {Schema} = require('mongoose');
const Commande = require('./Commande');
const ProduitService= require('./ProduitService');


const detailArticleSchema = new Schema({
    qte: {
        type: String,
        required: true
    },
    pu : {
        type: String,
        required: true
    },
    taxe: {
        type: String,
        required: true
    },

    prix: {
        type: String,
        required: true
    },
 
    commande: { type: Schema.Types.ObjectId, ref: Commande, required: true},
    service: { type: Schema.Types.ObjectId, ref: ProduitService, required: true},
  
    
}, {timestamps: true}
); 
module.exports =  mongoose.model('DetailArticle',detailArticleSchema)