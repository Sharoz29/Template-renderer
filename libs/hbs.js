import axios from "axios";
import puppeteer from "puppeteer";
import path from "path";
import { fileURLToPath } from "url";
import FormData from "form-data";
import fs from "fs";
import { handlebars, HBS, helpers } from "./libs/helpers.js";

function _setupHBS() {
  // Setup Native HBS to use helpers and partial templates folders and all
  handlebars.registerHelper(helpers);
  handlebars.registerPartials(path.resolve(__dirname, "./views/partials"));
  // handlebars.
}
