const convertTimeFormat = (timeString) => {
    if (!timeString || typeof timeString !== 'string') return 'N/A';
    
    // Remove "am" or "pm" and trim spaces
    timeString = timeString.replace(/\s*(am|pm)\s*/i, '').trim();
    
    // Add ":00" at the end to form a valid time format
    return `${timeString}:00`;
};
let checkinTime = result.checkInTime.replace(/"/g, '').trim(); 



function checkUserStatus() {
    // Step 1: Fetch 'whatsAppData' from localStorage
    const whatsAppData = JSON.parse(localStorage.getItem('whatsAppData'));

    if (whatsAppData) {
        // Get current date in dd/mm/yy format
        const currentDate = new Date();
        const day = String(currentDate.getDate()).padStart(2, '0');
        const month = String(currentDate.getMonth() + 1).padStart(2, '0');
        const year = String(currentDate.getFullYear()).slice(-2);
        const formattedDate = `${day}/${month}/${year}`;

        // Check if currentDate matches whatsAppData.date
        if (whatsAppData.date !== formattedDate) {
            // If date doesn't match, remove whatsAppData from localStorage
            localStorage.removeItem('whatsAppData');
            console.log('whatsAppData removed due to date mismatch');
        } else {
            // Step 2: Fetch 'officeTiming' from localStorage
            const officeTiming = JSON.parse(localStorage.getItem('officeTiming'));

            if (officeTiming) {
                // Get userId from the element with class 'userId'
                const userIdElement = document.querySelector('.userId');
                if (!userIdElement) {
                    console.log('User ID not found!');
                    return;
                }
                const userId = userIdElement.textContent.trim(); // Extract the userId

                // Check if userId matches officeTiming.userId
                if (officeTiming.userId === userId) {
                    
                    const convertTimeFormat = (timeString) => {
                        if (!timeString || typeof timeString !== 'string') return 'N/A';
                        
                        // Remove "am" or "pm" and trim spaces
                        const match = timeString.match(/(\d{1,2}):(\d{2})\s*(am|pm)/i);
                        
                        if (!match) return 'N/A';
                        
                        let [_, hour, minute, period] = match;
                        
                        // Convert to 24-hour format
                        hour = parseInt(hour, 10);
                        if (period.toLowerCase() === 'am' && hour === 12) {
                            hour = 0;  // Midnight case (12 AM is 00:00)
                        } else if (period.toLowerCase() === 'pm' && hour !== 12) {
                            hour += 12;  // Afternoon case (PM, except 12 PM which remains unchanged)
                        }
                        
                        // Format hour and minute to ensure 2-digit representation and return the result
                        return `${hour.toString().padStart(2, '0')}:${minute}:00`;
                    };
                    
                    // Correctly fetch WhatsApp data once
                    const checkInElements = document.querySelectorAll(".checkIn");
                    checkInElements.forEach(element => {
                        element.textContent = whatsAppData.checkinTime;
                    });

                    const officeCheckIn = officeTiming.checkinTime;
                    const userCheckIn = convertTimeFormat(whatsAppData.checkinTime);

                    // Helper function to add time
                    function addTimeToCheckIn(officeCheckIn, timeToAdd) {
                        const [checkInHours, checkInMinutes, checkInSeconds] = officeCheckIn.split(":").map(Number);
                        const [addHours, addMinutes, addSeconds] = timeToAdd.split(":").map(Number);
                
                        const totalSeconds = 
                            checkInSeconds + addSeconds + 
                            (checkInMinutes + addMinutes) * 60 + 
                            (checkInHours + addHours) * 3600;
                
                        const hours = Math.floor(totalSeconds / 3600) % 24;
                        const minutes = Math.floor((totalSeconds % 3600) / 60);
                        const seconds = totalSeconds % 60;
                
                        // Format time as "hh:mm:ss"
                        return `${String(hours).padStart(2, "0")}:${String(minutes).padStart(2, "0")}:${String(seconds).padStart(2, "0")}`;
                    }

                    // Create deadlines
                    const truserCheckIn = addTimeToCheckIn(userCheckIn, "15:32:00");
                    const lateDeadline = addTimeToCheckIn(officeCheckIn, "00:16:00");
                    const halfdayDeadline = addTimeToCheckIn(officeCheckIn, "00:46:00");
                    const absentDeadline = addTimeToCheckIn(officeCheckIn, "06:16:00");

                    console.log('StatusMatchFound', userId);
                    console.log('office Check in Timing', officeCheckIn);
                    console.log('office Check out Timing', officeTiming.checkoutTime);
                    console.log('User Reached at', userCheckIn);
                    
                    // Output the deadlines
                    console.log("Trail time:", truserCheckIn);
                    console.log("Late Deadline:", lateDeadline);
                    console.log("Halfday Deadline:", halfdayDeadline);
                    console.log("Absent Deadline:", absentDeadline);

                    // Call updateCheckInStatus with the proper arguments
                    const status = updateCheckInStatus(truserCheckIn, lateDeadline, halfdayDeadline, absentDeadline);
                    console.log("Check-In Status:", status);
                    return status;  // Returning status as a result
                } else {
                    console.log('No match found for userId in officeTiming');
                }
            }
        }
    } else {
        console.log('No whatsAppData found in localStorage');
    }
}

// Function to compare times
function isTimeGreaterThanOrEqual(time1, time2) {
    const [h1, m1, s1] = time1.split(":").map(Number);
    const [h2, m2, s2] = time2.split(":").map(Number);

    if (h1 > h2 || (h1 === h2 && m1 > m2) || (h1 === h2 && m1 === m2 && s1 >= s2)) {
        return true;
    }
    return false;
}

// Function to compare times
function isTimeLessThan(time1, time2) {
    const [h1, m1, s1] = time1.split(":").map(Number);
    const [h2, m2, s2] = time2.split(":").map(Number);

    if (h1 < h2 || (h1 === h2 && m1 < m2) || (h1 === h2 && m1 === m2 && s1 < s2)) {
        return true;
    }
    return false;
}

const isTimeGreaterThan = (time1, time2) => {
    // Convert both times to Date objects for comparison
    const [h1, m1, s1] = time1.split(':').map(Number);
    const [h2, m2, s2] = time2.split(':').map(Number);

    const t1 = new Date(0, 0, 0, h1, m1, s1);
    const t2 = new Date(0, 0, 0, h2, m2, s2);

    return t1 > t2;
};


// Function to update check-in status
function updateCheckInStatus(truserCheckIn, lateDeadline, halfdayDeadline, absentDeadline) {
    
    // If userCheckIn is less than lateDeadline, return "On-time"
    if (isTimeLessThan(truserCheckIn, lateDeadline) && isTimeGreaterThan(truserCheckIn, "07:00:00")) {
        return "On-time";
    } else if (isTimeGreaterThanOrEqual(truserCheckIn, absentDeadline)) {
        return "Absent";
    } else if (isTimeGreaterThanOrEqual(truserCheckIn, halfdayDeadline)) {
        return "Half-day";
    } else if (isTimeGreaterThanOrEqual(truserCheckIn, lateDeadline)) {
        return "Late";
    }
    
    // Default to "Absent" if no condition matches
    return "Absent"; // Default condition
}

// Call the checkUserStatus function to get and log the check-in status
checkUserStatus();
