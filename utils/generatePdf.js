const puppeteer = require("puppeteer");
const Commande = require("../models/Commande");
module.exports = async (html = "", invoiceNumber) => {
  const browser = await puppeteer.launch();
  const page = await browser.newPage();

  await page.setContent(html);
  let basePath = require("path").resolve(__dirname, "..");
  let documentPath = `${basePath}/doc/${invoiceNumber}.pdf`;
  const pdfBuffer = await page.pdf();
  await page.pdf({
    path: documentPath,
    format: "A4",
  });
  await page.close();
  await browser.close();
  console.log("Invoice Number",invoiceNumber)
  let result = await Commande.findByIdAndUpdate(invoiceNumber, {
    documentUrl: `documents/${invoiceNumber}.pdf`,
  });
  return pdfBuffer;
};
