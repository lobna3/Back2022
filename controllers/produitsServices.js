const ProduitService = require("../models/ProduitService");

// CRUD ProduitServices

const getProduitsServices = async (req, res) => {
    try {
        var result= await ProduitService.find({})
        res.send(result)
    }
    catch (err) {
        res.status(405).send({});
    }
};

const serviceById = async (req, res) => {
    try {
        const {id} = req.params
        var result= await ProduitService.findById(id);
        res.send(result)
    }
    catch (err) {
        res.status(405).send({});
    }
};

const ajouterProduitService = async (req, res) => {
    try {
        const new_ProduitService = new ProduitService(req.body);
        await new_ProduitService.save();
        res.send({"msg" :"save effectué avec succée !"});
    }
    catch (err) {
        res.end();
        console.log(err);
    }

};

const supprimerProduitService = async (req, res) => {
    try {
        await ProduitService.deleteOne({ _id: req.params.id })
        res.send({"msg":"supprimé avec succées!"});
    }
    catch (err) {
        res.send(err);
    }
};

const modifierProduitService = async (req, res) => {
    try {
        await ProduitService.updateOne({ _id: req.params.id }, req.body);
        res.send("mise à jour effectué avec succées!");
    }
    catch (err) {
        res.send(err);
    }
};

module.exports = {
    getProduitsServices,
    ajouterProduitService,
    supprimerProduitService,
    modifierProduitService,
    serviceById
   }