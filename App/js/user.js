



 window.onload = function() {
    const sentData = JSON.parse(localStorage.getItem('sentData'));
    
    console.log("Data sent to backend:", sentData);
    console.log("Receive from backend:", JSON.parse(localStorage.getItem('reciveData')));



  // Retrieve token details from localStorage
    const activeTicket = JSON.parse(localStorage.getItem('reciveData'));
    console.log("active Ticket", activeTicket);

    if (activeTicket.isActive == true) {



    const tktuserName = activeTicket.userName; // Access userName from activeTicket
    const tktuserId = activeTicket.userId; // Access userName from activeTicket
    const tktuserType = activeTicket.userType; // Access userName from activeTicket
    const tktuserImg = activeTicket.userImage; // Access userName from activeTicket

    console.log("Username:", tktuserName); // Log the username
    console.log("UserId:", tktuserId);
    console.log("UserType:", tktuserType);
  
    const userName = document.querySelectorAll(".userName");
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
    userType.forEach(function(userTypeElement) {
        userTypeElement.innerHTML = tktuserType; // Set innerHTML for each element
    });
    userImage.forEach(function(userImageElement) {
        userImageElement.src = tktuserImg; // Set innerHTML for each element
    });
    
} else {
    console.log("No token details found.");
    window.location.href = "/index.html";
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




function logout(){
    window.location.href = '/app/login.html';
}