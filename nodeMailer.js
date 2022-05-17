const nodemailer = require('nodemailer');
const { google } = require('googleapis');

const CLIENT_ID =
  "599473816033-fckga62vpq16cb2nldpbl5sg0533isd5.apps.googleusercontent.com"
const CLIENT_SECRET = "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"
const REDIRECT_URI = "https://developers.google.com/oauthplayground"
const REFRESH_TOKEN =
  "1//04-pOARCZLHBkCgYIARAAGAQSNwF-L9IrxHRL5OS9gBnAHoPFomW4Odh3GNaLlSJegH3-NtEWQEQ1BwypRfZ0x6TqBcsAy5iU6qQ"

const oAuth2Client = new google.auth.OAuth2(
  CLIENT_ID,
  CLIENT_SECRET,
  REDIRECT_URI
);
oAuth2Client.setCredentials({ refresh_token: REFRESH_TOKEN });

const sendMail= async () =>{
  try {
    const accessToken = await oAuth2Client.getAccessToken();

    const transport = nodemailer.createTransport({
      service: 'gmail',
      auth: {
        type: 'OAuth2',
        user: 'yousfi90lobna@gmail.com',
        clientId: CLIENT_ID,
        clientSecret: CLIENT_SECRET,
        refreshToken: REFRESH_TOKEN,
        accessToken: accessToken,
      },
    });

    // send mail with defined transport object
  let info = await transport.sendMail({
    from: '"Fred Foo 👻" <yousfi90lobna@gmail.com>', // sender address
    to: "yousfi55lobna@gmail.com", // list of receivers
    subject: "Hello ✔", // Subject line
    text: "Hello world?", // plain text body
    html: "<b>Hello world?</b>", // html body
    
  });
    console.log(info);
  } catch (error) {
    console.error(error);
  }
}


sendMail().catch(console.error);


