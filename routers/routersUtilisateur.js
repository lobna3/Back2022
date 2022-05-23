
const utilisateurCtrl = require('../controllers/utilisateur');
const passport = require("passport");

const router = (app) => {

  // CRUD Utilisateur
  app.get('/utilisateurs', utilisateurCtrl.getutilisateurs);

  app.get("/utilisateurById/:id",utilisateurCtrl.utilisateurById);

  app.post("/ajouter_utilisateur",utilisateurCtrl.ajouterUtilisateur );

  app.delete("/delete_utilisateur/:id",utilisateurCtrl.supprimerUtilisateur );

  app.put("/maj_utilisateur/:id",utilisateurCtrl.modifierUtilisateur );

  app.post("/register", utilisateurCtrl.Register);

  app.post("/login",utilisateurCtrl.Login);

  app.get("/testoken",passport.authenticate("jwt", { session: false }),utilisateurCtrl.Test);

  app.get("/testadmin",passport.authenticate("jwt", { session: false }),utilisateurCtrl.Admin);

}

module.exports = router;
