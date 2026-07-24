/**
 * Handles GET requests to check script status.
 * @returns {ContentService.TextOutput} A JSON response with the status.
 */
function doGet(e) {
  // Try a read-only operation to check basic Drive scope.
  try {
    DriveApp.getRootFolder(); 
  } catch (err) {
     return ContentService.createTextOutput(JSON.stringify({
      status: 'ERROR',
      message: 'Skrip belum memiliki otorisasi Google Drive. Harap jalankan fungsi `forceAuth` sekali dari editor skrip dan berikan izin.',
    })).setMimeType(ContentService.MimeType.JSON);
  }

  return ContentService.createTextOutput(JSON.stringify({
    status: 'GET_REQUEST_OK',
    message: 'Skrip aktif, memiliki izin dasar Drive, dan siap untuk permintaan POST.',
    effectiveUser: Session.getEffectiveUser().getEmail()
  })).setMimeType(ContentService.MimeType.JSON);
}


/**
 * Handles POST requests to upload files to Google Drive.
 * @param {object} e The event parameter from the web app.
 * @returns {ContentService.TextOutput} A JSON response with the upload status.
 */
function doPost(e) {
  Logger.log("POST request received.");
  if (e && e.postData && e.postData.contents) {
    Logger.log("Post data (first 200 chars): " + e.postData.contents.substring(0, 200));
  } else {
    Logger.log("No postData received.");
    return ContentService.createTextOutput(JSON.stringify({
      status: 'ERROR',
      message: 'Tidak ada data yang diterima dalam request POST.'
    })).setMimeType(ContentService.MimeType.JSON);
  }

  try {
    const data = JSON.parse(e.postData.contents);
    Logger.log("Parsed data: " + JSON.stringify({fileName: data.fileName, fileType: data.fileType, folderId: data.folderId}));

    const { fileData, fileName, fileType, folderId } = data;

    if (!fileData || !fileName || !fileType || !folderId) {
      throw new Error("Parameter tidak lengkap. Pastikan fileData, fileName, fileType, dan folderId tersedia.");
    }
    
    const base64Data = fileData.includes(',')
      ? fileData.split(',')[1]
      : fileData;
    const decodedData = Utilities.base64Decode(base64Data);

    const blob = Utilities.newBlob(decodedData, fileType, fileName);
    
    Logger.log("Mencoba membuat file di Folder ID: " + folderId);
    const destinationFolder = DriveApp.getFolderById(folderId);
    const file = destinationFolder.createFile(blob);
    
    // baris file.setSharing() dihapus karena menyebabkan error di beberapa environment
    
    const response = {
      status: 'SUCCESS',
      fileId: file.getId(),
      fileUrl: file.getUrl()
    };

    Logger.log("File berhasil dibuat. ID: " + file.getId());
    return ContentService.createTextOutput(JSON.stringify(response))
      .setMimeType(ContentService.MimeType.JSON);

  } catch (err) {
    Logger.log("ERROR ASLI: " + err.stack);
    return ContentService.createTextOutput(JSON.stringify({
      status: 'ERROR',
      message: err.message,
      stack: err.stack
    })).setMimeType(ContentService.MimeType.JSON);
  }
}

/**
 * A simple function to run from the editor to force the authorization flow.
 */
function forceAuth() {
  DriveApp.getRootFolder();
  Logger.log("Otorisasi dasar untuk DriveApp berhasil diperiksa/diberikan.");
}