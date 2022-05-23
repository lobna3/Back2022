const utilisateurCtrl = require("../controllers/profile.controllers");
const passport = require("passport");
const { ROLES, inRole } = require("../security/Rolemiddleware");
const router = (app) => {
  
// add profile route 
router.post("/profiles", 
passport.authenticate("jwt", { session: false }),
utilisateurCtrl.AddProfile);

// get all profiles 
router.get("/profiles", 
passport.authenticate("jwt", { session: false }),
inRole(ROLES.ADMIN),utilisateurCtrl.
FindAllProfiles);
// get one profiles 
router.get("/profile", 
passport.authenticate("jwt", { session: false }),utilisateurCtrl.
FindSingleProfile);

//delete profiles 
router.delete("/profiles/:id", 
passport.authenticate("jwt", { session: false }),
inRole(ROLES.ADMIN),utilisateurCtrl.
DeleteProfile);
 
};

module.exports = router;