const router = (app) => {
    const commandeCtrl = require('../controllers/commandes');

    // CRUD Commande
    app.get('/commandes', commandeCtrl.getCommandes);
  
    app.post("/ajouter_commande", commandeCtrl.ajouterCommande);
  
    app.delete("/delete_commande/:id", commandeCtrl.supprimerCommande);
  
    app.put("/maj_commande/:id", commandeCtrl.modifierCommande);
  
    app.get('/commandeById/:id', commandeCtrl.getCommandeById);

    app.put('/mod_status/:id', commandeCtrl.modifierStatus);

    app.post("/generate/", commandeCtrl.generateInvoice);
   
    app.post("/test", commandeCtrl.testEmail);
    
    

  }
  
  module.exports = router