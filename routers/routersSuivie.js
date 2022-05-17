const router = (app) => {
const suivieCtrl = require('../controllers/suivies');

    // CRUD Suivie
    app.get('/suivies', suivieCtrl.getSuivies);
  
    app.get('/suivieById/:id',suivieCtrl.suivieById);

    app.post("/ajouter_suivie", suivieCtrl.ajouterSuivie);
  
    app.delete("/delete_suivie/:id", suivieCtrl.supprimerSuivie);
  
    app.put("/maj_suivie/:id", suivieCtrl.modifierSuivie);
  
  }
  
  module.exports = router
  