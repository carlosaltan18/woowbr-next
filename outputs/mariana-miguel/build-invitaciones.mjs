import fs from "node:fs/promises";
import { FileBlob, SpreadsheetFile, Workbook } from "@oai/artifact-tool";

const sourcePath = "C:/Users/Carlos/Downloads/Lista Invitados Wowbee.xlsx";
const outputDir = "C:/Proyectos 2do año/woowbr-next/outputs/mariana-miguel";
const outputPath = `${outputDir}/invitaciones-mariana-miguel.xlsx`;

const sourceFile = await FileBlob.load(sourcePath);
const sourceWorkbook = await SpreadsheetFile.importXlsx(sourceFile);
const sourceSheet = sourceWorkbook.worksheets.getItemAt(0);
const sourceValues = sourceSheet.getUsedRange(true).values;

const records = [];
const unnamedIds = [];

for (const row of sourceValues.slice(2)) {
  const id = Number(row[0]);
  if (!Number.isFinite(id)) continue;

  const firstName = String(row[1] ?? "").trim();
  const lastName = String(row[2] ?? "").trim();
  const guestName = `${firstName} ${lastName}`.replace(/\s+/g, " ").trim();
  const requestedPasses = Number(row[4]);
  const passes = Number.isFinite(requestedPasses) && requestedPasses > 0
    ? Math.floor(requestedPasses)
    : 1;

  if (!guestName) {
    unnamedIds.push(id);
    continue;
  }

  const url = `https://www.woowbegt.com/Mariana%26Miguel-weeding?nombre=${encodeURIComponent(guestName)}&pases=${passes}&id=${id}`;
  records.push([id, guestName, passes, url]);
}

records.sort((left, right) => left[0] - right[0]);
unnamedIds.sort((left, right) => left - right);

const workbook = Workbook.create();
const invitations = workbook.worksheets.add("Invitaciones");
invitations.showGridLines = false;
invitations.tabColor = "#6A0F1B";

invitations.mergeCells("A1:D1");
invitations.getRange("A1").values = [["Enlaces de invitación · Mariana & Miguel"]];
invitations.getRange("A1:D1").format = {
  fill: "#10301D",
  font: { name: "Arial", size: 15, bold: true, color: "#FFFFFF" },
  horizontalAlignment: "left",
  verticalAlignment: "center",
};
invitations.getRange("A1:D1").format.rowHeight = 28;

invitations.mergeCells("A2:D2");
invitations.getRange("A2").values = [[
  `Se generaron ${records.length} enlaces personalizados. ${unnamedIds.length} registros sin nombre no incluyen enlace.`,
]];
invitations.getRange("A2:D2").format = {
  font: { name: "Arial", size: 10, italic: true, color: "#4B4C35" },
  verticalAlignment: "center",
};
invitations.getRange("A2:D2").format.rowHeight = 20;

invitations.getRange("A4:D4").values = [[
  "Código",
  "Invitación",
  "Pases",
  "URL de invitación",
]];
invitations.getRange("A4:D4").format = {
  fill: "#6A0F1B",
  font: { name: "Arial", size: 10, bold: true, color: "#FFFFFF" },
  horizontalAlignment: "center",
  verticalAlignment: "center",
};
invitations.getRange("A4:D4").format.rowHeight = 22;

if (records.length) {
  invitations.getRange(`A5:D${records.length + 4}`).values = records;
  const dataRange = invitations.getRange(`A5:D${records.length + 4}`);
  dataRange.format = {
    font: { name: "Arial", size: 10, color: "#1F2937" },
    verticalAlignment: "center",
  };
  invitations.getRange(`A5:A${records.length + 4}`).format.horizontalAlignment = "center";
  invitations.getRange(`C5:C${records.length + 4}`).format.horizontalAlignment = "center";
  invitations.getRange(`D5:D${records.length + 4}`).format.font = {
    name: "Arial",
    size: 10,
    color: "#155E75",
    underline: "single",
  };
  invitations.tables.add(`A4:D${records.length + 4}`, true, "GuestInvitationLinks");
}

invitations.getRange("A:A").format.columnWidth = 10;
invitations.getRange("B:B").format.columnWidth = 28;
invitations.getRange("C:C").format.columnWidth = 10;
invitations.getRange("D:D").format.columnWidth = 86;
invitations.freezePanes.freezeRows(4);

const pending = workbook.worksheets.add("Sin nombre");
pending.showGridLines = false;
pending.tabColor = "#B89A5C";
pending.mergeCells("A1:B1");
pending.getRange("A1").values = [["Registros pendientes de nombre"]];
pending.getRange("A1:B1").format = {
  fill: "#F3E7D2",
  font: { name: "Arial", size: 14, bold: true, color: "#6A0F1B" },
  verticalAlignment: "center",
};
pending.getRange("A1:B1").format.rowHeight = 26;
pending.getRange("A3:B3").values = [["Código", "Motivo"]];
pending.getRange("A3:B3").format = {
  fill: "#6A0F1B",
  font: { name: "Arial", size: 10, bold: true, color: "#FFFFFF" },
  horizontalAlignment: "center",
};

const pendingRows = unnamedIds.map((id) => [id, "Sin nombre en la lista fuente"]);
if (pendingRows.length) {
  pending.getRange(`A4:B${pendingRows.length + 3}`).values = pendingRows;
  pending.getRange(`A4:B${pendingRows.length + 3}`).format = {
    font: { name: "Arial", size: 10, color: "#1F2937" },
  };
}
pending.getRange("A:A").format.columnWidth = 12;
pending.getRange("B:B").format.columnWidth = 34;
pending.freezePanes.freezeRows(3);

workbook.recalculate();
const inspection = await workbook.inspect({
  kind: "table",
  range: `Invitaciones!A1:D${Math.min(records.length + 4, 12)}`,
  include: "values,formulas",
  tableMaxRows: 12,
  tableMaxCols: 4,
});

await fs.mkdir(outputDir, { recursive: true });
const exported = await SpreadsheetFile.exportXlsx(workbook);
await exported.save(outputPath);

const preview = await workbook.render({
  sheetName: "Invitaciones",
  range: `A1:D${Math.min(records.length + 4, 18)}`,
  scale: 1.5,
});
await fs.writeFile(`${outputDir}/invitaciones-preview.png`, new Uint8Array(await preview.arrayBuffer()));

console.log(JSON.stringify({
  outputPath,
  generated: records.length,
  pending: unnamedIds.length,
  inspection: inspection.ndjson,
}));
