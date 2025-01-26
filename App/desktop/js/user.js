


window.onload = function() {
    const sentData = JSON.parse(localStorage.getItem('sentData'));
    
    console.log("Data sent to backend:", sentData);
    console.log("Receive from backend:", JSON.parse(localStorage.getItem('receiveData')));



  // Retrieve token details from localStorage
    const activeTicket = JSON.parse(localStorage.getItem('receiveData'));
    console.log("active Ticket", activeTicket);

    if (activeTicket) {




    const tktuserName = activeTicket.userName; // Access userName from activeTicket // Full name from activeTicket
    const tktfirstName = tktuserName.split(" ")[0];
    const tktuserId = activeTicket.userId; // Access userName from activeTicket
    const tktuserType = activeTicket.userType; // Access userName from activeTicket
    const tktuserImg = activeTicket.userImage; // Access userName from activeTicket
    const tktuserToken = activeTicket.token; // Access userName from activeTicket

    console.log("Username:", tktuserName); // Log the username
    console.log("UserId:", tktuserId);
    console.log("UserType:", tktuserType);
    console.log("token:", tktuserToken);
  
  
    const userName = document.querySelectorAll(".userName");
    const firstName = document.querySelectorAll(".firstName");
    const userId = document.querySelectorAll(".userId");
    const userType = document.querySelectorAll(".userType");
    const userImage = document.querySelectorAll(".userImage");
    
    
     // Loop through each element and set its innerHTML
     userId.forEach(function(userIdElement) {
        userIdElement.innerHTML = tktuserId; // Set innerHTML for each element
    });
    userName.forEach(function(userNameElement) {
        userNameElement.innerHTML = tktuserName; // Set innerHTML for each element
    });
    firstName.forEach(function(firstNameElement) {
        firstNameElement.innerHTML = tktfirstName; // Set innerHTML for each element
    });
    userType.forEach(function(userTypeElement) {
        userTypeElement.innerHTML = tktuserType; // Set innerHTML for each element
    });
    userImage.forEach(function(userImageElement) {
        userImageElement.src = tktuserImg; // Set innerHTML for each element
    });
    
} else {
    console.log("No token details found.");
    // window.location.href = "/TFC-Connect/App/login.html";
}


    // Optionally, clear logs and token details from localStorage after retrieving them
    // localStorage.removeItem('loginLogs');
    // localStorage.removeItem('tokenDetails');
};




// Get all <li> elements
const menuItems = document.querySelectorAll('#menu-opn li');

// Function to handle click event on <li> items
menuItems.forEach((item) => {
    item.addEventListener('click', () => {
        // Remove active class from all <li> and <span> elements
        menuItems.forEach((li) => {
            li.classList.remove('active');
            li.querySelector('span').classList.remove('active');
        });

        // Add active class to clicked <li> and its child <span>
        item.classList.add('active');
        item.querySelector('span').classList.add('active');
    });
});




function displayLocalStorageAsObject() {
    const localStorageObject = {};

    // Loop through all keys in localStorage
    for (let i = 0; i < localStorage.length; i++) {
        const key = localStorage.key(i); // Get the key
        const value = localStorage.getItem(key); // Get the value associated with the key
        
        // Parse JSON if the value is a JSON string; otherwise, use the raw value
        try {
            localStorageObject[key] = JSON.parse(value);
        } catch (e) {
            localStorageObject[key] = value; // Assign raw value if it's not JSON
        }
    }

    console.log(localStorageObject); // Display as an object in the console
    return localStorageObject; // Return the object if needed
}

// Usage example
displayLocalStorageAsObject();



function logout() {
    // Retrieve and parse the active ticket data from localStorage
    const activeTicket = JSON.parse(localStorage.getItem('receiveData'));
     
    if (!activeTicket) {
        console.error("No active ticket found.");
        return;
    }

    // Extract token and userId from the activeTicket object
    const tktuserToken = activeTicket.token;
    const tktuserId = activeTicket.userId;

    console.log("Token:", tktuserToken);
    console.log("UserId:", tktuserId);

    // Create data object to send to the backend, with action included
    const data = new URLSearchParams();
    data.append('action', 'logoutSingle');
    data.append('token', tktuserToken);
    data.append('userId', tktuserId);

    console.log('Data being sent to the server:', data);

    // Fetch scriptUrl from config.json and then make the logout request
    fetch('/TFC-Connect/App/config.json')
        .then(response => response.json())
        .then(config => {
            const scriptUrl = config.scriptUrl;

            // Make the POST request to the App Script endpoint
            return fetch(scriptUrl, {
                method: 'POST',
                body: data
            });
        })
        .then(response => {
            if (response.headers.get('content-type')?.includes('application/json')) {
                return response.json();
            } else {
                throw new Error("Invalid JSON response");
            }
        })
        .then(data => {
            console.log("Logout successful:", data);

            // Update the specific ticket in localStorage's ticketDetails array
            if (data.userDetails) {
                // Get ticketDetails array from localStorage
                const ticketDetails = JSON.parse(localStorage.getItem('ticketDetails')) || [];

                // Find index of the ticket with matching token
                const ticketIndex = ticketDetails.findIndex(ticket => ticket.id === data.userDetails.token);

                if (ticketIndex !== -1) {
                    // Update the matching ticket's details
                    ticketDetails[ticketIndex].details = {
                        browser: data.userDetails.browser,
                        deviceModel: data.userDetails.deviceModel,
                        deviceType: data.userDetails.deviceType,
                        expiryTimestamp: data.userDetails.expiryTimestamp,
                        isActive: data.userDetails.isActive,
                        lastLoginTime: data.userDetails.lastLoginTime,
                        os: data.userDetails.os,
                        password: data.userDetails.password,
                        token: data.userDetails.token,
                        tokenGenTime: data.userDetails.tokenGenTime,
                        userId: data.userDetails.userId,
                        userImage: data.userDetails.userImage,
                        userName: data.userDetails.userName,
                        userType: data.userDetails.userType
                    };

                    // Save updated ticketDetails array back to localStorage
                    localStorage.removeItem('reciveData');
                    localStorage.setItem('ticketDetails', JSON.stringify(ticketDetails));
                    console.log("Updated ticket in localStorage:", ticketDetails
                    [ticketIndex]);
                } else {
                    console.warn("No matching ticket found for token:", data.userDetails.token);
                }

                // Redirect to /login.html after updating localStorage
                window.location.href = '/TFC-Connect/App/login.html';
            } else {
                console.warn("No userDetails found in the response.");
            }
        })
        .catch(error => {
            console.error("Error during logout:", error);
        });
}


setInterval(monitorToken(), 1000);


 
function monitorToken() {
    // Retrieve active ticket from localStorage
    const activeTicket = JSON.parse(localStorage.getItem('receiveData'));
    if (!activeTicket) {
        console.error("No active ticket found.");
        return;
    }

    const tktuserToken = activeTicket.token;

    // Set interval to check token validity every second
    const intervalId = setInterval(() => {
        // Create data object to send to the backend for token validity check
        const data = new URLSearchParams();
        data.append('action', 'checkToken');
        data.append('token', tktuserToken);

        // Fetch the backend URL from config.json
        fetch('/TFC-Connect/App/config.json')
            .then(response => response.json())
            .then(config => {
                const scriptUrl = config.scriptUrl;

                // Make a POST request to check token validity
                return fetch(scriptUrl, {
                    method: 'POST',
                    body: data
                });
            })
            .then(response => response.json())
            .then(data => {
                // Check if the token is still valid
                if (data.isValid) {
                    console.log("Token valid");
                } else {
                    console.warn("Token no longer valid");

                    // Clear the token details in localStorage and stop monitoring
                    removeInvalidTicket(tktuserToken);
                    clearInterval(intervalId); // Stop further monitoring

                    // Redirect to login page
                    window.location.href = '/TFC-Connect/App/login.html';
                }
            })
            .catch(error => {
                console.error("Error checking token validity:", error);
            });
    }, 1000); // Check every second
}

function removeInvalidTicket(token) {
    // Retrieve ticketDetails from localStorage
    const ticketDetails = JSON.parse(localStorage.getItem('ticketDetails')) || [];

    // Find index of the ticket with matching token
    const ticketIndex = ticketDetails.findIndex(ticket => ticket.id === token);

    if (ticketIndex !== -1) {
        // Remove the invalid ticket from ticketDetails
        ticketDetails.splice(ticketIndex, 1);

        // Update localStorage with the modified ticketDetails array
        localStorage.setItem('ticketDetails', JSON.stringify(ticketDetails));
        console.log(`Removed invalid ticket with token: ${token}`);
    }

    // Clear the active ticket as well
    localStorage.removeItem('reciveData');
}



function switchMenu() {
    document.getElementById("menuCard").style.display = "none";
    document.getElementById("logDetails").style.display = "block";
    document.getElementById("switchMenuBack").style.display = "flex";
    document.getElementById("switchMenu").style.display = "none";
}


function switchMenuBack() {
    document.getElementById("menuCard").style.display = "block";
    document.getElementById("logDetails").style.display = "none";
    document.getElementById("switchMenuBack").style.display = "none";
    document.getElementById("switchMenu").style.display = "flex";
}

setInterval(displayLoggedAccount, 1000);
displayLoggedAccount();


function displayLoggedAccount() {
    // Retrieve and parse `reciveData` from localStorage
    const activeTicket = JSON.parse(localStorage.getItem('receiveData'));
    if (!activeTicket) {
        console.error("No active ticket found.");
        return;
    }

    // Extract `token` from the activeTicket object
    const tktuserToken = activeTicket.token;
    console.log("Check Token:", tktuserToken);

    // Create a data object to send to the backend, including action
    const data = new URLSearchParams();
    data.append('action', 'displayLoggedAccount');
    data.append('token', tktuserToken);
    console.log('Data being sent to the server:', data);

    // Fetch config.json to get the script URL
    fetch('/TFC-Connect/App/config.json')
        .then(response => response.json())
        .then(config => {
            const scriptUrl = config.scriptUrl;

            // Send POST request to the Apps Script endpoint
            return fetch(scriptUrl, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/x-www-form-urlencoded'
                },
                body: data
            });
        })
        .then(response => {
            if (response.headers.get('content-type')?.includes('application/json')) {
                return response.json();
            } else {
                throw new Error("Invalid JSON response");
            }
        })
        .then(result => {
            console.log("Server response:", result);
            if (result.status) {
                console.log("All Accounts Received successfully.");

                const allAccounts = result.matchedAccounts;
                console.log("All Accounts:", allAccounts);

                // Clear previous contents if needed
                const deviceOpnContainer = document.getElementById('device-opn');
                deviceOpnContainer.innerHTML = '';

                // Loop through all matched accounts
                allAccounts.forEach((account, index) => {
                    // Create the device info container
                    const deviceInfoDiv = document.createElement('div');
                    deviceInfoDiv.className = 'device-info flex-row';

                    // Add device type
                    const deviceTypeDiv = document.createElement('div');
                    deviceTypeDiv.id = `deviceType-${index}`;
                    deviceTypeDiv.className = 'deviceType flex';
                    const icon = document.createElement('i');
                    icon.className = account.deviceType === 'Mobile' ? 'fi fi-rr-mobile-notch' : 'fi fi-rr-computer';
                    deviceTypeDiv.appendChild(icon);
                    deviceInfoDiv.appendChild(deviceTypeDiv);

                    // Add device details
                    const deviceDetailsDiv = document.createElement('div');
                    deviceDetailsDiv.className = 'deviceDetails flex-column';

                    // Device Model with Check Icon for Current Session
                    const deviceModelDiv = document.createElement('div');
                    deviceModelDiv.className = 'deviceModel';
                    const deviceModelText = document.createElement('div');
                    deviceModelText.id = `deviceModel-${index}`;
                    deviceModelText.className = 'deviceModel';
                    deviceModelText.innerHTML = account.deviceModel;

                    if (account.token === tktuserToken) {
                        deviceModelText.innerHTML += ' <i class="fi fi-rr-badge-check"></i>'; // Add the check icon for current session
                    }
                    deviceModelDiv.appendChild(deviceModelText);
                    deviceDetailsDiv.appendChild(deviceModelDiv);

                    // Device OS and Registration Time
                    const deviceOsRegDiv = document.createElement('div');
                    deviceOsRegDiv.className = 'deviceOsReg flex-row';
                    
                    const deviceBrowserDiv = document.createElement('div');
                    deviceBrowserDiv.id = `deviceBrowser-${index}`;
                    deviceBrowserDiv.className = 'deviceOs';
                    deviceBrowserDiv.innerText = account.deviceBrowser;
                    deviceOsRegDiv.appendChild(deviceBrowserDiv);

                    const spanElement = document.createElement('span');
                    deviceOsRegDiv.appendChild(spanElement);

                    const firstTokenGenTime = new Date(account.firstTokenGenTime);
                    const formattedFirstTokenGenTime = `${firstTokenGenTime.getDate().toString().padStart(2, '0')} ${firstTokenGenTime.toLocaleString('default', { month: 'short' })}`;
                    const tokenGenTimeDiv = document.createElement('div');
                    tokenGenTimeDiv.id = `firstTokenGenTime-${index}`;
                    tokenGenTimeDiv.className = 'devicReg';
                    tokenGenTimeDiv.innerText = formattedFirstTokenGenTime;
                    deviceOsRegDiv.appendChild(tokenGenTimeDiv);
                    deviceDetailsDiv.appendChild(deviceOsRegDiv);

                    // Device Activity
                    const deviceActivityDiv = document.createElement('div');
                    deviceActivityDiv.className = 'deviceActivity flex-row';
                    const isActiveSpan = document.createElement('span');
                    isActiveSpan.id = `isActive-${index}`;
                    isActiveSpan.className = account.isActive ? 'active' : 'inactive';
                    
                    const activeText = document.createElement('p');
                    const lastLoginDate = new Date(account.lastLoginTimestamp);
                    const formattedLastLoginTime = formatRelativeTime(lastLoginDate);
                    activeText.innerHTML = account.isActive 
                        ? `Active for <span id="lastLoginTimestamp-${index}">${formattedLastLoginTime}</span>` 
                        : `Inactive for <span id="lastLoginTimestamp-${index}">${formattedLastLoginTime}</span>`;
                    
                    deviceActivityDiv.appendChild(isActiveSpan);
                    deviceActivityDiv.appendChild(activeText);
                    deviceDetailsDiv.appendChild(deviceActivityDiv);
                    deviceInfoDiv.appendChild(deviceDetailsDiv);

                    // Delete Device Icon with Click Event to Call removeTokenFromBackend
                    const delDeviceDiv = document.createElement('div');
                    delDeviceDiv.id = `delDevice-${index}`;
                    delDeviceDiv.className = 'delDevice';
                    const deleteIcon = document.createElement('i');
                    deleteIcon.className = 'fi flex fi-rr-cross-small';
                    delDeviceDiv.appendChild(deleteIcon);

                    // Add click event listener to delete button
                    delDeviceDiv.addEventListener('click', () => {
                        removeTokenFromBackend(account.token); // Pass account.token to the function
                    });

                    deviceInfoDiv.appendChild(delDeviceDiv);
                    deviceOpnContainer.appendChild(deviceInfoDiv);
                });
            } else {
                console.log("No Record Found.");
            }
        })
        .catch(error => {
            console.error("Error occurred:", error);
        });
}

function removeTokenFromBackend(token) {
    console.log("Removing token:", token);

    // Create data object to send to the backend
    const data = new URLSearchParams();
    data.append('action', 'removeCheckToken');
    data.append('token', token);

    // Fetch backend URL from config.json
    fetch('/TFC-Connect/App/config.json')
        .then(response => response.json())
        .then(config => {
            const scriptUrl = config.scriptUrl;

            // Make POST request to remove the token
            return fetch(scriptUrl, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/x-www-form-urlencoded'
                },
                body: data
            });
        })
        .then(response => response.json())
        .then(result => {
            if (result.status === "sucess") {
                console.log("Token removal successful.");
                console.log("message:", result.message);
            } else {
                console.log("Token removal failed or token not found.");
            }
        })
        .catch(error => {
            console.error("Error occurred during token removal:", error);
        });
}






// Helper function to format dates to "04 Nov" format
function formatDate(date) {
    const options = { day: '2-digit', month: 'short' }; // Formatting options
    return date.toLocaleDateString('en-US', options);
}

// Helper function to format relative time
function formatRelativeTime(date) {
    const now = new Date();
    const secondsDiff = Math.floor((now - date) / 1000);
    let timeAgo = '';

    if (secondsDiff < 60) {
        timeAgo = `${secondsDiff} Sec`;
    } else if (secondsDiff < 3600) {
        const minutes = Math.floor(secondsDiff / 60);
        timeAgo = `${minutes} Min${minutes > 1 ? 's' : ''}`;
    } else if (secondsDiff < 86400) {
        const hours = Math.floor(secondsDiff / 3600);
        timeAgo = `${hours} Hour${hours > 1 ? 's' : ''}`;
    } else {
        const days = Math.floor(secondsDiff / 86400);
        timeAgo = `${days} Day${days > 1 ? 's' : ''}`;
    }

    return timeAgo;
}


