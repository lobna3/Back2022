const DetailArticle = require("../models/DetailArticle");



// CRUD DetailArticle
const getArticles = async (req, res) => {
    try {
        var result= await DetailArticle.find({}).populate('commande').populate('service')
        res.send(result)
    }
    catch (err) {
        res.status(405).send({});
    }
};

const articleById = async (req, res) => {
    try {
        const {id}= req.params
        var result= await DetailArticle.findById(id).populate('commande').populate('service')
        res.send(result)
    }
    catch (err) {
        res.status(405).send({});
    }
};

const ajouterArticle = async (req, res) => {
    try {
        const new_article = new DetailArticle(req.body);
        await new_article.save();
        res.status(200).json({ success: true, data: new_article });
    }
    catch (err) {
        res.end();
        console.log(err);
    }

};

const supprimerArticle = async (req, res) => {
    try {
        await DetailArticle.deleteOne({ _id: req.params.id })
        res.send({"msg":"supprimé avec succées!"});
    }
    catch (err) {
        res.send(err);
    }
};

const modifierArticle = async (req, res) => {
    try {
        await DetailArticle.updateOne({ _id: req.params.id }, req.body);
        res.send("mise à jour effectué avec succées!");
    }
    catch (err) {
        res.send(err);
    }
};

module.exports = {
    getArticles,
    ajouterArticle,
    supprimerArticle,
    modifierArticle,
    articleById
   }