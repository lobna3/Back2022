
const router = (app) => {
const clientCtrl = require('../controllers/clients');

  // CRUD Client
  app.get('/clients', clientCtrl.getClients);

  app.get("/clientById/:id", clientCtrl.getclientById);

  app.post("/ajouter_client", clientCtrl.ajouterClient);

  app.delete("/delete_client/:id", clientCtrl.supprimerClient);

  app.put("/maj_client/:id", clientCtrl.modifierClient);
  
}

module.exports = router