const router = (app) => {
  const adresseCtrl = require('../controllers/adresses');
  
  // CRUD Adresse
  app.get('/adresses', adresseCtrl.getAdresses);

  app.get("/adresseById/:id",adresseCtrl.adresseById);

  app.post("/ajouter_adresse", adresseCtrl.ajouterAdresse);

  app.delete("/delete_adresse/:id", adresseCtrl.supprimerAdresse);

  app.put("/maj_adresse/:id", adresseCtrl.modifierAdresse);
  
}

module.exports = router