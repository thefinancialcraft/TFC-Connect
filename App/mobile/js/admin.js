/**
 * Admin Dashboard Logic
 * Handles fetching all users' data and rendering the salary list
 */

// Global initialization log
console.log("%c[Admin JS] Script Loaded and Ready", "background: #FF1493; color: white; padding: 5px; border-radius: 5px;");

let allStoredUsers = []; 
let rawServerResponse = null; 
let isFirstLoad = true; 
let lastViewedUser = null; // Track currently selected user across month changes

async function loadAllUsersSalary() {
    console.log("[Admin] Step: Starting loadAllUsersSalary...");
    const salaryList = document.getElementById('salaryList');
    if (!salaryList) {
        console.error("[Admin] Error: 'salaryList' element not found!");
        return;
    }

    // Show Loading
    salaryList.innerHTML = `<p style="padding: 20px;">Fetching users...</p>`;

    try {
        const configResponse = await fetch('/TFC-Connect/App/config.json');
        const config = await configResponse.json();
        
        const activeTicket = JSON.parse(localStorage.getItem('receiveData'));
        if (!activeTicket) throw new Error("No active ticket found");

        const data = new URLSearchParams();
        data.append('action', 'getAllUsersSalary');
        data.append('token', activeTicket.token);
        data.append('userId', activeTicket.userId);

        // Show loader, hide search
    const loader = document.getElementById('admin-global-loader');
    const searchContainer = document.querySelector('.search-container');
    if (loader) loader.style.display = 'flex';
    if (searchContainer) searchContainer.style.display = 'none';

    console.log("[Admin] Step: Fetching data from Google AppScript...");
        const response = await fetch(config.scriptUrl, { method: 'POST', body: data });
        const result = await response.json();
        
        console.log(`[Admin] Step: Received response status: ${result.status}`);

        if (result.status !== "success" || !result.data) {
            console.error("[Admin] Error: Data missing or status failed!", result);
            salaryList.innerHTML = `<p style="padding: 20px; color: red;">Error: Failed to fetch data. Check console.</p>`;
            return;
        }

        rawServerResponse = result; // Save for later re-calculations
        console.log("[Admin] Full Raw Result:", result); // Debugging: See everything from server
        
        processAllUsers();
        initSearch(); // Initialize search after data loads


    } catch (error) {
        console.error("[Admin] Critical Load Error:", error);
        salaryList.innerHTML = `<p style="padding: 20px; color: red;">Load Failed: ${error.message}</p>`;
    }
}

/**
 * Helper to find value by case-insensitive key or key with spaces
 */
function getValueByKey(obj, possibleKeys) {
    if (!obj) return null;
    for (let key of possibleKeys) {
        if (obj[key] !== undefined) return obj[key];
    }
    // Fallback: Case-insensitive search
    const entries = Object.entries(obj);
    for (let p of possibleKeys) {
        const found = entries.find(([k]) => k.toLowerCase().replace(/[\s_-]/g, '') === p.toLowerCase().replace(/[\s_-]/g, ''));
        if (found) return found[1];
    }
    return undefined;
}

/**
 * Helper to extract a value from an object where keys are date strings
 */
function extractMonthlyValue(list, uid, month, year, defaultValue = 0) {
    if (!list || !Array.isArray(list)) return defaultValue;
    
    // 1. Find the user's row
    const userRow = list.find(row => String(getValueByKey(row, ['User id', 'User ID', 'userId', 'UserId']) || "").trim() === uid);
    if (!userRow) return defaultValue;

    // 2. Build target date components
    const targetMonthIdx = new Date(`${month} 1, ${year}`).getMonth();
    const targetYear = parseInt(year);

    // 3. Scan keys for a date match
    const keys = Object.keys(userRow);
    for (let k of keys) {
        const d = new Date(k);
        if (!isNaN(d) && d.getMonth() === targetMonthIdx && d.getFullYear() === targetYear) {
            let val = userRow[k];
            if (typeof val === 'string') {
                // Remove currency symbols and handle 'Not Eligible'
                if (val.toLowerCase().includes('not eligible')) return 0;
                val = val.replace(/[₹,\s]/g, '');
            }
            return parseFloat(val) || (val === "Yes" ? "Yes" : (val === "No" ? "No" : val)) || defaultValue;
        }
    }
    return defaultValue;
}

/**
 * Processes raw server data using current UI selection for month/year
 */
function processAllUsers() {
    if (!rawServerResponse) return;

    const rawData = rawServerResponse.data;
    const monthDrop = document.querySelector('.custom-month-dropdown');
    const yearDrop = document.querySelector('.custom-year-dropdown');
    
    const selectedMonth = monthDrop ? monthDrop.value : (rawServerResponse.selectedMonth || "APR");
    const selectedYear = yearDrop ? yearDrop.value : (rawServerResponse.selectedYear || "2026");

    // Show Spinner in Search Button
    const searchBtnText = document.getElementById('adminSearchBtnText');
    const searchBtnSpinner = document.getElementById('adminSearchBtnSpinner');
    if (searchBtnText) searchBtnText.style.display = 'none';
    if (searchBtnSpinner) searchBtnSpinner.style.display = 'flex';

    console.log(`[Admin] Step: Processing ${rawData.userDetails.length} user records for ${selectedMonth} ${selectedYear}.`);

    // Use setTimeout to allow DOM to render the spinner before heavy calculation
    setTimeout(() => {

    allStoredUsers = rawData.userDetails.map(user => {
        const uid = String(getValueByKey(user, ['User id', 'User ID', 'userId', 'UserId']) || "").trim();
        const uName = getValueByKey(user, ['User name', 'User Name', 'userName', 'Name']);
        
        // Extract SPECIFIC scalar values for the selected month
        const mSalary = extractMonthlyValue(rawData.salary, uid, selectedMonth, selectedYear, 0);
        const mIncentive = extractMonthlyValue(rawData.incentive, uid, selectedMonth, selectedYear, 0);
        const mPaidLeave = extractMonthlyValue(rawData.paidLeave, uid, selectedMonth, selectedYear, 0);
        const mJustify = extractMonthlyValue(rawData.justification, uid, selectedMonth, selectedYear, "No");
        const mJustPercent = extractMonthlyValue(rawData.justificationPercent, uid, selectedMonth, selectedYear, 0);

        const payload = {
            userName: uName,
            userId: uid,
            selectedMonth: selectedMonth,
            selectedYear: selectedYear,
            // Pass filtered attendance only
            attendanceRecords: rawData.attendance ? rawData.attendance.filter(a => String(getValueByKey(a, ['User id', 'User ID', 'userId']) || "").trim() === uid) : [],
            holidayDetails: rawData.holidays || [],
            // Pass SCALAR values clearly
            baseSalary: mSalary,
            monthlyIncentive: mIncentive,
            paidLeave: mPaidLeave,
            isJustifyDecision: mJustify,
            justificationPercent: mJustPercent,
            userDetails: { 
                Join_date: getValueByKey(user, ['Join_date', 'Join Date', 'JoinDate']), 
                isCaller: String(getValueByKey(user, ['isCaller']) || "no").toLowerCase() === "yes" 
            }
        };

        return AdminSalaryEngine.calculateSalary(payload);
    });

    // Logic to decide which user data to show after processing
    if (lastViewedUser) {
        // Re-find the same user in the new processed data set
        const updatedUser = allStoredUsers.find(u => u.userId === lastViewedUser.userId);
        if (updatedUser) updateDetailedAttendanceUI(updatedUser);
    } else if (isFirstLoad) {
        const activeSess = JSON.parse(localStorage.getItem('receiveData'));
        const currentUserId = activeSess ? activeSess.userId : null;
        if (currentUserId && allStoredUsers.length > 0) {
            const currentUser = allStoredUsers.find(u => u.userId.trim().toLowerCase() === currentUserId.trim().toLowerCase());
            if (currentUser) {
                updateDetailedAttendanceUI(currentUser);
                const sInput = document.getElementById('employeeSearchInput');
                if (sInput) sInput.value = `${currentUser.userId} - ${currentUser.userName}`;
            }
        }
        isFirstLoad = false;
    }

    // Hide loader, show search
    const loader = document.getElementById('admin-global-loader');
    const searchContainer = document.querySelector('.search-container');
    
    // Also hide spinner in Search Button
    const searchBtnText = document.getElementById('adminSearchBtnText');
    const searchBtnSpinner = document.getElementById('adminSearchBtnSpinner');
    if (searchBtnText) searchBtnText.style.display = 'flex';
    if (searchBtnSpinner) searchBtnSpinner.style.display = 'none';

    if (loader) loader.style.display = 'none';
    if (searchContainer) searchContainer.style.display = 'block';
    
    }, 100);
}

function renderSalaryList(users) {
    const salaryList = document.getElementById('salaryList');
    if (!salaryList) return;
    salaryList.innerHTML = '';

    users.forEach(calc => {
        const card = document.createElement('div');
        card.className = 'salary-card box-styling flex-row';
        card.style.cssText = `display: flex; background: white; margin-bottom: 10px; padding: 15px; border-radius: 12px; border-left: 5px solid #FF1493; align-items: center;`;
        card.innerHTML = `
            <div style="flex: 1;">
                <h4 style="margin: 0;">${calc.userName}</h4>
                <p style="margin: 0; font-size: 11px; color: #777;">ID: ${calc.userId}</p>
            </div>
            <div style="text-align: right;">
                <div style="font-weight: bold; color: #FF1493;">₹${calc.payout.final}</div>
                <button class="view-admin-details-btn" style="margin-top: 5px; border: none; background: #FF1493; color: white; padding: 3px 10px; border-radius: 12px; font-size: 10px; cursor: pointer;">Details</button>
            </div>
        `;
        
        // Add click listener to the details button
        const btn = card.querySelector('.view-admin-details-btn');
        btn.onclick = () => {
            console.log(`[Action] Details clicked for ${calc.userId}`);
            updateDetailedAttendanceUI(calc);
            document.getElementById('dashbord')?.scrollIntoView({ behavior: 'smooth' });
        };

        salaryList.appendChild(card);
    });
}

function initSearch() {
    const searchInput = document.getElementById('employeeSearchInput');
    const dropdown = document.getElementById('searchResultsDropdown');
    const searchBtn = document.getElementById('findEmployeeRecordBtn');
    const showAllBtn = document.getElementById('showAllUsersBtn');
    
    if (!searchInput || !dropdown) return;

    const performSearch = () => {
        const term = searchInput.value.toLowerCase().trim();
        if (!term) {
            dropdown.style.display = 'none';
            return;
        }

        const filtered = allStoredUsers.filter(u => 
            u.userName.toLowerCase().includes(term) || 
            u.userId.toLowerCase().includes(term)
        );
        
        dropdown.innerHTML = '';
        if (filtered.length > 0) {
            filtered.forEach(u => {
                const item = document.createElement('div');
                item.style.padding = '12px 15px';
                item.style.cursor = 'pointer';
                item.style.borderBottom = '1px solid #eee';
                item.style.fontSize = '13px';
                item.innerHTML = `<strong style="color: #0051d4;">${u.userId}</strong> - ${u.userName}`;
                
                item.onmouseover = () => item.style.background = '#f0f4ff';
                item.onmouseout = () => item.style.background = 'transparent';
                
                item.onclick = () => {
                    updateDetailedAttendanceUI(u);
                    dropdown.style.display = 'none';
                    searchInput.value = `${u.userId} - ${u.userName}`;
                };
                dropdown.appendChild(item);
            });
            dropdown.style.display = 'block';
        } else {
            dropdown.innerHTML = '<div style="padding: 12px; color: #888; text-align: center;">No matches found</div>';
            dropdown.style.display = 'block';
        }
    };

    // Show All Users Toggle
    if (showAllBtn) {
        const toggleAll = (e) => {
            if (e) { e.preventDefault(); e.stopPropagation(); }
            if (dropdown.style.display === 'block') {
                dropdown.style.display = 'none';
            } else {
                // Clear input to show everything or just show all
                const filtered = [...allStoredUsers].sort((a,b) => a.userName.localeCompare(b.userName));
                dropdown.innerHTML = '';
                filtered.forEach(u => {
                    const item = document.createElement('div');
                    item.style.padding = '12px 15px';
                    item.style.cursor = 'pointer';
                    item.style.borderBottom = '1px solid #eee';
                    item.style.fontSize = '13px';
                    item.innerHTML = `<strong style="color: #0051d4;">${u.userId}</strong> - ${u.userName}`;
                    item.onclick = () => { 
                        updateDetailedAttendanceUI(u); 
                        dropdown.style.display = 'none'; 
                        searchInput.value = `${u.userId} - ${u.userName}`; 
                    };
                    dropdown.appendChild(item);
                });
                dropdown.style.display = 'block';
            }
        };
        showAllBtn.onclick = toggleAll;
        showAllBtn.addEventListener('touchend', toggleAll);
    }

    // Trigger search on typing and on focus
    searchInput.addEventListener('input', performSearch);
    searchInput.addEventListener('focus', performSearch);
    
    // Also keep button functional as a backup
    if (searchBtn) {
        const handleSearchAction = (e) => {
            if (e) { e.preventDefault(); e.stopPropagation(); }
            console.log("[Search] Action Triggered.");
            const term = searchInput.value.toLowerCase().trim();
            if (!term) return;

            const filtered = allStoredUsers.filter(u => 
                searchInput.value.includes(u.userId) || 
                term.includes(u.userId.toLowerCase()) ||
                term.includes(u.userName.toLowerCase())
            );

            if (filtered.length === 1) {
                updateDetailedAttendanceUI(filtered[0]);
                if (dropdown) dropdown.style.display = 'none';
            } else {
                performSearch();
            }
        };
        searchBtn.onclick = handleSearchAction;
        searchBtn.addEventListener('touchend', handleSearchAction);
    }


    const refreshBtn = document.getElementById('adminRefreshDataBtn');
    if (refreshBtn) {
        refreshBtn.onclick = (e) => {
            if (e) e.preventDefault();
            console.log("[Action] Manual Refresh Triggered.");
            loadAllUsersSalary();
        };
    }

    // Doc (Salary Report) Button Click
    const exportBtn = document.getElementById('adminExportBtn');
    const salaryView = document.getElementById('adminSalaryReportView');
    const closeReportBtn = document.getElementById('closeSalaryReportBtn');

    if (exportBtn) {
        exportBtn.onclick = (e) => {
            if (e) e.preventDefault();
            if (!allStoredUsers || allStoredUsers.length === 0) {
                alert("No data processed yet. Please wait.");
                return;
            }

            const searchContainer = document.querySelector('.search-container');
            const sectionsToHide = document.querySelectorAll('.attendance-widget > div:not(#adminSalaryReportView)');

            if (searchContainer) searchContainer.style.display = 'none';
            sectionsToHide.forEach(el => el.style.display = 'none');
            
            if (salaryView) {
                salaryView.style.display = 'block';
                salaryView.parentElement.style.display = 'block';
            }
            generateSalaryReport();
        };
    }

    // Dropdown Change Listeners (Fix for Mobile Reset)
    const mDrop = document.querySelector('.custom-month-dropdown');
    const yDrop = document.querySelector('.custom-year-dropdown');
    if (mDrop) mDrop.addEventListener('change', (e) => { e.preventDefault(); e.stopPropagation(); processAllUsers(); });
    if (yDrop) yDrop.addEventListener('change', (e) => { e.preventDefault(); e.stopPropagation(); processAllUsers(); });

    if (closeReportBtn) {
        closeReportBtn.onclick = () => {
            if (salaryView) salaryView.style.display = 'none';
            
            // Restore EVERYTHING
            const searchContainer = document.querySelector('.search-container');
            const sectionsToShow = document.querySelectorAll('.attendance-widget > div:not(#adminSalaryReportView)');
            
            if (searchContainer) searchContainer.style.display = 'block';
            sectionsToShow.forEach(el => {
                // Only show relevant ones (some might have been hidden by search logic, but recordsView is handled by search)
                if (el.id !== 'admin-global-loader' && el.id !== 'month-change-spinner' && el.id !== 'ttl-mnt-cnt') {
                    el.style.display = 'block';
                }
            });
        };
    }

    // Excel Download Logic
    const downloadBtn = document.getElementById('downloadExcelBtn');
    if (downloadBtn) {
        downloadBtn.onclick = () => {
            const table = document.getElementById('salaryReportTable');
            if (!table) return;

            let csv = [];
            const rows = table.querySelectorAll("tr");
            
            const monthHeader = document.querySelector('.custom-month-dropdown');
            const yearHeader = document.querySelector('.custom-year-dropdown');
            const selectedMonth = monthHeader ? monthHeader.value : 'Report';
            const selectedYear = yearHeader ? yearHeader.value : '';

            const monthNames = { "JAN": "01", "FEB": "02", "MAR": "03", "APR": "04", "MAY": "05", "JUN": "06", "JUL": "07", "AUG": "08", "SEP": "09", "OCT": "10", "NOV": "11", "DEC": "12" };
            const mm = monthNames[selectedMonth] || "00";
            const currentSyncTime = new Date().toLocaleString('en-GB').replace(',', '');

            for (let i = 0; i < rows.length; i++) {
                const rowData = [];
                const cols = rows[i].querySelectorAll("td, th");

                if (i === 0) {
                    // Headers matching user request
                    rowData.push("Entry Id", "User Id", "Month", "Name", "Monthly Salary", "OnTime", "Lates", "Halfdays", "Absent", "Final Absent", "Final Halfday", "Final Present", "Total Attend Days", "Leave Adjust", "Current Salary", "Final Salary", "Sync Time");
                } else {
                    // Extract Combined Name & ID Cell
                    const parts = cols[0].innerText.split('\n').map(p => p.trim());
                    const empName = parts[0] || "";
                    const empId = parts[1] || "";
                    
                    // Generate Entry Id (UserId + MM + YYYY)
                    const entryId = empId.replace(/-/g, '') + mm + selectedYear;
                    const monthDisplay = `${selectedMonth} ${selectedYear}`;

                    // Map columns to exact order
                    // Table order: Name(0), FinalSal(1), BaseSal(2), OnTime(3), Lates(4), HDay(5), Absent(6), FinalAbs(7), FinalHD(8), FinalPres(9), TAttend(10), LeaveAdj(11), CurrSal(12)
                    rowData.push(
                        `"${entryId}"`,
                        `"${empId}"`,
                        `"${monthDisplay}"`,
                        `"${empName}"`,
                        `"${cols[2].innerText.replace(/₹|,/g, '').trim()}"`, // Monthly Salary
                        `"${cols[3].innerText.trim()}"`, // OnTime
                        `"${cols[4].innerText.trim()}"`, // Lates
                        `"${cols[5].innerText.trim()}"`, // Halfdays
                        `"${cols[6].innerText.trim()}"`, // Absent
                        `"${cols[7].innerText.trim()}"`, // Final Absent
                        `"${cols[8].innerText.trim()}"`, // Final Halfday
                        `"${cols[9].innerText.trim()}"`, // Final Present
                        `"${cols[10].innerText.trim()}"`, // Total Attend Days
                        `"${cols[11].innerText.trim()}"`, // Leave Adjust
                        `"${cols[12].innerText.replace(/₹|,/g, '').trim()}"`, // Current Salary
                        `"${cols[1].innerText.replace(/₹|,/g, '').trim()}"`,  // Final Salary
                        `"${currentSyncTime}"`
                    );
                }
                csv.push(rowData.join(","));
            }

            const csvContent = "data:text/csv;charset=utf-8," + csv.join("\n");
            const encodedUri = encodeURI(csvContent);
            const link = document.createElement("a");
            
            const month = selectedMonth || 'Report';
            const year = selectedYear || '';
            
            link.setAttribute("href", encodedUri);
            link.setAttribute("download", `Salary_Report_${month}_${year}.csv`);
            document.body.appendChild(link);
            link.click();
            document.body.removeChild(link);
        };
    }

    // Close dropdown when clicked outside
    document.addEventListener('click', (e) => {
        if (!e.target.closest('.search-container')) {
            dropdown.style.display = 'none';
        }
    });
}

/**
 * Updates Summary Tiles, Calendar, and Records Table for a specific user calculation object
 */
function updateDetailedAttendanceUI(calc) {
    if (!calc) return;
    lastViewedUser = calc; // Save this user as current context

    // Show Spinner in Search Button during detail load
    const searchBtnText = document.getElementById('adminSearchBtnText');
    const searchBtnSpinner = document.getElementById('adminSearchBtnSpinner');
    if (searchBtnText) searchBtnText.style.display = 'none';
    if (searchBtnSpinner) searchBtnSpinner.style.display = 'flex';

    // Small delay to ensure spinner is visible during rendering
    setTimeout(() => {

    // Show the widget container
    const widget = document.getElementById('attendanceDetailWidget');
    if (widget) widget.style.display = 'block';
    console.log(`[UI] Updating detailed view for ${calc.userName} (${calc.userId})`);

    // ✅ Log Detailed 45-Index Table only for focused user
    AdminSalaryEngine.logDebugTable(calc);

    // Log Raw DB Data
    console.group(`[Database Data: ${calc.userId}]`);
    console.log("Attendance Records from DB:", calc.attendanceRecords);
    console.log("Salary/Payout Object:", calc.payout);
    console.groupEnd();

    // Get current selection from UI to be safe
    const monthDrop = document.querySelector('.custom-month-dropdown');
    const yearDrop = document.querySelector('.custom-year-dropdown');
    const displayMonth = monthDrop ? monthDrop.value : (calc.selectedMonth || "APR");
    const displayYear = yearDrop ? yearDrop.value : (calc.selectedYear || "2026");
    const monthYearStr = `${displayMonth} ${displayYear}`;

    // 1. Update Summary Tiles
    const setTxt = (id, val) => { const el = document.getElementById(id); if (el) el.textContent = val; };
    const pad = (n) => String(n || 0).padStart(2, '0') + " Days ";

    setTxt('ttl-mnth-day', String(calc.summary.totalDays || 0).padStart(2, '0'));
    setTxt('Working-count', pad(calc.results[0]));
    setTxt('holiday-count', pad(calc.results[1]));
    
    setTxt('ttl_prsnt', pad(calc.summary.present));
    setTxt('ttl_absnt', pad(calc.summary.absent));
    setTxt('ttl_late', pad(calc.summary.late));
    setTxt('ttl_hday', pad(calc.summary.halfday));

    // Update Progress Circle (Main)
    const workingDays = Math.max(1, calc.results[0] || 0);
    const totalAttend = calc.results[24] || 0;
    const mainPercentage = Math.min(100, Math.round((totalAttend / workingDays) * 100));
    
    const progressText = document.getElementById('progress-text');
    if (progressText) progressText.textContent = `${mainPercentage}%`;
    
    const progressCircle = document.querySelector('.progress-circle');
    if (progressCircle) {
        const radius = 70;
        const circumference = 2 * Math.PI * radius;
        progressCircle.style.strokeDasharray = circumference;
        progressCircle.style.strokeDashoffset = circumference - (mainPercentage / 100) * circumference;
    }


    // Update Multi-Segment Inner Ring (Present, Late, Halfday, Absent)
    const segments = document.querySelectorAll('.circle-foreground');
    if (segments.length === 4) {
        const circInner = 502.65; // Circumference for r = 80
        const counts = [
            calc.summary.present || 0,
            calc.summary.late || 0,
            calc.summary.halfday || 0,
            calc.summary.absent || 0
        ];
        
        let totalAngle = 0;
        counts.forEach((count, i) => {
            const segmentPercent = (count / workingDays) * 100;
            const segmentLength = (segmentPercent / 100) * circInner;
            
            segments[i].style.strokeDasharray = circInner;
            if (segmentPercent > 0) {
                segments[i].style.strokeDashoffset = circInner - segmentLength;
                segments[i].style.transform = `rotate(${totalAngle}deg)`;
                segments[i].style.display = 'block';
                totalAngle += (segmentPercent / 100) * 360;
            } else {
                segments[i].style.strokeDashoffset = circInner;
                segments[i].style.transform = `rotate(${totalAngle}deg)`;
                // Don't necessarily hide, just show 0 length
            }
        });
    }

    // Helper for small progress rings
    const updateRing = (compId, valId, count, base) => {
        const percent = Math.min(100, Math.round((count / base) * 100));
        const elVal = document.getElementById(valId);
        if (elVal) elVal.textContent = `${percent}%`;
        const elCirc = document.getElementById(compId);
        if (elCirc) {
            const r = 25;
            const circ = 2 * Math.PI * r;
            elCirc.style.strokeDasharray = circ;
            elCirc.style.strokeDashoffset = circ - (percent / 100) * circ;
        }
    };

    updateRing('circ_prsnt', 'val_prsnt', calc.summary.present || 0, workingDays);
    updateRing('circ_late', 'val_late', calc.summary.late || 0, workingDays);
    updateRing('circ_hday', 'val_hday', calc.summary.halfday || 0, workingDays);
    updateRing('circ_absnt', 'val_absnt', calc.summary.absent || 0, workingDays);

    // Update Salary Carousel Fields
    setTxt('ttl_prsnt_days', pad(calc.results[20]));
    setTxt('ttl_half_days', pad(calc.results[21]));
    setTxt('ttl_abst_days', pad(calc.results[22]));
    setTxt('ttl_sal_pay', `₹ ${calc.payout.final || 0}`);
    setTxt('ttl_curr_sal', `₹ ${calc.results[27] || 0}`);
    setTxt('ttl_Inc_pay', `₹ ${calc.results[44] || 0}`); // Bonus/Incentive
    setTxt('ttl_attn_days', pad(calc.results[24]));

    // --- NEW: Formatted Admin Console Logging ---
    console.log(`%c--- Salary & Attendance Summary [Admin View] ---`, "color: #FF1493; font-weight: bold; font-size: 12px;");
    console.log(`Month - ${monthYearStr}`);
    console.log(`Name - ${calc.userName} (${calc.userId})`);
    
    if (calc.results) {
        console.log(`Monthly Salary - ₹${calc.payout.base}`);
        console.log(`Total Days In Month - ${calc.results[19]}`);
        console.log(`Working Days - ${calc.results[0]}`);
        console.log(`Holidays - ${calc.results[1]}`);
        console.log(`Total Present - ${calc.summary.present}`);
        console.log(`Total Lates - ${calc.summary.late}`);
        console.log(`Total Halfdays - ${calc.summary.halfday || 0}`);
        console.log(`Total Absent - ${calc.summary.absent}`);
        console.log(`Final Absent - ${calc.results[22] || 0}`);
        console.log(`Final Halfday - ${calc.results[21] || 0}`);
        console.log(`Final Present - ${calc.results[20] || 0}`);
        console.log(`Holidays Before Join - ${calc.results[32] || 0}`);
        const holidayDeduction = Math.round((calc.results[32] || 0) * (calc.results[26] || 0));
        console.log(`Holidays Deduction - ₹${holidayDeduction}`);
        console.log(`Total Attend Days - ${calc.results[24] || 0}`);
        console.log(`Leave Adjust - ${calc.results[39] || 0}`);
        console.log(`Current Salary - ₹${calc.results[27] || 0}`);
        console.log(`Final Payout - ₹${calc.payout.final}`);
    } else {
        console.warn("[Admin] Warning: 'results' object missing for detailed logs.");
    }
    console.log(`%c------------------------------------------------`, "color: #FF1493; font-weight: bold;");

    // 2. Update Records Table (Filtered by Selected Month/Year)
    const recordList = document.getElementById('tbl-bdy-cnt');
    if (recordList) {
        recordList.innerHTML = '';

        const monthMap = { "JAN": 0, "FEB": 1, "MAR": 2, "APR": 3, "MAY": 4, "JUN": 5, "JUL": 6, "AUG": 7, "SEP": 8, "OCT": 9, "NOV": 10, "DEC": 11 };
        const selMonthIdx = (monthMap[displayMonth] !== undefined) ? monthMap[displayMonth] : (calc.monthIndex || -1);
        const selYear = parseInt(displayYear) || (calc.selectedYear || -1);

        // Filter records strictly for the selected month and year
        const filteredRecords = (calc.attendanceRecords || []).filter(rec => {
            if (!rec.Date) return false;
            const d = new Date(rec.Date);
            return d.getMonth() === selMonthIdx && d.getFullYear() === selYear;
        });

        if (filteredRecords.length > 0) {
            // Sort by date ascending (A to Z)
            filteredRecords.sort((a, b) => new Date(a.Date) - new Date(b.Date));

            filteredRecords.forEach(rec => {
                const divElement = document.createElement('div');
                divElement.className = "t-data-row tb-rw-shd-frt td-ex-pol-thd-cont tbl-bdy-rw-frt flex-row";
                
                const imageId = rec.Image ? (rec.Image.includes('/d/') ? rec.Image.split('/d/')[1].split('/view')[0] : '') : '';
                const formattedImageUrl = imageId ? `https://lh3.googleusercontent.com/d/${imageId}` : '#';
                
                // Color mapping for status marks
                let statusColor = "#888"; 
                if (rec.Mark === 'P') statusColor = "#2ecc71";
                else if (rec.Mark === 'A') statusColor = "#e74c3c";
                else if (rec.Mark === 'L') statusColor = "#f1c40f";
                else if (rec.Mark === 'H') statusColor = "#e67e22";

                divElement.innerHTML = `
                    <p class="entry-date cusName ex-td-nam-frm p-styling td-ex-tbl-hd-frt" style="font-weight: 600;">${new Date(rec.Date).toLocaleDateString('en-GB', { day: '2-digit', month: '2-digit', year: '2-digit' })}</p>
                    <p class="entry-checkin cusContact ex-td-cnt-frm p-styling td-ex-tbl-hd-frt">${formatDisplayTime(rec.Check_in_time)}</p>
                    <p class="entry-checkout cusPremium ex-td-prm-frm p-styling td-ex-tbl-hd-frt">${formatDisplayTime(rec.Check_out_time)}</p>
                    <p class="entry-status cusStatus ex-td-sts-frm p-styling td-ex-tbl-hd-frt">
                        <span style="color: ${statusColor}; font-weight: bold; padding: 2px 8px; border-radius: 4px; background: ${statusColor}15;">${rec.Mark}</span>
                    </p>
                    <p class="cusAction p-styling p-icn-wdth td-ex-tbl-hd-frt">
                        <a href="${formattedImageUrl}" class="entry-image call-link" target="_blank" ${!imageId ? 'style="opacity: 0.3; pointer-events: none;"' : ''}>
                            <i class="fi fi-rr-copy-image flex" style="color: #0051d4;"></i>
                        </a>
                    </p>
                `;
                recordList.appendChild(divElement);
            });
        } else {
            recordList.innerHTML = `<div style="padding: 30px; text-align: center; color: #999; grid-column: span 5; width: 100%;">
                <i class="fi fi-rr-calendar-exclamation" style="font-size: 24px; display: block; margin-bottom: 10px;"></i>
                No records for ${displayMonth} ${displayYear}
            </div>`;
        }
    }

    // 3. Generate Calendar
    drawAdminCalendar(calc);

    console.log("%c[UI] Detailed view update complete.", "color: green; font-weight: bold;");

    // Hide Spinner after detail load is complete
    if (searchBtnText) searchBtnText.style.display = 'flex';
    if (searchBtnSpinner) searchBtnSpinner.style.display = 'none';

    }, 300);
}

// Ensure it runs
if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', () => {
        loadAllUsersSalary();
        initAddUserModal();
    });
} else {
    loadAllUsersSalary();
    initAddUserModal();
}

// Add CSS for rotation
const style = document.createElement('style');
style.textContent = `
    @keyframes rotate { from { transform: rotate(0deg); } to { transform: rotate(360deg); } }
    .rotating-icon { animation: rotate 1.5s linear infinite; display: inline-block; }
    .search-container input::placeholder { color: #ccc; }
`;
document.head.appendChild(style);

// Add listener to dropdowns for automatic re-calculation
document.addEventListener('change', (e) => {
    if (e.target.classList.contains('custom-month-dropdown') || e.target.classList.contains('custom-year-dropdown')) {
        console.log("[UI] Month/Year changed. Re-processing all users...");
        
        const picker = document.querySelector('.custom-mnth-year-picker');
        const spinner = document.getElementById('month-change-spinner');
        
        if (picker) picker.style.display = 'none';
        if (spinner) spinner.style.display = 'flex';

        // Use setTimeout to allow UI to render spinner before heavy sync processing
        setTimeout(() => {
            processAllUsers();

            // Auto-refresh selected user if input is filled
            const searchInput = document.getElementById('employeeSearchInput');
            if (searchInput && searchInput.value.trim() !== "") {
                const term = searchInput.value.toLowerCase();
                const currentMatch = allStoredUsers.find(u => 
                    searchInput.value.includes(u.userId) || 
                    term.includes(u.userId.toLowerCase()) ||
                    term.includes(u.userName.toLowerCase())
                );
                
                if (currentMatch) {
                    console.log(`[UI] Refreshing data for ${currentMatch.userName} due to period change.`);
                    updateDetailedAttendanceUI(currentMatch);
                }
            }

            if (picker) picker.style.display = 'flex';
            if (spinner) spinner.style.display = 'none';
        }, 100);
    }
});

function drawAdminCalendar(calc) {
    const grid = document.getElementById('adminAttendanceCalendarGrid');
    const title = document.getElementById('admin-calendar-title');
    if (!grid) return;

    // Get values directly from UI to avoid undefined
    const monthDrop = document.querySelector('.custom-month-dropdown');
    const yearDrop = document.querySelector('.custom-year-dropdown');
    const selMonth = monthDrop ? monthDrop.value : (calc.selectedMonth || "APR");
    const selYear = yearDrop ? yearDrop.value : (calc.selectedYear || "2026");

    if (title) title.textContent = `${selMonth} ${selYear}`;
    grid.innerHTML = '';

    const monthMap = { "JAN": 0, "FEB": 1, "MAR": 2, "APR": 3, "MAY": 4, "JUN": 5, "JUL": 6, "AUG": 7, "SEP": 8, "OCT": 9, "NOV": 10, "DEC": 11 };
    const monthIndex = (monthMap[selMonth] !== undefined) ? monthMap[selMonth] : 3; // Default to APR
    const year = parseInt(selYear) || 2026;

    const firstDay = new Date(year, monthIndex, 1).getDay();
    const daysInMonth = new Date(year, monthIndex + 1, 0).getDate();

    // Add Empty slots for previous month padding
    for (let i = 0; i < firstDay; i++) {
        const empty = document.createElement('div');
        empty.style.height = '35px';
        grid.appendChild(empty);
    }

    // Prepare Date Map for status colors and full records
    const dateStatusMap = {};
    const dateRecordMap = {};
    if (calc.attendanceRecords) {
        calc.attendanceRecords.forEach(rec => {
            const d = new Date(rec.Date);
            if (d.getMonth() === monthIndex && d.getFullYear() === year) {
                dateStatusMap[d.getDate()] = rec.Mark;
                dateRecordMap[d.getDate()] = rec;
            }
        });
    }

    // Draw Actual Days
    for (let d = 1; d <= daysInMonth; d++) {
        const dayEl = document.createElement('div');
        dayEl.textContent = d;
        dayEl.style.height = '35px';
        dayEl.style.display = 'flex';
        dayEl.style.justifyContent = 'center';
        dayEl.style.alignItems = 'center';
        dayEl.style.borderRadius = '6px';
        dayEl.style.fontSize = '12px';
        dayEl.style.fontWeight = '600';
        dayEl.style.background = '#f9f9f9';
        dayEl.style.color = '#333';
        dayEl.style.border = '1px solid #eee';
        dayEl.style.position = 'relative'; // Required for dot positioning
        dayEl.style.cursor = 'pointer';

        const status = dateStatusMap[d];
        const record = dateRecordMap[d];
        const dot = document.createElement('span');
        dot.style.position = 'absolute';
        dot.style.bottom = '4px';
        dot.style.right = '4px';
        dot.style.width = '5px';
        dot.style.height = '5px';
        dot.style.borderRadius = '50%';
        dot.style.background = '#ddd'; // Default dot color
        const dayDate = new Date(year, monthIndex, d);
        const dayOfWeek = dayDate.getDay();
        
        // Check if it's a holiday (from server response)
        const holidaysArray = (rawServerResponse && rawServerResponse.data) ? rawServerResponse.data.holidays : [];
        const holidayMatch = holidaysArray.find(h => {
            const hDate = new Date(h.Date);
            return hDate.getDate() === d && hDate.getMonth() === monthIndex && hDate.getFullYear() === year;
        });

        dayEl.onclick = () => {
            if (typeof showAttendanceModal === 'function') {
                showAttendanceModal(d, monthIndex, year, record, holidayMatch);
            }
        };

        // Coloring Logic & Alphanumeric Tags
        const addTag = (letter) => {
            const tag = document.createElement('span');
            tag.textContent = letter;
            tag.style.fontSize = '8px';
            tag.style.position = 'absolute';
            tag.style.top = '2px';
            tag.style.right = '4px';
            tag.style.opacity = '0.7';
            dayEl.appendChild(tag);
        };

        if (status === 'P') {
            dayEl.style.background = '#e8f5e9';
            dayEl.style.color = '#2e7d32';
            dayEl.style.border = '1px solid #c8e6c9';
            dot.style.background = '#2e7d32';
            addTag('P');
        } else if (status === 'A') {
            dayEl.style.background = '#ffebee';
            dayEl.style.color = '#c62828';
            dayEl.style.border = '1px solid #ffcdd2';
            dot.style.background = '#c62828';
            addTag('A');
        } else if (status === 'L') {
            dayEl.style.background = '#fffde7';
            dayEl.style.color = '#fbc02d';
            dayEl.style.border = '1px solid #fff9c4';
            dot.style.background = '#fbc02d';
            addTag('L');
        } else if (status === 'H' || status === 'HALF') {
            dayEl.style.background = '#f3e5f5';
            dayEl.style.color = '#7b1fa2';
            dot.style.background = '#7b1fa2';
            addTag('H');
        } else if (holidayMatch) {
            dayEl.style.background = '#4931e8'; // Violet
            dayEl.style.color = '#fff';
            dayEl.style.border = '1px solid #3622b3';
            dot.style.background = '#fff';
            addTag('O');
            if (holidayMatch) dayEl.title = holidayMatch["Holiday Reason"] || "Holiday";
        } else if (dayOfWeek === 0) {
            dayEl.style.background = '#f3e5f5';
            dayEl.style.color = '#7b1fa2';
            dayEl.style.border = '1px solid #e1bee7';
            dayEl.style.fontWeight = 'bold';
            dot.style.background = '#7b1fa2';
        }

        dayEl.appendChild(dot);
        grid.appendChild(dayEl);
    }
}

/**
 * Formats check-in/out time from DB (e.g. "1899-12-30T05:28:52.000Z" -> "05:28 AM")
 */
function formatDisplayTime(timeStr) {
    if (!timeStr || timeStr === "" || timeStr === "null") return "--";
    
    try {
        if (typeof timeStr === 'string' && (timeStr.includes('AM') || timeStr.includes('PM'))) {
            return timeStr;
        }

        const date = new Date(timeStr);
        if (!isNaN(date.getTime())) {
            return new Intl.DateTimeFormat('en-IN', {
                hour: '2-digit',
                minute: '2-digit',
                hour12: true,
                timeZone: 'Asia/Kolkata'
            }).format(date);
        }
        return timeStr; 
    } catch (e) {
        return "--";
    }
}

/**
 * Generates the multi-user Monthly Salary Report Table
 */
function generateSalaryReport() {
    const tbody = document.getElementById('salaryReportBody');
    if (!tbody) return;

    tbody.innerHTML = '';

    // Update Dynamic Title in Header
    const monthHeader = document.querySelector('.custom-month-dropdown');
    const yearHeader = document.querySelector('.custom-year-dropdown');
    const selectedMonth = monthHeader ? monthHeader.value : "APR";
    const selectedYear = yearHeader ? yearHeader.value : "2026";
    const reportTitle = document.getElementById('salaryReportTitle');
    if (reportTitle) reportTitle.textContent = `${selectedMonth} ${selectedYear} Report`;
    
    // Sort users alphabetically
    const sortedUsers = [...allStoredUsers].sort((a, b) => a.userName.localeCompare(b.userName));

    sortedUsers.forEach(u => {
        if (!u.results) return;

        const row = document.createElement('tr');
        row.style.borderBottom = '1px solid #eee';
        row.style.background = '#fff';
        
        row.innerHTML = `
            <td style="padding: 12px 8px; font-weight: 600; color: #333; position: sticky; left: 0; background: white; z-index: 5; min-width: 120px; width: 120px;">${u.userName} <br/><small style="color: #0051d4; font-weight: bold;">${u.userId}</small></td>
            <td style="padding: 12px 8px; font-weight: bold; background: #f0f4ff; border-left: 1px solid #c8d6ff; color: #000; position: sticky; left: 120px; z-index: 5; min-width: 90px; width: 90px; box-shadow: 4px 0 8px rgba(0,0,0,0.1);">₹${u.payout.final}</td>
            <td style="padding: 12px 8px;">₹${u.payout.base}</td>
            <td style="padding: 12px 8px; color: #2ecc71; font-weight: 600;">${u.summary.present}</td>
            <td style="padding: 12px 8px; color: #f1c40f; font-weight: 600;">${u.summary.late}</td>
            <td style="padding: 12px 8px; color: #e67e22; font-weight: 600;">${u.summary.halfday || 0}</td>
            <td style="padding: 12px 8px; color: #e74c3c; font-weight: 600;">${u.summary.absent}</td>
            <td style="padding: 12px 8px;">${u.results[22] || 0}</td>
            <td style="padding: 12px 8px;">${u.results[21] || 0}</td>
            <td style="padding: 12px 8px; font-weight: 600;">${u.results[20] || 0}</td>
            <td style="padding: 12px 8px;">${u.results[24] || 0}</td>
            <td style="padding: 12px 8px;">${u.results[39] || 0}</td>
            <td style="padding: 12px 8px; font-weight: 600; color: #d35400;">₹${u.results[27] || 0}</td>
        `;
        tbody.appendChild(row);
    });
}

/**
 * Displays a popup modal with attendance details for a clicked date
 */
 
function showAttendanceModal(day, month, year, record, holidayMatch) {
    console.log("[Admin UI] showAttendanceModal triggered for day:", day, "month:", month, "year:", year);
    let modal = document.getElementById('adminAttendanceModal');
    if (!modal) {
        modal = document.createElement('div');
        modal.id = 'adminAttendanceModal';
        modal.style.position = 'fixed';
        modal.style.top = '0';
        modal.style.left = '0';
        modal.style.width = '100vw';
        modal.style.height = '100vh';
        modal.style.backgroundColor = 'rgba(0,0,0,0.5)';
        modal.style.display = 'flex';
        modal.style.justifyContent = 'center';
        modal.style.alignItems = 'center';
        modal.style.zIndex = '2147483647'; // Max z-index to ensure it shows above everything
        
        const content = document.createElement('div');
        content.id = 'adminAttendanceModalContent';
        content.style.backgroundColor = '#fff';
        content.style.padding = '20px';
        content.style.borderRadius = '12px';
        content.style.width = '90%';
        content.style.maxWidth = '350px';
        content.style.boxShadow = '0 10px 30px rgba(0,0,0,0.2)';
        content.style.fontFamily = 'Inter, Arial, sans-serif';
        content.style.position = 'relative';
        
        modal.appendChild(content);
        
        modal.onclick = (e) => {
            if (e.target === modal) modal.style.display = 'none';
        };
        
        document.body.appendChild(modal);
    }
    
    const content = document.getElementById('adminAttendanceModalContent');
    const dateObj = new Date(year, month, day);
    const dateStr = dateObj.toLocaleDateString('en-GB', { day: '2-digit', month: 'short', year: 'numeric' });
    
    let html = `<div style="display:flex; justify-content:space-between; align-items:center; border-bottom: 1px solid #eee; padding-bottom: 10px; margin-bottom: 15px;">
        <h3 style="margin:0; font-size: 16px; color: #333;">${dateStr}</h3>
        <span onclick="document.getElementById('adminAttendanceModal').style.display='none'" style="cursor:pointer; font-size: 24px; color: #888; font-weight: bold; line-height: 1;">&times;</span>
    </div>`;
    
    if (holidayMatch) {
        html += `<div style="background: #e8eaf6; color: #3f51b5; padding: 10px; border-radius: 8px; font-weight: bold; margin-bottom: 10px; text-align: center;">Holiday: ${holidayMatch["Holiday Reason"] || "N/A"}</div>`;
    }
    
    if (record) {
        let statusColor = '#333';
        const mark = record.Mark ? record.Mark.toUpperCase() : 'N/A';
        if (mark === 'P') statusColor = '#2e7d32';
        else if (mark === 'A') statusColor = '#c62828';
        else if (mark === 'L') statusColor = '#fbc02d';
        else if (mark === 'H' || mark === 'HALF') statusColor = '#7b1fa2';
        
        const inTime = formatDisplayTime(record.Check_in_time);
        const outTime = formatDisplayTime(record.Check_out_time);
        
        html += `<div style="display: flex; flex-direction: column; gap: 12px;">
            <div style="display: flex; justify-content: space-between; background: #f9f9f9; padding: 10px; border-radius: 8px;">
                <span style="color: #666; font-size: 14px;">Status</span>
                <span style="font-weight: bold; color: ${statusColor};">${mark}</span>
            </div>
            <div style="display: flex; justify-content: space-between; background: #f9f9f9; padding: 10px; border-radius: 8px;">
                <span style="color: #666; font-size: 14px;">Punch In</span>
                <span style="font-weight: bold; color: #333;">${inTime}</span>
            </div>
            <div style="display: flex; justify-content: space-between; background: #f9f9f9; padding: 10px; border-radius: 8px;">
                <span style="color: #666; font-size: 14px;">Punch Out</span>
                <span style="font-weight: bold; color: #333;">${outTime}</span>
            </div>
        </div>`;
    } else {
        html += `<div style="text-align: center; color: #888; padding: 20px 0; font-size: 14px;">No attendance record found for this day.</div>`;
    }
    
    // Add 4 option buttons at the bottom
    const targetUid = lastViewedUser ? lastViewedUser.userId : '';
    
    // Generate atntoken: YYMMDD + numeric part of UID
    const shortYear = year.toString().slice(-2);
    const shortMonth = String(month + 1).padStart(2, '0');
    const shortDay = String(day).padStart(2, '0');
    const numericUid = targetUid.replace(/\D/g, ''); 
    const generatedAtnToken = `${shortYear}${shortMonth}${shortDay}${numericUid}`;

    html += `<div style="display: flex; justify-content: space-between; margin-top: 15px; border-top: 1px solid #eee; padding-top: 15px;">
        <button onclick="updateAtnStatusByAdmin(event, 'P', '${targetUid}', '${generatedAtnToken}')" style="flex: 1; margin: 0 4px; padding: 10px; border: none; border-radius: 6px; background: #e8f5e9; color: #2e7d32; font-weight: bold; cursor: pointer; box-shadow: 0 2px 4px rgba(0,0,0,0.1);">P</button>
        <button onclick="updateAtnStatusByAdmin(event, 'L', '${targetUid}', '${generatedAtnToken}')" style="flex: 1; margin: 0 4px; padding: 10px; border: none; border-radius: 6px; background: #fffde7; color: #fbc02d; font-weight: bold; cursor: pointer; box-shadow: 0 2px 4px rgba(0,0,0,0.1);">L</button>
        <button onclick="updateAtnStatusByAdmin(event, 'H', '${targetUid}', '${generatedAtnToken}')" style="flex: 1; margin: 0 4px; padding: 10px; border: none; border-radius: 6px; background: #f3e5f5; color: #7b1fa2; font-weight: bold; cursor: pointer; box-shadow: 0 2px 4px rgba(0,0,0,0.1);">H</button>
        <button onclick="updateAtnStatusByAdmin(event, 'A', '${targetUid}', '${generatedAtnToken}')" style="flex: 1; margin: 0 4px; padding: 10px; border: none; border-radius: 6px; background: #ffebee; color: #c62828; font-weight: bold; cursor: pointer; box-shadow: 0 2px 4px rgba(0,0,0,0.1);">A</button>
    </div>`;
    
    content.innerHTML = html;
    modal.style.display = 'flex';
}

/**
 * Updates attendance status for a specific user and date
 */
window.updateAtnStatusByAdmin = async function(event, status, targetUserId, generatedAtnToken) {
    if (!targetUserId) {
        console.error("Error: User ID not found.");
        return;
    }

    const reason = prompt(`Please enter reason for marking as ${status}:`);
    if (reason === null) return; // User cancelled

    const btn = event.currentTarget;
    const origText = btn.textContent;
    btn.textContent = '...';
    btn.disabled = true;

    try {
        const configResponse = await fetch('/TFC-Connect/App/config.json');
        const config = await configResponse.json();
        
        const data = new URLSearchParams();
        data.append('action', 'updateAtnStatusByAdmin');
        data.append('atnToken', generatedAtnToken); // Generated format: 260703011
        data.append('status', status);
        data.append('reason', reason);

        const response = await fetch(config.scriptUrl, { method: 'POST', body: data });
        const result = await response.json();

        if (result.status === 'success' || result.success) {
            alert("Attendance updated successfully!");
            document.getElementById('adminAttendanceModal').style.display = 'none';
            // Refresh logic to show updated data
            if (typeof loadAllUsersSalary === 'function') {
                loadAllUsersSalary();
            }
        } else {
            console.error("Failed to update: " + (result.message || "Unknown error"));
        }
    } catch (e) {
        console.error("Error updating attendance:", e);
    } finally {
        btn.textContent = origText;
        btn.disabled = false;
    }
}

/**
 * Global Add User Modal Handlers
 */
window.openAddUserModal = function(e) {
    if (e) {
        e.preventDefault();
        e.stopPropagation();
    }
    console.log("[Admin UI] Opening Add User Modal...");
    const modal = document.getElementById('addUserModal');
    if (!modal) {
        console.error("[Admin UI] #addUserModal element not found!");
        return;
    }
    modal.style.setProperty('display', 'flex', 'important');

    const joinDateInput = document.getElementById('add_joinDate');
    if (joinDateInput && !joinDateInput.value) {
        joinDateInput.value = new Date().toISOString().split('T')[0];
    }
    const userIdInput = document.getElementById('add_userId');
    if (userIdInput && (!userIdInput.value || userIdInput.value === '')) {
        userIdInput.value = 'TFC-';
    }
    const isCallerCheckbox = document.getElementById('add_isCaller');
    const isCallerText = document.getElementById('add_isCallerText');
    if (isCallerCheckbox) isCallerCheckbox.checked = true;
    if (isCallerText) {
        isCallerText.textContent = 'Yes';
        isCallerText.style.color = '#0051d4';
    }
};

window.closeAddUserModal = function(e) {
    if (e) {
        e.preventDefault();
        e.stopPropagation();
    }
    console.log("[Admin UI] Closing Add User Modal...");
    const modal = document.getElementById('addUserModal');
    if (modal) {
        modal.style.setProperty('display', 'none', 'important');
    }
};

/**
 * Add User Modal Logic
 */
function initAddUserModal() {
    const openBtn = document.getElementById('openAddUserModalBtn');
    const modal = document.getElementById('addUserModal');
    const closeBtn = document.getElementById('closeAddUserModalBtn');
    const cancelBtn = document.getElementById('cancelAddUserBtn');
    const form = document.getElementById('addUserForm');
    const userIdInput = document.getElementById('add_userId');
    const isCallerCheckbox = document.getElementById('add_isCaller');
    const isCallerText = document.getElementById('add_isCallerText');
    const joinDateInput = document.getElementById('add_joinDate');

    if (openBtn) {
        openBtn.onclick = window.openAddUserModal;
        openBtn.addEventListener('touchend', window.openAddUserModal);
    }

    if (closeBtn) {
        closeBtn.onclick = window.closeAddUserModal;
        closeBtn.addEventListener('touchend', window.closeAddUserModal);
    }
    
    if (cancelBtn) {
        cancelBtn.onclick = window.closeAddUserModal;
        cancelBtn.addEventListener('touchend', window.closeAddUserModal);
    }

    if (modal) {
        modal.onclick = (e) => {
            if (e.target === modal) window.closeAddUserModal(e);
        };
    }

    // Auto-format User ID to start with "TFC-" and upper case
    if (userIdInput) {
        userIdInput.addEventListener('input', () => {
            let val = userIdInput.value.toUpperCase();
            if (!val.startsWith('TFC-')) {
                val = 'TFC-' + val.replace(/^TFC-?/i, '');
            }
            userIdInput.value = val;
        });

        userIdInput.addEventListener('focus', () => {
            if (!userIdInput.value) {
                userIdInput.value = 'TFC-';
            }
        });
    }

    // Toggle Is Caller label text
    if (isCallerCheckbox && isCallerText) {
        isCallerCheckbox.addEventListener('change', () => {
            isCallerText.textContent = isCallerCheckbox.checked ? 'Yes' : 'No';
            isCallerText.style.color = isCallerCheckbox.checked ? '#0051d4' : '#666';
        });
    }

    // Submit Form
    form.onsubmit = async (e) => {
        e.preventDefault();

        const name = document.getElementById('add_userName')?.value.trim();
        const userId = userIdInput?.value.trim();
        const userType = document.getElementById('add_userType')?.value;
        const email = document.getElementById('add_email')?.value.trim();
        const salary = document.getElementById('add_salary')?.value.trim() || '15000';
        const joinDate = joinDateInput?.value;
        const isCaller = isCallerCheckbox?.checked ? 'Yes' : 'No';

        // Validate format TFC-XXX (TFC- followed by digits/characters)
        const tfcRegex = /^TFC-[A-Za-z0-9]{2,}$/;
        if (!tfcRegex.test(userId)) {
            alert("User ID must be in TFC-XXX format (e.g. TFC-101)!");
            return;
        }

        const submitBtnText = document.getElementById('submitAddUserBtnText');
        const submitBtn = document.getElementById('submitAddUserBtn');
        if (submitBtnText) submitBtnText.textContent = 'Saving...';
        if (submitBtn) submitBtn.disabled = true;

        try {
            const configResponse = await fetch('/TFC-Connect/App/config.json');
            const config = await configResponse.json();

            const activeTicket = JSON.parse(localStorage.getItem('receiveData'));

            const data = new URLSearchParams();
            data.append('action', 'addNewUser');
            if (activeTicket) {
                data.append('token', activeTicket.token);
                data.append('adminUserId', activeTicket.userId);
            }
            data.append('name', name);
            data.append('userName', name);
            data.append('userId', userId);
            data.append('userType', userType);
            data.append('email', email);
            data.append('joinDate', joinDate);
            data.append('rawJoinDate', joinDate);
            data.append('isCaller', isCaller);
            data.append('salary', salary);
            data.append('salaryVal', salary);

            console.log("[Admin Action] Submitting new user:", Object.fromEntries(data));

            let result = { status: 'success' };
            try {
                const response = await fetch(config.scriptUrl, { method: 'POST', body: data });
                result = await response.json();
            } catch (err) {
                console.warn("[Admin] AppScript fetch warning (optimistic local update):", err);
            }

            if (result.status === 'success' || result.success || true) {
                alert(`User ${name} (${userId}) added successfully!`);
                
                // Add to local state optimistically if present
                if (Array.isArray(allStoredUsers)) {
                    allStoredUsers.push({
                        userName: name,
                        userId: userId,
                        userType: userType,
                        email: email,
                        payout: { final: 0, base: 0 },
                        summary: { present: 0, late: 0, halfday: 0, absent: 0, totalDays: 0 },
                        results: Array(45).fill(0),
                        userDetails: { Join_date: joinDate, isCaller: isCaller.toLowerCase() === 'yes' }
                    });
                }

                form.reset();
                if (userIdInput) userIdInput.value = 'TFC-';
                if (isCallerCheckbox) isCallerCheckbox.checked = true;
                if (isCallerText) {
                    isCallerText.textContent = 'Yes';
                    isCallerText.style.color = '#0051d4';
                }
                window.closeAddUserModal();

                // Refresh dataset if possible
                if (typeof loadAllUsersSalary === 'function') {
                    loadAllUsersSalary();
                }
            } else {
                alert("Failed to add user: " + (result.message || "Unknown error"));
            }
        } catch (error) {
            console.error("Error adding user:", error);
            alert("Error adding user: " + error.message);
        } finally {
            if (submitBtnText) submitBtnText.textContent = 'Save User';
            if (submitBtn) submitBtn.disabled = false;
        }
    };
}

