const Paiement = require("../models/Paiement");


//CRUD Paiements

const getPaiements = async (req, res) => {
    try {
        var result= await Paiement.find({}).populate('commande');
        res.send(result)
    }
    catch (err) {
        res.status(405).send({});
    }
};

const paiementById = async (req, res) => {
    try {
        const {id}=req.params
        var result= await Paiement.findById(id).populate('commande');
        res.send(result)
    }
    catch (err) {
        res.status(405).send({});
    }
};


const ajouterPaiement = async (req, res) => {
    try {
        const new_paiement  = new Paiement(req.body);
        await new_paiement.save();
        res.status(200).json({ success: true, data: new_paiement  });
    }
    catch (err) {
        res.end();
        console.log(err);
    }

};

const supprimerPaiement = async (req, res) => {
    try {
        await Paiement.deleteOne({ _id: req.params.id })
        res.send({"msg":"supprimé avec succées!"});
    }
    catch (err) {
        res.send(err);
    }
};

const modifierPaiement = async (req, res) => {
    try {
        await Paiement.updateOne({ _id: req.params.id }, req.body);
        res.send("mise à jour effectué avec succées!");
    }
    catch (err) {
        res.send(err);
    }
};

module.exports = {
    getPaiements,
    ajouterPaiement,
    supprimerPaiement,
    modifierPaiement,
    paiementById
   }