import { google } from "googleapis";

export default async function handler(req, res) {
  if (req.method !== "POST") {
    return res.status(405).json({ error: "Método no permitido" });
  }

  try {
    const { nombre, telefono, confirmacion } = req.body;

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
    const spreadsheetId = "11vK0zvmTI4pchp07Jer3XMR9ej_bP6XqStrhIrgFxeM";

    await sheets.spreadsheets.values.append({
      spreadsheetId,
      range: "Hoja 1!A:E",
      valueInputOption: "USER_ENTERED",
      requestBody: {
        values: [[nombre, telefono, confirmacion, new Date().toLocaleString()]],
      },
    });

    return res.status(200).json({ success: true });
  } catch (error) {
    console.error(error);
    return res.status(500).json({ error: "Error al guardar datos" });
  }
}
