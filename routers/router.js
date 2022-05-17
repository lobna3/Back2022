const router = require("express").Router();

router.get("/", (req, res) => {
  res.send("Let's build a CRUD API!");
});

// CRUD Utilisateur
/* app.get('/utilisateurs', async (req, res) => {
  console.log('server');
  try {
    await Utilisateur.find({})
      .then(result => {
        res.send(result)
      })
  }
  catch (err) {
    console.log(err);
  }

}); 

app.post("/ajouter_utilisateur", async (req, res) => {
  try {
    let new_utilisateur = new Utilisateur({
      nom: req.body.nom,
      prenom: req.body.prenom,
      email: req.body.email,
      password: req.body.password,
      numTelp: req.body.numTelp,
      role: req.body.role,
    });
    await new_utilisateur.save();
    res.send("save effectué avec succée !");
  }
  catch (err) {
    console.log(err);
  }

});

app.delete("/delete_utilisateur/:id", async (req, res) => {
  try {
    await Utilisateur.findOneAndDelete({ _id: req.params.id });
    res.send("supprimé avec succées!");
  }
  catch (err) {
    res.send(err);
  }
});

app.put("/maj_utilisateur/:id", async (req, res) => {
  try {
    await Utilisateur.findOneAndUpdate({ _id: req.params.id }, {
      email: req.body.email
    });
    res.send("mise à jour effectué avec succées!");
  }
  catch (err) {
    res.send(err);
  }
});

// CRUD Client
app.get('/clients', async (req, res) => {
  try {
     //   var result= await Client.find({})
    //les adresses du client
        // client -> adresse(s) // aggregate
        /// adresse -> client // populate
       
        /*  /* Méthode 1
         Client.find({} , (result)=>{
             res.send(result)
         }) */

        /*   Méthode 2 
        Client.find({})
         .then(result => {
             res.send(result)
         } , (err)=>{

         }) 
    await Client.find({})
      .then(result => {
        res.send(result)
      })
  }
  catch (err) {
    console.log(err);
  }

});

app.post("/ajouter_client", async (req, res) => {
  try {
    const new_client = new Client(req.body);
    await new_client.save();

    const utilisateur = await Utilisateur.findById({ _id: new_client.utilisateur })
    utilisateur.clients.push(new_client);
    await utilisateur.save();
    //return new client object, after saving it to Utilisateur
    res.status(200).json({ success: true, data: new_client });
  }
  catch (err) {
    console.log(err);
  }

});

app.delete("/delete_client/:id", async (req, res) => {
  try {
    await Client.findOneAndDelete({ _id: req.params.id });
    res.send("supprimé avec succées!");
  }
  catch (err) {
    res.send(err);
  }
});

app.put("/maj_client/:id", async (req, res) => {
  try {
    await Client.findOneAndUpdate({ _id: req.params.id }, {
      email: req.body.email
    });
    res.send("mise à jour effectué avec succées!");
  }
  catch (err) {
    res.send(err);
  }
});

//JWT
let secretCode = 121215;
const data = [{
  nom: "Lobna",
  prenom: "yousfi",
  email: "lobna@gmail.com",
  password: "123456789"
},
{
  nom: "test",
  prenom: "test",
  email: "test1@gmail.com",
  password: "123456789"
}

];

app.get("/data/:id", (req, res) => {
  if (req.params.id == secretCode) {
    res.json(data)
  }
  else {
    res.json({ error: "vous n'etes pas autorisé a effectuer cette taches !! verifier votre code!" })
  }
});

let secretKey = "*****123";
//middleware(fonction js) construire les jetons 
function CreateToken(req, res, next) {
  const user = {
    username: req.body.username,
    email: req.body.email,
    password: req.body.password
  }; // user = {username:"lobna"}
  jwt.sign(user, secretKey, (err, resultat) => {
    if (err) {
      res.json({ error: err })
    } else {
      res.json({ token: resultat })
    }

  });
  next();

};

app.post("/login", CreateToken, (req, res) => { });*/
module.exports = router;