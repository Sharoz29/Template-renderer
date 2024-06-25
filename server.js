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
  // const access_token = await getToken();
  const access_token =
    "eyJraWQiOiJiOTk4YWY5YzJiOWY3MWI2ZDA3NGFmZThjMjUzN2JmOCIsInR5cCI6IkpXVCIsImFsZyI6IlJTMjU2In0.eyJhdWQiOiJ1cm46MTQ5NjUwOTA1NjQwODExMzY1MzUiLCJzdWIiOiJBcnNsYW4uYW5zYXJpQGxvd2NvZGVzb2wuY29tIiwiYXBwX25hbWUiOiJDb21tb25UZXN0IiwibmJmIjoxNzE5MzEyNzI5LCJhcHBfdmVyc2lvbiI6IjAxLjAxLjAxIiwiaXNzIjoidXJuOndlYi5wZWdhMjMubG93Y29kZXNvbC5jby51ayIsImV4cCI6MTcxOTMxNjMyOSwiaWF0IjoxNzE5MzEyNzI5LCJqdGkiOiIyODdmYTM0YTQxNzAxZDI5YmM4MTc0MDBiNDhhMThiNCIsIm9wZXJhdG9yX2FjY2VzcyI6IkNvbW1vblRlc3Q6QWRtaW4ifQ.M9y8rNCRISdQWG4N1pNfBz9pcU99zOSZo6JdiiAH90jPSWfXcF03jHtTOIL1CxfF0Oxxa7iphAUTMHSDMRQOPGabay5jKPkiAY5rRn6vZHUx_BmDO7dybwL-jRuIOfArBU3bcSdq4zhjnoow-4rc56C18l5RJI8NENPBnzHo15aoP0m4JOtU28t5M9y4u3bCW9u0Dquma3DXAFWvdlm4yjUKg48kj5Zb1U_fASh_Dk5YVqA9L_NjWJgks1wCDEGj64T-I_YMnP2udOdRvktokhQl0rboWYhqXMEEdkmo4_Mv2GMzii9CxVXEhOVZG23iAvToOaTlVMP_yzJODhPHqxY8SC2gtXCSkcPtSEUz6FRykBYHJ_sJuZR9VlN-WEShzuTuAYGR4PAyZF2fRB83AyGi7s70et9adLkvWrh2ZUIVQgrFnAytp7ORmWIXon3Dh60U-k60b4M-dbYp9682rtAa0gty-Nz_OMAGQQ7pfovzURgcIaAdludw1WMxQQwZXKKEThj-OrVcf5KYiNLUhu4wQdOkdRSWOFduYLnMAa38cjsgWot50MxihkvXAjTkUrUioYpQqtozAtLqBu9Rs75ur9ApW-qPks6RpU-XWe_7PrSsOFWDyirmX2YL-jrvJuKbYc4IUzdPhLFlPWddRYlw3vpKrPK5eeLbotETfZw";
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
      SelectedHomeBound: data.content.SelectedHomeBound,
      SelectedHomeBoundOnTelemedicine:
        data.content.SelectedHomeBoundOnTelemedicine,
      SelectedHomeBoundStatusOnFaceToFace:
        data.content.SelectedHomeBoundStatusOnFaceToFace,
      SelectedHomeBoundStatusOnTelemedicine:
        data.content.SelectedHomeBoundStatusOnTelemedicine,
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
