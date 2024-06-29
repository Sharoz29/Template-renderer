import express, { request } from "express";
import { HBS } from "./libs/helpers.js";
import { getCaseData } from "./libs/pega.js";
import { getPDFBuffer } from "./libs/pdf.js";
import bodyParser from "body-parser";
import * as path from "path";
import { fileURLToPath } from "url";
import { promisify } from "util";

import {
  createPdfFromHtml,
  attachPdfToCase,
  uploadPdfToPega,
} from "./libs/pdf.js";

const __dirname = path.dirname(fileURLToPath(import.meta.url));

const app = express();
const router = express.Router();
// Create `ExpressHandlebars` instance with a default layout.

// Register `hbs` as our view engine using its bound `engine()` function.
app.engine(".hbs", HBS.engine);
app.set("view engine", ".hbs");
app.set("views", path.resolve(__dirname, "./views"));

app.use("/reports", router);

const renderView = promisify(app.render.bind(app));

router.get("/attach-pdf/:id", async (req, res) => {
  getPDFBuffer(req.params.id, renderView)
    .then((data) => uploadPdfToPega(data.pdfBuffer, data.access_token))
    .then(({ ID, access_token }) =>
      attachPdfToCase(`LCS-CALLADOC-WORK ${req.params.id}`, ID, access_token)
    )
    .then(async (response) => {
      console.log("PDF uploaded successfully");
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
      console.log("Has Error:", error.message);
      res.send(error);
      // res?.error(error.message);
    });
});

router.get("/get-pdf/:id", async (req, res) => {
  getPDFBuffer(req.params.id, renderView)
    .then(({ pdfBuffer }) => {
      res.setHeader("Content-Type", "application/pdf");
      res.setHeader("Content-Disposition", "attachment; filename=output.pdf");
      res.send(pdfBuffer);
    })
    .catch((error) => {
      console.log("Has Error:", error.message);
      res.send(error);
      // res?.error(error.message);
    });
});

router.get("/get-html/:id", async (req, res) => {
  try {
    res.render("home", await getCaseData(req.params.id));
  } catch (error) {
    console.log("Has Error:", error);
    res?.error("Error while rendering HTML", error);
  }
});

router.use(express.static("public"));

app.listen(3000, () => {
  console.log("express-handlebars example server listening on: 3000");
});

// HBS.render("footer", {
//   title: "My Footer",
// }).then((template) => console.log("Footer:", template));

// HBS.render(path.resolve(__dirname, "./views", "header.hbs"), {
//   title: "My Header",
// }).then((template) => console.log("Header:", template));
