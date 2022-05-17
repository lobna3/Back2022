const router = (app) => {
    const ServiceCtrl = require('../controllers/produitsServices');

    // CRUD ProduitService
    app.get('/services',  ServiceCtrl.getProduitsServices);

    app.get("/serviceById/:id",ServiceCtrl.serviceById);
  
    app.post("/ajouter_service",  ServiceCtrl.ajouterProduitService);
  
    app.delete("/delete_service/:id",  ServiceCtrl.supprimerProduitService);
  
    app.put("/maj_service/:id",  ServiceCtrl.modifierProduitService);
  
  }
  
  module.exports = router