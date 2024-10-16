const express = require("express");
const mongoose = require("mongoose");
const cors = require("cors");
const bodyParser = require("body-parser"); // manipulation des objets dans la req
const res = require("express/lib/response");
//const jwt = require('jsonwebtoken'); //jwt: JSON Web Token : les jetons d'accées
const passport = require('passport')
const dotenv = require("dotenv");
const path = require("path");
dotenv.config();
const app = express();
app.use(cors());
app.use(bodyParser.urlencoded({ extended: false }));

// parse application/json
app.use(bodyParser.json());

/* passport */
app.use(passport.initialize())
require('./security/passport')(passport)

/* routage */
require("./routers/routersUtilisateur")(app);
require("./routers/routersClient")(app);
require("./routers/routersAdresse")(app);
require("./routers/routersCommande")(app);
require("./routers/routersSuivie")(app);
require("./routers/routersPaiement")(app);
require("./routers/routersProduitService")(app);
require("./routers/routersDetailArticle")(app);
require("./routers/Payment")(app);
require("./routers/routersProfiles")(app);

app.use("/documents", express.static(path.join(__dirname + "/doc")));
mongoose.connect(
 
  (err, done) => {
    if (err) {
      console.log(err);
    }
    if (done) {
      console.log("base se donnée connecté avec succées!");
    }
  }
);

app.listen(5000, () => console.log("server en  trés bien marchée !!"));
