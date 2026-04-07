/**
 * Piña Lab — Google Apps Script Email Collector
 */

const SHEET_ID = '1Y9g65iq-ov81be3ECU4fKV8zUqP4snb9TiH7PqRZLsA';
const SHEET_NAME = 'Piña Lab Waitlist';

function doPost(e) {
  try {
    const data = JSON.parse(e.postData.contents);
    const email = (data.email || '').trim().toLowerCase();

    if (!email) return jsonResponse({ status: 'error', message: 'No email provided.' });

    const sheet = SpreadsheetApp.openById(SHEET_ID).getSheetByName(SHEET_NAME)
                  || SpreadsheetApp.openById(SHEET_ID).insertSheet(SHEET_NAME);

    if (sheet.getLastRow() === 0) {
      sheet.appendRow(['Email', 'Timestamp', 'Source']);
    }

    const existing = sheet.getRange(2, 1, Math.max(sheet.getLastRow() - 1, 1), 1).getValues().flat();
    if (existing.includes(email)) {
      return jsonResponse({ status: 'duplicate' });
    }

    sheet.appendRow([email, data.timestamp || new Date().toISOString(), 'website']);
    return jsonResponse({ status: 'ok' });

  } catch (err) {
    return jsonResponse({ status: 'error', message: err.message });
  }
}

function doGet() {
  return jsonResponse({ status: 'alive' });
}

function jsonResponse(obj) {
  return ContentService
    .createTextOutput(JSON.stringify(obj))
    .setMimeType(ContentService.MimeType.JSON);
}
