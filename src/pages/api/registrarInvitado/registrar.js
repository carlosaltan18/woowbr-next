import { google } from "googleapis";

export default async function handler(req, res) {
  if (req.method !== "POST") {
    return res.status(405).json({ error: "Método no permitido" });
  }

  try {
    const { nombre, apellido, confirmacion, tipo, fechaRegistro } = req.body;

    const auth = new google.auth.GoogleAuth({
      credentials: {
        type: "service_account",
        project_id: process.env.GCP_PROJECT_ID,
        private_key: process.env.GCP_PRIVATE_KEY.replace(/\\n/g, "\n"),
        client_email: process.env.GCP_CLIENT_EMAIL,
      },
      scopes: ["https://www.googleapis.com/auth/spreadsheets"],
    });

    const sheets = google.sheets({ version: "v4", auth });
    const spreadsheetId = "1I1bqJqXfzH8lAG0CPcmQ97T5KR8yXE1lAjVYwOjdyD8";

    await sheets.spreadsheets.values.append({
      spreadsheetId,
      range: "Hoja 1!A:F",
      valueInputOption: "USER_ENTERED",
      requestBody: {
        values: [[nombre, apellido, confirmacion, tipo, fechaRegistro]],
      },
    })

    return res.status(200).json({ success: true });
  } catch (error) {
    console.error(error);
    return res.status(500).json({ error: "Error al guardar datos" });
  }
}
