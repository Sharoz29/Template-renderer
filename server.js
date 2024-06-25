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
  // const access_token =
  //   "eyJraWQiOiJiOTk4YWY5YzJiOWY3MWI2ZDA3NGFmZThjMjUzN2JmOCIsInR5cCI6IkpXVCIsImFsZyI6IlJTMjU2In0.eyJhdWQiOiJ1cm46MTQ5NjUwOTA1NjQwODExMzY1MzUiLCJzdWIiOiJBcnNsYW4uYW5zYXJpQGxvd2NvZGVzb2wuY29tIiwiYXBwX25hbWUiOiJDb21tb25UZXN0IiwibmJmIjoxNzE5MzE5MzUzLCJhcHBfdmVyc2lvbiI6IjAxLjAxLjAxIiwiaXNzIjoidXJuOndlYi5wZWdhMjMubG93Y29kZXNvbC5jby51ayIsImV4cCI6MTcxOTMyMjk1MywiaWF0IjoxNzE5MzE5MzUzLCJqdGkiOiJkZDZkODc3NDk2MWFhZjEwNmNmOTY1YzNkY2VmYTdmZCIsIm9wZXJhdG9yX2FjY2VzcyI6IkNvbW1vblRlc3Q6QWRtaW4ifQ.JiKGkdFFO6GrrdmSmzL4pe_SClT7UHOV_lLzmK9kahQgubh4YshxSJBB7hYIDHY0rfZUKYn8raFhf_KAwjBYv45gQ1B-7G8ZWiTat0JbggmHgeM881YkMmtpHNrFExCoUWg5PwTFpD5gj36PnQ5TMy7lGqXlr33uHuJEqV_JwIE6Q7SxMzj5BRmt2fVkD4FQ-WStLqDaLJTrYw_VJTrhscCKvc2v-V3XQDHQo6uWFlTYIbWABHuK5nHUCAMZ8qT76lvcOlCM4RkQN-wansq-RCNbdTS4YWaoTREqXUzaqr8D33kX8Ez6JoWQyFuBVoQULBYac27_fufVJn_sXgGfgwyK9dDdpAL1wML_MLLlAmJroEiJplmdkvwYUQu_s92bw7stWMJKMp5pjVMSOrJrYJlF8uQK9sD5iZ8-LKuFVNDIUJa22P6tT5ewLQZdTmTRcYAEKBlZFJPZHhc0DArbnVXGJTtJVLn0y15feguM4Ue4OoqIX41p4axiRJPQEvUg_RAErGdfGD4-1kGjgaY5xG0ot23Xy6dNgFsko6XhuZQ_rPus0_rgLWLYowwPqxb_BiwSf-NNSbTxFYSdLJPIDCSaZSsKtLWBWYHb7MBvbLjqu-t8iy440AN1r8H_xsVTgmsGijqc80My2n8bvWkld3ZI58JLvAo_EodN1ufxlYg";
  console.log(access_token);

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
    const SelectedMedicalConditionsOnTelemedicine =
      data.content.SelectedMedicalConditionsOnTelemedicine;
    const SelectedMedicalConditionsOnFaceToFace =
      data.content.SelectedMedicalConditionsOnFaceToFace;
    const SelectedHomeBound = data.content.SelectedHomeBound;
    const SelectedHomeBoundOnTelemedicine =
      data.content.SelectedHomeBoundOnTelemedicine;
    const SelectedHomeBoundStatusOnFaceToFace =
      data.content.SelectedHomeBoundStatusOnFaceToFace;
    const SelectedHomeBoundStatusOnTelemedicine =
      data.content.SelectedHomeBoundStatusOnTelemedicine;
    const SelectMD = data.content.SelectMD;

    res.render("home", {
      ...mockContext,
      ...AppointmentInformation,
      SelectedFunctionalLimitations,
      SelectedPatientDiets,
      SelectedPatientsDME,
      SelectedPatientSupplies,
      SelectedPatientsLabDx,
      SelectedLabsOnReferal,
      SelectedMedicalConditionsOnTelemedicine,
      SelectedMedicalConditionsOnFaceToFace,
      SelectedHomeBound,
      SelectedHomeBoundOnTelemedicine,
      SelectedHomeBoundStatusOnFaceToFace,
      SelectedHomeBoundStatusOnTelemedicine,
      SelectMD,
    });
    // res.send(response.data);
  } catch (error) {
    console.log("Has Error:", error.message);
    // res?.error(error.message);
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
