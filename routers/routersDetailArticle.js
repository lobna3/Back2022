const router = (app) => {
const articleCtrl = require('../controllers/detailsArticles');

    // CRUD Details Articles
    app.get('/articles', articleCtrl.getArticles);

    app.get("/articleById/:id", articleCtrl.articleById);
  
    app.post("/ajouter_article", articleCtrl.ajouterArticle);
  
    app.delete("/delete_article/:id", articleCtrl.supprimerArticle);
  
    app.put("/maj_article/:id", articleCtrl.modifierArticle);
  
  }
  
  module.exports = router