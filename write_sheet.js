const { google } = require('googleapis');
const fs = require('fs');

const sa = JSON.parse(fs.readFileSync('C:/Users/muham/Downloads/digmark-dahsboard-6bfaad2d6158.json', 'utf8'));
const sheetId = '1o6FwXrLnSq5n9jeHT34oGPO3iINvKfbJ-AXnO6zcTGg';

const auth = new google.auth.JWT({
  email: sa.client_email,
  key: sa.private_key,
  scopes: ['https://www.googleapis.com/auth/spreadsheets'],
});

const sheets = google.sheets({ version: 'v4', auth });

async function ensureSheet(sheets, sheetId) {
  try {
    const res = await sheets.spreadsheets.get({ spreadsheetId: sheetId, includeGridData: false });
    const titles = (res.data.sheets || []).map(s => s.properties && s.properties.title);
    if (!titles.includes('Registrations')) {
      await sheets.spreadsheets.batchUpdate({ spreadsheetId: sheetId, requestBody: { requests: [{ addSheet: { properties: { title: 'Registrations' } } }] } });
      console.log('SHEET CREATED: Registrations');
    } else {
      console.log('SHEET EXISTS: Registrations');
    }
  } catch(e) { console.log('Sheet check error:', e.message); }
}

async function main() {
  await ensureSheet(sheets, sheetId);
  try {
    // Write header row to A1:O1 (create if missing by using range with values)
    const header = [
      'Registration ID','Timestamp','Nama Lengkap','Nama Panggilan','WhatsApp','Email',
      'Tahun Lahir','Domisili','Status','Tujuan Belajar','Level English','Program','Source',
      'Lead Status','Notes'
    ];
    await sheets.spreadsheets.values.update({
      spreadsheetId: sheetId,
      range: 'Registrations!A1:O1',
      valueInputOption: 'USER_ENTERED',
      requestBody: { values: [header] },
    });
    console.log('HEADER WRITTEN: Registrations!A1:O1');
    
    // Test row (optional — verify the connection works)
    const testRow = [
      'SDLC-TEST-0001',
      new Date().toISOString().replace('T',' ').slice(0,19),
      'Test User','Test','6281234567890','test@example.com',
      '2000','Yogyakarta','Pelajar','Persiapan kerja','Basic',
      'English for General Customer','Instagram','New','Test submission from EVA build'
    ];
    await sheets.spreadsheets.values.append({
      spreadsheetId: sheetId,
      range: 'Registrations!A2:O',
      valueInputOption: 'USER_ENTERED',
      insertDataOption: 'INSERT_ROWS',
      requestBody: { values: [testRow] },
    });
    console.log('TEST ROW APPENDED: SDLC-TEST-0001');
  } catch (e) {
    console.error('Sheets error:', e.message || e);
    process.exit(1);
  }
}
main();
