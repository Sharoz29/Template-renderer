// const puppeteer = require("puppeteer");

import axios from "axios";
import puppeteer from "puppeteer";
import path from "path";
import { fileURLToPath } from "url";
import FormData from "form-data";
import { HBS, helpers } from "./helpers.js";
import { getCaseData } from "./pega.js";
import fs from "fs";

import { pegaBaseUrl as _pegaBaseUrl } from "./global.js";

const pegaBaseUrl = `${_pegaBaseUrl}/prweb/api/application/v2`;

// Get the current file's directory
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

export async function createPdfFromHtml(htmlContent, options = {}) {
  // Launch a new browser instance
  const browser = await puppeteer.launch({
    headless: true,
    args: ["--no-sandbox", "--disable-setuid-sandbox"],
  });
  const page = await browser.newPage();

  // Set the content of the page
  await page.setContent(htmlContent, { waitUntil: "networkidle0" });
  await page.addStyleTag({
    content: `
    @page {
      margin: 0.9in 0.1in 0.5in 0.1in;
    }
    body {
      margin: 0;
    }
  `,
  });
  // Generate the PDF and save it to the specified path
  try {
    // await page.evaluateHandle("document.fonts.ready");
    // const screenShotBuffer = await page.screenshot({
    //   type: "jpeg",
    //   quality: 100,
    //   fullPage: true,
    //   captureBeyondViewport: true,
    //   path: "output.jpg",
    // });

    // fs.writeFileSync("output.jpg", screenShotBuffer);

    const pdfBuffer = await page.pdf({
      format: "A4",
      scale: 0.8,
      printBackground: true,
      displayHeaderFooter: true,
      preferCSSPageSize: true,
      ...options,
    });
    await browser.close();
    console.log("PDF created successfully");
    return pdfBuffer;
  } catch (error) {
    console.log(error);
    throw error;
  }
  // Close the browser instance
}

export function getDateString() {
  // return date as mm-dd-yy-hh-mm
  return new Date().toLocaleDateString().replace(/\//g, "-");
}

export async function uploadPdfToPega(pdfBuffer, access_token) {
  const form = new FormData();
  form.append("file", pdfBuffer, {
    filename: `cad-report-${getDateString()}.pdf`,
    contentType: "application/pdf",
  });

  try {
    const uploadResponse = await axios.post(
      `${pegaBaseUrl}/attachments/upload`,
      form,
      {
        headers: {
          ...form.getHeaders(),
          Authorization: `Bearer ${access_token}`,
        },
      }
    );
    console.log("Uploaded PDF to Pega: ", uploadResponse.data);
    return {
      ...uploadResponse.data,
      access_token: access_token,
    };
  } catch (e) {
    console.log("Error while uploading file", e);
    throw e;
  }
}

export async function attachPdfToCase(caseID, attachmentID, pegaAuthToken) {
  if (!caseID) throw new Error("Case ID is required for attachment");

  const id = (caseID.split(" ") && caseID.split(" ")[1]) || "cad";
  const attachment = {
    attachmentFieldName: "pyAttachmentPage",
    category: "FILE",
    delete: true,
    name: `${id}-report-${getDateString()}.pdf`,
    pyPurpose: "out class pega developers",
    type: "FILE",
    ID: attachmentID,
  };

  try {
    const attachmentResponse = await axios.post(
      `${pegaBaseUrl}/cases/${caseID}/attachments`,
      {
        attachments: [{ ...attachment }],
      },
      {
        headers: {
          Authorization: `Bearer ${pegaAuthToken}`,
        },
      }
    );
    console.log("Attached PDF to case");
    return attachmentResponse.data;
  } catch (error) {
    console.log("Error while attaching file", error);
    throw error;
  }
}

export function getPDFBuffer(caseID, renderView) {
  return getCaseData(caseID).then(async (data) => {
    return {
      access_token: data.access_token,
      pdfBuffer: await createPdfFromHtml(await renderView("home", data), {
        path: path.join(__dirname, "output.pdf"),
        printBackground: true,

        headerTemplate: await HBS.render(
          path.resolve(__dirname, "../views/header.hbs"),
          {
            ...data,
            officeLogo: await helpers.imageToDataUrl(
              "https://web.pega23.lowcodesol.co.uk/reports/assets/office_logo.jpeg"
            ),
          }
        ),
        footerTemplate: await HBS.render(
          path.resolve(__dirname, "../views", "footer.hbs"),
          data
        ),
      }),
    };
  });
}
