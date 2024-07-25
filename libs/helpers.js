import { create } from "express-handlebars"; // "express-handlebars"
import { hostUrl } from "./global.js";
import * as path from "path";
import { fileURLToPath } from "url";
import axios from "axios";

const __dirname = path.dirname(fileURLToPath(import.meta.url));

const twoPointOption = [
  "I use or have been advised to use a cane or walker to get around safely.",
  "I have fallen in the past year.",
];

export function camelToSentence(str) {
  if (!str) return;
  return str.replace(/([A-Z])/g, " $1").replace(/^./, function (str) {
    return str.toUpperCase();
  });
}

export function isTrue(value) {
  return value == true || value == "true";
}

export function formsToPrint(allForms, form) {
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
  if (!Array.isArray(array) || array?.length === 0) return;
  return array.find((obj) => obj[key] === value);
}
export function copyTelemedecineToFaceToFace(
  context,
  teleMedicines,
  medicalConditions = [],
  homeBound = [],
  certOfHomeBound = []
) {
  return {
    ...context,
    FaceToFace: {
      ...teleMedicines,
      OtherMedicalConditionsOnFaceToFaceCheckbox:
        teleMedicines?.OtherMedicalConditionsOnTelemedicineCheckbox,
      OtherMedicalConditionsOnFaceToFaceTextbox:
        teleMedicines?.OtherMedicalConditionsOnTelemedicineTextbox,
      ReasonForHomebound: teleMedicines?.ReasonForHomeboundTelemedicine,
      isTM: true,
    },
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

/** If context has Telemedicine as AppointmentType */

export function F2FTMText(context) {
  return context?.isTM ? "Telemedicine" : "Face to Face";
}
export function CheckOrRadio(type) {
  return type === "radio" ? "radio" : "checkbox";
}
export function allergiesChecker(allergies) {
  return allergies === "No Known Allergies";
}
export function checker(use, name) {
  return name === "Yes"
    ? use === true || use === "true"
    : use === false || use === "false";
}
export function formatDate(date) {
  // return date as mm-dd-yy-hh-mm
  return new Date(date).toLocaleDateString().replace(/\//g, "-");
}
export function fallRiskMapper(array, options) {
  if (!Array.isArray(array) || array?.length === 0) return "";
  const newObj = array.reduce(
    (acc, item) => {
      const { IsChecked, FallRiskOption, WhyItMatters } = item;
      const isInTwoPoints = twoPointOption.includes(FallRiskOption);
      const newItem = {
        IsYes: IsChecked === "true",
        IsNo: IsChecked === "false",
        FallRiskOption: FallRiskOption,
        WhyItMatters: WhyItMatters,
        text: isInTwoPoints ? "Yes (2)" : "Yes (1)",
        weight: isInTwoPoints ? 2 : 1,
      };

      return {
        data: [...acc.data, newItem],
        count: acc.count + (IsChecked === "true" ? newItem.weight : 0),
      };
    },
    { count: 0, data: [] }
  );

  return options.fn(newObj);
}

function extractDatePart(dateString, type) {
  if (dateString) {
    const dateParts = dateString.split("-");

    const typeMap = {
      month: 1,
      day: 2,
      year: 0,
    };

    if (typeMap[type] !== undefined) {
      return dateParts[typeMap[type]];
    }
  }
}

export function getSignatureUrl(context, person) {
  switch (person) {
    case "patient":
      return context?.PatientsSignature || "";
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
  if (!Array.isArray(array) || array?.length === 0) return "";
  let result = "";
  for (let i = 0; i < array?.length; i += chunkSize) {
    let chunk = array.slice(i, i + chunkSize);
    result += options.fn({ chunk, $last: i + chunkSize >= array.length });
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

export function getMedicalConditionsFromF2F(context, option) {
  const medicalConditions = [];
  const pmh = context?.SelectedPastMedicalHistory;

  const isTrue = (mc) => mc.IsChecked === "true" || mc.IsChecked === true;

  if (pmh?.length > 0) {
    for (let i = 0; i < pmh.length; i++) {
      if (isTrue(pmh[i])) {
        const medCon = isTrue(pmh[i]) ? pmh[i] : "";
        console.log(medCon);
        medicalConditions.push(medCon);
      }
    }
  }
  return medicalConditions;
}

export function filterArr(arr, criteria, options) {
  let result = "";
  if (!Array.isArray(arr) || arr?.length === 0) return [];
  const filteredArr = arr.filter((item) => item.IsChecked === criteria);
  filteredArr.forEach((item) => {
    result += options.fn(item);
  });
  return result;
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
  CheckOrRadio,
  allergiesChecker,
  checker,
  formatDate,
  hostUrl,
  getSignatureUrl,
  splitArrayByNumber,
  imageToDataUrl,
  getMedicalConditionsFromF2F,
  extractDatePart,
  F2FTMText,
  filterArr,
  fallRiskMapper,
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
