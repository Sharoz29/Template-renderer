import axios from "axios";

// URL to get the token
const url =
  "https://web.pega23.lowcodesol.co.uk/prweb/PRRestService/oauth2/v1/token";

// Your client credentials
const client_id = "14965090564081136535";
const client_secret = "5038AA181BD81B18D9E6113E7668A9FD";

// Prepare the data for the POST request
const data = new URLSearchParams();
data.append("grant_type", "client_credentials");
data.append("client_id", client_id);
data.append("client_secret", client_secret);

// Send the POST request to get the access token

export async function getToken() {
  return await axios
    .post(url, data, {
      headers: {
        "Content-Type": "application/x-www-form-urlencoded",
      },
    })
    .then((response) => {
      // Handle success
      const tokenData = response.data;
      const access_token = tokenData.access_token;
      // console.log("Access Token:", access_token);

      return access_token;
    })
    .catch((error) => {
      // Handle error
      console.error(
        "Failed to get access token:",
        error.response.status,
        error.response.data
      );
    });
}
