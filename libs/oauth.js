import { axios } from "./axios.js";
import dotenv from "dotenv";
import fs from "fs";

dotenv.config();

import { pegaBaseUrl } from "./global.js";
// const pegaBaseUrl = "https://web.pega23.lowcodesol.co.uk";

// URL to get the token
const url = `${pegaBaseUrl}/prweb/PRRestService/oauth2/v1/token`;

// Your client credentials
const client_id = process.env.CLIENTID;
const client_secret = process.env.CLIENTSECRET;

// Prepare the data for the POST request
const data = new URLSearchParams();
data.append("grant_type", "client_credentials");
data.append("client_id", client_id);
data.append("client_secret", client_secret);

// Send the POST request to get the access token
/**
 * Function to check if the token is expired
 * @param {string} createdAt - The creation date of the token in ISO format
 * @param {number} expiresIn - The token's lifespan in seconds
 * @returns {boolean} - True if the token is expired, false otherwise
 */
function isTokenExpired(createdAt, expiresIn) {
  // Parse the createdAt date
  const tokenCreatedAt = new Date(createdAt);

  // Calculate the expiration date
  const tokenExpiryDate = tokenCreatedAt.getTime() + expiresIn * 1000;

  // Get the current date and time
  const now = new Date().getTime();

  // Check if the current date and time is after the token expiry date
  return now > tokenExpiryDate;
}

export async function getToken() {
  // read the access token from the file
  try {
    const tokenData = global.tokenData;
    if (
      tokenData &&
      !isTokenExpired(tokenData.createdAt, tokenData.expires_in)
    ) {
      return tokenData.access_token;
    } else {
      console.log("Token is expired");
    }
  } catch (error) {
    console.error("Failed to read access token from file:");
  }

  return await axios
    .post(url, data, {
      headers: {
        "Content-Type": "application/x-www-form-urlencoded",
      },
    })
    .then((response) => {
      // Handle success
      const tokenData = response.data;
      global.tokenData = { ...tokenData, createdAt: new Date() };

      // console.log("Got access token:", tokenData.access_token);
      const access_token = tokenData.access_token;

      // Write Access Token to a file
      // fs.writeFileSync(
      //   "access_token.json",
      //   JSON.stringify({ tokenData, createdAt: new Date() })
      // );

      return access_token;
    })
    .catch((error) => {
      // Handle error
      console.error("Failed to get access token:", error);
    });
}
