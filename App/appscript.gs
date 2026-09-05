/**
 * Google Apps Script - Standalone & Dispatcher Compatible addNewUser Function
 * 
 * Switch Case in doPost(e):
 * case 'addNewUser': {
 *     const { userId, userName, userType, email, rawJoinDate, isCaller, salaryVal } = e.parameter;
 *     return addNewUser(userId, userName, userType, email, rawJoinDate, isCaller, salaryVal);
 * }
 */

function addNewUser(userId, userName, userType, email, rawJoinDate, isCaller, salaryVal) {
  var logs = [];
  try {
    logs.push("Starting addNewUser execution...");

    // Fallback: If 1st argument is Event Object 'e' or 'e.parameter', extract fields automatically
    if (typeof userId === 'object' && userId !== null) {
      var p = userId.parameter ? userId.parameter : userId;
      userName = p.userName || p.name || p.newUserName || "";
      userType = p.userType || p.newUserType || "User";
      email = p.email || p.newUserEmail || "";
      rawJoinDate = p.rawJoinDate || p.joinDate || p.newJoinDate || "";
      isCaller = p.isCaller || p.newIsCaller || "Yes";
      salaryVal = p.salaryVal || p.salary || 15000;
      userId = p.userId || p.newUserId || "";
    }

    userId = (userId || "").toString().trim();
    userName = (userName || "").toString().trim();
    userType = (userType || "User").toString().trim();
    email = (email || "").toString().trim();
    rawJoinDate = (rawJoinDate || "").toString().trim();
    isCaller = (isCaller || "Yes").toString().trim();
    salaryVal = salaryVal ? parseFloat(salaryVal) || salaryVal : 15000;

    if (!userId || !userName) {
      logs.push("Error: User ID and Name are required.");
      return ContentService.createTextOutput(
        JSON.stringify({
          status: "error",
          message: "User ID and Name are required.",
          logs: logs
        })
      ).setMimeType(ContentService.MimeType.JSON);
    }

    var formattedJoinDate = formatDateToDDMMYY(rawJoinDate);
    logs.push("Parameters parsed -> User ID: " + userId + ", Name: " + userName + ", JoinDate: " + formattedJoinDate + ", Salary: " + salaryVal);

    // ==========================================
    // 1. SPREADSHEET 1: Auth / app_password
    // ID: 11nMeVqcEyxzODJptqfvWRegA7MM1Kzf3oaOx9mwWfj4
    // Sheet: app_password
    // ==========================================
    var ss1Id = "11nMeVqcEyxzODJptqfvWRegA7MM1Kzf3oaOx9mwWfj4";
    var ss1 = SpreadsheetApp.openById(ss1Id);
    if (!ss1) {
      logs.push("Error: Spreadsheet ID '" + ss1Id + "' not found.");
      return ContentService.createTextOutput(
        JSON.stringify({
          status: "error",
          message: "Spreadsheet 1 (Auth) not found.",
          logs: logs
        })
      ).setMimeType(ContentService.MimeType.JSON);
    }

    var sheetAppPass = ss1.getSheetByName("app_password");
    if (!sheetAppPass) {
      logs.push("Error: 'app_password' sheet not found.");
      return ContentService.createTextOutput(
        JSON.stringify({
          status: "error",
          message: "'app_password' sheet not found.",
          logs: logs
        })
      ).setMimeType(ContentService.MimeType.JSON);
    }

    var imageUrl = "https://cdn.marvel.com/content/1x/avengersendgame_lob_mas_mob_01.jpg";
    var appPassRow = [
      "",                 // Col A: Empty / Auto
      userId,             // Col B: User ID
      userName,           // Col C: User Name
      userId,             // Col D: User ID as Password
      userType,           // Col E: User Type
      email,              // Col F: Email
      imageUrl,           // Col G: Marvel Image URL
      "office",           // Col H: office
      true,               // Col I: TRUE
      "Yes",              // Col J: Yes
      1236                // Col K: 1236
    ];
    sheetAppPass.appendRow(appPassRow);
    logs.push("Successfully appended row to 'app_password' sheet.");

    // ==========================================
    // 2. SPREADSHEET 2: User Details, Paid Leave & Salary
    // ID: 16Udm3J8-fAnjNs-3Bcq9hMBn6KhMlPELVlHNb9tpvYk
    // ==========================================
    var ss2Id = "16Udm3J8-fAnjNs-3Bcq9hMBn6KhMlPELVlHNb9tpvYk";
    var ss2 = SpreadsheetApp.openById(ss2Id);
    if (!ss2) {
      logs.push("Error: Spreadsheet ID '" + ss2Id + "' not found.");
      return ContentService.createTextOutput(
        JSON.stringify({
          status: "error",
          message: "Spreadsheet 2 (User Details) not found.",
          logs: logs
        })
      ).setMimeType(ContentService.MimeType.JSON);
    }

    // 2a. Sheet: user_details
    var sheetUserDetails = ss2.getSheetByName("user_details");
    if (!sheetUserDetails) {
      logs.push("Error: 'user_details' sheet not found.");
      return ContentService.createTextOutput(
        JSON.stringify({
          status: "error",
          message: "'user_details' sheet not found.",
          logs: logs
        })
      ).setMimeType(ContentService.MimeType.JSON);
    }

    var userDetailsRow = [
      userId,             // Col A: User ID
      userName,           // Col B: Name
      "09:45 Am",         // Col C: Shift In
      "07:00 Pm",         // Col D: Shift Out
      "active",           // Col E: Status
      "",                 // Col F
      "",                 // Col G
      "",                 // Col H
      formattedJoinDate,  // Col I: Joining Date (e.g. 31/07/26)
      isCaller,           // Col J: Is Caller (Yes or No)
      false               // Col K: false
    ];
    sheetUserDetails.appendRow(userDetailsRow);
    logs.push("Successfully appended row to 'user_details' sheet.");

    // 2b. Sheet: paid_leave
    var sheetPaidLeave = ss2.getSheetByName("paid_leave");
    if (!sheetPaidLeave) {
      logs.push("Error: 'paid_leave' sheet not found.");
      return ContentService.createTextOutput(
        JSON.stringify({
          status: "error",
          message: "'paid_leave' sheet not found.",
          logs: logs
        })
      ).setMimeType(ContentService.MimeType.JSON);
    }
    sheetPaidLeave.appendRow([userId, userName]);
    logs.push("Successfully appended row to 'paid_leave' sheet.");

    // 2c. Sheet: Salary
    var sheetSalary = ss2.getSheetByName("Salary");
    if (!sheetSalary) {
      logs.push("Error: 'Salary' sheet not found.");
      return ContentService.createTextOutput(
        JSON.stringify({
          status: "error",
          message: "'Salary' sheet not found.",
          logs: logs
        })
      ).setMimeType(ContentService.MimeType.JSON);
    }
    var lastCol = sheetSalary.getLastColumn() || 15;
    var salaryRow = [userId, userName];
    for (var col = 3; col <= lastCol; col++) {
      salaryRow.push(salaryVal);
    }
    sheetSalary.appendRow(salaryRow);
    logs.push("Successfully appended row to 'Salary' sheet (" + (lastCol - 2) + " month columns).");

    // ==========================================
    // 3. SPREADSHEET 3: Incentives & Performance Records
    // ID: 1qzxbyavzNWD9x-hG5y6cNFZlMEMyubOR-JAN5-spWiA
    // Sheets: Incentive, justPercent, isJustification, Month_Ach,
    //         Backard_adjust, Score_Record, Carry_forward
    // ==========================================
    var ss3Id = "1qzxbyavzNWD9x-hG5y6cNFZlMEMyubOR-JAN5-spWiA";
    var ss3 = SpreadsheetApp.openById(ss3Id);
    if (!ss3) {
      logs.push("Error: Spreadsheet ID '" + ss3Id + "' not found.");
      return ContentService.createTextOutput(
        JSON.stringify({
          status: "error",
          message: "Spreadsheet 3 (Incentives) not found.",
          logs: logs
        })
      ).setMimeType(ContentService.MimeType.JSON);
    }

    var targetSheetsSS3 = [
      "Incentive",
      "justPercent",
      "isJustification",
      "Month_Ach",
      "Backard_adjust",
      "Score_Record",
      "Carry_forward"
    ];

    for (var i = 0; i < targetSheetsSS3.length; i++) {
      var sheetName = targetSheetsSS3[i];
      var sh = ss3.getSheetByName(sheetName);
      if (!sh) {
        logs.push("Error: '" + sheetName + "' sheet not found.");
        return ContentService.createTextOutput(
          JSON.stringify({
            status: "error",
            message: "'" + sheetName + "' sheet not found.",
            logs: logs
          })
        ).setMimeType(ContentService.MimeType.JSON);
      }
      sh.appendRow([userId, userName]);
      logs.push("Successfully appended row to '" + sheetName + "' sheet.");
    }

    logs.push("All sheets updated successfully for user " + userName + " (" + userId + ").");

    return ContentService.createTextOutput(
      JSON.stringify({
        status: "success",
        message: "User " + userName + " (" + userId + ") added successfully across all 3 spreadsheets!",
        logs: logs
      })
    ).setMimeType(ContentService.MimeType.JSON);

  } catch (err) {
    logs.push("Exception Error: " + err.toString());
    return ContentService.createTextOutput(
      JSON.stringify({
        status: "error",
        message: err.toString(),
        logs: logs
      })
    ).setMimeType(ContentService.MimeType.JSON);
  }
}

function formatDateToDDMMYY(dateStr) {
  if (!dateStr) return "31/07/26";
  if (dateStr.indexOf("/") !== -1) return dateStr;
  
  var parts = dateStr.split("-");
  if (parts.length === 3) {
    var year = parts[0].length === 4 ? parts[0].substring(2) : parts[0];
    var month = parts[1];
    var day = parts[2];
    return day + "/" + month + "/" + year;
  }
  return dateStr;
}
