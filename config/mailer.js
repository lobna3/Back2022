const nodemailer = require("nodemailer");

module.exports = function gmail_mailer(to, subject, content) {
  // create reusable transporter object using the default SMTP transport
  let transport = nodemailer.createTransport({
    service: "gmail",
    host: "smtp.gmail.com",
    port: 465,
    secure: false,
    auth: {
      user: process.env.GMAIL_USER, // generated ethereal user
      pass: process.env.GMAIL_PASS, // generated ethereal password
    },
    tls: {
      rejectUnauthorized: false,
    },
  });

  //ekteb el email mta3k hna
  // send mail with defined transport object
  let info = transport.sendMail({
    from: '"Super Vision 👻" <yousfi90lobna@gmail.com>', // sender address
    to: `👻<${to}>`, // list of receivers
    subject: `${subject}`,
    html: `${content}`,
  });

  //call this file with gmail_mailer(to, subject, content)

  console.log("Message sent: %s", info.messageId);
  // Message sent: <b658f8ca-6296-ccf4-8306-87d57a0b4321@example.com>

  // Preview only available when sending through an Ethereal account
  console.log("Preview URL: %s", nodemailer.getTestMessageUrl(info));
};
