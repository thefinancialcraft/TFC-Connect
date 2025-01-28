
function showScanner(){
    document.getElementById('qrScanner').style.display = "flex";
    startQRCamera();
}

function hideScanner(){
    document.getElementById('qrScanner').style.display = "none";
    stopQRCamera();
}


let video = document.getElementById("scanVideo");
let canvas = document.getElementById("scanCanvas");
let decodedResult = document.getElementById("decodedResult");
let qrContent = document.getElementById("qrContent");
let qrImage = document.getElementById("qrImage");
let soundEffect = document.getElementById("soundEffect");
let scanOverlay = document.getElementById("scanner-overlay");
let cameraStream = null;
let intervalId = null;



// Start the camera
async function startQRCamera() {
    canvas.style.display = "none";
    video.style.display = "block";
    scanOverlay.style.display = "block";
   
    try {
        cameraStream = await navigator.mediaDevices.getUserMedia({
            video: { facingMode: "environment" },
            audio: false
        });
        video.srcObject = cameraStream;

        // Start scanning frames
        intervalId = setInterval(scanFrame, 200); // Scan every 200ms
    } catch (err) {
        console.error("Camera initialization failed:", err);
        alert("Could not access the camera. Please allow camera permissions.");
    }
}
// Scan the current frame
function scanFrame() {
    const context = canvas.getContext("2d");
    canvas.width = video.videoWidth;
    canvas.height = video.videoHeight;
    context.drawImage(video, 0, 0, canvas.width, canvas.height);

    // Get the image data from the canvas
    const imageData = context.getImageData(0, 0, canvas.width, canvas.height);

    // Use jsQR to decode the QR code
    const code = jsQR(imageData.data, imageData.width, imageData.height);

    if (code) {
        
        const qrData = code.data.trim(); // Get the scanned QR code content
        
        // Validate QR Code
        if (qrData.startsWith("TFC") && qrData.endsWith("QR")) {
            // Stop the camera and display the result
            stopQRCamera();
            playsound();
            displayDecodedResult(code);
            updateQrCode(code);
           
        } else {
            // Invalid QR code, show alert and continue scanning
            alert("Invalid QR Code. Please try again.");
            startQRCamera();
        }
    }
}

// Stop the camera
function stopQRCamera() {
    if (cameraStream) {
        const tracks = cameraStream.getTracks();
        tracks.forEach(track => track.stop());
        cameraStream = null;
        
    }
    if (intervalId) {
        clearInterval(intervalId);
        intervalId = null;
    }
}

function playsound(){
soundEffect.play();
}

// Display the decoded QR code and its content
function displayDecodedResult(code) {
    canvas.style.display = "block";
    video.style.display = "none";
    scanOverlay.style.display = "none";
    qrContent.textContent = code.data; // Display decoded data   // Show QR code image

 
}


function updateQrCode(code) {
    console.log("run updateQR", code);

    // Check if the code length is 26
    if (code.data.length !== 26) {
        alert("Invalid code length. The code must be 26 characters.");
        return;
    }

    const prefix = code.data.substring(0, 3);  // "TFC"
    const date = code.data.substring(3, 9);    // DDMMYY
    const systemId = code.data.substring(9, 15);   // DTP002 (system ID)
    const userId = code.data.substring(15, 18);     // XXX (user ID)
    const time = code.data.substring(18, 24);       // HHMMSS (time in Indian format)
    const qr = code.data.substring(24);             // QR

    // Extract system type from system ID (first 3 letters)
    const systemType = systemId.substring(0, 3);  // DTP or LTP

    // Determine system type label (Desktop or Laptop)
    const systemLabel = systemType === "DTP" ? "Desktop" : systemType === "LTP" ? "Laptop" : "Unknown";

    // Convert date into readable format
    const day = date.substring(0, 2);
    const month = date.substring(2, 4);
    const year = "20" + date.substring(4, 6); // Assuming the year is in 'YY' format
    const formattedDate = `${day}/${month}/${year}`;

    // Convert time into HH:mm:ss format
    const hours = time.substring(0, 2);
    const minutes = time.substring(2, 4);
    const seconds = time.substring(4, 6);
    const formattedTime = `${hours}:${minutes}:${seconds}`;

    // Prepare the object to log
    const qrData = {
        prefix: prefix,
        date: formattedDate,
        systemtype: systemLabel,  // System type (Desktop/Laptop)
        systemId: systemId,      // System ID (DTP002 or LTP002)
        assignUserId: `TFC-${userId}`,  // Assigning user ID
        time: formattedTime,
        qr: qr
    };

    // Log the object to the console
    console.log("data from updateQR", qrData);

    // Get the current date and time
    const currentTime = new Date();
    const currentDate = currentTime.getDate();
    const currentMonth = currentTime.getMonth() + 1; // getMonth() is 0-based
    const currentYear = currentTime.getFullYear();

    // Parse date from the QR code (DDMMYY)
    const codeDay = parseInt(day, 10);
    const codeMonth = parseInt(month, 10);
    const codeYear = parseInt(year, 10);

    // Compare current date with the extracted date from QR code
    const isSameDate = currentDate === codeDay && currentMonth === codeMonth && currentYear === codeYear;

    // Add 2 minutes to the formatted time and compare with current time
    const timeParts = formattedTime.split(":");
    const codeTime = new Date(currentTime);
    codeTime.setHours(parseInt(timeParts[0], 10));
    codeTime.setMinutes(parseInt(timeParts[1], 10));
    codeTime.setSeconds(parseInt(timeParts[2], 10));

    // Add 2 minutes
    codeTime.setMinutes(codeTime.getMinutes() + 2);

    // Compare the adjusted code time with current time
    const isValidTime = currentTime <= codeTime;

    // Check both date and time validity
    if (!isValidTime || !isSameDate) {
        // If either the date or time is not valid, show an expired popup
        alert("Code has expired or is not valid for today!");
        startQRCamera();
    } else {
        // Now fetch active ticket data from localStorage
        const activeTicket = localStorage.getItem('receiveData');
        if (activeTicket) {
            try {
                const ticketData = JSON.parse(activeTicket); // Parse the JSON string
                const storedUserId = ticketData.userId || 'N/A'; // Extract userId from localStorage
                const token = ticketData.token || 'N/A';   // Extract token

                // Check if the userId from QR code matches the stored userId
                if (`TFC-${userId}` !== storedUserId) {
                    // If user IDs don't match, show the custom popup
                    const isConfirmed = confirm("This user ID is not assigned to this system ID. Do you want to proceed?");
                    if (isConfirmed) {
                        // Proceed with sending data to the backend
                        sendDataToBackend(token, storedUserId, systemId, `TFC-${userId}`, formattedTime, formattedDate);
                    } else {
                        // If user clicks "No", don't send the data
                        console.log("User did not confirm. Data not sent.");
                    }
                } else {
                    // If user IDs match, proceed with sending data to the backend
                    sendDataToBackend(token, storedUserId, systemId, `TFC-${userId}`, formattedTime, formattedDate);
                }
            } catch (error) {
                console.error('Error parsing active ticket:', error);
            }
        }
    }
}


function sendDataToBackend(token, userId, systemId, assignUserId, formattedTime, formattedDate) {
    // **Fetch backend URL from config.json and send the object**
    fetch('/TFC-Connect/App/config.json')
        .then(response => response.json())
        .then(config => {
            const scriptUrl = config.scriptUrl;

            // Create data to send
            const data = new URLSearchParams();
            data.append('action', 'updateScanStatus');
            data.append('token', token);
            data.append('userId', userId);
            data.append('systemId', systemId);  // Add systemId
            data.append('assignUserId', assignUserId);  // Add assignUserId
            data.append('time', formattedTime);  // Add formattedTime
            data.append('date', formattedDate);  // Add formattedDate

            // Make POST request to the backend
            return fetch(scriptUrl, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/x-www-form-urlencoded'
                },
                body: data
            })
            .then(response => response.json())  // Parse response as JSON
            .then(data => {
                // Log success message if data is returned as success
                if (data.status === 'success') {
                    console.log('Data sent successfully:', data.message);
                    hideScanner();
                } else {
                    console.log('Error:', data.message);
                }
            })
            .catch(error => console.error('Error sending data:', error));
        })
        .catch(error => console.error('Error fetching config:', error));
}
