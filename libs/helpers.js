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
  return value == true || value == "true" || value == "Yes";
}
export function mapCheckedItems(allItems, checkedItems) {

  const checkedIDs = checkedItems?.map((item) => item.ID);

  // Map through allItems and add IsChecked based on the comparison
  return allItems?.map((item) => ({
    ...item,
    IsChecked: checkedIDs?.includes(item.ID),
  }));
};
export function isFalse(value) {
  return value == false || value == "false" || value == "No";
}

export function formsToPrint(allForms, form, context) {
  if (
    form == "teleMedicines" &&
    context.AppointmentDetails.TypeOfVisit == "Telemedicine"
  ) {
    return form;
  }
  if (
    form == "faceToFaceEncounter" &&
    context.AppointmentDetails.TypeOfVisit == "Face to Face"
  ) {
    return form;
  }

  if (
    !["teleMedicines", "faceToFaceEncounter"]?.includes(form) &&
    allForms?.includes(form)
  ) {
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
export function calculateAge(dob) {
  if (!dob) return "";
  const birthDate = new Date(dob);
  const today = new Date();
  let age = today.getFullYear() - birthDate.getFullYear();
  const monthDifference = today.getMonth() - birthDate.getMonth();
  if (
    monthDifference < 0 ||
    (monthDifference === 0 && today.getDate() < birthDate.getDate())
  ) {
    age--;
  }
  return age;
}

export function isSelected(lab, selectedLabs, options) {
  if (selectedLabs?.includes(lab)) {
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
export function equalityChecker(a, b) {
  return a === b;
}

/** If context has Telemedicine as AppointmentType */

export function F2FTMText(context) {
  return context?.isTM ? "Telemedicine" : "Face to Face";
}

export function MapF2FTelemed(rootContext) {
  const { FaceToFace, AppointmentDetails } = rootContext;
  const { TypeOfVisit } = AppointmentDetails;
  const isTM = TypeOfVisit === "Telemedicine";

  return {
    ...FaceToFace,
    isTM,
  };
}

export function CheckOrRadio(type) {
  return type === "radio" ? "radio" : "checkbox";
}
export function allergiesChecker(allergies) {
  return allergies === "No Known Allergies";
}

export function checker(use, name) {

  use = String(use).toLowerCase(); 
  if (name === "Yes") {
    return use === "yes" || use === "true";
  } else if (name === "No") {
    return use === "no" || use === "false";
  }
  return false; 
}
export function formatDate(date) {
  if (!!date) {
    // return date as mm-dd-yy-hh-mm
    return new Date(date).toLocaleDateString().replace(/\//g, "-");
  }
}
export function fallRiskMapper(array, options) {
  if (!Array.isArray(array) || array?.length === 0) return "";
  const newObj = array.reduce(
    (acc, item) => {
      const { IsChecked, FallRiskOption, WhyItMatters } = item;
      const isInTwoPoints = twoPointOption?.includes(FallRiskOption);
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
      return (
        context?.OperatorDataMD?.MDSignature || context?.SignatureCapture3 || ""
      );
    // return context?.SignatureCapture3 || "";
    case "witness":
      return context?.RecordReleaseAuthorization?.Witness || "";
    case "provider":
      return (
        context?.OperatorData?.NPSignature || context?.SignatureCapture2 || ""
      );
    // return context?.SignatureCapture2 || "";
    // case "authorization":
    //   return context?.RecordReleaseAuthorization?.AuthorizationSignature || "";
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

  if (!pmh || !pmh?.length) return medicalConditions;

  const isTrue = (mc) => mc.IsChecked === "true" || mc.IsChecked === true;

  if (pmh?.length > 0) {
    for (let i = 0; i < pmh?.length; i++) {
      if (isTrue(pmh[i])) {
        const medCon = isTrue(pmh[i]) ? pmh[i] : "";
        // console.log(medCon);
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

export function isActivityPermitted(activities, activityName) {
  if (activities && Array.isArray(activities)) {
    const activity = activities.find(
      (activity) => activity.ActivitiesPermited === activityName
    );
    if (activity && activity.IsChecked === "true") {
      return "true";
    }
  }
  return "false";
}

export function getCheckedItems(arr, valueProp) {
  if (!Array.isArray(arr) || arr.length === 0) return [];
  const checkedItems = arr
    .filter((item) => item.IsChecked === "true")
    .map((item) => item[valueProp] || "");

  return checkedItems.map((item) => " " + item).join(",");
}

export function getDiagnosisAndICD(arr) {
  if (!Array.isArray(arr) || arr.length === 0) return [];
  // Filter checked items and map to "Diagnosis ICD"
  return arr
    .filter((item) => item.IsChecked === "true")
    .map((item) => `${item.Diagnosis} ${item.ICD}`);
}

export const helpers = {
  camelToSentence,
  formsToPrint,
  addToObject,
  heading,
  isSelected,
  findWithKey,
  isTrue,
  isFalse,
  copyTelemedecineToFaceToFace,
  counter,
  equalityChecker,
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
  calculateAge,
  MapF2FTelemed,
  isActivityPermitted,
  getCheckedItems,
  getDiagnosisAndICD,
  stringToHTML,
  mapCheckedItems
};

export const HBS = create({
  helpers,
  extname: ".hbs",
  // Uses multiple partials dirs, templates in "shared/templates/" are shared
  // with the client-side of the app (see below).
  partialsDir: ["views/partials/"],
});
export function stringToHTML(context, string) {
  const template = HBS.handlebars.compile(string);
  return new HBS.handlebars.SafeString(template({ ...context, ...helpers }));
}

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
