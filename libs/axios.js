import * as _axios from "axios";
import https from "https";
import fs from "fs";

const httpsAgent = new https.Agent({
  rejectUnauthorized: false, // (NOTE: this will disable client verification)
  cert: fs.readFileSync("./certs/cert.cer"),
  key: fs.readFileSync("./certs/key.pem"),

  // passphrase: "YYY",
});

export const defaultConfig = {
  httpsAgent,
  baseURL: process.env.BASEURL,
}

export const axios = _axios.default.create(defaultConfig);
