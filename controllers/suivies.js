const Suivie = require("../models/Suivie");


// CRUD Suvies

const getSuivies = async (req, res) => {
    try {
        var result= await Suivie.find({}).populate('commande');
        res.send(result)
    }
    catch (err) {
        res.status(405).send({});
    }
};

const suivieById = async (req, res) => {
    try {
        const {id}= req.params
        var result= await Suivie.findById(id).populate('commande');
        res.send(result)
    }
    catch (err) {
        res.status(405).send({});
    }
};




const ajouterSuivie = async (req, res) => {
    try {

        const new_suivie = new Suivie(req.body);
        await new_suivie.save();
        res.status(200).json({ success: true, data: new_suivie });

    }
    catch (err) {
        res.end();
        console.log(err);
    }

};

const supprimerSuivie = async (req, res) => {
    try {
        await Suivie.deleteOne({ _id: req.params.id })
        res.send({"msg":"supprimé avec succées!"});
    }
    catch (err) {
        res.send(err);
    }
};

const modifierSuivie = async (req, res) => {
    try {
        await Suivie.updateOne({ _id: req.params.id }, req.body);
        res.send("mise à jour effectué avec succées!");
    }
    catch (err) {
        res.send(err);
    }
};

module.exports = {
    getSuivies,
    ajouterSuivie,
    supprimerSuivie,
    modifierSuivie,
    suivieById
   }