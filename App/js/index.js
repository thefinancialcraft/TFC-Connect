


        // hero image autoslider

        const slider = document.querySelector('.slider');
    const slides = document.querySelectorAll('.slide');
    const totalSlides = slides.length;
    let currentIndex = 0;
    let slideWidth = slides[0].offsetWidth; // Get the width of a single slide
    
    // Clone the first slide and append it at the end to create an infinite loop effect
    const firstClone = slides[0].cloneNode(true);
    slider.appendChild(firstClone);
    
    function moveSlider() {
        // Move the slider by adjusting translateX for one image at a time
        slider.style.transform = `translateX(${-currentIndex * slideWidth}px)`;
        slider.style.transition = 'transform 0.5s ease'; // Smooth transition
        
        // Reset to the first slide when the last one (clone) is reached
        if (currentIndex === totalSlides) {
            setTimeout(() => {
                slider.style.transition = 'none'; // Remove transition for instant jump
                currentIndex = 0;
                slider.style.transform = `translateX(0px)`; // Move to first slide
            }, 500); // 500ms delay to show the last slide before reset
        }
    }
    
    // Set an interval to slide every 3 seconds
    setInterval(() => {
        currentIndex++;
        moveSlider();
    }, 3000); // Adjust the 3000ms for how long each image shows

    window.addEventListener('resize', () => {
        // Update the slide width on window resize
        slideWidth = slides[0].offsetWidth;
    });



    

    
        // JavaScript to handle showing/hiding forms
        const forgotIdContainer = document.getElementById('forgot-id-container');
        const loginContainer = document.getElementById('login-container');
        const loginContaineremail = document.getElementById('login-container-email');
        const forgotPasswordContainer = document.getElementById('forgot-password-container');

        document.getElementById('forgot-id-link').addEventListener('click', function() {
            loginContainer.style.display = 'none';
            forgotIdContainer.style.display = 'flex';
            resetId();
            
        });

       

        document.getElementById('forgot-password-link').addEventListener('click', function() {
            loginContainer.style.display = 'none';
            forgotPasswordContainer.style.display = 'flex';
            resetPassword();
        });

        document.getElementById('forgot-password-link2').addEventListener('click', function() {
            loginContaineremail.style.display = 'none';
            forgotPasswordContainer.style.display = 'flex';
            resetPassword();
        });


  



        document.getElementById('back-to-login').addEventListener('click', function() {
            forgotIdContainer.style.display = 'none';
            loginContainer.style.display = 'flex';
        });

        document.getElementById('back-to-login-password').addEventListener('click', function() {
            forgotPasswordContainer.style.display = 'none';
            loginContainer.style.display = 'flex';
        });

        

        // Initially show the login container
        loginContainer.style.display = 'flex';




    // hero button slider
    
    const sliderContainer = document.querySelector('.slider-container');
let isSwiped = false;
let startX;
let currentTranslateX = 0;

// Get references to the hero-container and form-container elements
const heroContainer = document.querySelector('.hero-container');
const formContainer = document.querySelector('.form-container');

sliderContainer.addEventListener('touchstart', (e) => {
    startX = e.touches[0].clientX; // Finger ka starting position
    currentTranslateX = parseInt(sliderContainer.style.transform.replace('translateX(', '').replace('px)', '')) || 0; // Current position ko track karein
});

sliderContainer.addEventListener('touchmove', (e) => {
    const currentX = e.touches[0].clientX; // Current position
    const deltaX = currentX - startX; // Swipe distance

    if (!isSwiped) {
        // Swipe ko move karein, limit karein to frame ke andar
        const newTranslateX = currentTranslateX + deltaX;
        sliderContainer.style.transform = `translateX(${Math.max(0, Math.min(newTranslateX, 230))}px)`; // 0 se 300px ke beech
    }
});

sliderContainer.addEventListener('touchend', () => {
    const translateValue = parseInt(sliderContainer.style.transform.replace('translateX(', '').replace('px)', ''));

    // Check if the button is swiped more than half
    if (translateValue > 150) {
        sliderContainer.style.transform = 'translateX(240px)'; // Move to the end if swiped more than half
        isSwiped = true;

        // Hide hero-container and show form-container
        heroContainer.style.display = 'none'; // Hide hero container
        formContainer.style.display = 'flex'; // Show form container

    } else {
        sliderContainer.style.transform = 'translateX(0)'; // Return to original position
        isSwiped = false;
    }
});


function moveToNext(current, nextFieldId) {
        if (current.value.length === current.maxLength) {
            document.getElementById(nextFieldId).focus();
        }
    }

    function moveToPrevious(event, current, prevFieldId) {
        if (event.key === "Backspace" && current.value.length === 0) {
            document.getElementById(prevFieldId).focus();
        }
    }
        


    // function submitPassOtp(){
    // document.getElementById("pass-otp-verify-form").style.display = "none";
    // document.getElementById("upd-pass-form").style.display = "flex";
    // document.getElementById("hero2").style.display = "none";
    // document.getElementById("hero3").style.display = "flex";
    // }


    function resetId(){
        document.getElementById("slider").style.display = "none";
    document.getElementById("hero2").style.display = "flex";
    document.getElementById("findUserId-cont").style.display = "none";

    }

    function resetPassword(){
    document.getElementById("slider").style.display = "none";
    document.getElementById("hero2").style.display = "flex";
    }


    function loginEmail(){
    document.getElementById("login-container").style.display = "none";
    document.getElementById("login-container-email").style.display = "flex";
    }

    function loginUserid(){
    document.getElementById("login-container").style.display = "flex";
    document.getElementById("login-container-email").style.display = "none";
    }

    function backtologin(){
    document.getElementById("pass-otp-verify-form").style.display = "flex";
    document.getElementById("upd-pass-form").style.display = "none";
    document.getElementById("slider").style.display = "flex";
    document.getElementById("hero2").style.display = "none";
    document.getElementById("hero3").style.display = "none";
    document.getElementById("findUserId-cont").style.display = "none";
    document.getElementById("id-otp-verify-form").style.display = "flex";
    const inputs = document.querySelectorAll('.login-form input');
    inputs.forEach(input => {
        input.value = ''; // Change border color to red
    });
    resetUi(); 
    resetPassUi();

    }


    // Assuming this code is part of your form submission function
    function showSpinner() {
        var spinners = document.querySelectorAll(".spinner");
        var buttonTexts = document.querySelectorAll(".button-text"); // Corrected variable name
    
        // Hide the button text and show the spinner
        buttonTexts.forEach(buttonText => {
            buttonText.style.display = "none"; // Use the correct variable name
        });
    
        spinners.forEach(spinner => {
            spinner.style.display = "inline-block";
        });
    }
    
    function hideSpinner() {
        var spinners = document.querySelectorAll(".spinner");
        var buttonTexts = document.querySelectorAll(".button-text");
    
        // Hide the spinner and show the button text again
        spinners.forEach(spinner => {
            spinner.style.display = "none";
        });
    
        buttonTexts.forEach(buttonText => {
            buttonText.style.display = "inline-block";
        });
    }
       

// Function to log 'ticketDetails' data as an array of objects
function logTicketDetailsAsObjects() {
    const key = "ticketDetails";
    const value = localStorage.getItem(key);

    if (value) {
        // Parse the value as JSON, assuming it's an array format like '[{"id":1,"name":"example"},...]'
        const ticketDetailsArray = JSON.parse(value);

        // Transform each entry into an object if it’s an array
        const ticketDetailsObjects = ticketDetailsArray.map((detail, index) => ({
            [`ticketDetail_${index + 1}`]: detail
        }));

        console.log(ticketDetailsObjects);
    } else {
        console.log("No data found for 'ticketDetails'");
    }
}








// Run logTicketDetailsAsObjects on page load
window.onload = function() {
  
    
    checkTicketDetails();

    let existingTicketDetails = localStorage.getItem('ticketDetails');
          
    // Check if existingTicketDetails is valid and parse it
    if (existingTicketDetails) {
       console.log( existingTicketDetails = JSON.parse(existingTicketDetails));
        
       }
    
};






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



// Multi-tab change detection
window.addEventListener('storage', function(event) {
    if (event.key === 'ticketDetails') {
        location.reload();
    }
});

// Single-tab change detection
let previousTicketDetails = localStorage.getItem('ticketDetails');
setInterval(() => {
    const currentTicketDetails = localStorage.getItem('ticketDetails');
    if (currentTicketDetails !== previousTicketDetails) {
        location.reload();
        previousTicketDetails = currentTicketDetails;
    }
}, 1000);



function checkTicketDetails() {
    const ticketDetails = JSON.parse(localStorage.getItem('ticketDetails')); // Parse 'ticketDetails' from localStorage

    if (ticketDetails && Array.isArray(ticketDetails) && ticketDetails.length > 0) { // Check if 'ticketDetails' exists, is an array, and not empty
        switchToken();
        createSlidesFromLocalStorage();
        logTicketDetailsAsObjects();
        initializeSlider();
    } else { // If 'ticketDetails' does not exist, is null, or is an empty array
        switchLogin();
    }
}




function switchToken(){
    document.getElementById("login-container").style.display = 'none';
    document.getElementById("Last-login-container").style.display = 'flex';
}


function switchLogin(){
    document.getElementById("login-container").style.display = 'flex';
    document.getElementById("Last-login-container").style.display = 'none';
}




// Function to create slides based on ticketDetails in localStorage
function createSlidesFromLocalStorage() {
    const key = "ticketDetails";
    const value = localStorage.getItem(key);

    // Clear existing slides
    const slider = document.querySelector('.token-slider');
    slider.innerHTML = ''; // Clear existing slides

    if (value) {
        // Parse the value as JSON
        const ticketDetailsArray = JSON.parse(value);

        // Iterate over each ticket detail and create a slide
        ticketDetailsArray.forEach((detail, index) => {
            // Access user details from the nested structure
            const userDetails = detail.details;

            // Log the user image URL for debugging
            console.log(`User Image URL for index ${index + 1}: ${userDetails.userImage}`);

            // Create a new slide
            const slide = document.createElement('div');
            slide.className = 'token-slide';

            // Create the inner content for the slide
            slide.innerHTML = `
                <img id="token_userImg_${index + 1}" src="${userDetails.userImage}" alt="${userDetails.userName}">
                <div class="token_details flex-coloum">
                    <h2 id="token_userName_${index + 1}">${userDetails.userName}</h2>
                    <div class="tUsrDetails flex-row">
                        <p id="token_userId_${index + 1}">${userDetails.userId}</p>
                        <span></span>
                        <p id="token_userType_${index + 1}">${userDetails.userType}</p>
                        <p style="display: none;" id="token_id_store_${index + 1}">${userDetails.token}</p>
                    </div>
                </div>
            `;

            // Append the new slide to the slider
            slider.appendChild(slide);
        });
    } else {
        console.log("No data found for 'ticketDetails'");
    }
}


function initializeSlider() {
    let tcurrentIndex = 0;
    const tslides = document.querySelectorAll('.token-slide');
    const ttotalSlides = tslides.length;
    const tsliderContainer = document.querySelector('.token-slider');
    
    // Get button elements
    const prevBtn = document.getElementById('prevBtn');
    const nextBtn = document.getElementById('nextBtn');
    
    // Get the anchor element to update its ID and text
    const tokenIdLink = document.getElementById('token_id');
    
    // Variables for touch events
    let Startt, endX; // Startt for touch start position
    let isDragging = false;

    // Function to update the slider position
    function updateSliderPosition() {
        const offset = -tcurrentIndex * 100; // Adjust slide position by 100%
        tsliderContainer.style.transform = `translateX(${offset}%)`;
        updateButtonVisibility(); // Update button visibility after changing slide
        updateTokenId(); // Update the token ID based on the current slide
    }

    // Function to update button visibility
    function updateButtonVisibility() {
        prevBtn.style.display = tcurrentIndex === 0 ? 'none' : 'block'; // Hide or show the previous button
        nextBtn.style.display = tcurrentIndex === ttotalSlides - 1 ? 'none' : 'block'; // Hide or show the next button
    }

    // Function to update the token ID link
    function updateTokenId() {
        const activeSlide = tslides[tcurrentIndex]; // Get the currently active slide
        const tokenData = activeSlide.textContent; // Get the text content of the slide

        // Use regex to extract the token part
        const tokenMatch = tokenData.match(/token_[a-zA-Z0-9]+/); // Match the token pattern
        const token = tokenMatch ? tokenMatch[0] : ''; // Extract the token, or set as empty if not found

        // Set the ID and href to # (inactive)
        tokenIdLink.id = `token_id_store_${tcurrentIndex + 1}`;
        tokenIdLink.href = '#'; // Set href to # to make it inactive
        tokenIdLink.textContent = token; // Set text to the extracted token

        console.log(`Updated ID: ${tokenIdLink.id}, Token: ${token}`); // Log the updated values
    }

    // Function to show the next slide
    function showNextSlide() {
        if (tcurrentIndex < ttotalSlides - 1) { // Check if not at the last slide
            tcurrentIndex++; // Move to the next slide
            updateSliderPosition(); // Update the slider position
        }
    }

    // Function to show the previous slide
    function showPrevSlide() {
        if (tcurrentIndex > 0) { // Check if not at the first slide
            tcurrentIndex--; // Move to the previous slide
            updateSliderPosition(); // Update the slider position
        }
    }

    // Button event listeners
    prevBtn.addEventListener('click', showPrevSlide);
    nextBtn.addEventListener('click', showNextSlide);

    // Touch start event
    tsliderContainer.addEventListener('touchstart', (e) => {
        Startt = e.touches[0].clientX; // Get starting X position
        isDragging = true; // Set dragging to true
    });

    // Touch move event
    tsliderContainer.addEventListener('touchmove', (e) => {
        if (!isDragging) return; // Exit if not dragging
        endX = e.touches[0].clientX; // Get current X position
    });

    // Touch end event
    tsliderContainer.addEventListener('touchend', () => {
        if (!isDragging) return; // Exit if not dragging
        if (Startt > endX + 50) { // Swipe left
            showNextSlide(); // Call function to show next slide
        } else if (Startt < endX - 50) { // Swipe right
            showPrevSlide(); // Call function to show previous slide
        }
        isDragging = false; // Reset dragging
    });

    // Prevent default drag behavior
    tsliderContainer.addEventListener('dragstart', (e) => {
        e.preventDefault();
    });

    // Initial button visibility update
    updateButtonVisibility();
    updateTokenId(); // Set the initial token ID and text
}




    function submitIdLoginForm(event) {
        showSpinner(); // Show the spinner while processing
        event.preventDefault(); // Prevent default form submission
        const formData = new FormData(event.target);
        const data = new URLSearchParams(); // Use URLSearchParams to construct the data
    
        data.append('action', 'loginbyid'); // Specify the action as 'login'
    
        // Generate a new token and get the current time
        const token = generateToken(); // Assuming generateToken() is defined elsewhere
        const tokenGenTime = new Date().toISOString(); // Get current time as token generation time
    
        // Append token and token generation time to data
        data.append('token', token);
        data.append('tokenGenTime', tokenGenTime);
    
        // Append form data to the URLSearchParams object
        formData.forEach((value, key) => {
            data.append(key, value);
        });
    
        fetch('config.json')
            .then(response => response.json())
            .then(config => {
                const scriptUrl = config.scriptUrl; // Get the script URL from config
    
                // Make the POST request to the App Script endpoint
                return fetch(scriptUrl, {
                    method: 'POST',
                    body: data // Send URLSearchParams data
                });
            })
            .then(response => {
                // Check if the response is actually JSON
                if (response.headers.get('content-type')?.includes('application/json')) {
                    return response.json();
                } else {
                    throw new Error("Invalid JSON response");
                }
            })
            .then(result => {
                console.log("Server Response:", result); // Log the entire server response
                console.log("tokenDetails", result.tokenDetails); // Log the entire server response
                
    
                // Store logs in localStorage before redirect
                if (result) {


                    // console.log("Logs before saving to localStorage:", result.logs);
                    // localStorage.setItem('loginLogs', JSON.stringify(result.logs));
                    // console.log("ticket before saving to localStorage:", result.tokenDetails);
                    // logAllLocalStorageItems();
                   
           // Assuming result.tokenDetails contains the new token details
              const tokenDetailsWithId = {
              id: result.tokenDetails.token, // Replace 'tokenId' with the actual property name of the token ID
              details: result.tokenDetails // Include all other token details
          };
          
          // Retrieve existing ticket details from localStorage
          let existingTicketDetails = localStorage.getItem('ticketDetails');
          
          // Check if existingTicketDetails is valid and parse it
          if (existingTicketDetails) {
              existingTicketDetails = JSON.parse(existingTicketDetails);
              
              // Ensure that it is an array
              if (!Array.isArray(existingTicketDetails)) {
                  existingTicketDetails = []; // Reset to an empty array if it's not an array
              }
          } else {
              existingTicketDetails = []; // Initialize as an empty array if no data is found
          }
          
          // Add the new token details to the existing array
          existingTicketDetails.push(tokenDetailsWithId);
          
          // Save the updated array back to localStorage
          localStorage.setItem('ticketDetails', JSON.stringify(existingTicketDetails));
          
          // Log the saved ticket details
          console.log("ticketDetails:", JSON.parse(localStorage.getItem('ticketDetails')));
                             
                    
                } else {
                    console.warn("No logs found in the result.");
                }
    
                // Reset the input borders and clear the error message
                resetInputBorders();
                clearErrorMessage();
    
                if (result.status === 'success') {
                    // Construct the URL based on the userType
                    const userType = result.userType.toLowerCase(); // Ensure the userType is in lowercase
                    const validUserTypes = ['user', 'admin', 'agent']; // Define valid user types
                    
                    // Check if the userType is valid
                    if (validUserTypes.includes(userType)) {
                        window.location.href = `html/${userType}.html`; // Redirect dynamically
                    } else {
                        showErrorMessage(document.getElementById('error-message'), 'Unexpected user type');
                        highlightInputFields();
                    }
                } else {
                    // Display error message
                    showErrorMessage(document.getElementById('error-message'), result.message);
                    highlightInputFields(); // Highlight input fields on error
                }
            })
            .catch(error => {
                console.error('Error:', error);
                showErrorMessage(document.getElementById('error-message'), 'An error occurred while submitting the form.');
                highlightInputFields(); // Highlight input fields on error
            })
            .finally(() => {
                hideSpinner(); // Hide spinner after processing the response
            });
    }
    
    
    
    
    
    function generateToken() {
        // Example token generation logic (you can replace this with a more secure method)
        return 'token_' + Math.random().toString(36).substr(2, 9); // Simple random token
    }



// Function to highlight input fields
function highlightInputFields() {
    const inputs = document.querySelectorAll('.login-form input');
    inputs.forEach(input => {
        input.style.border = '1.5px solid red'; // Change border color to red
    });
}

// Function to reset input borders to default
function resetInputBorders() {
    const inputs = document.querySelectorAll('.login-form input');
    inputs.forEach(input => {
        input.style.border = '1.5px solid #8773da8e'; // Reset to default color
    });
}

// Function to clear the error message
function clearErrorMessage() {
    const errorMessage = document.getElementById('error-message');
    errorMessage.style.display = 'none'; // Hide the error message
    errorMessage.innerText = ''; // Clear the error message text
}

// Add event listeners to input fields to reset borders on click
document.querySelectorAll('.login-form input').forEach(input => {
    input.addEventListener('click', () => {
        resetInputBorders(); // Reset borders when input is clicked
        clearErrorMessage(); // Clear error message when input is clicked
    });

   
});

// Add event listeners to buttons with class "switch-btn"
document.querySelectorAll('.switch-btn').forEach(button => {
    button.addEventListener('click', () => {
        resetInputBorders(); // Reset borders when switch button is clicked
        clearErrorMessage(); // Clear error message when switch button is clicked
    });
});



function submitEmailLoginForm(event) {
    showSpinner(); // Show the spinner while processing
    event.preventDefault(); // Prevent default form submission
    const formData = new FormData(event.target);
    const data = {};
    data.action = 'loginbyemail'; // Specify the action as 'login'

    // Generate a new token and get the current time
    const token = generateToken(); // Assuming generateToken() is defined elsewhere
    const tokenGenTime = new Date().toISOString(); // Get current time as token generation time

    console.log('Generated Token:', token); // Log the generated token
    console.log('Token Generation Time:', tokenGenTime); // Log the token generation time

    // Append token and token generation time to data
    data.token = token;
    data.tokenGenTime = tokenGenTime;

    // Append form data to the data object
    formData.forEach((value, key) => {
        data[key] = value;
    });

    console.log('Data being sent to the server:', data); // Log the data being sent

    fetch('config.json')
        .then(response => response.json())
        .then(config => {
            const scriptUrl = config.scriptUrl; // Get the script URL from config

            // Make the POST request to the App Script endpoint
            return fetch(scriptUrl, {
                method: 'POST',
                body: new URLSearchParams(data) // Send form data
            });
        })
        .then(response => {
            // Check if the response is actually JSON
            if (response.headers.get('content-type')?.includes('application/json')) {
                return response.json();
            } else {
                throw new Error("Invalid JSON response");
            }
        })
        .then(result => {
            console.log("Server Response:", result); // Log the server response

            // Reset the input borders and clear the error message
            resetInputBorders();
            clearErrorMessage();

            if (result.status === 'success') {
                // Construct the URL based on the userType
                const userType = result.userType.toLowerCase(); // Ensure the userType is in lowercase
                const validUserTypes = ['user', 'admin', 'agent']; // Define valid user types
                
                // Check if the userType is valid
                if (validUserTypes.includes(userType)) {
                    // window.location.href = `html/${userType}.html`; // Redirect dynamically
                } else {
                    document.getElementById('error-message').innerText = 'Unexpected user type';
                    highlightInputFields();
                    hideSpinner(); // Hide spinner after processing the response
                } 
            } else {
                // Display error message
                document.getElementById('error-message').style.display = 'block';
                document.getElementById('error-message').innerText = result.message;
                highlightInputFields(); // Highlight input fields on error
                hideSpinner(); // Hide spinner after processing the response
            }
        })
        .catch(error => {
            console.error('Error:', error); // Log any error that occurs
            
            document.getElementById('error-message').innerText = 'An error occurred';
            highlightInputFields(); // Highlight input fields on error
            hideSpinner(); // Hide spinner after processing the response
        });
}



// send otp to mail


let timerInterval; // To store the timer interval

let storedEmail = ''; // Variable to hold the email
let storedToken = ''; // Variable to hold the token

async function sendOtpid() {
    var email = document.getElementById('findMailId').value;
    const errorMessageElement = document.getElementById('error-message');

    // Clear previous error message
    errorMessageElement.textContent = '';
    errorMessageElement.style.display = 'none';
    errorMessageElement.style.backgroundColor = '';
    errorMessageElement.style.boxShadow = '';

    console.log('Attempting to send OTP for email:', email);

    if (!email) {
        console.log('Error: No email provided.');
        showErrorMessage(errorMessageElement, "Please enter a valid email address.");
        highlightInputFields();
        return;
    }

    // Generate a token
    const token = Math.random().toString(36).substr(2, 9); // Random token generation
    console.log('Generated token:', token);

    var payload = {
        action: 'verifyidemail',
        email: email,
        token: token // Add the token to the payload
    };
    console.log('Payload to send:', payload);

    // Disable the link while processing
    const sendIdOtp = document.getElementById('sendIdOtp');
    sendIdOtp.textContent = 'Sending...';
    sendIdOtp.style.pointerEvents = 'none'; // Disable clicks

    try {
        // Load the config.json file to get the script URL
        const configResponse = await fetch('config.json');
        const config = await configResponse.json();
        const scriptUrl = config.scriptUrl; // Get the script URL from config
        console.log('Script URL loaded:', scriptUrl);

        // Make the POST request to the App Script endpoint
        const response = await fetch(scriptUrl, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/x-www-form-urlencoded' // Use the appropriate header for form data
            },
            body: new URLSearchParams(payload) // Send form data
        });

        const data = await response.json();
        console.log('Response received from server:', data);

        if (data.status === 'success') {
            showSuccessMessage(errorMessageElement, 'OTP sent successfully!'); // Show success message
            
            // Store email and token for later use
            storedEmail = email;
            storedToken = token;
            console.log('Stored email and token:', storedEmail, storedToken);

            document.getElementById('findMailId').setAttribute('readonly', true); // Set input field to readonly
            sendIdOtp.style.display = 'none'; // Hide Send OTP button
            document.getElementById('timer-display').style.display = 'block'; // Show the timer display
            startTimer(60); // Start the 59 seconds timer
            console.log('Timer started for 59 seconds.');
        } else {
            console.log('Error from server:', data.message);
            // Reset email and token on error
            resetFields(); // Call function to reset fields and remove readonly attribute
            showErrorMessage(errorMessageElement, data.message);
            highlightInputFields(); // Highlight input fields on error
        }
    } catch (error) {
        console.error('Error occurred during the fetch operation:', error);
        
        // Reset email and token on catch
        resetFields(); // Call function to reset fields and remove readonly attribute
        showErrorMessage(errorMessageElement, 'An error occurred while sending the OTP. Please try again.');
        highlightInputFields(); // Highlight input fields on error
    } finally {
        // Re-enable the link
        sendIdOtp.textContent = 'Send OTP';
        sendIdOtp.style.pointerEvents = 'auto'; // Enable clicks
    }
}



// Function to reset fields and remove readonly attribute
function resetFields() {
    storedEmail = ''; // Reset email
    storedToken = ''; // Reset token
    document.getElementById('findMailId').removeAttribute('readonly'); // Remove readonly attribute
    console.log('Fields have been reset. Email and token cleared.');
}




// Function to start the timer
function startTimer(duration) {
    const timerDisplay = document.getElementById('timer-display');
    let timeLeft = duration;

    // Update the timer display every second
    timerInterval = setInterval(() => {
        if (timeLeft <= 0) {
            clearInterval(timerInterval); // Stop the timer
            resetUi(); // Reset the UI after the timer ends
        } else {
            timerDisplay.textContent = `Please wait: ${timeLeft} seconds`;
            timeLeft--;
        }
    }, 1000);
}

// Function to reset the UI after the timer
function resetUi() {
    const emailInput = document.getElementById('findMailId');
    const sendIdOtp = document.getElementById('sendIdOtp');
    const timerDisplay = document.getElementById('timer-display');
    const errorMessageElement = document.getElementById('error-message');

    emailInput.removeAttribute('readonly'); // Make input editable again
    sendIdOtp.style.display = 'inline'; // Show the Send OTP button again
    sendIdOtp.style.pointerEvents = 'auto'; // Enable clicks on the link
    sendIdOtp.textContent = 'Send OTP'; // Reset button text
    timerDisplay.style.display = 'none'; // Hide the timer display
    errorMessageElement.textContent = ''; // Clear any previous error messages
    errorMessageElement.style.display = 'none'; // Hide error message
}

// Function to display error messages
function showErrorMessage(element, message) {
    element.textContent = message;
    element.style.display = 'block'; // Show the error message
    element.style.backgroundColor = 'rgb(255, 72, 72)'; // Show the error message
}

// Function to display success messages
function showSuccessMessage(element, message) {
    element.textContent = message;
    element.style.backgroundColor = 'rgb(11, 239, 38)'; // Corrected property assignment
    element.style.boxShadow = '0px 5px 30px rgba(64, 255, 0, 0.292)'; // Corrected property assignment
    element.style.display = 'block'; // Show the message
    element.style.color = 'white'; // Set text color to white 


}



async function submitIdOtp(event) {
    event.preventDefault(); // Prevent the default form submission behavior
    console.log("Form submission prevented.");

    // Collecting OTP values
    const otpInputs = document.querySelectorAll('input[name="otp"]');
    const otp = Array.from(otpInputs).map(input => input.value).join('');
    console.log("Collected OTP:", otp);

    const messageElement = document.getElementById('error-message'); // Single message element

    // Clear previous messages
    resetMessageDisplay(messageElement);
    console.log("Previous messages cleared.");

    // Check if the OTP is complete
    if (otp.length < 6) {
        console.log("Incomplete OTP, length:", otp.length);
        showMessage(messageElement, 'Please enter a complete OTP.', 'error');
        return;
    }
    console.log("OTP is complete.");

    // Prepare payload for the server
    const payload = {
        action: 'verifyidotp',
        email: storedEmail, // Use stored email
        token: storedToken, // Use stored token
        otp: otp
    };
    console.log("Payload prepared:", payload);

    try {
        console.log("Fetching config.json...");
        // Fetch the script URL from config.json
        const configResponse = await fetch('config.json');
        const config = await configResponse.json();
        const scriptUrl = config.scriptUrl;
        console.log("Config loaded, script URL:", scriptUrl);

        // Send the OTP verification request to the server
        console.log("Sending OTP verification request...");
        const response = await fetch(scriptUrl, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/x-www-form-urlencoded'
            },
            body: new URLSearchParams(payload)
        });

        console.log("Response received:", response);
        const data = await response.json();
        console.log("Response data:", data);

        // Handle response from the server
        if (data.status === 'success') {
            console.log("OTP verified successfully.");
            showMessage(messageElement, 'OTP verified successfully!', 'success');
            
            // Show the userId in the findUserId function
          
            document.getElementById('findUserId').innerText = `User Id : ${data.userId}`;
            clearInterval(timerInterval); // Stop the timer
            
            

            // Additional success handling logic
            handleSuccessfulVerification();
        } else {
            console.log("Verification failed:", data.message);
            showMessage(messageElement, data.message || 'Verification failed. Please try again.', 'error');
        }
    } catch (error) {
        console.error("Error during verification:", error);
        showMessage(messageElement, 'An error occurred during verification. Please try again.', 'error');
    }
}



// Helper function to reset message display
function resetMessageDisplay(element) {
    element.textContent = '';
    element.style.display = 'none';
    element.style.backgroundColor = ''; // Reset background color
    element.style.boxShadow = ''; // Reset box shadow
}

// Function to display messages
function showMessage(element, message, type) {
    element.textContent = message;
    element.style.display = 'block'; // Show the message

    if (type === 'error') {
        element.style.backgroundColor = 'rgb(255, 72, 72)'; // Error background color
        element.style.color = 'white'; // Error text color
        element.style.boxShadow = '0px 5px 30px rgba(255, 0, 0, 0.292)';
    } else if (type === 'success') {
        element.style.backgroundColor = 'rgb(11, 239, 38)'; // Success background color
        element.style.color = 'white'; // Success text color
        element.style.boxShadow = '0px 5px 30px rgba(64, 255, 0, 0.292)'; // Box shadow for success
    }
}

// Handle successful OTP verification
function handleSuccessfulVerification() {
    document.getElementById("id-otp-verify-form").style.display = "none"; // Hide OTP form
    document.getElementById("findUserId-cont").style.display = "flex"; // Show the findUserId container
    document.getElementById("hero2").style.display = "none"; // Hide hero2
    document.getElementById("hero4").style.display = "flex"; // Show hero4
}













async function sendPassOtp() {
    var email = document.getElementById('passMailId').value;
    const errorMessageElement = document.getElementById('error-message');

    // Clear previous error message
    errorMessageElement.textContent = '';
    errorMessageElement.style.display = 'none';
    errorMessageElement.style.backgroundColor = '';
    errorMessageElement.style.boxShadow = '';

    console.log('Attempting to send OTP for email:', email);

    if (!email) {
        console.log('Error: No email provided.');
        showErrorMessage(errorMessageElement, "Please enter a valid email address.");
        highlightInputFields();
        return;
    }

    // Generate a token
    const token = Math.random().toString(36).substr(2, 9); // Random token generation
    console.log('Generated token:', token);

    var payload = {
        action: 'verifyidemail',
        email: email,
        token: token // Add the token to the payload
    };
    console.log('Payload to send:', payload);

    // Disable the link while processing
    const sendIdOtp = document.getElementById('sendPassOtp');
    sendIdOtp.textContent = 'Sending...';
    sendIdOtp.style.pointerEvents = 'none'; // Disable clicks

    try {
        // Load the config.json file to get the script URL
        const configResponse = await fetch('config.json');
        const config = await configResponse.json();
        const scriptUrl = config.scriptUrl; // Get the script URL from config
        console.log('Script URL loaded:', scriptUrl);

        // Make the POST request to the App Script endpoint
        const response = await fetch(scriptUrl, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/x-www-form-urlencoded' // Use the appropriate header for form data
            },
            body: new URLSearchParams(payload) // Send form data
        });

        const data = await response.json();
        console.log('Response received from server:', data);

        if (data.status === 'success') {
            showSuccessMessage(errorMessageElement, 'OTP sent successfully!'); // Show success message
            
            // Store email and token for later use
            storedEmail = email;
            storedToken = token;
            console.log('Stored email and token:', storedEmail, storedToken);

            document.getElementById('passMailId').setAttribute('readonly', true); // Set input field to readonly
            sendIdOtp.style.display = 'none'; // Hide Send OTP button
            document.getElementById('timer-display-pass').style.display = 'block'; // Show the timer display
            startPassTimer(60); // Start the 59 seconds timer
            console.log('Timer started for 59 seconds.');
        } else {
            console.log('Error from server:', data.message);
            // Reset email and token on error
            resetFields(); // Call function to reset fields and remove readonly attribute
            showErrorMessage(errorMessageElement, data.message);
            highlightInputFields(); // Highlight input fields on error
        }
    } catch (error) {
        console.error('Error occurred during the fetch operation:', error);
        
        // Reset email and token on catch
        resetFields(); // Call function to reset fields and remove readonly attribute
        showErrorMessage(errorMessageElement, 'An error occurred while sending the OTP. Please try again.');
        highlightInputFields(); // Highlight input fields on error
    } finally {
        // Re-enable the link
        sendIdOtp.textContent = 'Send OTP';
        sendIdOtp.style.pointerEvents = 'auto'; // Enable clicks
    }
}


function startPassTimer(duration) {
    const timerDisplay = document.getElementById('timer-display-pass');
    let timeLeft = duration;

    // Update the timer display every second
    timerInterval = setInterval(() => {
        if (timeLeft <= 0) {
            clearInterval(timerInterval); // Stop the timer
            resetPassUi(); // Reset the UI after the timer ends
        } else {
            timerDisplay.textContent = `Please wait: ${timeLeft} seconds`;
            timeLeft--;
        }
    }, 1000);
}

function resetPassUi() {
    const emailInput = document.getElementById('passMailId');
    const sendIdOtp = document.getElementById('sendPassOtp');
    const timerDisplay = document.getElementById('timer-display-pass');
    const errorMessageElement = document.getElementById('error-message');

    emailInput.removeAttribute('readonly'); // Make input editable again
    sendIdOtp.style.display = 'inline'; // Show the Send OTP button again
    sendIdOtp.style.pointerEvents = 'auto'; // Enable clicks on the link
    sendIdOtp.textContent = 'Send OTP'; // Reset button text
    timerDisplay.style.display = 'none'; // Hide the timer display
    errorMessageElement.textContent = ''; // Clear any previous error messages
    errorMessageElement.style.display = 'none'; // Hide error message
}



async function submitPassOtp(event) {
    event.preventDefault(); // Prevent the default form submission behavior
    console.log("Form submission prevented.");

    // Collecting OTP values
    const otpInputs = document.querySelectorAll('input[name="passOtp"]');
    const otp = Array.from(otpInputs).map(input => input.value).join('');
    console.log("Collected OTP:", otp);

    const messageElement = document.getElementById('error-message'); // Single message element

    // Clear previous messages
    resetMessageDisplay(messageElement);
    console.log("Previous messages cleared.");

    // Check if the OTP is complete
    if (otp.length < 6) {
        console.log("Incomplete OTP, length:", otp.length);
        showMessage(messageElement, 'Please enter a complete OTP.', 'error');
        return;
    }
    console.log("OTP is complete.");

    // Prepare payload for the server
    const payload = {
        action: 'verifyidotp',
        email: storedEmail, // Use stored email
        token: storedToken, // Use stored token
        otp: otp
    };
    console.log("Payload prepared:", payload);

    try {
        console.log("Fetching config.json...");
        // Fetch the script URL from config.json
        const configResponse = await fetch('config.json');
        const config = await configResponse.json();
        const scriptUrl = config.scriptUrl;
        console.log("Config loaded, script URL:", scriptUrl);

        // Send the OTP verification request to the server
        console.log("Sending OTP verification request...");
        const response = await fetch(scriptUrl, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/x-www-form-urlencoded'
            },
            body: new URLSearchParams(payload)
        });

        console.log("Response received:", response);
        const data = await response.json();
        console.log("Response data:", data);

        // Handle response from the server
        if (data.status === 'success') {
            console.log("OTP verified successfully.");
            showMessage(messageElement, 'OTP verified successfully!', 'success');
            

            document.getElementById('user-id').value = data.userId; // Set userId
            document.getElementById('email').value = data.email; // Set email
            handleSuccessfulPassVerification();
            clearInterval(timerInterval); // Stop the timer
            
            

        } else {
            console.log("Verification failed:", data.message);
            showMessage(messageElement, data.message || 'Verification failed. Please try again.', 'error');
        }
    } catch (error) {
        console.error("Error during verification:", error);
        showMessage(messageElement, 'An error occurred during verification. Please try again.', 'error');
    }
}


function handleSuccessfulPassVerification() {
    console.log("OTP verification successful. Proceeding to password update form.");

    // Hide OTP verification form
    console.log("Hiding OTP verification form...");
    document.getElementById("pass-otp-verify-form").style.display = "none"; // Hide OTP form

    // Show password update form
    console.log("Showing password update form...");
    document.getElementById("upd-pass-form").style.display = "flex"; // Show the password update form

    // Hide hero2 section
    console.log("Hiding hero2 section...");
    document.getElementById("hero2").style.display = "none"; // Hide hero2

    // Show hero3 section
    console.log("Showing hero3 section...");
    document.getElementById("hero3").style.display = "flex"; // Show hero3

    // Retrieve userId and email directly from the populated fields
    const userId = document.getElementById('user-id').value; // Get userId
    const email = document.getElementById('email').value; // Get email

    // Logging populated values
    console.log("userId and email populated: ", userId, email);
}


async function submitNewPassword(event) {
    event.preventDefault(); // Prevent the default form submission behavior
    console.log("Form submission prevented.");

    // Retrieve values from the form
    const newPassword = document.getElementById('new-password').value;
    const confirmPassword = document.getElementById('confirm-password').value;
    const userId = document.getElementById('user-id').value; // From server response
    const email = document.getElementById('email').value; // From server response

    // Clear any previous messages
    resetMessageDisplay(document.getElementById('error-message'));

    // Log the retrieved values
    console.log("New Password:", newPassword);
    console.log("Confirm Password:", confirmPassword);
    console.log("User ID:", userId);
    console.log("Email:", email);

    // Check if passwords match
    if (newPassword !== confirmPassword) {
        console.log("Password mismatch detected.");
        showMessage(document.getElementById('error-message'), 'Passwords do not match.', 'error');
        return;
    }

    // Prepare payload
    const payload = {
        action: 'updatePassword',
        userId: userId,
        newPassword: newPassword
    };
    
    try {
        console.log("Fetching config.json...");
        const configResponse = await fetch('config.json');
        if (!configResponse.ok) {
            throw new Error("Failed to load config.json");
        }
        const config = await configResponse.json();
        const scriptUrl = config.scriptUrl;
        
        console.log("Sending password update request to:", scriptUrl);
        const response = await fetch(scriptUrl, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/x-www-form-urlencoded'
            },
            body: new URLSearchParams(payload)
        });

        console.log("Response received:", response);
        if (!response.ok) {
            throw new Error("Failed to update password, status: " + response.status);
        }
        const data = await response.json();
        console.log("Response data:", data);

        // Handle response
        if (data.status === 'success') {
            console.log("Password updated successfully.");
            showMessage(document.getElementById('error-message'), 'Password updated successfully!', 'success');
            
            // Reset input fields
            document.getElementById('new-password').value = "";
            document.getElementById('confirm-password').value = "";
            document.getElementById('user-id').value = "";
            document.getElementById('email').value = "";
            console.log("Input fields reset.");

            // Start countdown and reset page after 10 seconds
            let countdown = 10;
            const countdownMessage = document.getElementById('error-message'); // Assuming it's the same element for messages
            countdownMessage.innerHTML = `Password Updated, Redirecting in ${countdown} seconds...`;
            
            const interval = setInterval(() => {
                countdown--;
                countdownMessage.innerHTML = `Redirecting in ${countdown} seconds...`;
                if (countdown <= 0) {
                    clearInterval(interval);
                    // Reset the page or redirect to a specific URL
                    window.location.reload(); // Reload the current page
                }
            }, 1000);
        } else {
            console.log("Password update failed:", data.message);
            showMessage(document.getElementById('error-message'), data.message || 'Password update failed.', 'error');
        }
    } catch (error) {
        console.error("Error during password update:", error);
        showMessage(document.getElementById('error-message'), 'An error occurred during password update. Please try again.', 'error');
    }
}
