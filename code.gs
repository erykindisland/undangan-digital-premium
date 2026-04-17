/**
 * Google Apps Script for Dynamic Wedding Invitation
 * Deploy this as a Web App (Execute as: Me, Access: Anyone)
 */

const SHEET_NAME = 'Customers';

/**
 * Handle GET requests
 * - Fetch a single invitation: ?to=slug
 * - Fetch all invitations (Admin): ?action=get_all
 * - Fetch RSVPs: ?action=get_rsvps&to=slug
 */
function doGet(e) {
  const slug = e.parameter.to;
  const action = e.parameter.action;
  
  const ss = SpreadsheetApp.getActiveSpreadsheet();
  const sheet = ss.getSheetByName(SHEET_NAME) || setupSheet();

  const data = sheet.getDataRange().getValues();
  const fixedKeys = ['Slug', 'GroomName', 'BrideName', 'Date', 'Time', 'LocationName', 'MapURL', 'GalleryURLs', 'MusicURL', 'RSVPData', 'Status'];

  // Admin Dashboard Action: Get all entries
  if (action === 'get_all') {
    const allList = [];
    for (let i = 1; i < data.length; i++) {
        const rowObj = {};
        fixedKeys.forEach((key, idx) => {
            rowObj[key] = data[i][idx] || '';
        });
        allList.push(rowObj);
    }
    return createJsonResponse(allList);
  }

  // Fetch RSVPs for a specific slug (Guest Book / Isolated Tab)
  if (action === 'get_rsvps' && slug) {
    const rsvpSheet = ss.getSheetByName(slug);
    if (!rsvpSheet) return createJsonResponse([]); // Return empty if no tab yet
    
    const rsvpData = rsvpSheet.getDataRange().getValues();
    const filteredRSVPs = [];
    
    // Column Index in Isolated Tab: [0] Timestamp, [1] GuestName, [2] Attendance, [3] Message
    for (let i = 1; i < rsvpData.length; i++) {
      filteredRSVPs.push({
        name: rsvpData[i][1],
        message: rsvpData[i][3],
        time: rsvpData[i][0]
      });
    }
    return createJsonResponse(filteredRSVPs.reverse());
  }

  // Fetch single slug (The Invitation itself)
  if (slug) {
    for (let i = 1; i < data.length; i++) {
      if (data[i][0] === slug) {
        const rowObj = {};
        fixedKeys.forEach((key, idx) => {
          rowObj[key] = data[i][idx] || '';
        });
        return createJsonResponse({ success: true, data: rowObj });
      }
    }
    return createJsonResponse({ success: false, message: 'Not Found' });
  }

  return createJsonResponse({ success: false, message: 'Invalid Request' });
}

/**
 * Handle POST requests
 * - Submit RSVP
 * - Admin Approve
 * - Upsert Invitation (Editor)
 */
function doPost(e) {
  let params;
  try {
    params = JSON.parse(e.postData.contents);
  } catch (err) {
    return createJsonResponse({ success: false, message: 'Invalid JSON' });
  }

  const ss = SpreadsheetApp.getActiveSpreadsheet();
  const sheet = ss.getSheetByName(SHEET_NAME) || setupSheet();
  const action = params.action;

  // Action: Submit RSVP (to Isolated Tab)
  if (action === 'submit_rsvp') {
    const targetSlug = params.slug;
    const rsvpSheet = ss.getSheetByName(targetSlug);
    
    if (!rsvpSheet) {
      return createJsonResponse({ success: false, message: 'Halaman belum aktif atau belum disetujui admin.' });
    }

    const rsvpRow = [
      new Date(),           // Timestamp
      params.name,          // Guest Name
      params.attendance,    // Attendance
      params.message        // Message/Prayer
    ];
    rsvpSheet.appendRow(rsvpRow);
    return createJsonResponse({ success: true, message: 'Konfirmasi berhasil dikirim!' });
  }

  // Action: Admin Approve
  if (action === 'approve') {
    const slug = params.slug;
    const data = sheet.getDataRange().getValues();
    for (let i = 1; i < data.length; i++) {
      if (data[i][0] === slug) {
        // Change status
        sheet.getRange(i + 1, 11).setValue('Approved');
        
        // Create Isolated RSVP Tab
        setupIsolatedRSVPSheet(slug);
        
        return createJsonResponse({ success: true, message: 'Undangan disetujui & Tab database dibuat!' });
      }
    }
    return createJsonResponse({ success: false, message: 'Slug tidak ditemukan.' });
  }

  // Action: Upsert Invitation (from Editor)
  const slug = params.Slug;
  if (!slug) return createJsonResponse({ success: false, message: 'Slug is required' });

  const data = sheet.getDataRange().getValues();
  let foundRow = -1;

  for (let i = 1; i < data.length; i++) {
    if (data[i][0] === slug) {
      foundRow = i + 1;
      break;
    }
  }

  const rowValues = [
    params.Slug,
    params.GroomName,
    params.BrideName,
    params.Date,
    params.Time,
    params.LocationName,
    params.MapURL,
    params.GalleryURLs,
    params.MusicURL,
    params.RSVPData || '[]',
    'Pending' // Always reset to pending on edit/new
  ];

  if (foundRow > -1) {
    sheet.getRange(foundRow, 1, 1, rowValues.length).setValues([rowValues]);
  } else {
    sheet.appendRow(rowValues);
  }

  return createJsonResponse({ success: true, message: 'Berhasil disimpan! Status saat ini: Pending.' });
}

/** Helper to create JSON response */
function createJsonResponse(data) {
  return ContentService.createTextOutput(JSON.stringify(data))
    .setMimeType(ContentService.MimeType.JSON);
}

/** Initial setup for Invitations sheet */
function setupSheet() {
  const ss = SpreadsheetApp.getActiveSpreadsheet();
  let sheet = ss.getSheetByName(SHEET_NAME);
  if (!sheet) sheet = ss.insertSheet(SHEET_NAME);
  
  const headers = ['Slug', 'GroomName', 'BrideName', 'Date', 'Time', 'LocationName', 'MapURL', 'GalleryURLs', 'MusicURL', 'RSVPData', 'Status'];
  sheet.getRange(1, 1, 1, headers.length).setValues([headers]);
  
  const headerRange = sheet.getRange(1, 1, 1, headers.length);
  headerRange.setFontWeight('bold');
  headerRange.setBackground('#f3f3f3');
  headerRange.setBorder(true, true, true, true, true, true);
  return sheet;
}

/** 
 * Create a dedicated sheet for a specific Slug
 * Triggered on Admin Approval
 */
function setupIsolatedRSVPSheet(slug) {
  const ss = SpreadsheetApp.getActiveSpreadsheet();
  let sheet = ss.getSheetByName(slug);
  
  // If sheet doesn't exist, create it
  if (!sheet) {
    sheet = ss.insertSheet(slug);
  } else {
    // If it exists, clear it to reset format (or just leave it)
    sheet.clear();
  }
  
  const headers = ['Timestamp', 'GuestName', 'Attendance', 'Message'];
  sheet.getRange(1, 1, 1, headers.length).setValues([headers]);
  
  // Apply formatting
  const headerRange = sheet.getRange(1, 1, 1, headers.length);
  headerRange.setFontWeight('bold');
  headerRange.setBackground('#e2efda'); // Light green for guest book
  headerRange.setHorizontalAlignment('center');
  
  // Freeze top row
  sheet.setFrozenRows(1);
  
  // Auto-resize columns
  sheet.autoResizeColumns(1, 4);
  
  return sheet;
}