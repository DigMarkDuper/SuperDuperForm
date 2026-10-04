import { google } from "googleapis";

export interface RegistrationRow {
  id: string;
  timestamp: string;
  fullName: string;
  nickname: string;
  whatsapp: string;
  email: string;
  birthYear: string;
  domicile: string;
  status: string;
  learningGoals: string;
  englishLevel: string;
  program: string;
  source: string;
  leadStatus: string;
  notes: string;
}

function getAuth() {
  const projectId = process.env.GOOGLE_PROJECT_ID;
  const clientEmail = process.env.GOOGLE_CLIENT_EMAIL;
  const privateKeyRaw = process.env.GOOGLE_PRIVATE_KEY || "";

  if (!projectId || !clientEmail || !privateKeyRaw) {
    throw new Error("Missing Google service account credentials in environment.");
  }

  const privateKey = privateKeyRaw.replace(/\n/g, "\n");

  return new google.auth.JWT({
    email: clientEmail,
    key: privateKey,
    scopes: ["https://www.googleapis.com/auth/spreadsheets"],
  });
}

export async function appendRegistration(row: RegistrationRow) {
  const sheetId = process.env.GOOGLE_SHEET_ID;
  if (!sheetId) throw new Error("GOOGLE_SHEET_ID not set.");

  const auth = getAuth();
  const sheets = google.sheets({ version: "v4", auth });

  const values = [
    row.id,
    row.timestamp,
    row.fullName,
    row.nickname,
    row.whatsapp,
    row.email,
    row.birthYear,
    row.domicile,
    row.status,
    row.learningGoals,
    row.englishLevel,
    row.program,
    row.source,
    row.leadStatus,
    row.notes,
  ];

  const res = await sheets.spreadsheets.values.append({
    spreadsheetId: sheetId,
    range: "Registrations!A2:O",
    valueInputOption: "USER_ENTERED",
    insertDataOption: "INSERT_ROWS",
    requestBody: { values: [values] },
  });

  return res.data;
}
