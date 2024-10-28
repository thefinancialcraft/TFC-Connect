

function checkAndLogActiveTickets() {
        const ticketDetails = localStorage.getItem('ticketDetails'); // Retrieve 'ticketDetails' from localStorage
    
        if (ticketDetails) { // Check if 'ticketDetails' is available
            let tickets = JSON.parse(ticketDetails); // Parse the JSON string to an array of tickets
            const currentTime = Date.now(); // Current timestamp in milliseconds
            const gracePeriod = 1 * 60 * 1000; // 3 days in milliseconds
            let activeFound = false; // Flag to track if any active ticket was found
    
            // Function to convert UTC time to IST
            const toIST = (timestamp) => {
                return new Date(timestamp).toLocaleString('en-IN', { timeZone: 'Asia/Kolkata' });
            };
    
            // Filter out expired tickets
            tickets = tickets.filter((ticket, index) => {
                if (ticket.details.isActive) { // Check if isActive is true
                    activeFound = true; // Set flag to true if active ticket is found
                    console.log(`Active Ticket ${index + 1}:`, ticket); // Log active ticket
                    
                    // Convert lastLoginTime from ISO string to timestamp in milliseconds
                    const lastLoginTime = new Date(ticket.details.lastLoginTime).getTime();
                    
                    // Calculate removal time based on lastLoginTime and grace period
                    const removalTime = lastLoginTime + gracePeriod;
    
                    console.log(`Removal Time (IST): ${toIST(removalTime)}`);
                    console.log(`Last Login Time (IST): ${toIST(ticket.details.lastLoginTime)}`);
                    console.log(`Expiry Timestamp (IST): ${toIST(ticket.details.expiryTimestamp)}`); // Log expiry timestamp
    
                    // Check if currentTime is less than or equal to either the removalTime or expiryTimestamp
                    if (currentTime > removalTime || currentTime >= new Date(ticket.details.expiryTimestamp).getTime()) {
                        // Log removal details in IST
                        console.log(`Removing Ticket - Token No: ${ticket.details.token}`);
                        console.log(`Removal Time (IST): ${toIST(removalTime)}`);
                        console.log(`Current Time (IST): ${toIST(currentTime)}`); // Added current time log
                        console.log(`Last Login Time (IST): ${toIST(ticket.details.lastLoginTime)}`);
                        console.log(`Expiry Timestamp (IST): ${toIST(ticket.details.expiryTimestamp)}`); // Added expiry timestamp log
                        
                        return false; // Exclude ticket from updated tickets array
                    } else {
                        console.log(`Ticket not removed. Last Login Time is still valid.`);
                    }
                }
                return true; // Keep non-expired tickets
            });
    
            if (!activeFound) {
                console.log('No active ticket found.');
            }
    
            // Update localStorage with the filtered tickets
            localStorage.setItem('ticketDetails', JSON.stringify(tickets));
        } else {
            console.log('No ticketDetails available in localStorage');
        }
    }
    
    
    
        setInterval(checkAndLogActiveTickets, 1000); 
    
    
    
    
    
    
    