const router = (app) => {
    const paiementCtrl = require('../controllers/paiements');
    
    // CRUD Paiement
    app.get('/paiements', paiementCtrl.getPaiements);

    app.get("/paiementById/:id", paiementCtrl.paiementById);
  
    app.post("/ajouter_paiement", paiementCtrl.ajouterPaiement);
  
    app.delete("/delete_paiement/:id", paiementCtrl.supprimerPaiement);
  
    app.put("/maj_paiement/:id", paiementCtrl.modifierPaiement);
  
  }
  
  module.exports = router