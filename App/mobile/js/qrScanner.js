
function showScanner(){
    document.getElementById('qrScanner').style.display = "flex";
    startCamera();
}

function hideScanner(){
    document.getElementById('qrScanner').style.display = "none";
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
async function startCamera() {
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
        // Stop the camera and scanning once QR is found
        stopCamera();
        displayDecodedResult(code);
    }
}

// Stop the camera
function stopCamera() {
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

// Display the decoded QR code and its content
function displayDecodedResult(code) {
    canvas.style.display = "block";
    video.style.display = "none";
    scanOverlay.style.display = "none";
    qrContent.textContent = code.data; // Display decoded data
    qrImage.src = code.imageData;      // Show QR code image
    soundEffect.play(); // Play sound when QR is decoded
    decodedResult.style.display = 'block'; // Show the result
}