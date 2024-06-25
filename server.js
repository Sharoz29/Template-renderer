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
  // "eyJraWQiOiJiOTk4YWY5YzJiOWY3MWI2ZDA3NGFmZThjMjUzN2JmOCIsInR5cCI6IkpXVCIsImFsZyI6IlJTMjU2In0.eyJhdWQiOiJ1cm46MTQ5NjUwOTA1NjQwODExMzY1MzUiLCJzdWIiOiJBcnNsYW4uYW5zYXJpQGxvd2NvZGVzb2wuY29tIiwiYXBwX25hbWUiOiJDb21tb25UZXN0IiwibmJmIjoxNzE5MzE5NTQ1LCJhcHBfdmVyc2lvbiI6IjAxLjAxLjAxIiwiaXNzIjoidXJuOndlYi5wZWdhMjMubG93Y29kZXNvbC5jby51ayIsImV4cCI6MTcxOTMyMzE0NSwiaWF0IjoxNzE5MzE5NTQ1LCJqdGkiOiIzMTZjYzAzZDllOWRjOWYyZmY0NTUzNzExMWM4MTU3NiIsIm9wZXJhdG9yX2FjY2VzcyI6IkNvbW1vblRlc3Q6QWRtaW4ifQ.AykMogrK1bFnU89UwvEiEY2NqYgjtHe5mT9chNoPnC1LSgoPd1nU9faep-zhsY3HAVxWWixtzqB305ixGcRaCd-u2TvqkqvfH4dOpwvM-WegvLByw35juBd1NK8eqanv2Im7sHjGNqoKd48tH_iEXoJcBnfl9iGqQpYK6jQJW1xZrPHF8hxo0cX9WP_urayDOj3yvT7LbYxqdgnHwXARb37Lq1Zme772QEVks3zNl3yxe9FmKilHTmfYWEADw-FsKR2VtbQ10DLrgRIwr_0HKtLRoTGTDcPRQiyg3VsKrAuzn__vP8HeNqqav3FDhWuNU_jVb08pyLXK5s-zw0hKOZMCskduMT01juG6SeQ-0-MrIfT8YdQu0hwa0rnYvhIOMbCTp1X2dT7-UPfKXVovR5ITxkqhLUjHwt5ZYC4zBu0MZaG5-nxtYNbU0T4yKqzZSkDsr4_YHoW5_xcZQpcFrH6GoQiLFlrLY7o3lghBG7ShfC9nESMTYa_30xh0cQm5xudf20M4-15RE6ORyfhOeAzEDhIWBSx4HN8pSU6wB_cgPI7IIHDIKfqRzz959uAG-qvVDf7TGpI5-d_p3cm6a-l3PoRTWj5WcOBVTYfSe_e6ufZSkZ42zZ5mNEwfetjJT4txxXcMZaCzhaJgH0JFaaM0w2oRwQhtefAai1XFczs";
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
