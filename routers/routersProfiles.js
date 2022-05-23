const utilisateurCtrl = require("../controllers/profile.controllers");
const passport = require("passport");
const { ROLES, inRole } = require("../security/Rolemiddleware");
const router = (app) => {
  
// add profile route 
app.post("/profiles", 
passport.authenticate("jwt", { session: false }),
utilisateurCtrl.AddProfile);

// get all profiles 
app.get("/profiles", 
passport.authenticate("jwt", { session: false }),
inRole(ROLES.ADMIN),utilisateurCtrl.
FindAllProfiles);

// get one profiles 
app.get("/profile", 
passport.authenticate("jwt", { session: false }),utilisateurCtrl.
FindSingleProfile);

//delete profiles 
app.delete("/profiles/:id", 
passport.authenticate("jwt", { session: false }),
inRole(ROLES.ADMIN),utilisateurCtrl.
DeleteProfile);
 
};

module.exports = router;