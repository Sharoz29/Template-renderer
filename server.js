import express, { request } from "express";
import { HBS, helpers } from "./libs/helpers.js";
import bodyParser from "body-parser";
import * as path from "path";
import { fileURLToPath } from "url";
import { mockContext } from "./libs/mock.js";
import axios from "axios";
import { getToken } from "./libs/oauth.js";
const __dirname = path.dirname(fileURLToPath(import.meta.url));

const app = express();

// Create `ExpressHandlebars` instance with a default layout.

// Register `hbs` as our view engine using its bound `engine()` function.
app.engine(".hbs", HBS.engine);
app.set("view engine", ".hbs");
app.set("views", path.resolve(__dirname, "./views"));

var jsonParser = bodyParser.json();

// create application/x-www-form-urlencoded parser
var urlencodedParser = bodyParser.urlencoded({ extended: false });

app.get("/get-html/:id", async (req, res) => {
  const access_token = await getToken();
  try {
    const response = await axios.get(
      `https://web.pega23.lowcodesol.co.uk/prweb/api/v1/cases/LCS-CALLADOC-WORK ${req.params.id}`,
      {
        headers: {
          Authorization: `Bearer ${access_token}`,
          Accept: "application/json",
        },
      }
    );
    const data = response.data;
    const AppointmentInformation = data.content.AppointmentInformation;
    const SelectedFunctionalLimitations =
      data.content.SelectedFunctionalLimitations;
    const SelectedPatientDiets = data.content.SelectedPatientDiets;
    const SelectedPatientsDME = data.content.SelectedPatientsDME;
    const SelectedPatientSupplies = data.content.SelectedPatientSupplies;
    const SelectedPatientsLabDx = data.content.SelectedPatientsLabDx;
    const SelectedLabsOnReferal = data.content.SelectedLabsOnReferal;

    res.render("home", {
      ...mockContext,
      ...AppointmentInformation,
      SelectedFunctionalLimitations,
      SelectedPatientDiets,
      SelectedPatientsDME,
      SelectedPatientSupplies,
      SelectedPatientsLabDx,
      SelectedLabsOnReferal,
    });
    // res.send(response.data);
  } catch (error) {
    console.log("Has Error:", error.message);
    res.error(error.message);
  }
});

// app.get("/yell", (req, res) => {
//   res.render("yell", {
//     title: "Yell",

//     // This `message` will be transformed by our `yell()` helper.
//     message: "hello world",
//   });
// });

// app.get("/exclaim", (req, res) => {
//   res.render("yell", {
//     title: "Exclaim",
//     message: "hello world",

//     // This overrides _only_ the default `yell()` helper.
//     helpers: {
//       yell(msg) {
//         return msg + "!!!";
//       },
//     },
//   });
// });

// app.get("/echo/:message?", exposeTemplates, (req, res) => {
//   res.render("echo", {
//     title: "Echo",
//     message: req.params.message,

//     // Overrides which layout to use, instead of the defaul "main" layout.
//     layout: "shared-templates",

//     partials: Promise.resolve({
//       echo: hbs.handlebars.compile("<p>ECHO: {{message}}</p>"),
//     }),
//   });
// });

app.use(express.static("dist"));

app.listen(3000, () => {
  console.log("express-handlebars example server listening on: 3000");
});
