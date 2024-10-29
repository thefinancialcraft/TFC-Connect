 // This function will run when the page is fully loaded
 window.onload = function() {
    const sentData = JSON.parse(localStorage.getItem('sentData'));
    
    console.log("Data sent to backend:", sentData);
    console.log("Receive from backend:", JSON.parse(localStorage.getItem('reciveData')));
    console.log("Active Ticket:", localStorage.getItem('activeTicket'));


    // Retrieve token details from localStorage
    const tokenDetails = JSON.parse(localStorage.getItem('ticketDetails'));
    if (tokenDetails) {
        console.log("ticket Details:", tokenDetails); // Display token details in the console


    } else {
        console.log("No token details found.");
        window.location.href = "/index.html";

    }

    // Optionally, clear logs and token details from localStorage after retrieving them
    localStorage.removeItem('loginLogs');
    localStorage.removeItem('tokenDetails');
};