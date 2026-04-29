// =========================================================
// SINATRIA - Google Apps Script Backend
// Versi: 1.0 | Akses Sheet: DataAset & Riwayat
// =========================================================

const SHEET_NAME_ASSETS = "DataAset";
const SHEET_NAME_REPORTS = "Riwayat";

// =========================================================
// SETUP FUNCTION (Jalankan sekali)
// =========================================================
function setupSheets() {
  const ss = SpreadsheetApp.getActiveSpreadsheet();
  
  // Setup Sheet DataAset
  if (!ss.getSheetByName(SHEET_NAME_ASSETS)) {
    const assetSheet = ss.insertSheet(SHEET_NAME_ASSETS);
    assetSheet.appendRow([
      "Asset ID",
      "Tanggal",
      "Nama Aset",
      "Merek",
      "Lokasi",
      "Kondisi",
      "Keterangan"
    ]);
    
    // Format header
    const headerRange = assetSheet.getRange(1, 1, 1, 7);
    headerRange.setBackground("#002D5E")
      .setFontColor("#ffffff")
      .setFontWeight("bold")
      .setHorizontalAlignment("center");
    
    // Atur lebar kolom
    assetSheet.setColumnWidth(1, 150);  // Asset ID
    assetSheet.setColumnWidth(2, 150);  // Tanggal
    assetSheet.setColumnWidth(3, 180);  // Nama Aset
    assetSheet.setColumnWidth(4, 130);  // Merek
    assetSheet.setColumnWidth(5, 150);  // Lokasi
    assetSheet.setColumnWidth(6, 120);  // Kondisi
    assetSheet.setColumnWidth(7, 200);  // Keterangan
  }
  
  // Setup Sheet Riwayat
  if (!ss.getSheetByName(SHEET_NAME_REPORTS)) {
    const reportSheet = ss.insertSheet(SHEET_NAME_REPORTS);
    reportSheet.appendRow([
      "Report ID",
      "Tanggal",
      "Nama Pemohon",
      "Nama Aset",
      "Lokasi",
      "Tingkat",
      "Status",
      "Deskripsi",
      "Foto URL",
      "Catatan Admin"
    ]);
    
    // Format header
    const headerRange = reportSheet.getRange(1, 1, 1, 10);
    headerRange.setBackground("#002D5E")
      .setFontColor("#ffffff")
      .setFontWeight("bold")
      .setHorizontalAlignment("center");
    
    // Atur lebar kolom
    reportSheet.setColumnWidth(1, 150);  // Report ID
    reportSheet.setColumnWidth(2, 150);  // Tanggal
    reportSheet.setColumnWidth(3, 150);  // Nama Pemohon
    reportSheet.setColumnWidth(4, 150);  // Nama Aset
    reportSheet.setColumnWidth(5, 150);  // Lokasi
    reportSheet.setColumnWidth(6, 100);  // Tingkat
    reportSheet.setColumnWidth(7, 120);  // Status
    reportSheet.setColumnWidth(8, 200);  // Deskripsi
    reportSheet.setColumnWidth(9, 180);  // Foto URL
    reportSheet.setColumnWidth(10, 180); // Catatan Admin
  }
  
  Logger.log("✅ Sheet berhasil di-setup!");
}

// =========================================================
// MAIN HANDLER (Endpoint)
// =========================================================
function doPost(e) {
  try {
    const params = JSON.parse(e.postData.contents);
    const action = params.action || "";
    
    let result = { ok: false, error: "Unknown action" };
    
    if (action === "addAsset") {
      result = handleAddAsset(params);
    } else if (action === "getAssets") {
      result = handleGetAssets();
    } else if (action === "deleteAsset") {
      result = handleDeleteAsset(params);
    } else if (action === "deleteAssets") {
      result = handleDeleteAssets(params);
    } else if (action === "addReport") {
      result = handleAddReport(params);
    } else if (action === "getReports") {
      result = handleGetReports();
    } else if (action === "updateReportStatus") {
      result = handleUpdateReportStatus(params);
    } else if (action === "deleteReport") {
      result = handleDeleteReport(params);
    }
    
    return ContentService.createTextOutput(JSON.stringify(result))
      .setMimeType(ContentService.MimeType.JSON);
  } catch (err) {
    return ContentService.createTextOutput(JSON.stringify({
      ok: false,
      error: err.message || "Server error"
    }))
      .setMimeType(ContentService.MimeType.JSON);
  }
}

// =========================================================
// ASSET HANDLERS
// =========================================================

function handleAddAsset(params) {
  try {
    const { assetId, tanggal, namaAset, merek, lokasi, kondisi, keterangan } = params;
    
    // Validasi
    if (!assetId || !namaAset || !merek || !lokasi || !kondisi) {
      return { ok: false, error: "Data tidak lengkap" };
    }
    
    const sheet = SpreadsheetApp.getActiveSpreadsheet().getSheetByName(SHEET_NAME_ASSETS);
    
    // Cek duplikasi
    const data = sheet.getDataRange().getValues();
    for (let i = 1; i < data.length; i++) {
      if (data[i][0] === assetId) {
        return { ok: false, error: "Asset ID sudah ada" };
      }
    }
    
    // Tambah row baru
    sheet.appendRow([
      assetId,
      tanggal || new Date().toISOString(),
      namaAset,
      merek,
      lokasi,
      kondisi,
      keterangan || ""
    ]);
    
    return { ok: true, message: "Aset berhasil disimpan" };
  } catch (err) {
    return { ok: false, error: err.message };
  }
}

function handleGetAssets() {
  try {
    const sheet = SpreadsheetApp.getActiveSpreadsheet().getSheetByName(SHEET_NAME_ASSETS);
    const data = sheet.getDataRange().getValues();
    
    const assets = [];
    for (let i = 1; i < data.length; i++) {
      assets.push({
        assetId: data[i][0],
        tanggal: data[i][1],
        namaAset: data[i][2],
        merek: data[i][3],
        lokasi: data[i][4],
        kondisi: data[i][5],
        keterangan: data[i][6]
      });
    }
    
    return { ok: true, assets: assets };
  } catch (err) {
    return { ok: false, error: err.message };
  }
}

function handleDeleteAsset(params) {
  try {
    const { assetId } = params;
    
    if (!assetId) {
      return { ok: false, error: "Asset ID diperlukan" };
    }
    
    const sheet = SpreadsheetApp.getActiveSpreadsheet().getSheetByName(SHEET_NAME_ASSETS);
    const data = sheet.getDataRange().getValues();
    
    for (let i = 1; i < data.length; i++) {
      if (data[i][0] === assetId) {
        sheet.deleteRow(i + 1);
        return { ok: true, message: "Aset berhasil dihapus" };
      }
    }
    
    return { ok: false, error: "Asset tidak ditemukan" };
  } catch (err) {
    return { ok: false, error: err.message };
  }
}

function handleDeleteAssets(params) {
  try {
    const { assetIds } = params;
    
    if (!assetIds || !Array.isArray(assetIds) || assetIds.length === 0) {
      return { ok: false, error: "Asset IDs diperlukan" };
    }
    
    const sheet = SpreadsheetApp.getActiveSpreadsheet().getSheetByName(SHEET_NAME_ASSETS);
    const data = sheet.getDataRange().getValues();
    
    // Sort indices descending untuk menghindari shift issues
    const rowsToDelete = [];
    for (let i = 1; i < data.length; i++) {
      if (assetIds.includes(data[i][0])) {
        rowsToDelete.push(i + 1);
      }
    }
    
    // Hapus dari belakang
    rowsToDelete.sort((a, b) => b - a);
    for (const row of rowsToDelete) {
      sheet.deleteRow(row);
    }
    
    return { ok: true, message: `${rowsToDelete.length} aset berhasil dihapus` };
  } catch (err) {
    return { ok: false, error: err.message };
  }
}

// =========================================================
// REPORT HANDLERS
// =========================================================

function handleAddReport(params) {
  try {
    const { 
      reportId, 
      tanggal, 
      namaPemohon, 
      namaAset, 
      lokasi, 
      tingkat, 
      deskripsi, 
      fotoUrl 
    } = params;
    
    // Validasi
    if (!reportId || !namaPemohon || !namaAset || !lokasi || !tingkat || !deskripsi) {
      return { ok: false, error: "Data tidak lengkap" };
    }
    
    const sheet = SpreadsheetApp.getActiveSpreadsheet().getSheetByName(SHEET_NAME_REPORTS);
    
    // Cek duplikasi
    const data = sheet.getDataRange().getValues();
    for (let i = 1; i < data.length; i++) {
      if (data[i][0] === reportId) {
        return { ok: false, error: "Report ID sudah ada" };
      }
    }
    
    // Tambah row baru
    sheet.appendRow([
      reportId,
      tanggal || new Date().toISOString(),
      namaPemohon,
      namaAset,
      lokasi,
      tingkat,
      "dilaporkan", // Status default
      deskripsi,
      fotoUrl || "",
      "" // Catatan admin (kosong dulu)
    ]);
    
    return { ok: true, message: "Report berhasil disimpan" };
  } catch (err) {
    return { ok: false, error: err.message };
  }
}

function handleGetReports() {
  try {
    const sheet = SpreadsheetApp.getActiveSpreadsheet().getSheetByName(SHEET_NAME_REPORTS);
    const data = sheet.getDataRange().getValues();
    
    const reports = [];
    for (let i = 1; i < data.length; i++) {
      reports.push({
        reportId: data[i][0],
        tanggal: data[i][1],
        namaPemohon: data[i][2],
        namaAset: data[i][3],
        lokasi: data[i][4],
        tingkat: data[i][5],
        status: data[i][6],
        deskripsi: data[i][7],
        fotoUrl: data[i][8],
        catatanAdmin: data[i][9]
      });
    }
    
    return { ok: true, reports: reports };
  } catch (err) {
    return { ok: false, error: err.message };
  }
}

function handleUpdateReportStatus(params) {
  try {
    const { reportId, status, catatanAdmin } = params;
    
    if (!reportId || !status) {
      return { ok: false, error: "Report ID dan status diperlukan" };
    }
    
    const sheet = SpreadsheetApp.getActiveSpreadsheet().getSheetByName(SHEET_NAME_REPORTS);
    const data = sheet.getDataRange().getValues();
    
    for (let i = 1; i < data.length; i++) {
      if (data[i][0] === reportId) {
        // Update status (kolom 7 = index 6)
        sheet.getRange(i + 1, 7).setValue(status);
        
        // Update catatan admin (kolom 10 = index 9)
        if (catatanAdmin) {
          sheet.getRange(i + 1, 10).setValue(catatanAdmin);
        }
        
        return { ok: true, message: "Status berhasil diupdate" };
      }
    }
    
    return { ok: false, error: "Report tidak ditemukan" };
  } catch (err) {
    return { ok: false, error: err.message };
  }
}

function handleDeleteReport(params) {
  try {
    const { reportId } = params;
    
    if (!reportId) {
      return { ok: false, error: "Report ID diperlukan" };
    }
    
    const sheet = SpreadsheetApp.getActiveSpreadsheet().getSheetByName(SHEET_NAME_REPORTS);
    const data = sheet.getDataRange().getValues();
    
    for (let i = 1; i < data.length; i++) {
      if (data[i][0] === reportId) {
        sheet.deleteRow(i + 1);
        return { ok: true, message: "Report berhasil dihapus" };
      }
    }
    
    return { ok: false, error: "Report tidak ditemukan" };
  } catch (err) {
    return { ok: false, error: err.message };
  }
}

// =========================================================
// TEST FUNCTION (Untuk debug)
// =========================================================
function testAPI() {
  Logger.log("Testing Assets:");
  Logger.log(handleGetAssets());
  
  Logger.log("Testing Reports:");
  Logger.log(handleGetReports());
}
