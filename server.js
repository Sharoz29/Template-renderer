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
  //   "eyJraWQiOiJiOTk4YWY5YzJiOWY3MWI2ZDA3NGFmZThjMjUzN2JmOCIsInR5cCI6IkpXVCIsImFsZyI6IlJTMjU2In0.eyJhdWQiOiJ1cm46MTQ5NjUwOTA1NjQwODExMzY1MzUiLCJzdWIiOiJBcnNsYW4uYW5zYXJpQGxvd2NvZGVzb2wuY29tIiwiYXBwX25hbWUiOiJDb21tb25UZXN0IiwibmJmIjoxNzE5MzkzMDMyLCJhcHBfdmVyc2lvbiI6IjAxLjAxLjAxIiwiaXNzIjoidXJuOndlYi5wZWdhMjMubG93Y29kZXNvbC5jby51ayIsImV4cCI6MTcxOTM5NjYzMiwiaWF0IjoxNzE5MzkzMDMyLCJqdGkiOiI0ZjQ2MDFkMDM3NWQ2ZjllZmQ5ZDE0MTkxMGIzNzU4MCIsIm9wZXJhdG9yX2FjY2VzcyI6IkNvbW1vblRlc3Q6QWRtaW4ifQ.NHjbBBP32bM8FSj21I4fA-sCTYRd1sdajLWixun0zQFIuhkMz_fYO5FystO_pRaejE76vxkxKqJAtgdKGv10P4aq_3jAx8wezHB76oDtXP6JYu87pRBLwO9MeFVxNuuRtqkiVlVAJv_n5fXNsIUGUMo77YcruIxPfILmbwZzm15z86J6Ez8C3obsQNGRkf4oykIeJHbjHW3dZN5Wl6MfI_Epd4xAAUqE1nlu58iSoTZQC3T0LO7N6_NQQdBrw7YhUOisz1jauJs9U2s_ugJj-ft99eIEfE4K_CbpaUZo81yU0NpfArkN_6ZjujA2sSljafjoIAXp3iX6W81FVMP1iDGmL6sSWomreQX61OMRairXvs-bpwMMEfEZoRbtH55i00fE_L3_3a-tsB1ePMPx-kx_Iyu3jAYk1jZCoFhJKdmad9Y--N1KUyUEUOqhcooLUFoCN0USZ7-OXh5zHOib_SoGFbq9DYDmvWF7XubnWWmaHyfUxUi3RJmRgLKsCkuadSZQTezfc_GIeN-cae8CsgNQ1wwiWz0ZBu4gkOmttIBNRA58tBMw4ftf9tJcWRns3G2e3MBVU2DVCN5a9DGdqIiROBiHRlcYK9WgHslt0ucjzuKZnsqmiRHSOFKz07jva49fKGnfv50urDxIob__PqHLCqaTeLDQchNQARn_F5k";
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
