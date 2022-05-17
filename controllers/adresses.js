const Adresse = require("../models/Adresse");


// CRUD Adresse
const getAdresses = async (req, res) => {
    try {
        var result= await Adresse.find({}).populate('client')
        res.send(result)
    }
    catch (err) {
        res.status(405).send({});
    }
};

const adresseById = async (req, res)=>{
    try
    {   const { id } = req.params;
        const result = await Adresse.findById(id).populate('client');
        res.send(result);
    }
     catch(err){
         res.status(405).send({});
     }
   
     
};

const ajouterAdresse = async (req, res) => {
    try {
      
        const new_adresse = new Adresse(req.body);
        await new_adresse.save();
        res.status(200).json({ success: true, data: new_adresse }); 
    }
    catch (err) {
        res.end();
        console.log(err);
    }

};

const supprimerAdresse = async (req, res) => {
    try {
        await Adresse.deleteOne({ _id: req.params.id })
        res.send({"msg":"supprimé avec succées!"});
    }
    catch (err) {
        res.send(err);
    }
};

const modifierAdresse = async (req, res) => {
    try {
        await Adresse.updateOne({ _id: req.params.id }, req.body);
        res.send("mise à jour effectué avec succées!");
    }
    catch (err) {
        res.send(err);
    }
};



module.exports = {
    getAdresses,
    ajouterAdresse,
    supprimerAdresse,
    modifierAdresse,
    adresseById
   }