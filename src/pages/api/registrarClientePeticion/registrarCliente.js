import { google } from "googleapis";

export default async function handler(req, res) {
  if (req.method !== "POST") {
    return res.status(405).json({ error: "Método no permitido" });
  }

  try {
    // 1. Extraemos los parámetros dinámicos. 
    // 'values' debe ser un arreglo simple, ej: ["Dato 1", "Dato 2", "Dato 3"]
    const { spreadsheetId, range, values } = req.body;

    // Validación de parámetros obligatorios
    if (!spreadsheetId || !range || !values || !Array.isArray(values)) {
      return res.status(400).json({ 
        error: "Faltan parámetros: se requiere spreadsheetId, range y un arreglo de values." 
      });
    }

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

    // 2. Ejecutamos el append con la estructura dinámica
    await sheets.spreadsheets.values.append({
      spreadsheetId,
      range,
      valueInputOption: "USER_ENTERED",
      requestBody: {
        // En Google Sheets API, 'values' es un arreglo de arreglos (filas de columnas)
        values: [values], 
      },
    });

    return res.status(200).json({ success: true });
  } catch (error) {
    console.error("Error en Google Sheets API:", error);
    return res.status(500).json({ error: "Error al guardar datos" });
  }
}