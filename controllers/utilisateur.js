const Utilisateur = require("../models/Utilisateur");
const ValidateRegister = require("../validation/Register");
const ValidateLogin = require("../validation/Login");
const jwt = require('jsonwebtoken')
const bcrypt = require('bcryptjs')
// CRUD Utilisateur

const Register = async (req, res) => {
  const { errors, isValid } = ValidateRegister(req.body);
  try {
    if (!isValid) {
      res.status(404).json(errors);
    } else {
      Utilisateur.findOne({ email: req.body.email }).then(async(exist) => {
        if (exist) {
          errors.email = "utilisateur exist";
          res.status(404).json(errors);
        } else {
          const hash = bcrypt.hashSync(req.body.password, 10)//hashed password
          req.body.password = hash;
          req.body.role = "USER";
          await Utilisateur.create(req.body);
          res.status(200).json({ message: "success" });
        }
      });
    }
  } catch (error) {
    res.status(404).json(error.message);
  }
};

const Login = async(req, res)=>{
  const {errors, isValid} = ValidateLogin(req.body)
 try {
    if(!isValid){
     res.status(404).json(errors)
    }else{
      Utilisateur.findOne({email: req.body.email})
    .then(user=>{
      if(!user){
        errors.email = "not found user"
        res.status(404).json(errors)
      }else{
        bcrypt.compare(req.body.password, user.password)
        .then(isMatch=>{
          if(!isMatch){
            errors.password = "incorrect password"
            res.status(404).json(errors)
          }else{
            var token = jwt.sign({ 
              id: user._id,
              nom: user.nom,
              email: user.email,
              role: user.role
             }, process.env.PRIVATE_KEY,  { expiresIn: '24h' });
             res.status(200).json({
               message: "success",
               token: "Bearer "+token
             })
          }
        })
      }
    })
    }
 } catch (error) {
  res.status(404).json(error.message);
 }
};

const Test = (req, res)=>{
  res.send("Bienvenue utilisateur")
};

const Admin = (req, res)=>{
  res.send("welcome admin")
}; 

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
  utilisateurById,
  Register,
  Login,
  Test,
  Admin
};