import { create } from "express-handlebars"; // "express-handlebars"

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

export const helpers = {
  camelToSentence,
  formsToPrint,
  addToObject,
  heading,
  isSelected,
  findWithKey,
  isTrue,
};

export const HBS = create({
  helpers,
  extname: ".hbs",
  // Uses multiple partials dirs, templates in "shared/templates/" are shared
  // with the client-side of the app (see below).
  partialsDir: ["views/partials/"],
});
