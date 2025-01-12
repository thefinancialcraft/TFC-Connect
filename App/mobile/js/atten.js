// Function to generate dates
let timeInterval; // To store the time interval for updating the clock
let lastTime; // To store the last displayed time

function updateTime() {
  const now = new Date();
  let hours = now.getHours();
  const minutes = now.getMinutes().toString().padStart(2, '0');
  const seconds = now.getSeconds().toString().padStart(2, '0');
  const ampm = hours >= 12 ? 'PM' : 'AM';
  hours = hours % 12;
  hours = hours ? hours : 12; // the hour '0' should be '12'
  const time = `${hours}:${minutes}:${seconds} ${ampm}`;
  
  document.getElementById("currentTime").textContent = time;
  
  lastTime = time; // Store the current time for later use
}

// Function to stop the clock update and freeze the current time
function stopTimeUpdate() {
  clearInterval(timeInterval); // Stop the time update
  document.getElementById("currentTime").textContent = lastTime; // Display the frozen time
}

// Start the clock update every second
timeInterval = setInterval(updateTime, 1000);


function updateDateAndWeek() {
  const daysOfWeek = ["Sunday", "Monday", "Tuesday", "Wednessday", "Thursday", "Friday", "Saturday"];
  const monthsOfYear = ["January", "February", "March", "April", "May", "June", "July", "August", "September", "October", "November", "December"];
  const currentDate = new Date();
  
  const weekName = daysOfWeek[currentDate.getDay()];
  const day = currentDate.getDate().toString().padStart(2, '0'); // Add leading zero for single-digit days
  const month = monthsOfYear[currentDate.getMonth()];
  const year = currentDate.getFullYear();

  const formattedDate = `${day} ${month} ${year}`;

  const weekElement = document.querySelector('.crn-wek');
  const dateElement = document.querySelector('.crn-date');

  weekElement.textContent = weekName;
  dateElement.textContent = formattedDate;
}

updateDateAndWeek(); 


// setInterval(updateTime, 1000);
// updateTime(); 

function generateDates() {
    const dateContainer = document.getElementById("dateContainer");
    const today = new Date();
  
    const colors = ['#31e774', '#ffd606', '#ffa033', '#ff4000']; // Colors array
  
    for (let i = 0; i < 6; i++) {
      const date = new Date(today);
      date.setDate(today.getDate() - i);
  
      const day = String(date.getDate()).padStart(2, '0'); // Ensure two digits (DD)
      const month = date.toLocaleString('default', { month: 'short' }); // Get short month name
  
      // Create the date box
      const atnBox = document.createElement("div");
      atnBox.classList.add("atn-bx",  "flex-coloum");
  
      // Add 'bx-anm' class to the first div only
      if (i === 0) {
        atnBox.classList.add("bx-anm", "atn-bx-sp");
      }
  
      // Add the day and month
      const dateDiv = document.createElement("div");
      dateDiv.classList.add("date", "flex");
      dateDiv.textContent = day;
  
      const monthDiv = document.createElement("div");
      monthDiv.classList.add("month", "flex");
      monthDiv.textContent = month;
  
      // Append to atnBox
      atnBox.appendChild(dateDiv);
      atnBox.appendChild(monthDiv);
  
      // Add an indicator below dates (except for the current date)
      if (i !== 0) {
        const indicator = document.createElement("div");
        indicator.classList.add("indicator");
  
        // Assign color from the array
        const colorIndex = (i - 1) % colors.length; // Rotate through colors
        indicator.style.cssText = `
          display: inline-block;
          width: 12px;
          height: 3px;
          background-color: ${colors[colorIndex]};
          border-radius: 4px;
          margin-top: -1px;
        `;
        atnBox.appendChild(indicator);
      }
  
      // Append to container
      dateContainer.appendChild(atnBox);
    }
  }
  
  // Call the function
  generateDates();
  

  const slider = document.getElementById('slider');
  const camCont = document.getElementById('cam-cnt');
  const checkinCont = document.getElementById('chknBtn');
  const actionCont = document.getElementById('actBtn');
  const sliderText = document.getElementById('sliderText');
  const switchContainer = document.querySelector('.atn-switch');
  let videoElement; // Store the video element
  let mediaStream; // Store the media stream for stopping the camera
  
  let isTouching = false;
  let startX = 0;
  let sliderLeft = 0;


 // OpenCageData API key
 const apiKey = 'ce06c4af81284473b967280cd317765f';

 // Function to fetch area name from coordinates
 // Function to fetch a detailed address with specified components
 async function getAreaName(lat, lng) {
     const url = `https://api.opencagedata.com/geocode/v1/json?q=${lat}+${lng}&key=${apiKey}`;
     
     try {
         const response = await fetch(url);
         const data = await response.json();
 
         if (data.results && data.results.length > 0) {
             const addressComponents = data.results[0].components;

             console.log("add",  addressComponents);
 
             // Extract the specified components, leave blank if not available
             
             const road = addressComponents.road || "";
             const suburb = addressComponents.suburb || "";
             const industrial = addressComponents.industrial || "";
             const city = addressComponents.city || "";
             const county = addressComponents.county || "";
             const postcode = addressComponents.postcode || "";
             const state_district = addressComponents.state_district|| "";
             const state = addressComponents.state || "";
             const country = addressComponents.country || "";
 
             // Construct the detailed address in the required format
             const detailedAddress = `${industrial} ${suburb} ${city}  ${county} ${state} ${country} ${postcode}  `;

            
             
             // Remove any unnecessary commas if parts are missing
             return detailedAddress.replace(/,\s*,/g, ',').replace(/,\s*$/, '');
         } else {
             throw new Error("No results found.");
         }
     } catch (error) {
         console.error("Error fetching area name:", error);
         return "Unable to fetch area name.";
     }
 }
 
 // Fetch and update location
 function updateLocation() {
   const locationElement = document.getElementById('location');
 
   if (navigator.geolocation) {
       navigator.geolocation.getCurrentPosition(
           async (position) => {
               const latitude = position.coords.latitude.toFixed(6);
               const longitude = position.coords.longitude.toFixed(6);
               
               // Call getAreaName to fetch the address
               const areaName = await getAreaName(latitude, longitude);
               
               // Update the location element with address
               locationElement.textContent = `${areaName}`;
           },
           (error) => {
               console.error("Error fetching location: ", error);
               locationElement.textContent = "Unable to fetch location.";
           },
           {
               enableHighAccuracy: true,
               timeout: 10000,
               maximumAge: 0
           }
       );
   } else {
       console.error("Geolocation is not supported in this browser.");
       locationElement.textContent = "Geolocation is not supported by your browser.";
   }
 }
 


// Modify startCamera function to update location
function startCamera() {
  if (!navigator.mediaDevices || !navigator.mediaDevices.getUserMedia) {
      console.error("getUserMedia is not supported in your browser.");
      alert("Your browser does not support camera access. Please try using a modern browser like Chrome, Firefox, or Safari.");
      return;
  }

  // Update location
  updateLocation();

  // Try to access the camera
  navigator.mediaDevices.getUserMedia({
      video: {
          width: 1920, // Increase resolution for a wider field of view
          height: 1080 // Adjust height accordingly
      }
  })
  .then((stream) => {
      console.log("Camera stream started successfully.");
      videoElement = document.getElementById('videoElement');
      videoElement.srcObject = stream;
      videoElement.autoplay = true;
      videoElement.style.width = '100%';
      videoElement.style.height = '100%';
      videoElement.style.objectFit = 'cover';
      videoElement.style.transform = 'scaleX(-1)'; // Flip video horizontally if needed

      mediaStream = stream; // Store the media stream for stopping it later

      camCont.style.perspective = '1500px'; // Optional styling for camera container
  })
  .catch((err) => {
      console.error('Error accessing the camera: ', err);
      alert("Error accessing the camera. Please try again.");
  });
}

document.getElementById('cam-stp').addEventListener('click', () => {
    // Stop the time update and freeze the current time
    stopTimeUpdate();

    // Capture snapshot logic
    if (videoElement && mediaStream) {
        // Create a new canvas for the snapshot
        const canvas = document.createElement('canvas');
        canvas.width = videoElement.videoWidth;  // Set canvas width to video width
        canvas.height = videoElement.videoHeight;  // Set canvas height to video height
        const ctx = canvas.getContext('2d');
        ctx.drawImage(videoElement, 0, 0, canvas.width, canvas.height);  // Draw the current frame of the video onto the canvas

        // Get the check-in time for watermark (from element with id 'currentTime')
        const currentDate = new Date();
        const day = String(currentDate.getDate()).padStart(2, '0');
        const month = String(currentDate.getMonth() + 1).padStart(2, '0');
        const year = String(currentDate.getFullYear()).slice(-2);
        const formattedDate = `${day}/${month}/${year}`;
        let checkinTime = document.getElementById('currentTime')?.textContent || "Unknown Time";

        // Remove seconds (ss) part from the time
        checkinTime = checkinTime.replace(/:\d{2}(\s?[APap][Mm])/, "$1");
        const watermarkText = `${formattedDate} ${checkinTime}`;

        // Watermark and flip logic
        ctx.save();
        ctx.scale(-1, 1);  // Flip the image horizontally
        ctx.font = '14vw Arial';
        ctx.fillStyle = '#4931e7';
        ctx.textAlign = 'center';
        ctx.textBaseline = 'middle';
        const marginBottom = -19;
        ctx.fillText(watermarkText, -canvas.width / 2, canvas.height / 2 + marginBottom);
        ctx.restore();

        // Create a flipped canvas for the flipped snapshot image
        const flipCanvas = document.createElement('canvas');
        flipCanvas.width = canvas.width;
        flipCanvas.height = canvas.height;
        const flipCtx = flipCanvas.getContext('2d');
        flipCtx.save();
        flipCtx.scale(-1, 1);  // Flip the image horizontally
        flipCtx.drawImage(canvas, -canvas.width, 0);
        flipCtx.restore();

        // Convert the flipped snapshot canvas to a base64 string
        const flippedSnapshot = flipCanvas.toDataURL('image/png');

        // Set the flipped snapshot image to the HTML img element with id 'snapshotImage'
        const snapshotImage = document.getElementById('snapshotImage');
        snapshotImage.src = flippedSnapshot;
        snapshotImage.style.display = 'block';
        snapshotImage.style.width = '100%';
        snapshotImage.style.height = '100%';
        snapshotImage.style.objectFit = 'cover';
        snapshotImage.style.transform = 'scaleX(-1)';  // Flip it back for display

        // Stop video and hide the video element
        videoElement.pause();
        videoElement.srcObject = null;
        videoElement.style.display = 'none';

        mediaStream.getTracks().forEach(track => track.stop());

        // Update UI buttons
        document.getElementById('cam-stp').style.display = 'none';
        document.querySelector('.loader').style.display = 'flex';
        document.querySelector('.loader').style.marginLeft = '45%';
        
        document.getElementById('camCancel').style.display = 'none';

        // Create a download link for the flipped snapshot image
        const downloadLink = document.createElement('a');
        downloadLink.href = flippedSnapshot;
        downloadLink.download = `snapshot_checkin_${checkinTime}_flipped.png`;
        downloadLink.style.display = 'none';
        document.body.appendChild(downloadLink);
        // downloadLink.click();
        document.body.removeChild(downloadLink);

        // Now flip the image back to the original orientation (post-download)
        flipCanvas.width = canvas.width;
        flipCanvas.height = canvas.height;
        const restoreCtx = flipCanvas.getContext('2d');
        restoreCtx.save();
        restoreCtx.scale(1, 1);  // Restore the original orientation
        restoreCtx.drawImage(canvas, 0, 0);
        restoreCtx.restore();
        snapshotImage.src = restoreCtx.canvas.toDataURL('image/png');

        // Call checkInUpdate function to get checkinData
        const checkinData = checkInUpdate(formattedDate, checkinTime);

        // Log checkinData and snapshot before sending to backend
        // console.log("Check-in Data: ", checkinData);
        // console.log("Flipped Snapshot Data (Base64): ", flippedSnapshot);

        // Upload checkinData and snapshot to the backend
        uploadCheckinData(checkinData, flippedSnapshot);
    } else {
        alert("No active camera stream found.");
    }
});

// Define the checkInUpdate function
function checkInUpdate(formattedDate, checkinTime) {
    const currentDate = new Date();
    const monthNames = [
        "January", "February", "March", "April", "May", "June",
        "July", "August", "September", "October", "November", "December"
    ];

    
   
    
    const userId = document.querySelector('.userId')?.textContent || "Unknown UserId";
    const last3Digits = userId.slice(-3); // Get last 3 digits of userId
    const userName = document.querySelector('.userName')?.textContent || "Unknown UserName";
    const location = document.getElementById('location')?.textContent || "Unknown Location";

     // Get the current date and time components
     const day = String(currentDate.getDate()).padStart(2, '0');
     const month = String(currentDate.getMonth() + 1).padStart(2, '0');
     const year = String(currentDate.getFullYear()).slice(-2); // Last two digits of the year
     const hours = String(currentDate.getHours()).padStart(2, '0');
     const minutes = String(currentDate.getMinutes()).padStart(2, '0');
     const seconds = String(currentDate.getSeconds()).padStart(2, '0');
     
     // Generate the atn_token
     const atnToken = `${day}${month}${year}${last3Digits}`;

    // Include action field in the checkinData
    return {
        date: formattedDate,
        month: monthNames[currentDate.getMonth()],
        atnToken: atnToken,
        userId: userId,
        userName: userName,
        location: location,
        checkinTime: checkinTime,
        action: "uploadCheckinData" // Action to be included in the data
    };
}

// Function to upload checkinData and snapshot
function uploadCheckinData(checkinData, snapshotData) {
    // Log the data before sending it
    // console.log("Uploading data...");
    console.log("Uploading Check-in Data: ", checkinData);
    console.log("Snapshot Data (Base64): ", snapshotData);

    // Convert checkinData to a URL-encoded string
    const data = new URLSearchParams(checkinData).toString();

    // Fetch backend URL from config.json
    fetch('/TFC-Connect/App/config.json')
        .then(response => response.json())
        .then(config => {
            const scriptUrl = config.scriptUrl;

            // Prepare the request data including the snapshot (base64 image)
            const requestData = {
                ...checkinData,   // Merge checkinData
                snapshot: snapshotData // Include the base64 snapshot image
            };

            // Convert request data to URL-encoded format
            const requestPayload = new URLSearchParams(requestData).toString();

            // Make POST request to upload the data and snapshot
            return fetch(scriptUrl, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/x-www-form-urlencoded'
                },
                body: requestPayload
            });
        })
        .then(response => response.json())
        .then(data => {

            

            console.log("attendance Data uploaded successfully:", data);
            document.getElementById('cam-stp').style.display = 'none';
            document.getElementById('SnapWhts').style.display = 'block';
            document.getElementById('bcToDash').style.display = 'block';
            document.getElementById('camCancel').style.display = 'none';
            document.querySelector('.loader').style.display = 'none';

            localStorage.setItem('whatsAppData', JSON.stringify(data.uploadedData));
            
            
        })
        .catch(error => {
            console.error("attendance Error uploading data:", error);
        });
}





  
  // camCancel button functionality: Simply stop the stream and hide the cam-cnt
  document.getElementById('camCancel').addEventListener('click', () => {
      if (mediaStream) {
          mediaStream.getTracks().forEach(track => track.stop()); // Stop all media tracks
      }
      camCont.style.display = 'none';
      slider.style.left = '0px'; // Snap back to the left
          sliderText.classList.remove('wait-animate'); // Remove animation
          sliderText.textContent = 'Check In'; // Reset the text
          checkinCont.style.display = "flex";
          actionCont.style.display = "none";
         
  });
  
  // bcToDash button functionality: Stop the stream and hide cam-cnt, reset UI
  document.getElementById('bcToDash').addEventListener('click', () => {
      // Stop the camera stream and hide video container
      if (mediaStream) {
          mediaStream.getTracks().forEach(track => track.stop()); // Stop all media tracks
      }
      camCont.style.display = 'none'; // Hide video container
  
      // Reset UI elements
      checkinCont.style.display = "none";
      actionCont.style.display = "flex";   
    //   document.getElementById('stsBx').style.display = 'none';
  });
  

  // SnapWhts button functionality: Stop the stream, hide cam-cnt, and redirect to WhatsApp
  document.getElementById('SnapWhts').addEventListener('click', () => {
      // Stop the camera stream and hide video container
      if (mediaStream) {
          mediaStream.getTracks().forEach(track => track.stop()); // Stop all media tracks
      }

      camCont.style.display = 'none'; // Hide video container
  
      // Reset UI elements
      checkinCont.style.display = "none";
      actionCont.style.display = "flex";

      const whatsAppData = JSON.parse(localStorage.getItem('whatsAppData'));
  
      var message = '*Reached*, ' + whatsAppData.userName + '\n' +
                    'Date: ' + whatsAppData.date + '\n' +
                    'Time: ' + whatsAppData.checkinTime + '\n' +
                    'location: *' + whatsAppData.location + '*\n' +
                    'Image Link: ' + whatsAppData.snapshotLink;

                 
                    var encodedMessage = encodeURIComponent(message);
                    var whatsappUrl = 'https://wa.me/?text=' + encodedMessage;
      
                    window.open(whatsappUrl, '_blank');


  });
  
  // Slider functionality
  slider.addEventListener('touchstart', (e) => {
      isTouching = true;
      startX = e.touches[0].clientX;
      sliderLeft = parseInt(getComputedStyle(slider).left, 10);
  });
  
  slider.addEventListener('touchmove', (e) => {
      if (!isTouching) return;
  
      const deltaX = e.touches[0].clientX - startX;
      let newLeft = sliderLeft + deltaX;
  
      // Constrain the slider within the container
      const maxLeft = switchContainer.offsetWidth - slider.offsetWidth;
      if (newLeft < 0) newLeft = 0;
      if (newLeft > maxLeft) newLeft = maxLeft;
  
      slider.style.left = `${newLeft}px`;
  });

  slider.addEventListener('touchend', () => {
    if (!isTouching) return;

    isTouching = false;
    const maxLeft = switchContainer.offsetWidth - slider.offsetWidth;
    const currentLeft = parseInt(getComputedStyle(slider).left, 10);

    // If slider is dragged more than halfway, complete the slide
    if (currentLeft > maxLeft / 2) {
        slider.style.left = `${maxLeft}px`; // Snap to the right
        sliderText.textContent = 'Wait';
        sliderText.classList.add('wait-animate'); // Add animation
        checkinCont.style.display = "none";
        actionCont.style.display = "flex";
        camCont.style.display = "flex";

        // **Fetch active ticket from local storage**
        const activeTicket = localStorage.getItem('receiveData');
        if (activeTicket) {
            try {
                const ticketData = JSON.parse(activeTicket); // Parse the JSON string
                const userId = ticketData.userId || 'N/A'; // Extract userId
                const token = ticketData.token || 'N/A';   // Extract token

                // Create an object and console log it
                const ticketObject = { UserId: userId, Token: token };
                console.log('Active Ticket:', ticketObject);

                // **Fetch backend URL from config.json and send the object**
                fetch('/TFC-Connect/App/config.json')
                    .then(response => response.json())
                    .then(config => {
                        const scriptUrl = config.scriptUrl;

                        // Create data to send
                        const data = new URLSearchParams();
                        data.append('action', 'validTicketForAttendance');
                        data.append('token', token);
                        data.append('userId', userId);

                        // Make POST request to the backend
                        return fetch(scriptUrl, {
                            method: 'POST',
                            headers: {
                                'Content-Type': 'application/x-www-form-urlencoded'
                            },
                            body: data
                        });
                    })
                    .then(response => response.json()) // Parse backend response to JSON
                    .then(attendanceData => {
                        // Check if the response indicates success
                        if (attendanceData.status === "success") {
                            console.log('Attendance Data for Backend:', attendanceData);
                        
                            document.querySelector(".ent-ext-tim").style.display = "flex";
                            document.querySelector("#cam-stp").style.display = "block";
                            document.querySelector(".loader").style.display = "none";
                        
                            // Update entry and exit times in the DOM
                            let entryTime = attendanceData.entryTime;  // Assuming entry time is sent in response
                            let exitTime = attendanceData.exitTime;    // Assuming exit time is sent in response
                        
                            // Remove the quotes around entryTime and exitTime, if any
                            entryTime = entryTime.replace(/"/g, '').trim();  // Remove quotes
                            exitTime = exitTime.replace(/"/g, '').trim();    // Remove quotes
                        
                            // Set the entry and exit times in the respective DOM elements
                            document.getElementById('entry-time').textContent = entryTime;
                            document.getElementById('exit-time').textContent = exitTime;
                        } else {
                            console.warn('Backend validation failed:', attendanceData.message);
                        
                            // Reset UI and stop stream
                            resetUI();
                        }
                        
                    })
                    .catch(error => {
                        console.error('Error during fetch:', error);

                        // Reset UI and stop stream
                        resetUI();
                    });
            } catch (err) {
                console.error('Error parsing activeTicket from localStorage:', err);

                // Reset UI and stop stream
                resetUI();
            }
        } else {
            console.warn('No activeTicket found in local storage.');

            // Reset UI and stop stream
            resetUI();
        }

        // Start camera and update location
        startCamera();
    } else {
        resetUI();
    }

    // Helper function to reset the UI and stop the camera stream
    function resetUI() {
        slider.style.left = '0px'; // Snap back to the left
        sliderText.classList.remove('wait-animate'); // Remove animation
        sliderText.textContent = 'Check In'; // Reset the text
        checkinCont.style.display = "flex";
        actionCont.style.display = "none";
        camCont.style.display = "none";

        // Stop the camera stream
        stopCamera();
    }

    // Function to stop the camera stream
    function stopCamera() {
        const videoElement = document.querySelector('video'); // Select the video element
        if (videoElement && videoElement.srcObject) {
            const stream = videoElement.srcObject;
            const tracks = stream.getTracks(); // Get all tracks (audio/video)

            // Stop each track
            tracks.forEach(track => track.stop());

            // Clear the video source
            videoElement.srcObject = null;
        }
    }
});





let progress = 0;
const progressText = document.getElementById("progress-text");
const progressCircle = document.querySelector(".progress-circle");
const circumference = 439.82; // Correct circumference for r = 70

// Function to update the progress based on a specific value
function updateProgress(targetProgress) {
  const incrementSpeed = 0.5; // Speed of the progress increment

  if (progress < targetProgress) {
    progress += incrementSpeed;
    const offset = circumference - (progress / 100) * circumference;
    progressCircle.style.strokeDashoffset = offset; // Update the stroke dashoffset
    progressText.innerHTML = `${Math.floor(progress)}% <p>Attendance</p>`;
    setTimeout(() => updateProgress(targetProgress), 10); // Smooth transition with slight delay
  } else {
    // Stop exactly at targetProgress
    progress = targetProgress;
    const offset = circumference - (progress / 100) * circumference;
    progressCircle.style.strokeDashoffset = offset;
    progressText.innerHTML = `${Math.floor(progress)}% <p>Attendance</p>`;
  }
}

// Example usage: Update progress to 90%
updateProgress(50);




// Function to set custom percentage values for each segment
const segmentPercentages = [0, 0, 0, 0]; // Initial percentages for each segment
const progressSegments = document.querySelectorAll('.circle-foreground'); // All the segments
const circleCircumference = 502.65; // Circumference of the circle (2 * π * r)

// Function to update each segment's progress
function updateSegmentProgress() {
  let totalProgress = 0;
  let startAngle = 0; // Start angle for each segment

  // Loop over each segment and apply progress
  progressSegments.forEach((segment, index) => {
    const segmentPercentage = segmentPercentages[index];
    
    if (segmentPercentage > 0) {
      const segmentProgress = (segmentPercentage / 100) * circleCircumference; // Calculate the stroke offset based on percentage

      // Calculate the starting point for each segment to avoid overlap
      const segmentDashoffset = circleCircumference - segmentProgress;
      segment.style.strokeDashoffset = segmentDashoffset;
      
      // Apply the rotation to the segment so it starts at the right angle
      segment.style.transform = `rotate(${startAngle}deg)`;

      // Update the start angle for the next segment
      startAngle += (segmentPercentage / 100) * 360; // 360 degrees for the full circle
    } else {
      // If the percentage is 0, ensure no progress is displayed (reset stroke-dashoffset)
      segment.style.strokeDashoffset = circleCircumference;
      segment.style.transform = `rotate(${startAngle}deg)`;
    }
  });
}

function setSegmentPercentage(segmentIndex, targetPercentage) {
    if (segmentIndex >= 0 && segmentIndex < segmentPercentages.length) {
      // Ensure percentage is within 0-100% range
      if (targetPercentage >= 0 && targetPercentage <= 100) {
        const currentPercentage = segmentPercentages[segmentIndex]; // Current percentage
        const step = (targetPercentage - currentPercentage) / 100; // Small incremental step
  
        // Incrementally update the percentage
        const interval = setInterval(() => {
          if (
            (step > 0 && segmentPercentages[segmentIndex] < targetPercentage) || 
            (step < 0 && segmentPercentages[segmentIndex] > targetPercentage)
          ) {
            segmentPercentages[segmentIndex] += step; // Increment the percentage
            updateSegmentProgress(); // Recalculate the progress
          } else {
            segmentPercentages[segmentIndex] = targetPercentage; // Set to the exact target
            updateSegmentProgress();
            clearInterval(interval); // Stop the incremental updates
          }
        }, 10); // Adjust the interval timing for smoother or faster progress
      }
    }
  }
  



// Example usage: Set individual segment percentages and update progress
setSegmentPercentage(0, 39);  // Set segment 1 to 25%
setSegmentPercentage(1, 15);  // Set segment 2 to 25%
setSegmentPercentage(2, 20);  // Set segment 3 to 25%
setSegmentPercentage(3, 10);  // Set segment 4 to 25%



function updateBar(index, targetValue, color) {
    // Select all progress rings
    const progressRings = document.querySelectorAll('.progress-ring');
  
    // Get specific progress ring by index
    const progressRing = progressRings[index];
    const circle = progressRing.querySelector('.progress');
    const progressValue = progressRing.querySelector('.progress-value');
  
    const radius = circle.r.baseVal.value;
    const circumference = 2 * Math.PI * radius;

    // Set initial strokeDasharray
    circle.style.strokeDasharray = `${circumference}`;
    circle.style.strokeDashoffset = `${circumference}`;  // Initial value is 100% (full circle)
  
    // Apply stroke color dynamically
    circle.style.stroke = color;

    // Animate progress value from 0% to targetValue
    let currentValue = 0;
    const interval = setInterval(() => {
        if (currentValue >= targetValue) {
            clearInterval(interval); // Stop the interval once the target value is reached
        } else {
            currentValue++;
            progressValue.textContent = `${currentValue}%`;
            
            // Update strokeDashoffset based on current progress
            const offset = circumference - (currentValue / 100) * circumference;
            circle.style.strokeDashoffset = offset;
        }
    }, 10); // Increase every 10ms for a smooth animation
}

// Example: Update all progress rings
updateBar(0, 25, '#31e774'); // 25% progress, green color
updateBar(1, 50, '#ffd606'); // 50% progress, yellow color
updateBar(2, 75, '#ffa033'); // 75% progress, orange color
updateBar(3, 90, '#ff4000'); // 90% progress, red color


let currentIndex = 0;
const slides = document.querySelectorAll('.carousel .slide');
const totalSlides = slides.length;
const carousel = document.querySelector('.carousel');

// Function to move carousel automatically forward
function moveCarousel() {
    currentIndex++;
    if (currentIndex >= totalSlides) {
        currentIndex = 0; // Loop back to the first slide after the last slide
    }
    const translateY = -currentIndex * 140; // Moves the carousel by 140px per slide
    carousel.style.transform = `translateY(${translateY}px)`;
}

// Start the automatic sliding interval
function startAutoSlide() {
    setInterval(moveCarousel, 5000); // Move the carousel every 3 seconds
}

// Start the automatic sliding on page load
startAutoSlide();
function createCalendar(year, month) {
    const calendar = document.getElementById('calendar');
    const currentDate = new Date();
    const today = currentDate.getDate();
    const currentMonth = currentDate.getMonth();
    const currentYear = currentDate.getFullYear();

    const daysInMonth = new Date(year, month + 1, 0).getDate();
    const firstDay = new Date(year, month, 1).getDay();

    // Define colors for the spans
    const colors = ['#31e774', '#ffd606', '#ffa033', '#ff4000'];

    let table = `<table>
        <thead>
            <tr>
                <th>Su</th>
                <th>Mo</th>
                <th>Tu</th>
                <th>We</th>
                <th>Th</th>
                <th>Fr</th>
                <th>Sa</th>
            </tr>
        </thead>
        <tbody>`;
    
    let date = 1;
    for (let i = 0; i < 6; i++) {
        table += '<tr>';
        for (let j = 0; j < 7; j++) {
            if (i === 0 && j < firstDay) {
                table += '<td></td>';
            } else if (date > daysInMonth) {
                break;
            } else {
                const isToday = date === today && month === currentMonth && year === currentYear;
                const colorIndex = (date - 1) % colors.length; // Rotate through colors
                
                table += `<td class="${isToday ? 'current-day bx-anm' : ''}">
                    <div class="tc-c" style="text-align: center;">
                        ${!isToday ? `<span style="display: inline-block; border-radius: 12px; width: 10px; height: 3px; background-color: ${colors[colorIndex]};"></span>` : ''}
                        <div>${date}</div>
                    </div>
                </td>`;
                date++;
            }
        }
        table += '</tr>';
    }

    table += '</tbody></table>';
    calendar.innerHTML = table;
}

// Initialize the calendar
createCalendar(new Date().getFullYear(), new Date().getMonth());


async function getCheckinInfo() {
    // Retrieve the active ticket from localStorage
    const activeTicket = localStorage.getItem('receiveData');
    if (!activeTicket) {
        console.error('No active ticket found in localStorage.');
        return;
    }

    try {
        // Parse the JSON string from localStorage
        const ticketData = JSON.parse(activeTicket);
        const userId = ticketData.userId || 'N/A';
        const token = ticketData.token || 'N/A';

        // Log the active ticket object
        const ticketObject = { UserId: userId, Token: token };
        console.log('Active Ticket:', ticketObject);

        // Fetch the backend URL from config.json
        const response = await fetch('/TFC-Connect/App/config.json');
        const config = await response.json();
        const scriptUrl = config.scriptUrl;

        // Prepare the data to send
        const data = new URLSearchParams();
        data.append('action', 'getCheckinInfo');
        data.append('token', token);
        data.append('userId', userId);

        // Send the data to the backend via POST
        const backendResponse = await fetch(scriptUrl, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/x-www-form-urlencoded'
            },
            body: data
        });

       // Parse the backend response
const result = await backendResponse.json();
console.log('Backend Response for checkin:', result);

// First, hide the checkDotCont
document.getElementById('checkDotCont').style.display = 'none';

// Check the result message and perform actions accordingly
if (result.message === 'hideAll') {
    // Show the check-in button
    document.getElementById('atn-switch').style.display = 'none';
} else if (result.message === 'showCheckOut') {
    // Show the check-out button
    document.getElementById('atn-switch').style.display = 'flex';
    document.getElementById('actBtn').style.display = 'flex';
    document.getElementById('chknBtn').style.display = 'none';
    document.getElementById('resetCont').style.display = 'none';

} else if (result.message === 'showCheckIn') {
    // Show the check-out button
    document.getElementById('atn-switch').style.display = 'flex';
    document.getElementById('actBtn').style.display = 'none';
    document.getElementById('chknBtn').style.display = 'flex';
    document.getElementById('resetCont').style.display = 'none';

} else if (result.message === 'moveForward') {
    // Show the reset container
    document.getElementById('atn-switch').style.display = 'flex';
    document.getElementById('resetCont').style.display = 'flex';
    document.getElementById('actBtn').style.display = 'none';
    document.getElementById('chknBtn').style.display = 'none';
}

        return result;
    } catch (error) {
        console.error('Error processing active ticket:', error);
    }
}

setInterval(getCheckinInfo, 1000);
