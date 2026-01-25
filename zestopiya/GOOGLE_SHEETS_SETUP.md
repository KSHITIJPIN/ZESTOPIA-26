# Google Sheets Integration Guide

Since this website runs in the browser, it cannot write directly to an Excel file on your computer for security reasons. However, we can connect it to a **Google Sheet** to store registrations in real-time!

## Step 1: Create a Google Sheet
1. Go to [Google Sheets](https://sheets.new) and create a new sheet.
2. Name it "Zestopia Registrations".
3. Rename the first sheet (tab) to `Participants`.
4. Create a second sheet (tab) and name it `Organizers`.

## Step 2: Add Header Rows
In the `Participants` sheet, add these headers in the first row:
`timestamp`, `id`, `name`, `email`, `contact`, `college`, `studentClass`, `gender`, `event`, `specialReq`

In the `Organizers` sheet, add these headers:
`timestamp`, `id`, `name`, `email`, `contact`, `college`, `studentClass`, `gender`, `teamName`, `role`

## Step 3: Create the Script
1. In your Google Sheet, go to **Extensions** > **Apps Script**.
2. Delete any code in the editor and paste the code below:

```javascript
const SHEET_ID = "YOUR_SPREADSHEET_ID_HERE"; // Optional: Leave blank to use active sheet

function doPost(e) {
  const lock = LockService.getScriptLock();
  lock.tryLock(10000);

  try {
    const doc = SpreadsheetApp.getActiveSpreadsheet();
    const data = JSON.parse(e.postData.contents);
    
    // Determine target sheet based on 'type' field in data
    const sheetName = data.type === 'organizer' ? 'Organizers' : 'Participants';
    const sheet = doc.getSheetByName(sheetName);
    
    const headers = sheet.getRange(1, 1, 1, sheet.getLastColumn()).getValues()[0];
    const nextRow = sheet.getLastRow() + 1;
    
    const newRow = headers.map(function(header) {
      return header === 'timestamp' ? new Date() : data[header];
    });
    
    sheet.getRange(nextRow, 1, 1, newRow.length).setValues([newRow]);
    
    return ContentService
      .createTextOutput(JSON.stringify({ "result": "success", "row": nextRow }))
      .setMimeType(ContentService.MimeType.JSON);
  } catch (e) {
    return ContentService
      .createTextOutput(JSON.stringify({ "result": "error", "error": e }))
      .setMimeType(ContentService.MimeType.JSON);
  } finally {
    lock.releaseLock();
  }
}
```

3. Click the disk icon (💾) to Save project.

## Step 4: Deploy
1. Click the blue **Deploy** button > **New deployment**.
2. Click the gear icon (⚙️) next to 'Select type' > select **Web app**.
3. Description: `Zestopia API`.
4. Execute as: `Me`.
5. **Who has access**: `Anyone` (Important! This allows the website to send data).
6. Click **Deploy**.
7. Copy the **Web app URL** (It starts with `https://script.google.com/...`).

## Step 5: Connect to Website
1. Open the file `src/services/api.js`.
2. Replace the `GOOGLE_SCRIPT_URL` variable with your new Web app URL.
