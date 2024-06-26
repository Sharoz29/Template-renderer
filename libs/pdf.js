// const puppeteer = require("puppeteer");

import axios from "axios";
import puppeteer from "puppeteer";
import path from "path";
import { fileURLToPath } from "url";
import FormData from "form-data";
import fs from "fs";

// Get the current file's directory
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

export async function createPdfFromHtml(htmlContent, options = {}) {
  // Launch a new browser instance
  const browser = await puppeteer.launch();
  const page = await browser.newPage();

  // Set the content of the page
  await page.setContent(htmlContent);

  // Generate the PDF and save it to the specified path
  const pdfBuffer = await page.pdf({
    format: "A4",
    scale: 0.7,
    printBackground: true,
    headerTemplate: `
      <div style="font-size:10px; width: 100%; text-align: center; margin-top: 10px;">
        <span class="title">Header here</span>
      </div>
    `,
    footerTemplate: `
      <div style="font-size:10px; width: 100%; text-align: center; margin-bottom: 10px;">
        <span class="pageNumber"></span> / <span class="totalPages"></span>
      </div>
    `,
    displayHeaderFooter: true,
    preferCSSPageSize: false,
    margin: {
      top: "1cm",
      bottom: "1cm",
      left: "3mm",
      right: "3mm",
    },
    ...options,
  });

  // Close the browser instance
  await browser.close();

  console.log("PDF created successfully");
  return pdfBuffer;
}

export function getDateString() {
  // return date as mm-dd-yy-hh-mm
  return new Date().toLocaleDateString().replace(/\//g, "-");
}
const pegaBaseUrl =
  "https://web.pega23.lowcodesol.co.uk/prweb/api/application/v2";

export async function uploadPdfToPega(pdfBuffer, pegaAuthToken) {
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
          Authorization: `Bearer ${pegaAuthToken}`,
        },
      }
    );
    console.log("Uploaded PDF to Pega: ", uploadResponse.data);
    return uploadResponse.data;
  } catch (e) {
    console.log("Error while uploading file", e);
    throw e;
  }
}

export async function attachPdfToCase(caseID, attachmentID, pegaAuthToken) {
  const attachment = {
    attachmentFieldName: "pyAttachmentPage",
    category: "FILE",
    delete: true,
    name: `cad-report-${getDateString()}.pdf`,
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
