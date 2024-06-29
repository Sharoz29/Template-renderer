import axios from "axios";
import { getToken } from "./oauth.js";
import { mockContext } from "./mock.js";
import { pegaBaseUrl } from "./global.js";

export async function getCaseData(caseID) {
  const access_token = await getToken();
  try {
    const response = await axios.get(
      `${pegaBaseUrl}/prweb/api/v1/cases/LCS-CALLADOC-WORK ${caseID}`,
      {
        headers: {
          Authorization: `Bearer ${access_token}`,
          Accept: "application/json",
        },
      }
    );
    const data = response.data;

    const { AppointmentInformation } = data.content;

    return {
      ...mockContext,
      ...AppointmentInformation,
      ...data.content,
      access_token,
    };
    // res.send(response.data);
  } catch (error) {
    console.log("Has Error:", error.message);
    // res?.error(error.message);
  }
}
