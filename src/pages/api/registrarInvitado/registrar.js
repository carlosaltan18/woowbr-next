import { google } from "googleapis";

function getSheetTitle(range) {
  const separatorIndex = range.lastIndexOf("!");
  if (separatorIndex === -1) return null;

  return range
    .slice(0, separatorIndex)
    .trim()
    .replace(/^'(.*)'$/, "$1")
    .replace(/''/g, "'");
}

function toA1SheetTitle(title) {
  return `'${title.replace(/'/g, "''")}'`;
}

function getRangeStartColumn(range) {
  const separatorIndex = range.lastIndexOf("!");
  const rangePart = range.slice(separatorIndex + 1);
  const columnMatch = rangePart.match(/\$?([A-Z]+)/i);

  if (!columnMatch) {
    throw new Error("El rango debe comenzar en una columna, por ejemplo: Hoja 1!A:G.");
  }

  return columnMatch[1].toUpperCase();
}

function columnNumber(column) {
  return [...column].reduce((total, letter) => total * 26 + letter.charCodeAt(0) - 64, 0);
}

function columnLabel(number) {
  let result = "";
  let value = number;

  while (value > 0) {
    const remainder = (value - 1) % 26;
    result = String.fromCharCode(65 + remainder) + result;
    value = Math.floor((value - 1) / 26);
  }

  return result;
}

async function ensureHeaders({ sheets, spreadsheetId, range, headers }) {
  const sheetTitle = getSheetTitle(range);
  if (!sheetTitle) {
    throw new Error("El rango debe incluir el nombre de la hoja, por ejemplo: Hoja 1!A:G.");
  }

  const startColumn = getRangeStartColumn(range);
  const startColumnNumber = columnNumber(startColumn);
  const endColumn = columnLabel(startColumnNumber + headers.length - 1);
  const safeSheetTitle = toA1SheetTitle(sheetTitle);
  const headerRange = `${safeSheetTitle}!${startColumn}1:${endColumn}1`;
  const currentHeader = await sheets.spreadsheets.values.get({ spreadsheetId, range: headerRange });
  const hasHeaders = headers.every(
    (header, index) => currentHeader.data.values?.[0]?.[index] === header,
  );

  if (hasHeaders) return;

  const spreadsheet = await sheets.spreadsheets.get({
    spreadsheetId,
    fields: "sheets.properties(sheetId,title)",
  });
  const targetSheet = spreadsheet.data.sheets?.find(
    (sheet) => sheet.properties?.title === sheetTitle,
  );

  if (typeof targetSheet?.properties?.sheetId !== "number") {
    throw new Error(`No se encontró la hoja \"${sheetTitle}\".`);
  }

  // Si la hoja ya tiene respuestas, las desplazamos una fila para no sobrescribirlas.
  if (currentHeader.data.values?.[0]?.some(Boolean)) {
    await sheets.spreadsheets.batchUpdate({
      spreadsheetId,
      requestBody: {
        requests: [
          {
            insertDimension: {
              range: {
                sheetId: targetSheet.properties.sheetId,
                dimension: "ROWS",
                startIndex: 0,
                endIndex: 1,
              },
              inheritFromBefore: false,
            },
          },
        ],
      },
    });
  }

  await sheets.spreadsheets.values.update({
    spreadsheetId,
    range: headerRange,
    valueInputOption: "RAW",
    requestBody: { values: [headers] },
  });

  await sheets.spreadsheets.batchUpdate({
    spreadsheetId,
    requestBody: {
      requests: [
        {
          repeatCell: {
            range: {
              sheetId: targetSheet.properties.sheetId,
              startRowIndex: 0,
              endRowIndex: 1,
              startColumnIndex: startColumnNumber - 1,
              endColumnIndex: startColumnNumber - 1 + headers.length,
            },
            cell: {
              userEnteredFormat: {
                backgroundColor: { red: 0.72, green: 0.58, blue: 0.02 },
                horizontalAlignment: "CENTER",
                textFormat: { bold: true, foregroundColor: { red: 1, green: 1, blue: 1 } },
              },
            },
            fields: "userEnteredFormat(backgroundColor,horizontalAlignment,textFormat)",
          },
        },
        {
          updateSheetProperties: {
            properties: {
              sheetId: targetSheet.properties.sheetId,
              gridProperties: { frozenRowCount: 1 },
            },
            fields: "gridProperties.frozenRowCount",
          },
        },
        {
          autoResizeDimensions: {
            dimensions: {
              sheetId: targetSheet.properties.sheetId,
              dimension: "COLUMNS",
              startIndex: startColumnNumber - 1,
              endIndex: startColumnNumber - 1 + headers.length,
            },
          },
        },
      ],
    },
  });
}

export default async function handler(req, res) {
  if (req.method !== "POST") {
    return res.status(405).json({ error: "Método no permitido" });
  }

  try {
    // Cada cliente define su propia estructura, por ejemplo:
    // { spreadsheetId, range: "Respuestas!A:C", headers: ["Nombre", "Correo", "Estado"], values: ["Ana", "ana@email.com", "Sí"] }
    const { spreadsheetId, range, headers, values } = req.body;
    const cleanHeaders = Array.isArray(headers)
      ? headers.map((header) => (typeof header === "string" ? header.trim() : ""))
      : [];

    if (
      !spreadsheetId
      || !range
      || !Array.isArray(values)
      || !cleanHeaders.length
      || cleanHeaders.some((header) => !header)
      || values.length !== cleanHeaders.length
    ) {
      return res.status(400).json({
        error: "Se requiere spreadsheetId, range, headers y values con la misma cantidad de columnas.",
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

    await ensureHeaders({ sheets, spreadsheetId, range, headers: cleanHeaders });

    await sheets.spreadsheets.values.append({
      spreadsheetId,
      range,
      valueInputOption: "RAW",
      requestBody: {
        values: [values],
      },
    });

    return res.status(200).json({ success: true });
  } catch (error) {
    console.error("Error en Google Sheets API:", error);
    return res.status(500).json({ error: "Error al guardar datos" });
  }
}
