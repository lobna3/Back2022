const Commande = require("../models/Commande");
const DetailArticle = require("../models/DetailArticle");
const Suivie = require("../models/Suivie");
const Paiement = require("../models/Paiement");
const gmail_mailer = require("../config/mailer");
const sendMail = require ("../config/nodeMailer")
const mongoose = require("mongoose");
var ObjectId = mongoose.Types.ObjectId;
const generatePDF = require("../utils/generatePdf");

// CRUD Commandes

const getCommandes = async (req, res) => {
  try {
    Commande.aggregate([
      {
        $lookup: {
          from: "detailarticles",
          localField: "_id",
          foreignField: "commande",
          as: "articles",
        },
      },
      {
        $lookup: {
          from: "suivies",
          localField: "_id",
          foreignField: "commande",
          as: "suivies",
        },
      },
      {
        $lookup: {
          from: "paiements",
          localField: "_id",
          foreignField: "commande",
          as: "paiements",
        },
      },
    ]).exec(async function (err, results) {
      if (results && results.length > 0) {
        var r = await Commande.populate(results, { path: "client" });
        res.send(r);
      } else {
        res.send({});
      }
    });
  } catch (err) {
    res.status(405).send({});
  }
};

const getCommandeById = async (req, res) => {
  try {
    Commande.aggregate([
      { $match: { _id: ObjectId(req.params.id) } },
      {
        $lookup: {
          from: "suivies",
          localField: "_id",
          foreignField: "commande",
          as: "suivies",
        },
      },
      {
        $lookup: {
          from: "detailarticles",
          localField: "_id",
          foreignField: "commande",
          as: "articles",
        },
      },
      {
        $lookup: {
          from: "paiements",
          localField: "_id",
          foreignField: "commande",
          as: "paiements",
        },
      },
    ]).exec(async function (err, results) {
      if (results && results.length > 0) {
        var r = await Commande.populate(results[0], { path: "client" });
        let mappedResult = r.articles.map(async (elm) => {
          let article = await DetailArticle.findById(elm).populate("service");
          return article;
        });
        let newArticles = await Promise.all(mappedResult);
        let finalResult = { ...r, articles: newArticles };
        res.send(finalResult);
      } else {
        res.send({});
      }
    });
  } catch (err) {
    res.status(405).send({});
  }
};

const ajouterCommande = async (req, res) => {
  try {
    /* commande : {}, 
        details articles : [{} , {}] */
    console.log(req.body.commande);
    const new_commande = new Commande(req.body.commande);
    await new_commande.save();

    if (req.body.articles) {
      await req.body.articles.map(async (b) => {
        var new_article = new DetailArticle(b);
        new_article.commande = new_commande._id;
        await new_article.save();
      });
    }

    if (req.body.suivies) {
      await req.body.suivies.map(async (a) => {
        var new_suivie = new Suivie(a);
        new_suivie.commande = new_commande._id;
        await new_suivie.save();
      });
    }

    if (req.body.paiements) {
      await req.body.paiements.map(async (c) => {
        var new_paiement = new Paiement(c);
        new_paiement.commande = new_commande._id;
        await new_paiement.save();
      });
    }

    /*const new_suivi = new Suivie()
        new_suivi.titre="Commande crée"
        new_suivi.commande = new_commande._id;
        new_suivi.save();*/

    /*const new_paiement = new Paiement()
        new_paiement.typePaiement="carte bancaire"
        new_paiement.commande = new_commande._id;
        new_paiement.save();*/

    res.status(200).json({ success: true, data: new_commande });
  } catch (err) {
    // res.end();
    // console.log(err);
    res.status(500).json({ success: false, data: err.message });
  }
};

const modifierCommande = async (req, res) => {
  try {
    await Commande.updateOne({ _id: req.params.id }, req.body);
    res.send("mise à jour effectué avec succées!");
  } catch (err) {
    res.send(err);
  }
};

const modifierStatus = async (req, res) => {
  try {
    var comd = await Commande.findOne({ _id: req.params.id });
    comd.status = req.body.status;

    var date1 = new Date(comd.dateEmission);
    console.log(comd.dateEmission);
    date1.setDate(1);
    date1.setMonth(0);
    var date2 = new Date(comd.dateEmission);
    date2.setDate(1);
    date2.setMonth(0);
    date2.setFullYear(date2.getFullYear() + 1);

    if (req.body.status == "Facture") {
      var commandes = await Commande.find({
        status: "Facture",
        dateEmission: {
          $gte: new Date(date1),
          $lt: new Date(date2),
        },
      });
      comd.nFacture = commandes.length + 1;
    }

    await comd.save();
    var new_suivie = new Suivie();
    new_suivie.typeS = "edit";
    new_suivie.titreS = "La commande a été modifié par";
    new_suivie.descriptionS = req.body.nom;

    new_suivie.commande = comd._id;
    await new_suivie.save();

    res.send({ test: "mise à jour effectué avec succées!" });
  } catch (err) {
    res.status(405).send(err);
  }
};

const supprimerCommande = async (req, res) => {
  try {
    await Commande.deleteOne({ _id: req.params.id });
    res.send({ msg: "supprimé avec succées!" });
  } catch (err) {
    res.send(err);
  }
};

const generateInvoice = async (req, res) => {
  try {
    let { commandeDetails } = req.body;
    console.log("Commande details", commandeDetails.articles);
    const pdf = await generatePDF(
      `
    <html>
    <head>
      <title>FACTURE</title>
      <style>
        body {
          padding: 60px;
          font-family: "Hevletica Neue", "Helvetica", "Arial", sans-serif;
          font-size: 16px;
          line-height: 24px;
        }

        body > h4 {
          font-size: 24px;
          line-height: 24px;
          text-transform: uppercase;
          margin-bottom: 60px;
        }

        body > header {
          display: flex;
        }

        body > header > .address-block:nth-child(2) {
          margin-left: 100px;
        }

        .address-block address {
          font-style: normal;
        }

        .address-block > h5 {
          font-size: 14px;
          line-height: 14px;
          margin: 0px 0px 15px;
          text-transform: uppercase;
          color: #aaa;
        }

        .table {
          width: 100%;
          margin-top: 60px;
        }

        .table table {
          width: 100%;
          border: 1px solid #eee;
          border-collapse: collapse;
        }

        .table table tr th,
        .table table tr td {
          font-size: 15px;
          padding: 10px;
          border: 1px solid #eee;
          border-collapse: collapse;
        }

        .table table tfoot tr td {
          border-top: 3px solid #eee;
        }
      </style>
    </head>
    <body>
      <h4>Invoice</h4>
      <header>
        <div class="address-block">
          <h5>ADRESSE FACTURATION</h5>
          <address>
            ${commandeDetails.adresseFacturation}<br />
           
          </address>
        </div>
        <div class="address-block">
          <h5>ADRESSE LIVRAISON</h5>
          <address>
           ${commandeDetails.adresseLivraison}
          </address>
        </div>
      </header>
      <div class="table">
        <table>
          <thead>
            <tr>
              <th style="text-align:left;">PRODUIT</th>
              <th>PRIX</th>
              <th>QUANITE</th>
              <th>TAXE</th>
              <th>TOTAL</th>
            </tr>
          </thead>
          <tbody>
            ${commandeDetails.articles.map(
              (elm) => `  <tr>
            <td style="text-align:left;">${elm.service.titre}</td>
            <td style="text-align:center;">${elm.pu}</td>
            <td style="text-align:center;">${elm.qte}</td>
            <td style="text-align:center;">${elm.taxe}</td>
            <td style="text-align:center;">${elm.prix}</td>
          </tr>`
            )}
         
          </tbody>
          <tfoot>
            <tr>
              <td colSpan="2" />
              <td style="text-align:right;"><strong>TOTAL HT</strong></td>
              <td style="text-align:center;">${commandeDetails.total}</td>
            </tr>
            <tr>
            <td colSpan="2" />
            <td style="text-align:right;"><strong>TAXES</strong></td>
            <td style="text-align:center;">${commandeDetails.taxes}</td>
          </tr>
          <tr>
          <td colSpan="2" />
          <td style="text-align:right;"><strong>REMISE</strong></td>
          <td style="text-align:center;">${commandeDetails.remise}</td>
        </tr>
        <tr>
        <td colSpan="2" />
        <td style="text-align:right;"><strong>TOTAL TTC</strong></td>
        <td style="text-align:center;">${commandeDetails.totalTtc}</td>
      </tr>
          </tfoot>
        </table>
      </div>
    </body>
  </html>
      `,
      commandeDetails._id
    );

    res.json({ success: true, message: "Document Ajouter" });
  } catch (error) {
    res.json({ err: error.message });
  }
};

const testEmail = async (req, res) => {
  await gmail_mailer(req.body.email, req.body.subject, req.body.description);
  res.status(200).json({ success: true });
 
};



module.exports = {
  getCommandes,
  ajouterCommande,
  modifierCommande,
  supprimerCommande,
  getCommandeById,
  modifierStatus,
  generateInvoice,
  testEmail,
 
};
