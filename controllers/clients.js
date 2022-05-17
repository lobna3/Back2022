const Adresse = require("../models/Adresse");
const Client = require("../models/Client");
const mongoose = require("mongoose");
var ObjectId = mongoose.Types.ObjectId;

// CRUD Clients

const getClients = async (req, res) => {
  try {
    Client.aggregate([
      {
        $lookup: {
          from: "adresees",
          localField: "_id",
          foreignField: "client",
          as: "adresses",
        },
      },
      {
        $lookup: {
          from: "commandes",
          localField: "_id",
          foreignField: "client",
          as: "commandes",
        },
      },
    ]).exec(function (err, results) {
      res.send(results);
    });
  } catch (err) {
    res.status(405).send({});
  }
};

const getclientById = async (req, res) => {
  try {
    Client.aggregate([
      { $match: { _id: ObjectId(req.params.id) } },
      {
        $lookup: {
          from: "adresees",
          localField: "_id",
          foreignField: "client",
          as: "adresses",
        },
      },
      {
        $lookup: {
          from: "commandes",
          localField: "_id",
          foreignField: "client",
          as: "commandes",
        },
      },
    ]).exec(function (err, results) {
      res.send(results);
    });
  } catch (err) {
    res.status(405).send({});
  }
};

const ajouterClient = async (req, res) => {
  try {
    console.log(req.body.adresses);
    const new_client = new Client(req.body.client);
    let savedCliend = await new_client.save();

    if (req.body.adresses) {
      await req.body.adresses.map(async (a) => {
        let info = { ...a, client: savedCliend._id };
        var new_address = new Adresse(info);

        let result = await new_address.save();
      
      });
    }

    res.status(200).json({ success: true, data: new_client });
  } catch (err) {
    res.status(500).json({ success: false, data: err.message });
  }
};

const supprimerClient = async (req, res) => {
  try {
    //  await Client.findOneAndDelete({ _id: req.params.id });
    await Client.deleteOne({ _id: req.params.id });
    res.send({ msg: "supprimé avec succées!" });
  } catch (err) {
    res.send(err);
  }
};

const modifierClient = async (req, res) => {
  try {
    /* await Client.updateOne({ _id: req.params.id }, {
            email: req.body.email
        }); */
    await Client.updateOne({ _id: req.params.id }, req.body);
    res.send("mise à jour effectué avec succées!");
  } catch (err) {
    res.send(err);
  }
};

module.exports = {
  getClients,
  ajouterClient,
  modifierClient,
  supprimerClient,
  getclientById,
};
