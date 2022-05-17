const Utilisateur = require("../models/Utilisateur");

// CRUD Utilisateur
const getutilisateurs = async(req, res) => {
  console.log('controller')
  try {
    await Utilisateur.find({})
      .then(result => {
        res.send(result)
      })
  }
  catch (err) {
    console.log(err);
  }

};

const utilisateurById = async(req,res) =>{
  const {id}= req.params;
  const result = await Utilisateur.findById(id)
  res.send(result)
}

const ajouterUtilisateur = async (req, res) => {
  try {
    const new_utilisateur= new Utilisateur(req.body);
    await new_utilisateur.save();
    res.send("save effectué avec succée !");

    
  }
  catch (err) {
    console.log(err);
  }

};

const supprimerUtilisateur =async (req, res) => {
  try {
    await Utilisateur.findOneAndDelete({ _id: req.params.id });
    res.send("supprimé avec succées!");
  }
  catch (err) {
    res.send(err);
  }
};

const modifierUtilisateur =async (req, res) => {
  try {
    await Utilisateur.findOneAndUpdate({ _id: req.params.id }, {
      email: req.body.email
    });
    res.send("mise à jour effectué avec succées!");
  }
  catch (err) {
    res.send(err);
  }
};
 
module.exports = {
  getutilisateurs,
  ajouterUtilisateur,
  supprimerUtilisateur,
  modifierUtilisateur,
  utilisateurById

};