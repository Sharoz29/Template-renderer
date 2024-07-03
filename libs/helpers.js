import { create } from "express-handlebars"; // "express-handlebars"
import { hostUrl } from "./global.js";
import * as path from "path";
import { fileURLToPath } from "url";
import axios from "axios";

const __dirname = path.dirname(fileURLToPath(import.meta.url));

export function camelToSentence(str) {
  if (!str) return;
  return str.replace(/([A-Z])/g, " $1").replace(/^./, function (str) {
    return str.toUpperCase();
  });
}

export function isTrue(value, options) {
  return value == true || value == "true";
}

export function formsToPrint(allForms, form, options) {
  if (allForms.includes(form)) {
    return form;
  }
  return "";
}

export function addToObject(obj, key, value) {
  return { ...obj, [key]: value };
}

export function heading(context) {
  return new HBS.handlebars.SafeString(
    `<h2 class="text-center m-auto">${HBS.helpers.camelToSentence(
      context.currentForm
    )}</h2>`
  );
}

export function isSelected(lab, selectedLabs, options) {
  if (selectedLabs.includes(lab)) {
    return options.fn(this);
  }
  return options.inverse(this);
}

export function findWithKey(array, key, value) {
  return array.find((obj) => obj[key] === value);
}

export function copyTelemedecineToFaceToFace(
  context,
  teleMedicines,
  medicalConditions,
  homeBound,
  certOfHomeBound
) {
  return {
    ...context,
    FaceToFace: { ...teleMedicines },
    SelectedMedicalConditionsOnFaceToFace: [...medicalConditions],
    SelectedHomeBound: [...homeBound],
    SelectedHomeBoundStatusOnFaceToFace: [...certOfHomeBound],
  };
}

export function counter(index) {
  return index + 1;
}

export function radioButtonChecker(option, name) {
  return option === name;
}

export function allergiesChecker(allergies) {
  return allergies === "No Known Allergies";
}
export function checker(use, name) {
  return name === "Yes"
    ? use === true || use === "true"
    : use === false || use === "false";
}
export function dailyUseChecker(frequency, name) {
  return frequency === name;
}

export function formatDate(date) {
  // return date as mm-dd-yy-hh-mm
  return new Date(date).toLocaleDateString().replace(/\//g, "-");
}

export function countOfOption(boolOfIsChecked, context) {
  let count = 0;
  if (!Array.isArray(context) || context.length === 0) return 0;
  context.forEach((item) => {
    if (
      item.IsChecked === boolOfIsChecked ||
      item.IsChecked === `${boolOfIsChecked}`
    ) {
      count++;
    }
  });
  return count;
}

export function getSignatureUrl(context, person) {
  switch (person) {
    case "patient":
      return context?.AnnualWellnessForm?.PatientsSignature || "";
    case "physician":
      return context?.SignatureCapture3 || "";
    case "witness":
      return context?.RecordReleaseAuthorization?.Witness || "";
    case "provider":
      return context?.SignatureCapture2 || "";
    case "authorization":
      return context?.RecordReleaseAuthorization?.AuthorizationSignature || "";
  }
}
export function splitArrayByNumber(array, chunkSize, options) {
  if(!array || array?.length === 0) return [];

  let result = "";
  for (let i = 0; i < array?.length; i += chunkSize) {
    let chunk = array.slice(i, i + chunkSize);
    result += options.fn({ chunk });
  }
  return result;
}

export async function imageToDataUrl(url) {
  return await axios
    .get(url, { responseType: "arraybuffer" })
    .then((response) => {
      const contentType = response.headers["content-type"];
      let body = "data:" + contentType + ";base64,";
      body += Buffer.from(response.data).toString("base64");
      return body;
    });
}

export const helpers = {
  camelToSentence,
  formsToPrint,
  addToObject,
  heading,
  isSelected,
  findWithKey,
  isTrue,
  copyTelemedecineToFaceToFace,
  counter,
  radioButtonChecker,
  allergiesChecker,
  checker,
  dailyUseChecker,
  formatDate,
  hostUrl,
  getSignatureUrl,
  countOfOption,
  splitArrayByNumber,
  imageToDataUrl,
};

export const HBS = create({
  helpers,
  extname: ".hbs",
  // Uses multiple partials dirs, templates in "shared/templates/" are shared
  // with the client-side of the app (see below).
  partialsDir: ["views/partials/"],
});

// import https from "https";

// https
//   .get(
//     "https://web.pega23.lowcodesol.co.uk/reports/assets/polst.jpeg",
//     (resp) => {
//       resp.setEncoding("base64");
//       let body = "data:" + resp.headers["content-type"] + ";base64,";
//       resp.on("data", (data) => {
//         body += data;
//       });
//       resp.on("end", () => {
//         console.log(body);
//         //return res.json({result: body, status: 'success'});
//       });
//     }
//   )
//   .on("error", (e) => {
//     console.log(`Got error: ${e.message}`);
//   });
