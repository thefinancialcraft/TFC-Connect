window.onload = function() {
    checkTokenAndLog();
};

function checkTokenAndLog() {
    console.log("Checking for token in localStorage...");

    // Retrieve the token details from localStorage
    const tokenDetailsJSON = localStorage.getItem('tokenDetails');
    
    if (tokenDetailsJSON) {
        // Parse the JSON string into an object
        const tokenDetails = JSON.parse(tokenDetailsJSON);
        
        // Log the token and expiration details
        console.log("Token details found:", tokenDetails);
        
        // Optional: Display the token details on the page
        displayUserInfo(tokenDetails);
    } else {
        console.log("No token found in localStorage.");
    }
}

function displayUserInfo(tokenDetails) {
    const userInfoDiv = document.getElementById('user-info');
    userInfoDiv.innerHTML = `
        <p><strong>Token:</strong> ${tokenDetails.token}</p>
        <p><strong>Expiration:</strong> ${new Date(tokenDetails.expiration).toLocaleString()}</p>
    `;
}
