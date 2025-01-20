import express, { request } from "express";
import { HBS } from "./libs/helpers.js";
import { getCaseData } from "./libs/pega.js";
import { getPDFBuffer, getCombinedPDFBuffer } from "./libs/pdf.js";
import bodyParser from "body-parser";
import * as path from "path";
import { fileURLToPath } from "url";
import { promisify } from "util";
import { coloredText } from "./libs/global.js";
import { attachPdfToCase, uploadPdfToPega } from "./libs/pega.js";

const __dirname = path.dirname(fileURLToPath(import.meta.url));

const app = express();
const router = express.Router();
app.use(express.json({ limit: "50mb" }));
app.use(bodyParser.json());
// Create `ExpressHandlebars` instance with a default layout.

// Register `hbs` as our view engine using its bound `engine()` function.
app.engine(".hbs", HBS.engine);
app.set("view engine", ".hbs");
app.set("views", path.resolve(__dirname, "./views"));

app.use("/reports", router);

const renderView = promisify(app.render.bind(app));

router.get("/attach-pdf/:id/:fileName", async (req, res) => {
  console.time(coloredText(req.params.id, "green") + " in");
  getPDFBuffer(req.params.id, renderView, "pdf")
    .then((data) =>
      uploadPdfToPega({
        ...data,
        caseID: req.params.id,
        fileName: req?.params?.fileName,
      })
    )
    .then(({ ID, access_token }) =>
      attachPdfToCase(
        `LCS-CALLADOC-WORK ${req.params.id}`,
        ID,
        access_token,
        req.params.id,
        req?.params?.fileName
      )
    )
    .then(async (response) => {
      // console.log("PDF uploaded successfully");
      console.timeEnd(coloredText(req.params.id, "green") + " in");
      res.send(
        await HBS.renderView(
          path.resolve(__dirname, "./views", "success.hbs"),
          {
            caseID: `${req.params.id}`,
          }
        )
      );
    })
    .catch((error) => {
      console.timeEnd(coloredText(req.params.id, "green") + " in");
      console.log("Has Error:", error.message);
      res.send(error);
      // res?.error(error.message);
    });
});

router.get("/attach-lab/:id", async (req, res) => {
  console.time(coloredText(req.params.id, "green") + "in");
  getPDFBuffer(req.params.id, renderView, "lab")
    .then((data) =>
      uploadPdfToPega({
        ...data,
        caseID: req.params.id,
        fileName: req?.query?.fileName,
      })
    )
    .then(({ ID, access_token }) =>
      attachPdfToCase(
        `LCS-CALLADOC-WORK ${req.params.id}`,
        ID,
        access_token,
        req.params.id,
        req?.query?.fileName
      )
    )
    .then(async (response) => {
      // console.log("PDF uploaded successfully");
      console.timeEnd(coloredText(req.params.id, "green") + " in");
      res.send(
        await HBS.renderView(
          path.resolve(__dirname, "./views", "success.hbs"),
          {
            caseID: `${req.params.id}`,
          }
        )
      );
    })
    .catch((error) => {
      console.timeEnd(coloredText(req.params.id, "green") + " in");
      console.log("Has Error:", error.message);
      res.send(error);
    });
});

router.get("/get-pdf/:id/:fileName", async (req, res) => {
  console.time(coloredText(req.params.id, "green") + " in");
  getPDFBuffer(req.params.id, renderView, "pdf")
    .then(({ pdfBuffer }) => {
      res.setHeader("Content-Type", "application/pdf");
      res.setHeader(
        "Content-Disposition",
        `attachment; filename=${req.params.fileName || "output"}-${
          req.params.id
        }.pdf`
      );
      res.send(pdfBuffer);
      console.timeEnd(coloredText(req.params.id, "green") + " in");
      // console.groupEnd();
    })
    .catch((error) => {
      // console.groupEnd();
      console.timeEnd(coloredText(req.params.id, "green") + " in");
      console.log("Has Error:", error.message);
      res.send(error);
      // res?.error(error.message);
    });
});
router.get("/get-lab/:id", async (req, res) => {
  console.time(coloredText(req.params.id, "green") + "in");
  getPDFBuffer(req.params.id, renderView, "lab")
    .then(({ pdfBuffer }) => {
      res.setHeader("Content-Type", "application/pdf");
      res.setHeader("Content-Disposition", "attachment; filename=output.pdf");
      res.send(pdfBuffer);
      console.timeEnd(coloredText(req.params.id, "green") + " in");
    })
    .catch((error) => {
      console.timeEnd(coloredText(req.params.id, "green") + " in");
      console.log("Has Error:", error.message);
      res.send(error);
    });
});

router.post("/get-selected-forms", async (req, res) => {
  const caseID =req?.body?.ID;
  const caseInfo=  await getCaseData(caseID).then(async (res) => {
    console.timeLog(
      coloredText(caseID, "green") + " in",
      " --> Before Rendering and Creation of PDF"
    )
    console.log(res,"response");
    return res;
  });
  if (!caseInfo) {
    console.error("Error: No case data found for caseID:", caseID);
    return res.status(404).send({
      error: "No case data found",
      caseID,
    });
  }
  const selectedForms = req.body.selectedForms;

  return await getCombinedPDFBuffer(renderView, caseInfo, selectedForms)
    .then(({ pdfBuffer }) => {
      const pdfBase64 = pdfBuffer.toString("base64");
      res.setHeader(
        "Content-Disposition",
        `attachment; filename=${req.body.fileName || "output"}-${
          caseID
        }.pdf`
      );
      res.json({
        fileName: `${req.body.fileName || "output"}-${
          caseID
        }.pdf`,
        pdf:pdfBase64,
      });

      console.timeEnd(
        coloredText(caseID)
      );
    })
    .catch((error) => {
      console.timeEnd(
        coloredText(caseID))
      console.log("Has Error:", error.message);
      res.send(error);
    });
});

router.get("/get-html/:id", async (req, res) => {
  console.time(coloredText(req.params.id, "green") + " in");
  try {
    res.render("home", { ...(await getCaseData(req.params.id)), type: null });
    console.timeEnd(coloredText(req.params.id, "green") + " in");
  } catch (error) {
    console.timeEnd(coloredText(req.params.id, "green") + " in");
    console.log("Has Error:", error);
    res?.error("Error while rendering HTML", error);
  }
});

router.use(express.static("public"));

console.clear();
app.listen(3000, () => {
  console.log("express-handlebars example server listening on: 3000");
});
