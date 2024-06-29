import { create } from "express-handlebars"; // "express-handlebars"
import { hostUrl } from "./global.js";
import * as path from "path";
import { fileURLToPath } from "url";

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

export function getSignatureUrl(context, person) {
  switch (person) {
    case "patient":
      return context?.AdmissionOrders?.PatientsSignature || "";
    case "physician":
      return context?.AdmissionOrders?.PhysiciansSignature || "";
    case "witness":
      return context?.AdmissionOrders?.WitnessSignature || "";
    case "provider":
      return context?.AdmissionOrders?.ProviderSignature || "";
  }
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
};

export const HBS = create({
  helpers,
  extname: ".hbs",
  // Uses multiple partials dirs, templates in "shared/templates/" are shared
  // with the client-side of the app (see below).
  partialsDir: ["views/partials/"],
});
