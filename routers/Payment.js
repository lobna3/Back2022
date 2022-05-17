const router = (app) => {
    const PaymentCtrl = require('../controllers/payment');
    
    // CRUD Adresse
  
    app.post("/payment",PaymentCtrl.Add);
    app.post("/payment/:id",PaymentCtrl.Verify);
  

    
  }
  
  module.exports = router