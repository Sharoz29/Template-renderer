import { axios, defaultConfig } from "./axios.js";
import { getToken } from "./oauth.js";
import { mockContext } from "./mock.js";
import { coloredText } from "./global.js";
import FormData from "form-data";

export async function getCaseData(caseID) {
  const access_token = await getToken();
  try {
    // console.time("Got Data for Case: " + coloredText(caseID, "green") + " in");
    console.timeLog(
      coloredText(caseID, "green") + " in",
      " --> Before Getting Case Data"
    );

    const response = await axios.get(
      // `${process.env.BASEURL}/prweb/api/v1/cases/LCS-CALLADOC-WORK ${caseID}`,
      `https://calladocfw-rra3n9-prod.pegalaunchpad.com/dx/api/application/v2/data_views/PatientCheckupLookup/${caseID}`,
      {
        headers: {
          Cookie: `PEGA-SESSION-COOKIE=${access_token}`,
          Authorization: `Bearer ${access_token}`,
          Accept: "application/json",
        },
      }
    );
    const data = response.data;

    const { AppointmentInformation } = data.content;

    // console.timeEnd(
    //   "Got Data for Case: " + coloredText(caseID, "green") + " in"
    // );
    console.timeLog(
      coloredText(caseID, "green") + " in",
      " --> After Case Data Received"
    );
    return {
      ...mockContext,
      ...AppointmentInformation,
      ...data.content,
      access_token,
    };
    // res.send(response.data);
  } catch (error) {
    console.log("Has Error Getting Case Data:", error);
    global.tokenData = null;
    // res?.error(error.message);
  }
}

export async function uploadPdfToPega({
  pdfBuffer,
  access_token,
  caseID,
  fileName,
}) {
  try {
    const form = new FormData();
    form.append("file", pdfBuffer, {
      filename: fileName
        ? `${fileName}${getDateString()}.pdf`
        : `cad-report${getDateString()}.pdf`,
      contentType: "application/pdf",
    }); // append the pdf buffer to the form data
    console.timeLog(
      coloredText(caseID, "green") + " in",
      " --> Before Uploading To Pega"
    );
    const uploadResponse = await axios.post(
      `${process.env.BASEURL}/prweb/api/application/v2/attachments/upload`,
      form,
      {
        headers: {
          ...form.getHeaders(),
          Authorization: `Bearer ${access_token}`,
        },
      }
    );
    console.timeLog(
      coloredText(caseID, "green") + " in",
      " --> After Uploading To Pega"
    );
    return {
      ...uploadResponse.data,
      access_token: access_token,
    };
  } catch (e) {
    console.log("Error while uploading file", e);
    throw e;
  }
}

export async function attachPdfToCase(
  caseName,
  attachmentID,
  pegaAuthToken,
  caseID,
  fileName
) {
  if (!caseName) throw new Error("Case ID is required for attachment");

  console.timeLog(
    coloredText(caseID, "green") + " in",
    " --> Before Attaching To Case"
  );
  const attachment = {
    attachmentFieldName: "pyAttachmentPage",
    category: "FILE",
    delete: true,
    name: fileName
      ? `${fileName}${getDateString()}.pdf`
      : `${caseID}report${getDateString()}.pdf`,
    pyPurpose: "out class pega developers",
    type: "FILE",
    ID: attachmentID,
  };

  try {
    const attachmentResponse = await axios.post(
      `${process.env.BASEURL}/prweb/api/application/v2/cases/${caseName}/attachments`,
      {
        attachments: [{ ...attachment }],
      },
      {
        headers: {
          Authorization: `Bearer ${pegaAuthToken}`,
        },
      }
    );
    console.timeLog(
      coloredText(caseID, "green") + " in",
      " --> After Attaching To Case"
    );
    return attachmentResponse.data;
  } catch (error) {
    console.log("Error while attaching file", error);
    throw error;
  }
}

export function getDateString() {
  // return date as mm-dd-yy-hh-mm
  return new Date().toLocaleDateString().replace(/\//g, "-");
}
