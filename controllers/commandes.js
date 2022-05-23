const Commande = require("../models/Commande");
const DetailArticle = require("../models/DetailArticle");
const Suivie = require("../models/Suivie");
const Paiement = require("../models/Paiement");
const gmail_mailer = require("../config/mailer");
const sendMail = require("../config/nodeMailer");
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

const getCommandeInfo = async (id) => {
  try {
    let result = await Commande.aggregate([
      { $match: { _id: ObjectId(id) } },
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
    ]);
    var r = await Commande.populate(result, { path: "client" });
    console.log("Result", r[0]);
    let mappedResult = r[0].articles.map(async (elm) => {
      let article = await DetailArticle.findById(elm).populate("service");
     
      return article;
    });
    let newArticles = await Promise.all(mappedResult);
    let finalResult = { ...r[0], articles: newArticles };
    return finalResult;
    // .exec(async function (err, results) {
    //   if (results && results.length > 0) {
    //     var r = await Commande.populate(results[0], { path: "client" });
    //     let mappedResult = r.articles.map(async (elm) => {
    //       let article = await DetailArticle.findById(elm).populate("service");
    //       return article;
    //     });
    //     let newArticles = await Promise.all(mappedResult);
    //     let finalResult = { ...r, articles: newArticles };
    //    return finalResult ;
    //   } else {
    //   return null ;
    //   }
    // });
  } catch (err) {
    console.log("error", err.message);
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
     console.log("Suivies", req.body.suivies);
     console.log("Paiements", req.body.paiements);
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
    // res.status(200).json({ success: true, data: savedCmd });
  } catch (err) {
    // res.end();
    // console.log(err);
    res.status(500).json({ success: false, data: err.message });
  }
};

const ajouterFacture = async (req, res) => {
  try {
    /* commande : {}, 
        details articles : [{} , {}] */

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

    let commande = await getCommandeInfo(new_commande._id.toString());
    console.log("Commande Data", commande);
    const pdf = await generatePDF(
      `<!DOCTYPE html>
      <html>
        <head>
          <meta charset="utf-8" />
          <title>A simple, clean, and responsive HTML invoice template</title>
      
          <style>
            .invoice-box {
              max-width: 800px;
              margin: auto;
              padding: 30px;
              border: 1px solid #eee;
              box-shadow: 0 0 10px rgba(0, 0, 0, 0.15);
              font-size: 16px;
              line-height: 24px;
              font-family: 'Helvetica Neue', 'Helvetica', Helvetica, Arial, sans-serif;
              color: #555;
            }
      
            .invoice-box table {
              width: 100%;
              line-height: inherit;
              text-align: left;
            }
      
            .invoice-box table td {
              padding: 5px;
              vertical-align: top;
            }
      
            .invoice-box table tr td:nth-child(2) {
              text-align: right;
            }
      
            .invoice-box table tr.top table td {
              padding-bottom: 20px;
            }
      
            .invoice-box table tr.top table td.title {
              font-size: 45px;
              line-height: 45px;
              color: #333;
            }
      
            .invoice-box table tr.information table td {
              padding-bottom: 40px;
            }
      
            .invoice-box table tr.heading td {
              background: #eee;
              border-bottom: 1px solid #ddd;
              font-weight: bold;
            }
      
            .invoice-box table tr.details td {
              padding-bottom: 20px;
            }
      
            .invoice-box table tr.item td {
              border-bottom: 1px solid #eee;
            }
      
            .invoice-box table tr.item.last td {
              border-bottom: none;
            }
      
            .invoice-box table tr.total td:nth-child(2) {
              border-top: 2px solid #eee;
              font-weight: bold;
            }
      
            @media only screen and (max-width: 600px) {
              .invoice-box table tr.top table td {
                width: 100%;
                display: block;
                text-align: center;
              }
      
              .invoice-box table tr.information table td {
                width: 100%;
                display: block;
                text-align: center;
              }
            }
      
            /** RTL **/
            .invoice-box.rtl {
              direction: rtl;
              font-family: Tahoma, 'Helvetica Neue', 'Helvetica', Helvetica, Arial, sans-serif;
            }
      
            .invoice-box.rtl table {
              text-align: right;
            }
      
            .invoice-box.rtl table tr td:nth-child(2) {
              text-align: left;
            }
          </style>
        </head>
      
        <body>
          <div class="invoice-box">
            <table cellpadding="0" cellspacing="0">
              <tr class="top">
                <td colspan="2">
                  <table>
                    <tr>
                      <td class="title">
                        <img src="https://www.sparksuite.com/images/logo.png" style="width: 100%; max-width: 300px" />
                      </td>
      
                      <td>
                      ${commande.status} #: ${commande.nFacture}<br />
                      Date de facturation:${
                        commande.dateEmission
                      }<br />
                      Date d'echéance:${
                        commande.dateEcheance
                      }
                      </td>
                    </tr>
                  </table>
                </td>
              </tr>
      
              <tr class="information">
                <td colspan="2">
                  <table>
                    <tr>
                      <td>
                      Arsela.<br />
                      Sahloul 4054 Sousse, Tunisie<br />
                      Email: info@arsela.com
                      </td>
      
                      <td>
                      Attn:
                      ${commande.client.titre}
                      ${commande.client.nom}
                      ${commande.client.prenom}.<br />
                      ${commande.client.activite}<br />
                      ${commande.client.email}
                      </td>
                    </tr>
                  </table>
                </td>
              </tr>
             <table>
              <tr class="heading">
                <td>Article & Description</td>
                <td>QTE</td>
                <td>PU</td>
                <td>TAX</td>
                <td> Prix</td>
              </tr>
              ${commande.articles.map(
                (elm) => `<tr class="item">
              <td>${elm.service.titre} ${elm.service.description}</td>
              <td>${elm.qte}</td>
              <td>${elm.pu}DT </td>
              <td>${elm.taxe}</td>
              <td>${elm.prix}DT</td>
            </tr>`
              )}
              </table>
              <table>
              <tr class="total">
                <td></td>
      
                <td>SubTotal :${commande.total} DT</td>
              </tr>
              <tr class="total">
              <td></td>
    
              <td>Remise :${commande.remise} DT</td>
            </tr>
            <tr class="total">
              <td></td>
    
              <td>Tax:${commande.taxes} DT</td>
            </tr>
            <tr class="total">
              <td></td>
    
              <td>TotalTTc :${commande.totalTtc} DT</td>
            </tr>
            <tr class="total">
            <td></td>
            <td> </td>
            </tr>
              </table>
              <table>
              <tr class="heading">
                <td>Mode de paiement</td>
      
                <td>Check #</td>
              </tr>
      
              <tr class="details">
                <td>Check</td>
      
                <td>1000</td>
              </tr>
             </table>
            </table>
            <div className="row">
            <div className="col-sm-7 col-12 text-center text-sm-left">
              <h6>Terms &amp; Condition</h6>
              <p>Le pilote d'essai n'est pas toujours l'entreprise la plus saine..</p>
            </div>
          </div>
        </body>
      </html>
          `,
      commande._id
    );
    let savedCmd = await getCommandeInfo(commande._id);

    //res.status(200).json({ success: true, data: new_commande });
    res.status(200).json({ success: true, data: savedCmd });
  } catch (err) {
    console.log("error",err)
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

const modifierFacture = async (req, res) => {
  try {
  
    var comd1 =  await Commande.updateOne({ _id: req.params.id }, req.body);
    await comd1.save();

    if (req.body.paiements) {
      await req.body.paiements.map(async (c) => {
        var new_paiement = new Paiement(c);
        new_paiement.commande = comd1._id;
        await new_paiement.save();
      });
    }
    
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
      `<!DOCTYPE html>
      <html>
        <head>
          <meta charset="utf-8" />
          <title>A simple, clean, and responsive HTML invoice template</title>
      
          <style>
            .invoice-box {
              max-width: 800px;
              margin: auto;
              padding: 30px;
              border: 1px solid #eee;
              box-shadow: 0 0 10px rgba(0, 0, 0, 0.15);
              font-size: 16px;
              line-height: 24px;
              font-family: 'Helvetica Neue', 'Helvetica', Helvetica, Arial, sans-serif;
              color: #555;
            }
      
            .invoice-box table {
              width: 100%;
              line-height: inherit;
              text-align: left;
            }
      
            .invoice-box table td {
              padding: 5px;
              vertical-align: top;
            }
      
            .invoice-box table tr td:nth-child(2) {
              text-align: right;
            }
      
            .invoice-box table tr.top table td {
              padding-bottom: 20px;
            }
      
            .invoice-box table tr.top table td.title {
              font-size: 45px;
              line-height: 45px;
              color: #333;
            }
      
            .invoice-box table tr.information table td {
              padding-bottom: 40px;
            }
      
            .invoice-box table tr.heading td {
              background: #eee;
              border-bottom: 1px solid #ddd;
              font-weight: bold;
            }
      
            .invoice-box table tr.details td {
              padding-bottom: 20px;
            }
      
            .invoice-box table tr.item td {
              border-bottom: 1px solid #eee;
            }
      
            .invoice-box table tr.item.last td {
              border-bottom: none;
            }
      
            .invoice-box table tr.total td:nth-child(2) {
              border-top: 2px solid #eee;
              font-weight: bold;
            }
      
            @media only screen and (max-width: 600px) {
              .invoice-box table tr.top table td {
                width: 100%;
                display: block;
                text-align: center;
              }
      
              .invoice-box table tr.information table td {
                width: 100%;
                display: block;
                text-align: center;
              }
            }
      
            /** RTL **/
            .invoice-box.rtl {
              direction: rtl;
              font-family: Tahoma, 'Helvetica Neue', 'Helvetica', Helvetica, Arial, sans-serif;
            }
      
            .invoice-box.rtl table {
              text-align: right;
            }
      
            .invoice-box.rtl table tr td:nth-child(2) {
              text-align: left;
            }
          </style>
        </head>
      
        <body>
          <div class="invoice-box">
            <table cellpadding="0" cellspacing="0">
              <tr class="top">
                <td colspan="2">
                  <table>
                    <tr>
                      <td class="title">
                        <img src="https://www.sparksuite.com/images/logo.png" style="width: 100%; max-width: 300px" />
                      </td>
      
                      <td>
                      ${commandeDetails.status} #: ${commandeDetails.nFacture}<br />
                      Date de facturation:${
                        commandeDetails.dateEmission
                      }<br />
                      Date d'echéance:${
                        commandeDetails.dateEcheance
                      }
                      </td>
                    </tr>
                  </table>
                </td>
              </tr>
      
              <tr class="information">
                <td colspan="2">
                  <table>
                    <tr>
                      <td>
                      Arsela.<br />
                      Sahloul 4054 Sousse, Tunisie<br />
                      Email: info@arsela.com
                      </td>
      
                      <td>
                      Attn:
                      ${commandeDetails.client.titre}
                      ${commandeDetails.client.nom}
                      ${commandeDetails.client.prenom}.<br />
                      ${commandeDetails.client.activite}<br />
                      ${commandeDetails.client.email}
                      </td>
                    </tr>
                  </table>
                </td>
              </tr>
             <table>
              <tr class="heading">
                <td>Article & Description</td>
                <td>QTE</td>
                <td>PU</td>
                <td>TAX</td>
                <td> Prix</td>
              </tr>
              ${commandeDetails.articles.map(
                (elm) => `<tr class="item">
              <td>${elm.service.titre} ${elm.service.description}</td>
              <td>${elm.qte}</td>
              <td>${elm.pu}DT </td>
              <td>${elm.taxe}</td>
              <td>${elm.prix}DT</td>
            </tr>`
              )}
              </table>
              <table>
              <tr class="total">
                <td></td>
      
                <td>SubTotal :${commandeDetails.total} DT</td>
              </tr>
              <tr class="total">
              <td></td>
    
              <td>Remise :${commandeDetails.remise} DT</td>
            </tr>
            <tr class="total">
              <td></td>
    
              <td>Tax:${commandeDetails.taxes} DT</td>
            </tr>
            <tr class="total">
              <td></td>
    
              <td>TotalTTc :${commandeDetails.totalTtc} DT</td>
            </tr>
            <tr class="total">
            <td></td>
            <td> </td>
            </tr>
              </table>
              <table>
              <tr class="heading">
                <td>Mode de paiement</td>
      
                <td>Check #</td>
              </tr>
      
              <tr class="details">
                <td>Check</td>
      
                <td>1000</td>
              </tr>
             </table>
            </table>
            <div className="row">
            <div className="col-sm-7 col-12 text-center text-sm-left">
              <h6>Terms &amp; Condition</h6>
              <p>Le pilote d'essai n'est pas toujours l'entreprise la plus saine..</p>
            </div>
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
  ajouterFacture,
};
