/**
 * Admin Attendance & Salary Calculation Logic
 * Optimized for processing data for any user (not just the current logged-in user)
 */

const AdminSalaryEngine = {

    /**
     * The core calculation logic extracted and modularized from generateAttendanceTable
     * @param {Object} input - Inputs required for calculation
     * @returns {Object} result - Calculated metrics and final payout
     */
    calculateSalary: function(input) {
        const {
            selectedMonth,      // e.g., "APR"
            selectedYear,       // e.g., "2026"
            attendanceRecords,  // Array of { Date, Mark }
            holidayDetails,     // Array of { date, status }
            baseSalary,         // Scalar base salary
            userDetails,        // { Join_date, isCaller }
            monthlyIncentive = 0,      // Pre-filtered Scalar
            paidLeave = 0,             // Pre-filtered Scalar
            isJustifyDecision = "No",  // Pre-filtered Scalar
            justificationPercent = 0   // Pre-filtered Scalar
        } = input;

        // 1. Initial Counts from raw records
        let counts = { present: 0, late: 0, hday: 0, absent: 0, holiday: 0 };
        const selectedMonthYear = `${selectedMonth} ${selectedYear}`;

        attendanceRecords.forEach(record => {
            if (!record.Date) return;

            // Robust date parsing (handles DD-MM-YYYY, DD/MM/YYYY, YYYY-MM-DD)
            let dateObj;
            if (typeof record.Date === "string" && record.Date.includes("-")) {
                const parts = record.Date.split("-");
                if (parts[0].length === 4) { // YYYY-MM-DD
                    dateObj = new Date(record.Date);
                } else { // DD-MM-YYYY
                    dateObj = new Date(`${parts[2]}-${parts[1]}-${parts[0]}T00:00:00`);
                }
            } else {
                dateObj = new Date(record.Date);
            }

            if (isNaN(dateObj.getTime())) return;

            // Convert to IST safely
            let formattedDate = dateObj.toLocaleString('en-US', { month: 'short', year: 'numeric', timeZone: 'Asia/Kolkata' }).toUpperCase();
            
            // Handle cases where toLocaleString might return "FEB. 2026" or similar
            formattedDate = formattedDate.replace(/[.,]/g, "");

            if (formattedDate === selectedMonthYear) {
                let mark = (record.Mark || "").toUpperCase();
                if (mark === "P") counts.present++;
                else if (mark === "L") counts.late++;
                else if (mark === "H") counts.hday++;
                else if (mark === "A") counts.absent++;
            }
        });

        // 2. Constants & Helpers
        const totalDaysInMonth = new Date(selectedYear, new Date(`${selectedMonth} 1`).getMonth() + 1, 0).getDate();
        const holidaysInMonth = holidayDetails.filter(h => {
            const dateVal = h.Date || h.date;
            if (!dateVal) return false;
            
            // If Working is "yes", it's NOT a holiday
            const isWorking = String(h.Working || "").toLowerCase() === "yes";
            if (isWorking) return false;

            const hDate = new Date(dateVal);
            if (isNaN(hDate)) return false;

            const hMonth = hDate.toLocaleString('en-US', { month: 'short' }).toUpperCase();
            const hYear = hDate.getFullYear().toString();

            return hMonth === selectedMonth && hYear === selectedYear;
        }).length;

        const workingDaysInMonth = totalDaysInMonth - holidaysInMonth;

        // 3. Logic Map Implementation (Equivalent to atten.js dataMap)
        // Note: Using the exact logic indices from your generateAttendanceTable

        const extractV = (idx, resultMap) => resultMap[idx] || 0;

        const results = {};

        // Simplified mapping of the core logic
        results[3] = counts.present;
        results[9] = counts.late;
        results[15] = counts.hday;
        results[13] = counts.absent;
        results[1] = holidaysInMonth;
        results[0] = workingDaysInMonth;
        results[19] = totalDaysInMonth;

        const currentDate = new Date().toISOString().split('T')[0];

        // Past Holidays (Within the selected month that have already passed)
        results[2] = holidayDetails.filter(h => {
            const dateVal = h.Date || h.date;
            if (!dateVal) return false;

            // If Working is "yes", it's NOT a holiday
            const isWorking = String(h.Working || "").toLowerCase() === "yes";
            if (isWorking) return false;

            const hDate = new Date(dateVal);
            if (isNaN(hDate)) return false;

            // Must be in the selected month/year AND before today
            const hMonth = hDate.toLocaleString('en-US', { month: 'short' }).toUpperCase();
            const hYear = hDate.getFullYear().toString();
            
            return hMonth === selectedMonth && hYear === selectedYear && hDate < new Date(currentDate);
        }).length;

        // Full Day Count (Index 4)
        results[4] = results[3] + results[2];

        // Late Adjusted (Index 5)
        results[5] = results[9] - (results[9] % 5) - Math.floor(results[9] / 5);

        // Late Rem of 5 (Index 10)
        results[10] = results[9] % 5;

        // Late Div by 5 (INT) (Index 11)
        results[11] = Math.floor(results[9] / 5);

        // Late Rem Div by 3 (INT) (Index 16)
        results[16] = Math.floor(results[10] / 3);

        // Late Rem Final (Index 6)
        results[6] = results[10] - results[16];

        // Final Adj Halfday (Index 7)
        results[17] = results[15] + results[16]; // Halfday + Late Rem Div by 3
        results[18] = results[17] % 2;           // Halfday + Late Rem Mod 2
        results[12] = Math.floor(results[17] / 2); // Halfday + Late Rem Div by 2 (INT)
        
        results[7] = (results[17] - results[18]) - results[12];

        // Total Adjusted Days (Index 8)
        results[8] = results[4] + results[5] + results[6] + results[7];

        // Final Absent (Index 22)
        results[14] = results[11] + results[12] + results[13]; // Final Adjusted Days
        results[22] = results[14];

        // Mid-month joiner logic (Parity with atten.js)
        let daysBeforeJoin = 0;
        let holidaysBeforeJoin = 0;
        const userDate = new Date(userDetails.Join_date);
        const formattedUserDate = userDate.toLocaleString('en-US', { month: 'short', year: 'numeric', timeZone: 'Asia/Kolkata' }).toUpperCase().replace(/[.,]/g, "");
        
        if (formattedUserDate === selectedMonthYear) {
            const selectedDay = userDate.getDate();
            daysBeforeJoin = selectedDay - 1;

            holidaysBeforeJoin = holidayDetails.filter(h => {
                const dateVal = h.Date || h.date;
                if (!dateVal) return false;
                const parts = dateVal.split("-");
                if (parts.length < 3) return false;
                const [dd, mm, yyyy] = parts;
                const holidayDate = new Date(`${yyyy}-${mm}-${dd}T00:00:00`);
                
                const formattedHoliday = holidayDate.toLocaleString('en-US', { month: 'short', year: 'numeric', timeZone: 'Asia/Kolkata' }).toUpperCase().replace(/[.,]/g, "");
                return formattedHoliday === formattedUserDate && holidayDate.getDate() < selectedDay;
            }).length;
        }

        results[23] = results[3] + results[9] + results[15]; // Total Coming Days
        results[31] = daysBeforeJoin;
        results[32] = holidaysBeforeJoin;

        // Correctly initialize casualLeave before use
        let casualLeave = 0;
        const currentJoinMonthYear = new Date(userDetails.Join_date).toLocaleString('en-US', { month: 'short', year: 'numeric', timeZone: 'Asia/Kolkata' }).toUpperCase().replace(/[.,]/g, "");

        if (selectedMonthYear === currentJoinMonthYear) {
            casualLeave = 0;
        } else {
            if (!userDetails.isCaller) {
                casualLeave = 1; // Non-callers get 1 CL
            } else {
                // Callers get 1 CL only if justified
                casualLeave = (isJustifyDecision.toLowerCase() === "yes") ? 1 : 0;
            }
        }
        
        results[33] = casualLeave;
        results[34] = userDetails.isCaller ? "yes" : "no";
        results[35] = isJustifyDecision;
        results[36] = (parseFloat(justificationPercent)*100).toFixed(0) + "%";
        results[37] = paidLeave;

        // Total Attend Days (Index 24)
        results[24] = results[23] === 0 ? 0 : (results[18] === 1 ? results[8] + 0.5 : results[8]) - results[32]; 
        
        // Balance Paid Leave (Index 38)
        let totalLvl = results[37] + results[33];
        results[38] = results[22] === 0 ? (totalLvl - results[18]) : (results[22] > totalLvl ? 0 : totalLvl - results[22]);
        if (results[38] < 0) results[38] = 0;

        // Calculation of actual salary
        results[25] = baseSalary;
        results[26] = results[25] / results[19]; // Per Day Sal
        
        let currentSalary = Math.round(results[24] * results[26]);
        
        // --- JUSTIFICATION LOGIC (Parity with atten.js Index 27) ---
        if (isJustifyDecision === "Yes") {
            currentSalary = currentSalary + (results[25] * (parseFloat(justificationPercent) || 0));
        }

        results[27] = Math.round(currentSalary > results[25] ? results[25] : currentSalary);

        // Leave Adjustments (Index 39)
        // casualLeave already defined above
        let totalLeaveAvailable = (parseFloat(paidLeave) || 0) + casualLeave;
        
        if (totalLeaveAvailable === 0) {
            results[39] = 0;
        } else if (results[22] === 0) {
            results[39] = results[7]; // Uses final halfday logic
        } else if (results[22] > totalLeaveAvailable) {
            results[39] = totalLeaveAvailable;
        } else {
            results[39] = results[22];
        }

        // --- FINAL PAYOUT (Index 40) ---
        let finalPayout = Math.round(results[27] + (results[26] * results[39]));
        if (results[25] - finalPayout <= 10 && results[25] - finalPayout > 0) {
            finalPayout = results[25];
        }
        results[40] = finalPayout > results[25] ? results[25] : finalPayout;

        // --- MONTHLY INCENTIVE (Index 44) ---
        results[44] = monthlyIncentive;
        
        // Wave Out (Index 41)
        results[41] = Math.round((results[18] === 1 ? results[14] + 0.5 : results[14]) * results[26]);
        
        // Expecting Salary (Index 42)
        let preSal = Math.round(results[25] - results[41] + (results[39] * results[26]));
        results[42] = preSal > results[25] ? results[25] : preSal;

        // Leave Applied (Index 43)
        results[43] = (results[22] === 0 || selectedMonthYear === formattedUserDate) ? 0 : 1;

        // Final Present/Halfday/Absent for display consistency
        results[20] = results[8]; // Calculated Adjusted Present
        results[21] = results[18]; // Remainder Halfday (0 or 1)
        results[28] = selectedMonthYear;
        results[29] = formattedUserDate;
        results[30] = userDetails.Join_date;
            
        // --- DEBUGGING TABLE (Admin Parity with atten.js) ---
        const titles = {
            0: "Working Days", 1: "1. No. of Holidays", 2: "2. Adjusted Holidays", 3: "3. Present Count",
            4: "4. Full Day Count", 5: "5. Late Adjusted Count", 6: "6. Late Rem Final", 7: "7. Final Adjusted Halfday Count",
            8: "8. Total Adjusted Days", 9: "9. Late Count", 10: "10. Late Rem of 5", 11: "11. Late Div by 5 (INT)",
            12: "12. Halfday + Late Rem Div by 2 (INT)", 13: "13. Absent Count", 14: "14. Final Adjusted Days",
            15: "15. Halfday Count", 16: "16. Late Rem Div by 3 (INT)", 17: "17. Halfday + Late Rem Div by 3",
            18: "18. Halfday + Late Rem Mod 2", 19: "19. Total Days in Month", 20: "20. Final Present Value",
            21: "21. Final Halfday Value", 22: "22. Final Absent Value", 23: "23. Total Coming Days",
            24: "24. Total Attend Days", 25: "25. Monthly Salary", 26: "26. Per Day Salary", 27: "27. Current Salary",
            28: "28. Selected Month & Year", 29: "29. Joining Month", 30: "30. Joining Date", 31: "31. Days Before Join",
            32: "32. Holidays Before Joining", 33: "33. Casual Leave", 34: "34. isCaller", 35: "35. isJustify",
            36: "36. justPercentData", 37: "37. Paid Leave", 38: "38. Balance Paid Leave", 39: "39. Leave Adjust",
            40: "40. Final Payout", 41: "41. Wave Out", 42: "42. Expecting Salary", 43: "43. Leave applied",
            44: "44. Monthly Incentive"
        };

        const debugTable = Object.keys(titles).map(idx => ({
            Title: titles[idx],
            Days: results[idx] !== undefined ? results[idx] : "N/A"
        }));

        // Attach raw results for optional debugging
        return {
            userName: input.userName,
            userId: input.userId,
            month: selectedMonthYear,
            attendanceRecords: attendanceRecords,
            summary: {
                totalDays: results[19],
                present: counts.present,
                late: counts.late,
                halfday: counts.hday,
                absent: counts.absent,
                attendDays: results[24]
            },
            payout: {
                base: results[25],
                perDay: results[26].toFixed(2),
                final: results[40],
                incentive: monthlyIncentive
            },
            results: results, // Needed for debug table
            debugInfo: debugTable // Pre-mapped titles and values
        };
    },

    /**
     * Helper to log the 45-index table for a specific user
     */
    logDebugTable: function(calc) {
        if (!calc || !calc.debugInfo) return;
        console.log(`%c--- Detailed Breakdown: ${calc.userName} (${calc.userId}) ---`, "color: #FF1493; font-weight: bold; font-size: 14px;");
        console.table(calc.debugInfo);
    }
};

/**
 * Example Usage for Admin:
 * 
 * const userPayload = {
 *    userName: "Deepak",
 *    userIdRaw: "UID123",
 *    selectedMonth: "APR",
 *    selectedYear: "2026",
 *    attendanceRecords: [...], // All P/L/A logs from server
 *    holidayDetails: [...],
 *    baseSalary: 25000,
 *    userDetails: { Join_date: "2024-01-01", isCaller: "Yes" },
 *    incentiveData: [...],
 *    paidLeaveData: [...],
 *    justPercentData: [...],
 *    isJustificationData: [...]
 * };
 * 
 * const result = AdminSalaryEngine.calculateSalary(userPayload);
 * console.log("Calculated Summary for Admin:", result);
 */
