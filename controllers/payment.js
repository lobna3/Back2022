const axios = require ("axios")

module.exports = {
  Add: async (req, res) => {
    const url = "https://developers.flouci.com/api/generate_payment";
    const payload = {
      app_token: "576a8776-b084-45a3-a0ed-121dc1261479",
      app_secret: process.env.FLOUSI_SECRET,
      amount: req.body.amount,
      accept_card: "true",
      session_timeout_secs: 1200,
      success_link: "http://localhost:3000/success",
      fail_link: "http://localhost:3000/fail",
      developer_tracking_id: "c9f8f0a3-6fbe-4942-90da-ef97b8d6bf9a",
    }
    await axios
    .post(url,payload)
    .then(result=>{
        res.send(result.data)
    })
    .catch(err=>console.error(err))
  },

  Verify: async (req,res)=>{
      const id_payment= req.params.id;
     await axios.get(`https://developers.flouci.com/api/verify_payment/${id_payment}`,{headers : {
        'Content-Type': 'application/json',
        'apppublic': "576a8776-b084-45a3-a0ed-121dc1261479",
        'appsecret': process.env.FLOUSI_SECRET
      }})
      .then(result=>{
        res.send(result.data)
    })
    .catch(err=>console.error(err.message))
      
}
};
