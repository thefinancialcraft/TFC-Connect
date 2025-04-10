


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

    document.getElementById('oploder').style.display = "flex";
    document.getElementById('oploder').style.marginTop = "30px";
    document.getElementById('subBtn').style.display = "none";

    const sendIdOtp = document.getElementById('sendPassOtp');
    sendIdOtp.textContent = 'Sending...';
    sendIdOtp.style.pointerEvents = 'none'; // Disable clicks

    try {
        // Load the config.json file to get the script URL
        const configResponse = await fetch('/TFC-Connect/App/config.json');
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
        document.getElementById('oploder').style.display = "none";
        document.getElementById('oploder').style.marginTop = "0px";
        document.getElementById('subBtn').style.display = "block";
    

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
        document.getElementById('oploder').style.display = "none";
        document.getElementById('oploder').style.marginTop = "0px";
        document.getElementById('subBtn').style.display = "block";
    
    }
}


    async function submitPassOtp(event) {
        event.preventDefault(); // Prevent the default form submission behavior
        console.log("Form submission prevented.");

        document.getElementById('oploder').style.display = "flex";
        document.getElementById('oploder').style.marginTop = "30px";
        document.getElementById('subBtn').style.display = "none";

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
            const configResponse = await fetch('/TFC-Connect/App/config.json');
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
            document.getElementById('oploder').style.display = "none";
            document.getElementById('oploder').style.marginTop = "0px";
            document.getElementById('subBtn').style.display = "block";

            // Handle response from the server
            if (data.status === 'success') {
                console.log("OTP verified successfully.");

                const enteredUserId = document.getElementById('userId').textContent; // Input field se user ID le rahe hain

               

                if (data.userId !== enteredUserId) {
                    console.log("User ID Mismatched");
                    showMessage(messageElement, 'User ID Mismatched', 'error');
                    console.log("userId a",enteredUserId);
                    console.log("userId b", data.userId);
    

                    
                    return; // Function yahin stop ho jayega
                }


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


function handleSuccessfulPassVerification() {
    console.log("OTP verification successful. Proceeding to password update form.");

    // Hide OTP verification form
    console.log("Hiding OTP verification form...");
    document.getElementById("pass-otp-verify-form").style.display = "none"; // Hide OTP form
    document.getElementById("rstImg1").style.display = "none"; // Hide OTP form

    // Show password update form
    console.log("Showing password update form...");
    document.getElementById("upd-pass-form").style.display = "flex"; // Show the password update form
    document.getElementById("rstImg2").style.display = "flex"; // Show the password update form
    document.getElementById("rstPswdMsg").textContent = "We're just one step away from updating your password! Enter your new password and re-enter it to verify. 🔐✨";
    

    // Retrieve userId and email directly from the populated fields
    const userId = document.getElementById('user-id').value; // Get userId
    const email = document.getElementById('email').value; // Get email

    // Logging populated values
    console.log("userId and email populated: ", userId, email);
}

// Helper function to reset message display
function resetMessageDisplay(element) {
    element.textContent = '';
    element.style.display = 'none';
    element.style.backgroundColor = ''; // Reset background color
    element.style.boxShadow = ''; // Reset box shadow
}


async function submitNewPassword(event) {

    document.getElementById('pasloder').style.display = "flex";
        document.getElementById('pasloder').style.marginTop = "30px";
        document.getElementById('pasBtn').style.display = "none";

    event.preventDefault(); // Prevent the default form submission behavior
    console.log("Form submission prevented.");

    const activeTicket = JSON.parse(localStorage.getItem('receiveData'));
    if (!activeTicket) {
        console.error("No active ticket found.");
        return;
    }

    const token = activeTicket.token;

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
        const configResponse = await fetch('/TFC-Connect/App/config.json');
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
        document.getElementById('pasloder').style.display = "none";
        document.getElementById('pasloder').style.marginTop = "0px";
        document.getElementById('pasBtn').style.display = "block";
        if (!response.ok) {
            throw new Error("Failed to update password, status: " + response.status);
        }
        const data = await response.json();
        console.log("Response data:", data);

        // Handle response
        if (data.status === 'success') {

            localStorage.setItem('isPswdUpdt', 'true');

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
               window.location.href = '/TFC-Connect/App/login.html'; // Reload the current page
           }
       }, 1000);

            document.getElementById("rstImg2").style.display = "none";
            document.getElementById("upd-pass-form").style.display = "none";
            document.getElementById("rstImg3").style.display = "flex";
            document.getElementById("rstImg3").style.transform = "scale(1.8)";
            document.getElementById("rstImg3").style.paddingTop = "30px";
            document.getElementById("rstPswdMsg").textContent = "Awesome! Your password is finally updated and fully secured. Now, let’s dive back in and log into your account! 🔒🚀 ";


            // Retrieve ticketDetails from localStorage
          const ticketDetails = JSON.parse(localStorage.getItem('ticketDetails')) || [];
      
          // Find index of the ticket with matching token
          const ticketIndex = ticketDetails.findIndex(ticket => ticket.id === token);
      
          if (ticketIndex !== -1) {
              // Remove the invalid ticket from ticketDetails
              ticketDetails.splice(ticketIndex, 1);
      
              // Update localStorage with the modified ticketDetails array
              localStorage.setItem('ticketDetails', JSON.stringify(ticketDetails));
              ////console.log(`Removed invalid ticket with token: ${token}`);
          }
      
          // Clear the active ticket as well
          localStorage.removeItem('reciveData');

         
            
        } else {
            console.log("Password update failed:", data.message);
            showMessage(document.getElementById('error-message'), data.message || 'Password update failed.', 'error');
        }
    } catch (error) {
        console.error("Error during password update:", error);
        showMessage(document.getElementById('error-message'), 'An error occurred during password update. Please try again.', 'error');
        document.getElementById('pasloder').style.display = "none";
        document.getElementById('pasloder').style.marginTop = "0px";
        document.getElementById('pasBtn').style.display = "block";
    }
}


function rstPswdDp(){
    const rstPswdDp = document.getElementById('mailVerify');
    
    if (rstPswdDp) {
        rstPswdDp.classList.add('visible'); // Slide out to hide
    }
}


function hdPswdDp(){
    const rstPswdDp = document.getElementById('mailVerify');
    
    if (rstPswdDp) {
        rstPswdDp.classList.remove('visible'); // Slide out to hide
    }
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

