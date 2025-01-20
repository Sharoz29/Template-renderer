// const puppeteer = require("puppeteer");

import { axios } from "./axios.js";
import puppeteer from "puppeteer";
import path from "path";
import { fileURLToPath } from "url";
import { HBS, helpers } from "./helpers.js";
import { getCaseData } from "./pega.js";
import { coloredText } from "./global.js";
import { mockContext } from "./mock.js";

// Get the current file's directory
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

export async function createPdfFromHtml(htmlContent, options = {}) {
  // Launch a new browser instance
  // if (!global.page) {
  //   console.log("Launching browser");
  // }
  const browser = await puppeteer.launch({
    headless: true,
    args: ["--no-sandbox", "--disable-setuid-sandbox"],
  });

  global.page = await browser.newPage();
  const page = global.page;
  // Set the content of the page
  await page.setContent(htmlContent, { waitUntil: "load" });
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
      scale: 0.75,
      printBackground: true,
      displayHeaderFooter: true,
      preferCSSPageSize: true,
      ...options,
    });
    // await page.close();
    // await browser.close();
    // console.log("PDF created successfully");
    return pdfBuffer;
  } catch (error) {
    console.log(error);
    throw error;
  }
  // Close the browser instance
}

export function getPDFBuffer(caseID, renderView, type) {
  return getCaseData(caseID).then(async (data) => {
    console.timeLog(
      coloredText(caseID, "green") + " in",
      " --> Before Rendering and Creation of PDF"
    );
    const viewData = { ...data, type };
    return {
      access_token: data.access_token,
      pdfBuffer: await createPdfFromHtml(
        await renderView("home", { ...viewData }),
        {
          printBackground: true,
          layout: "main",
          headerTemplate: await HBS.render(
            path.resolve(__dirname, "../views/header.hbs"),
            {
              ...viewData,
              officeLogo: `data:image/jpeg;base64,${data?.Office?.LogoAttachStream}`,
            }
          ),
          footerTemplate: await HBS.render(
            path.resolve(__dirname, "../views", "footer.hbs"),
            viewData
          ),
        }
      ).then((data) => {
        console.timeLog(
          coloredText(caseID, "green") + " in",
          " --> After Rendering and Creation of PDF pm"
        );
        return data;
      }),
    };
  });
}

export async function getCombinedPDFBuffer(renderView, data, selectedForms) {
  const caseID = data?.ID;
  console.timeLog(
    coloredText(caseID, "green") + " in",
    " --> Before Rendering and Creation of PDF"
  );



  const processedData = {
    ...data,
  };

  const viewData = { ...processedData, type: "pdf" };
  return {
    pdfBuffer: await createPdfFromHtml(
      await renderView("home", { ...viewData }),
      {
        printBackground: true,
        layout: "main",
        headerTemplate: await HBS.render(
          path.resolve(__dirname, "../views/header.hbs"),
          {
            ...viewData,
            officeLogo: `data:image/jpeg;base64,${processedData?.Office?.LogoAttachStream}`,
          }
        ),
        footerTemplate: await HBS.render(
          path.resolve(__dirname, "../views", "footer.hbs"),
          viewData
        ),
      }
    ).then((data) => {
      console.timeLog(
        coloredText(caseID, "green") + " in",
        " --> After Rendering and Creation of PDF pm"
      );
      return data;
    }),
  };
}
