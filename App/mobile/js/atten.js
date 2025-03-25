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

function generateDates(attrecord, holidays = []) {
    const dateContainer = document.getElementById("dateContainer");

    // Check if the container exists
    if (!dateContainer) {
        console.error("Element with id 'dateContainer' not found!");
        return;
    }

    // Clear the previous contents in the container to prevent duplicate entries
    dateContainer.innerHTML = '';

    const today = new Date();

    const colors = []; // Colors array for attendance
    const attendance = {}; // Object to hold attendance data by date
    const holidayMap = {}; // Map to store holidays

    // Fill the attendance object based on the attrecord data
    attrecord.forEach(record => {
        let dateObj = new Date(record.Date);
        let formattedDate = `${dateObj.getFullYear()}-${(dateObj.getMonth() + 1).toString().padStart(2, '0')}-${dateObj.getDate().toString().padStart(2, '0')}`;
        attendance[formattedDate] = record.Mark.toUpperCase();
    });

    // Process holidays (similarly to createCalendarFromSpan)
    holidays.forEach(row => {
        let [isoDate, holidayName, working] = row;
        if (working.toLowerCase() === "yes") return; // Skip working holidays
        let dateObj = new Date(isoDate);
        dateObj.setMinutes(dateObj.getMinutes() + 330); // Adjust for timezone if needed
        let formattedDate = `${dateObj.getFullYear()}-${(dateObj.getMonth() + 1).toString().padStart(2, '0')}-${dateObj.getDate().toString().padStart(2, '0')}`;
        holidayMap[formattedDate] = true; // Mark the date as a holiday
    });

    // Loop to create 6 dates
    for (let i = 0; i < 6; i++) {
        const date = new Date(today);
        date.setDate(today.getDate() - i); // Set the date to today, and subtract i days
        
        const day = String(date.getDate()).padStart(2, '0'); // Ensure two digits (DD)
        const month = date.toLocaleString('default', { month: 'short' }); // Get short month name

        // Create the date box
        const atnBox = document.createElement("div");
        atnBox.classList.add("atn-bx", "flex-coloum");

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

        // Determine the attendance mark for this date
        const formattedDate = `${date.getFullYear()}-${(date.getMonth() + 1).toString().padStart(2, '0')}-${date.getDate().toString().padStart(2, '0')}`;
        const mark = attendance[formattedDate] || null;
        let color = 'transparent'; // Default color if no attendance mark
        
        // Set colors based on attendance mark
        if (mark === 'P') color = '#31e774'; // Present
        else if (mark === 'L') color = '#ffd606'; // Late
        else if (mark === 'H') color = '#ffa033'; // Half day
        else if (mark === 'A') color = '#ff4000'; // Absent
        else if (holidayMap[formattedDate]) color = '#4931e7'; // Holiday

        // Add an indicator below dates (except for the current date)
        if (i !== 0) {
            const indicator = document.createElement("div");
            indicator.classList.add("indicator");

            // Set the color based on the mark
            indicator.style.cssText = `
                display: inline-block;
                width: 12px;
                height: 3px;
                background-color: ${color};
                border-radius: 4px;
                margin-top: -1px;
            `;
            atnBox.appendChild(indicator);
        }

        // Append to container
        dateContainer.appendChild(atnBox);
    }
}




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

             //console.log("add",  addressComponents);
 
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

 function restartTime() {
    timeInterval = setInterval(updateTime, 1000); // Stop the time update
   
  }



// Modify startCamera function to update location
function startCamera() {
  if (!navigator.mediaDevices || !navigator.mediaDevices.getUserMedia) {
      console.error("getUserMedia is not supported in your browser.");
      alert("Your browser does not support camera access. Please try using a modern browser like Chrome, Firefox, or Safari.");
      return;
  }
  document.getElementById('snapshotImage').style.display = 'none';
  document.getElementById('videoElement').style.display = 'flex';
  document.getElementById('camCancel').style.display = 'block';
  document.getElementById('bcToDash').style.display = 'none';
  document.getElementById('SnapWhts').style.display = 'none';
  document.querySelector('.loader').style.display = 'flex';
  document.querySelector('.loader').style.width = '48%';
  document.getElementById('location').textContent = "Fetching...";
  // Update location
  updateLocation();
  restartTime();

  // Try to access the camera
  navigator.mediaDevices.getUserMedia({
      video: {
          width: 1920, // Increase resolution for a wider field of view
          height: 1080 // Adjust height accordingly
      }
  })

  .then((stream) => {
     
      //console.log("Camera stream started successfully.");
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
        document.querySelector('.loader').style.width = '100%';
        
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
        // //console.log("Check-in Data: ", checkinData);
        // //console.log("Flipped Snapshot Data (Base64): ", flippedSnapshot);

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

     const officeTiming = JSON.parse(localStorage.getItem('officeTiming'));

      // Correctly fetch WhatsApp data once
      const checkInElements = document.querySelectorAll(".checkIn");
      checkInElements.forEach(element => {
          element.textContent = checkinTime;
      });

      const officeCheckIn = officeTiming.checkinTime;
     


     const convertTimeFormat = (timeString) => {
        if (!timeString || typeof timeString !== 'string') return 'N/A';
        
        // Remove "am" or "pm" and trim spaces
        const match = timeString.match(/(\d{1,2}):(\d{2})\s*(am|pm)/i);
        
        if (!match) return 'N/A';
        
        let [_, hour, minute, period] = match;
        
        // Convert to 24-hour format
        hour = parseInt(hour, 10);
        if (period.toLowerCase() === 'am' && hour === 12) {
            hour = 0;  // Midnight case (12 AM is 00:00)
        } else if (period.toLowerCase() === 'pm' && hour !== 12) {
            hour += 12;  // Afternoon case (PM, except 12 PM which remains unchanged)
        }
        
        // Format hour and minute to ensure 2-digit representation and return the result
        return `${hour.toString().padStart(2, '0')}:${minute}:00`;
    };
    
    const userCheckIn = convertTimeFormat(checkinTime);

    function addTimeToCheckIn(officeCheckIn, timeToAdd) {
        const [checkInHours, checkInMinutes, checkInSeconds] = officeCheckIn.split(":").map(Number);
        const [addHours, addMinutes, addSeconds] = timeToAdd.split(":").map(Number);

        const totalSeconds = 
            checkInSeconds + addSeconds + 
            (checkInMinutes + addMinutes) * 60 + 
            (checkInHours + addHours) * 3600;

        const hours = Math.floor(totalSeconds / 3600) % 24;
        const minutes = Math.floor((totalSeconds % 3600) / 60);
        const seconds = totalSeconds % 60;

        // Format time as "hh:mm:ss"
        return `${String(hours).padStart(2, "0")}:${String(minutes).padStart(2, "0")}:${String(seconds).padStart(2, "0")}`;
    }

    // Create deadlines
    const truserCheckIn = addTimeToCheckIn(userCheckIn, "00:00:00");
    const lateDeadline = addTimeToCheckIn(officeCheckIn, "00:16:00");
    const halfdayDeadline = addTimeToCheckIn(officeCheckIn, "00:46:00");
    const absentDeadline = addTimeToCheckIn(officeCheckIn, "06:16:00");

    //console.log('office Check in Timing', officeCheckIn);
    //console.log('office Check out Timing', officeTiming.checkoutTime);
    //console.log('User Reached at', userCheckIn);
    
    // Output the deadlines
    //console.log("Trail time:", truserCheckIn);
    //console.log("Late Deadline:", lateDeadline);
    //console.log("Halfday Deadline:", halfdayDeadline);
    //console.log("Absent Deadline:", absentDeadline);

    // Call updateCheckInStatus with the proper arguments
    const checkinstatus = updateCheckInStatus(truserCheckIn, lateDeadline, halfdayDeadline, absentDeadline);
   

   
    let statusMark; // StatusMark ko initialize karte hain

    // Check checkinstatus aur uske basis par statusMark ko update karte hain
    if (checkinstatus === "On time") {
        statusMark = "P"; // "P" ka matlab Present hai
    } else if (checkinstatus === "Late") {
        statusMark = "L"; // "L" ka matlab Late hai
    } else if (checkinstatus === "Absent") {
        statusMark = "A"; // "A" ka matlab Absent hai
    } else if (checkinstatus === "Halfday") {
        statusMark = "H"; // "H" ka matlab Halfday hai
    }

// Ab `statusMark` ko updated value mil gayi hai
//console.log("Check-in Status:", checkinstatus);
//console.log("Status Mark:", statusMark);





    // Include action field in the checkinData
    return {
        date: formattedDate,
        month: monthNames[currentDate.getMonth()],
        atnToken: atnToken,
        userId: userId,
        userName: userName,
        location: location,
        checkinTime: checkinTime,
        checkinstatus : checkinstatus,
        statusMark : statusMark,
        action: "uploadCheckinData" // Action to be included in the data
    };
}


// Function to compare times
function isTimeGreaterThanOrEqual(time1, time2) {
    const [h1, m1, s1] = time1.split(":").map(Number);
    const [h2, m2, s2] = time2.split(":").map(Number);

    if (h1 > h2 || (h1 === h2 && m1 > m2) || (h1 === h2 && m1 === m2 && s1 >= s2)) {
        return true;
    }
    return false;
}

// Function to compare times
function isTimeLessThan(time1, time2) {
    const [h1, m1, s1] = time1.split(":").map(Number);
    const [h2, m2, s2] = time2.split(":").map(Number);

    if (h1 < h2 || (h1 === h2 && m1 < m2) || (h1 === h2 && m1 === m2 && s1 < s2)) {
        return true;
    }
    return false;
}

const isTimeGreaterThan = (time1, time2) => {
    // Convert both times to Date objects for comparison
    const [h1, m1, s1] = time1.split(':').map(Number);
    const [h2, m2, s2] = time2.split(':').map(Number);

    const t1 = new Date(0, 0, 0, h1, m1, s1);
    const t2 = new Date(0, 0, 0, h2, m2, s2);

    return t1 > t2;
};


// Function to update check-in status
function updateCheckInStatus(truserCheckIn, lateDeadline, halfdayDeadline, absentDeadline) {
    
    // If userCheckIn is less than lateDeadline, return "On-time"
    if (isTimeLessThan(truserCheckIn, lateDeadline) && isTimeGreaterThan(truserCheckIn, "07:00:00")) {
        return "On time";
    } else if (isTimeGreaterThanOrEqual(truserCheckIn, absentDeadline)) {
        return "Absent";
    } else if (isTimeGreaterThanOrEqual(truserCheckIn, halfdayDeadline)) {
        return "Halfday";
    } else if (isTimeGreaterThanOrEqual(truserCheckIn, lateDeadline)) {
        return "Late";
    }
    
    // Default to "Absent" if no condition matches
    return "Absent"; // Default condition
}


// Function to upload checkinData and snapshot
function uploadCheckinData(checkinData, snapshotData) {
    // Log the data before sending it
    // //console.log("Uploading data...");
    //console.log("Uploading Check-in Data: ", checkinData);
    //console.log("Snapshot Data (Base64): ", snapshotData);

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

            

            //console.log("attendance Data uploaded successfully:", data);
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
                //console.log('Active Ticket:', ticketObject);

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
                            //console.log('Attendance Data for Backend:', attendanceData);
                        
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
  



function updateBar(index, targetValue, color, duration = 1000) {
    // Select all progress rings
    const progressRings = document.querySelectorAll('.progress-ring');
    
    // Get specific progress ring by index
    const progressRing = progressRings[index];
    const circle = progressRing.querySelector('.progress');
    const progressValue = progressRing.querySelector('.progress-value');

    const radius = circle.r.baseVal.value;
    const circumference = 2 * Math.PI * radius;

    // Set strokeDasharray
    circle.style.strokeDasharray = `${circumference}`;
    circle.style.stroke = color;

    // Get current percentage value
    let startValue = parseFloat(progressValue.textContent) || 0;
    targetValue = Math.max(0, Math.min(100, targetValue)); // Ensure within 0-100

    let startTime = null;

    function animateProgress(currentTime) {
        if (!startTime) startTime = currentTime;
        let elapsedTime = currentTime - startTime;
        
        // Calculate progress based on time elapsed
        let progress = Math.min(elapsedTime / duration, 1); // Ensures max value is 1
        
        // **Easing effect (smooth transition)**
        let easedProgress = progress * (2 - progress); // Ease-in-out effect

        // Interpolated Value Between startValue and targetValue
        let currentValue = startValue + (targetValue - startValue) * easedProgress;
        progressValue.innerText = `${Math.round(currentValue)}%`; // Update text smoothly

        // Update strokeDashoffset based on percentage
        const offset = circumference - (currentValue / 100) * circumference;
        circle.style.strokeDashoffset = offset;

        if (progress < 1) {
            requestAnimationFrame(animateProgress); // Continue animation
        }
    }

    requestAnimationFrame(animateProgress);
}




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


document.addEventListener("DOMContentLoaded", function () {
    createCalendarFromSpan(); // Initial load
    observeDateChange(); // Start observing changes in crt-atn-clndr
});


function createCalendarFromSpan(attrecord, response = []) {
    //console.log("attrecord Data:", attrecord);
    //console.log("Holidays Data:", response);

    const calendar = document.getElementById('calendar');
    const dateSpan = document.getElementById('crt-atn-clndr');

    if (!dateSpan) {
        console.error("Element with id 'crt-atn-clndr' not found!");
        return;
    }

    const dateText = dateSpan.textContent.trim();
    const [monthText, yearText] = dateText.split(" ");
    const year = parseInt(yearText, 10);
    const monthNames = ["JAN", "FEB", "MAR", "APR", "MAY", "JUN", "JUL", "AUG", "SEP", "OCT", "NOV", "DEC"];
    const month = monthNames.indexOf(monthText.toUpperCase());

    if (month === -1 || isNaN(year)) {
        console.error("Invalid date format in span. Expected 'MMM YYYY' format.");
        return;
    }

    const currentDate = new Date();
    const today = currentDate.getDate();
    const currentMonth = currentDate.getMonth();
    const currentYear = currentDate.getFullYear();
    
    const daysInMonth = new Date(year, month + 1, 0).getDate();
    const firstDay = new Date(year, month, 1).getDay();

    let holidays = {};
    response.forEach((row, index) => {
        if (index === 0) return;
        let [isoDate, holidayName, working] = row;
        if (working.toLowerCase() === "yes") return;
        let dateObj = new Date(isoDate);
        dateObj.setMinutes(dateObj.getMinutes() + 330);
        let formattedDate = `${dateObj.getFullYear()}-${(dateObj.getMonth() + 1).toString().padStart(2, '0')}-${dateObj.getDate().toString().padStart(2, '0')}`;
        holidays[formattedDate] = true;
    });

    let attendance = {};
    attrecord.forEach(record => {
        let dateObj = new Date(record.Date);
        let formattedDate = `${dateObj.getFullYear()}-${(dateObj.getMonth() + 1).toString().padStart(2, '0')}-${dateObj.getDate().toString().padStart(2, '0')}`;
        if (dateObj.getFullYear() === year && dateObj.getMonth() === month) {
            attendance[formattedDate] = record.Mark.toUpperCase();
        }
    });

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
                let formattedDate = `${year}-${(month + 1).toString().padStart(2, '0')}-${date.toString().padStart(2, '0')}`;
                let isHoliday = holidays[formattedDate] ? true : false;
                let mark = attendance[formattedDate] || null;
                
                let color = 'transparent';
                if (mark === 'P') color = '#31e774';
                else if (mark === 'L') color = '#ffd606';
                else if (mark === 'H') color = '#ffa033';
                else if (mark === 'A') color = '#ff4000';
                else if (isHoliday) color = '#4931e7';

                let spanHTML = !isToday 
                    ? `<span style="display: inline-block; border-radius: 12px; width: 13px; height: 3.5px; background-color: ${color};"></span>`
                    : '';

                table += `<td class="${isToday ? 'current-day bx-anm' : ''}">
                    <div class="tc-c" style="text-align: center;">
                        ${spanHTML}
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




// 📌 **Auto-Update When `crt-atn-clndr` Changes**
function observeDateChange() {
    const targetNode = document.getElementById('crt-atn-clndr');
    if (!targetNode) return;

    const observer = new MutationObserver(() => {
        createCalendarFromSpan(); // Update calendar on text change
    });

    observer.observe(targetNode, { characterData: true, childList: true, subtree: true });
}




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
        //console.log('Active Ticket:', ticketObject);

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
        //console.log('Backend Response for checkin:', result);

        const convertTimeFormat = (timeString) => {
            if (!timeString || typeof timeString !== 'string') return 'N/A';
        
            // Remove "am" or "pm" and trim spaces
            const match = timeString.match(/(\d{1,2}):(\d{2})\s*(am|pm)/i);
            if (!match) return 'N/A'; // Invalid format
        
            let [_, hours, minutes, modifier] = match;
        
            // Convert hours to 24-hour format
            if (modifier.toLowerCase() === 'pm' && hours !== '12') {
                hours = (parseInt(hours) + 12).toString(); // Convert PM to 24-hour
            } else if (modifier.toLowerCase() === 'am' && hours === '12') {
                hours = '00'; // Midnight case
            }
        
            // Return in 24-hour format with seconds set to '00'
            return `${hours}:${minutes}:00`;
        };
        
    // Remove quotes around checkinTime and checkoutTime, if any
     let checkinTime = result.checkInTime.replace(/"/g, '').trim();  // Remove quotes and trim 
    let checkoutTime = result.checkOutTime.replace(/"/g, '').trim();  // Remove quotes and trim spaces

// Save userId, checkinTime, and checkoutTime in localStorage
if (result.status === 'success') {
    const officeTiming = {
        userId: userId,
        checkinTime: convertTimeFormat(checkinTime), // Use updated checkinTime
        checkoutTime: convertTimeFormat(checkoutTime) // Use updated checkoutTime
    };
    localStorage.setItem('officeTiming', JSON.stringify(officeTiming));
    //console.log('Office Timing saved to localStorage:', officeTiming);
}


        // First, hide the checkDotCont
        document.getElementById('checkDotCont').style.display = 'none';

        // Check the result message and perform actions accordingly
        if (result.message === 'hideAll') {
            document.getElementById('atn-switch').style.display = 'none';
        } else if (result.message === 'showCheckOut') {
            document.getElementById('atn-switch').style.display = 'flex';
            document.getElementById('actBtn').style.display = 'flex';
            document.getElementById('chknBtn').style.display = 'none';
            document.getElementById('resetCont').style.display = 'none';
        } else if (result.message === 'showCheckIn') {
            document.getElementById('atn-switch').style.display = 'flex';
            document.getElementById('actBtn').style.display = 'none';
            document.getElementById('chknBtn').style.display = 'flex';
            document.getElementById('resetCont').style.display = 'none';
            const sliderText = document.getElementById('sliderText');
            const slider = document.getElementById('slider');
            slider.style.left = '0px'; // Snap back to the left
            sliderText.classList.remove('wait-animate'); // Remove animation
            sliderText.textContent = 'Check In';
            // Reset the text
            // document.getElementById('snapshotImage').style.display = 'none';
            // document.getElementById('videoElement').style.display = 'flex';

            

        } else if (result.message === 'moveForward') {
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

let noRecd ;
noRecd = "hide";
localStorage.setItem('noRecd', noRecd);


setInterval(getCheckinInfo, 1000);
setInterval(activityDataRecord, 1000);
setInterval(getAttenData, 5000);
setInterval(showRecdfun, 1000);
setInterval(hideRecdfun, 1000);
setInterval(findHoliday, 1000);




async function getAttenData() {
    // Retrieve the active ticket from localStorage
    const activeTicket = localStorage.getItem('receiveData');
    if (!activeTicket) {
        console.error('No active ticket found in localStorage.');
        return;
    }

    const ticketData = JSON.parse(activeTicket);
    const userId = ticketData.userId || 'N/A';
    const token = ticketData.token || 'N/A';
    const last3Digits = userId.slice(-3); // Get last 3 digits of userId
    

     // Get the current date and time components
     const currentDate = new Date();
     const day = String(currentDate.getDate()).padStart(2, '0');
     const month = String(currentDate.getMonth() + 1).padStart(2, '0');
     const year = String(currentDate.getFullYear()).slice(-2); // Last two digits of the year
     const hours = String(currentDate.getHours()).padStart(2, '0');
     const minutes = String(currentDate.getMinutes()).padStart(2, '0');
     const seconds = String(currentDate.getSeconds()).padStart(2, '0');
     
     // Generate the atn_token
     const atnToken = `${day}${month}${year}${last3Digits}`;
   
      // Log the active ticket object
      const ticketObject = { UserId: userId, Token: token, atnToken: atnToken};
      //console.log('Active Ticket:', ticketObject);

      // Fetch the backend URL from config.json
      const response = await fetch('/TFC-Connect/App/config.json');
      const config = await response.json();
      const scriptUrl = config.scriptUrl;

      // Prepare the data to send
      const data = new URLSearchParams();
      data.append('action', 'getAttenData');
      data.append('token', token);
      data.append('userId', userId);
      data.append('atnToken', atnToken);

      const backendResponse = await fetch(scriptUrl, {
        method: 'POST',
        headers: {
            'Content-Type': 'application/x-www-form-urlencoded'
        },
        body: data
    });

    const result = await backendResponse.json();
   
    
// Get the date from the element with class "selected-date-text"
let selectedDateText = document.querySelector(".selected-date-text")?.textContent.trim();

// Convert selected date to a proper format (23 MAR 2025)
let selectedDate = new Date(selectedDateText);
// let currentDate = new Date();

// Format current date to match the format "23 MAR 2025"
let formattedCurrentDate = currentDate.getDate() + " " + 
    currentDate.toLocaleString('en-US', { month: 'short' }).toUpperCase() + " " + 
    currentDate.getFullYear();

// Run function only if selected date matches current date
if (selectedDateText === formattedCurrentDate) {
    if (result.status === "error") {
        resetAttenStatus();
        let noRecd = "show";
        localStorage.setItem('noRecd', noRecd);
        //console.log("Data available hai:", data);
    } else {
        //console.log("Data undefined hai, 'noRecd' ko 'hide' set nahi kiya gaya.");
    }
} else {
    //console.log("Selected date aur current date match nahi kar rahe, function execute nahi hoga.");
}


    //console.log('data get from getAttenData:', result);
 
    
    let checkinstatusresponse;

    if (!result.data || typeof result.data.Check_in_status === 'undefined') {
        //console.log('Check_in_status is undefined or result.data is missing');
        checkinstatusresponse = 'Default value';  // Set a default value or handle it accordingly
    } else if (typeof result.data.Check_in_status === 'string') {
        // If Check_in_status is a plain string like "Absent", no need to parse it.
        checkinstatusresponse = result.data.Check_in_status;
    } else {
        // If it's an object or needs to be parsed
        try {
            checkinstatusresponse = JSON.parse(result.data.Check_in_status);
        } catch (error) {
            //console.log('Error parsing Check_in_status:', error);
            checkinstatusresponse = result.data.Check_in_status;  // Fallback to raw value
        }
    }
    
    localStorage.setItem('Check_in_status', checkinstatusresponse);
    
    checkInOutDate(result.data);

}


function showSpinner() {
    // Get the button element
    const checkOutBtn = document.getElementById('checkOutBtn');

    // Clear the button's current content
    checkOutBtn.textContent = "";

    // Create a new div element
    const spinnerDiv = document.createElement('div');

    // Add classes to the newly created div (optional for additional styling)
    spinnerDiv.classList.add("spinner", "flex-column");

    // Set inline styles for the spinner
    spinnerDiv.style.width = "25px"; // Spinner size
    spinnerDiv.style.height = "25px"; // Spinner size
    spinnerDiv.style.border = "3px solid #ff0606"; // Solid red border
    spinnerDiv.style.borderTop = "3px solid #fff"; // White top border for spinning effect
    spinnerDiv.style.borderRadius = "50%"; // Make it circular
    spinnerDiv.style.animation = "spin 1s linear infinite"; // Add spinning animation

    // Append the spinner div to the button
    checkOutBtn.appendChild(spinnerDiv);
}

function hideSpinner() {
    // Get the button element
    const checkOutBtn = document.getElementById('checkOutBtn');

    // Clear the button's content (removing the spinner div)
    checkOutBtn.textContent = "";
}





// Example checkoutTime input
async function checkoutFuntion() {
    showSpinner();
    const checkinstatusresponse = localStorage.getItem('Check_in_status');
    //console.log(`Data of getAttenData:`, checkinstatusresponse);

    // Ensure the checkinstatusresponse is valid
    if (!checkinstatusresponse) {
        //console.log('checkinstatusresponse is not defined or is null.');
        return;
    }
    //console.log('checkinstatusresponse:', checkinstatusresponse);

    // Get office timing from localStorage
    const officeTiming = JSON.parse(localStorage.getItem('officeTiming'));
    if (!officeTiming || !officeTiming.checkoutTime) {
        //console.log('Checkout time not found in localStorage.');
        return;
    }
    
    const userCheckOut = officeTiming.checkoutTime;

    // Get the current time in IST
    const currentDate = new Date();
    const currentTime = currentDate.toLocaleTimeString('en-US', {
        hour12: false,
        timeZone: 'Asia/Kolkata', // Indian Standard Time
    });

    //console.log(`Checkout time: ${userCheckOut}, Current time: ${currentTime}`);

    // Calculate the time difference between currentTime and userCheckOut
    const latediffrence = calculateTimeDifference(currentTime, userCheckOut);

    //console.log(`Time difference: ${latediffrence}`);

    // Check if the current time is earlier than the checkout time - 15 minutes
    const fifteenMinutesBeforeCheckout = subtractTime(userCheckOut, "00:15:00");  // Subtract 15 minutes

    //console.log(`Fifteen minutes before checkout: ${fifteenMinutesBeforeCheckout}`);

    let checkOutStatus = "On Time";  // This can be "On Time", "Halfday", "Late", or "Absent"
let markstatus = "P";
let markstatusReason = "N/A";

if (checkinstatusresponse === "On Time") {
    markstatus = "P";  // P for Present
} else if (checkinstatusresponse === "Halfday") {
    markstatus = "H";  // H for Halfday
} else if (checkinstatusresponse === "Late") {
    markstatus = "L";  // L for Late
} else if (checkinstatusresponse === "Absent") {
    markstatus = "A";  // A for Absent
}

//console.log(markstatus);


    // Compare the current time and fifteen minutes before checkout directly as strings
    if (currentTime < fifteenMinutesBeforeCheckout) {
        //console.log(`User is early by ${currentTime} compared to ${fifteenMinutesBeforeCheckout}.`);
    
        // Check the value of checkinstatusresponse
        if (checkinstatusresponse === "On Time") {
            checkOutStatus = "Halfday";
            markstatus = "H";
            markstatusReason = `Due to the early exit by ${latediffrence}`;

            //console.log("status update", checkOutStatus);
        } else if (checkinstatusresponse === "Halfday") {
            checkOutStatus = "Absent";
            markstatus = "A";
            markstatusReason = `Due to the early exit by ${latediffrence}`;
            //console.log("status update", checkOutStatus);
        } else if (checkinstatusresponse === "Absent") {
            checkOutStatus = "Absent";
            markstatus = "A";
            //console.log("status update", checkOutStatus);
        }
    
    } else {
        // If the user is not early enough, no change
        //console.log(`User is not early enough to trigger status change.`);
    }

    const activeTicket = localStorage.getItem('receiveData');
    if (!activeTicket) {
        console.error('No active ticket found in localStorage.');
        
        return;

    }

    const ticketData = JSON.parse(activeTicket);
    const userId = ticketData.userId || 'N/A';
    const token = ticketData.token || 'N/A';
    const last3Digits = userId.slice(-3); // Get last 3 digits of userId
    
    // Get the current date and time components
    const day = String(currentDate.getDate()).padStart(2, '0');
    const month = String(currentDate.getMonth() + 1).padStart(2, '0');
    const year = String(currentDate.getFullYear()).slice(-2); // Last two digits of the year
    const hours = String(currentDate.getHours()).padStart(2, '0');
    const minutes = String(currentDate.getMinutes()).padStart(2, '0');
    const seconds = String(currentDate.getSeconds()).padStart(2, '0');
    
    // Generate the atn_token
    const atnToken = `${day}${month}${year}${last3Digits}`;
  
    // Log the active ticket object
    const ticketObject = { 
        action: "checkoutFuntion",
        userId: userId,
        token: token, 
        atnToken: atnToken,
        checkoutTime: currentTime,
        checkinstatusresponse: checkOutStatus,
        markstatus: markstatus,
        decision: "By Attendance",
        markstatusReason: markstatusReason
    };
    //console.log('checkout reponse sending data:', ticketObject);

    const data = new URLSearchParams(ticketObject);

    // Fetch config
    const response = await fetch('/TFC-Connect/App/config.json');
    const config = await response.json();
    const scriptUrl = config.scriptUrl;
    
    // Send the data in the request body to the backend
    const backendResponse = await fetch(scriptUrl, {
        method: 'POST',
        headers: {
            'Content-Type': 'application/x-www-form-urlencoded'
        },
        body: data
    });
    
    // Handle the response if needed
    const result = await backendResponse.json();
    //console.log('Backend from checkout:', result);
    const checkOutBtn = document.getElementById('checkOutBtn');

    // Clear the button's current content
    checkOutBtn.textContent = "";

    // Create the <i> element for the icon
    const iconElement = document.createElement('i');
    iconElement.className = "fi fi-rs-arrow-left-from-arc"; // Add classes for the icon

    // Add the icon and "Check Out" text back to the button
    checkOutBtn.appendChild(iconElement);
    checkOutBtn.appendChild(document.createTextNode("Check Out"));


}

// Function to calculate time difference in HH:MM format
function calculateTimeDifference(currentTime, checkOutTime) {
    const [currentHours, currentMinutes, currentSeconds] = currentTime.split(':').map(Number);
    const [checkoutHours, checkoutMinutes, checkoutSeconds] = checkOutTime.split(':').map(Number);

    // Convert both times to total seconds for easier comparison
    const currentTimeInSeconds = (currentHours * 3600) + (currentMinutes * 60) + currentSeconds;
    const checkOutTimeInSeconds = (checkoutHours * 3600) + (checkoutMinutes * 60) + checkoutSeconds;

    let diffInSeconds = checkOutTimeInSeconds - currentTimeInSeconds;

    // Handle negative difference (if currentTime is after checkOutTime)
    if (diffInSeconds < 0) {
        diffInSeconds += 24 * 3600; // Add 24 hours worth of seconds (86400 seconds)
    }

    const hours = Math.floor(diffInSeconds / 3600);
    const minutes = Math.floor((diffInSeconds % 3600) / 60);
    const seconds = diffInSeconds % 60;

    // Return the result as HH:MM:SS
    return `${String(hours).padStart(2, '0')}:${String(minutes).padStart(2, '0')}:${String(seconds).padStart(2, '0')}`;
}


// Function to subtract time in hh:mm:ss format
function subtractTime(time, subtract) {
    const [h1, m1, s1] = time.split(":").map(Number);
    const [h2, m2, s2] = subtract.split(":").map(Number);

    let seconds = s1 - s2;
    let minutes = m1 - m2;
    let hours = h1 - h2;

    if (seconds < 0) {
        seconds += 60;
        minutes--;
    }
    if (minutes < 0) {
        minutes += 60;
        hours--;
    }
    if (hours < 0) {
        hours += 24;  // In case the time goes to the previous day
    }

    return `${hours.toString().padStart(2, '0')}:${minutes.toString().padStart(2, '0')}:${seconds.toString().padStart(2, '0')}`;
}


class DatePicker {
    constructor(container, type) {
        this.container = container;
        this.dateDisplay = container.querySelector(".selected-date-text");
        this.resetButton = container.querySelector(".resetDate");

        // Set default dates based on type
        let today = new Date();
        if (type === "start") {
            this.selectedDate = new Date(today.getFullYear(), today.getMonth(), 1); // Month start
        } else if (type === "end") {
            this.selectedDate = new Date(today.getFullYear(), today.getMonth() + 1, 0); // Month end
        } else {
            this.selectedDate = new Date(); // Today (default)
        }
        this.date = new Date(this.selectedDate); 

        this.init();
    }

    init() {
        this.updateSelectedDateText();
        this.addEventListeners();
    }

    updateSelectedDateText() {
        this.dateDisplay.textContent = `${this.selectedDate.getDate().toString().padStart(2, "0")} ${
            this.selectedDate.toLocaleString("default", { month: "short" }).toUpperCase()
        } ${this.selectedDate.getFullYear()}`;
    }

    addEventListeners() {
        this.dateDisplay.addEventListener("click", () => {
            activeDatePicker = this;  // Store reference for active date picker
            calendarContainer.style.display = "block";
            renderCalendar();
        });

        this.resetButton.addEventListener("click", () => this.resetToDefaultDate());
    }

    resetToDefaultDate() {
        let today = new Date();
        if (this.dateDisplay.classList.contains("start-date-text")) {
            this.selectedDate = new Date(today.getFullYear(), today.getMonth(), 1); // Month start
        } else if (this.dateDisplay.classList.contains("end-date-text")) {
            this.selectedDate = new Date(today.getFullYear(), today.getMonth() + 1, 0); // Month end
        } else {
            this.selectedDate = new Date(); // Current Date
        }
        this.date = new Date(this.selectedDate);
        this.updateSelectedDateText();
        this.resetButton.style.display = "none";
        localStorage.setItem('noRecd', "hide");
    }
}

// Initialize All Date Pickers with correct type
const datePickers = [];
document.querySelectorAll(".date-picker-container").forEach(container => {
    let dateText = container.querySelector(".selected-date-text");

    let type = dateText.classList.contains("start-date-text") ? "start"
             : dateText.classList.contains("end-date-text") ? "end"
             : "current";

    datePickers.push(new DatePicker(container, type));
});

// Calendar Functions
const calendarContainer = document.querySelector(".calendar-container");
const currentMonthYear = document.querySelector(".current-month-year");
const calendarGridContainer = document.querySelector(".calendar-grid-container");
let activeDatePicker = null;

function renderCalendar() {
    if (!activeDatePicker) return;

    calendarGridContainer.innerHTML = "";
    let date = activeDatePicker.date;
    let year = date.getFullYear();
    let month = date.getMonth();

    currentMonthYear.textContent = date.toLocaleString("default", { month: "long", year: "numeric" });

    let firstDay = new Date(year, month, 1).getDay();
    let lastDate = new Date(year, month + 1, 0).getDate();

    for (let i = 0; i < firstDay; i++) {
        let emptySlot = document.createElement("div");
        calendarGridContainer.appendChild(emptySlot);
    }

    for (let i = 1; i <= lastDate; i++) {
        let day = document.createElement("div");
        day.className = "calendar-day";
        day.textContent = i;

        if (i === activeDatePicker.selectedDate.getDate() && 
            year === activeDatePicker.selectedDate.getFullYear() && 
            month === activeDatePicker.selectedDate.getMonth()) {
            day.classList.add("calendar-day-selected");
        }

        day.addEventListener("click", () => {
            activeDatePicker.selectedDate = new Date(year, month, i);
            activeDatePicker.updateSelectedDateText();
            activeDatePicker.resetButton.style.display = "flex";
            calendarContainer.style.display = "none";

            document.querySelectorAll(".calendar-day").forEach(d => d.classList.remove("calendar-day-selected"));
            day.classList.add("calendar-day-selected");
        });

        calendarGridContainer.appendChild(day);
    }
}

document.querySelector(".prev-month").addEventListener("click", () => {
    if (activeDatePicker) {
        activeDatePicker.date.setMonth(activeDatePicker.date.getMonth() - 1);
        renderCalendar();
    }
});

document.querySelector(".next-month").addEventListener("click", () => {
    if (activeDatePicker) {
        activeDatePicker.date.setMonth(activeDatePicker.date.getMonth() + 1);
        renderCalendar();
    }
});

// Close calendar when clicked outside
document.addEventListener("click", (e) => {
    if (!e.target.closest(".date-picker-container") && !e.target.closest(".calendar-container")) {
        calendarContainer.style.display = "none";
    }
});



function updateMonthDates(index) {
    let monthSpan = document.querySelector(`.act-mnth-slt-${index}`);
    let startSpan = document.querySelector(`.act-start-${index}`);
    let endSpan = document.querySelector(`.act-end-${index}`);
    
    if (!monthSpan || !startSpan || !endSpan) {
        console.error("One or more elements not found for index:", index);
        return;
    }
    
    let monthYearText = monthSpan.innerText.trim(); // "MMM YYYY"
    let date = new Date(monthYearText);
    
    if (isNaN(date.getTime())) {
        console.error("Invalid date format in act-mnth-slt-", index);
        return;
    }
    
    let currentDate = new Date();
    let firstDate = new Date(date.getFullYear(), date.getMonth(), 1);
    let lastDate;
    
    // Check if selected month is the current month
    if (date.getFullYear() === currentDate.getFullYear() && date.getMonth() === currentDate.getMonth()) {
        lastDate = currentDate; // Set to current date only (without time)
    } else {
        lastDate = new Date(date.getFullYear(), date.getMonth() + 1, 0);
    }
    
    function formatDate(date) {
        let day = date.getDate().toString().padStart(2, '0');
        let month = date.toLocaleString("en-GB", { month: "short" }).toUpperCase();
        let year = date.getFullYear();
        return `${day} ${month} ${year}`;
    }
    
    startSpan.innerText = formatDate(firstDate);
    endSpan.innerText = formatDate(lastDate);
}

function observeMonthSpan(index) {
    const monthSpan = document.querySelector(`.act-mnth-slt-${index}`);
    if (monthSpan) {
        const observer = new MutationObserver(() => updateMonthDates(index));
        observer.observe(monthSpan, { childList: true, subtree: true, characterData: true });
    }
}

// Example usage for multiple instances
observeMonthSpan(1);
observeMonthSpan(2);







function checkInOutDate(data) {
    //console.log("Data received in checkInOutDate: ", data); // Log the data to check what's being passed


// Get the date from the element with class "selected-date-text"
let selectedDateText = document.querySelector(".selected-date-text")?.textContent.trim();

// Convert selected date to a proper format (23 MAR 2025)
let selectedDate = new Date(selectedDateText);
let currentDate = new Date();

// Format current date to match the format "23 MAR 2025"
let formattedCurrentDate = currentDate.getDate() + " " + 
    currentDate.toLocaleString('en-US', { month: 'short' }).toUpperCase() + " " + 
    currentDate.getFullYear();

// Run function only if selected date matches current date
if (selectedDateText === formattedCurrentDate) {
    if (typeof data !== "undefined") {
        let noRecd = "hide";
        localStorage.setItem('noRecd', noRecd);
        //console.log("Data available hai:", data);
    } else {
        //console.log("Data undefined hai, 'noRecd' ko 'hide' set nahi kiya gaya.");
    }
} else {
    //console.log("Selected date aur current date match nahi kar rahe, function execute nahi hoga.");
}


    const checkInOutDate = document.getElementById("checkInOutDate");

    // Check if the element exists
    if (!checkInOutDate) {
        console.error("Element with ID 'checkInOutDate' not found in the DOM!");
        return;
    }

    const dateValue = checkInOutDate.innerText.trim(); // Get the text content of the span
    if (!dateValue || dateValue === "Select Date") {
        //console.log("No valid date selected.");
        return;
    }

    // Try parsing date from '17 JAN 2025' format
    const parsedDate = parseDate(dateValue);

    if (parsedDate) {
        const formattedDate = formatDateToDDMMYY(parsedDate);
        //console.log(`Formatted date (dd/mm/yy): ${formattedDate}`);

        // Check if the formatted date matches today's date
        const currentDate = getCurrentDateInDDMMYY();
        if (formattedDate === currentDate) {
            //console.log("Formatted date matches the current date. Running function A...");
            updateAtnCells(data);
        } else {
            //console.log("Formatted date does not match the current date. Skipping function A.", formattedDate);
            updateAtnCellsByDate(formattedDate);
            
        }
    } else {
        //console.log("Invalid date format. Please use 'DD MMM YYYY'");
    }
}


function activityDataRecord() {
    //console.log("Function running: activityDataRecord");

    // Retrieve and parse the active ticket data from localStorage
    const activeTicket = JSON.parse(localStorage.getItem('receiveData'));

    if (!activeTicket) {
        console.error("No active ticket found.");
        return;
    }

    // Extract token and userId from the activeTicket object
    const tktuserToken = activeTicket.token;
    const tktuserId = activeTicket.userId;

    //console.log("Token:", tktuserToken);
    //console.log("UserId:", tktuserId);

    // Create data object to send to the backend, with action included
    const data = new URLSearchParams();
    data.append('action', 'activityDataRecord');
    data.append('token', tktuserToken);
    data.append('userId', tktuserId);

    //console.log('Data being sent from activityDataRecord:', data.toString());

    // Fetch config.json to get script URL
    fetch('/TFC-Connect/App/config.json')
        .then(response => {
            if (!response.ok) {
                throw new Error(`Failed to load config.json, status: ${response.status}`);
            }
            return response.json();
        })
        .then(config => {
            if (!config.scriptUrl) {
                throw new Error("scriptUrl not found in config.json");
            }

            // Make the POST request to the App Script endpoint
            return fetch(config.scriptUrl, {
                method: 'POST',
                headers: { 'Content-Type': 'application/x-www-form-urlencoded' },
                body: data
            });
        })
        .then(response => {
            if (!response.ok) {
                throw new Error(`Server error: ${response.status}`);
            }
            return response.json();
        })
        .then(result => {
            markActivity(result.data);
            markAttnDays(result.data);
            findHoliday(result.data)
            //console.log("Server response activityDataRecord:", result);

        })
        .catch(error => {
            console.error("Error in activityDataRecord:", error);
        });

        markActivity();  
}


function markActivity(data) {
    //console.log("📌 Received Data:", data);

    let activityContainer = document.getElementById("activityContainer");
    let allActCnt = document.getElementById("allActCnt");

    let entries = Object.values(data);
    
    // Sort entries in descending order based on the date (newest first)
    entries.sort((a, b) => new Date(b.Date) - new Date(a.Date));

    let recentEntries = entries.slice(0, 2); // सिर्फ़ 2 एंट्रीज़ (top 2 latest entries)

    // ✅ `activityContainer` (Recent 2 Entries)
    renderEntries(recentEntries, activityContainer);

    // ✅ `allActCnt` ke liye date-wise filter karein
    applyDateFilter(entries);

    function formatDate(dateString) {
        let date = new Date(dateString);
        let options = { day: "2-digit", month: "short", year: "numeric" };
        return date.toLocaleDateString("en-GB", options).replace(",", "");
    }

    function formatTime(timeString) {
        if (!timeString) return "00:00 AM";
        let date = new Date(timeString);
        let hours = date.getHours();
        let minutes = date.getMinutes();
        let ampm = hours >= 12 ? "PM" : "AM";

        hours = hours % 12;
        hours = hours === 0 ? 12 : hours;

        let formattedHours = hours < 10 ? "0" + hours : hours;
        let formattedMinutes = minutes < 10 ? "0" + minutes : minutes;

        return `${formattedHours}:${formattedMinutes} ${ampm}`;
    }

    function renderEntries(entries, container) {
        //console.log("🔍 Rendering Entries:", entries);

        let fragment = document.createDocumentFragment();
        container.innerHTML = ""; // ✅ Clear previous data

        entries.forEach(entry => {
            let formattedDate = formatDate(entry.Date);
            let checkInTime = formatTime(entry.Check_in_time);
            let checkOutTime = formatTime(entry.Check_out_time);
            let checkInStatus = entry.Check_in_status || "N/A";
            let checkOutStatus = entry.Check_out_status || "N/A";

            //console.log(`📆 Entry Date: ${entry.Date} ➝ ${formattedDate}`);

            let checkInCard = document.createElement("div");
            checkInCard.classList.add("act-card", "flex", "box-styling");
            checkInCard.innerHTML = `
                <div class="act-cd-prf box-styling">
                    <i style="transform: rotateY(180deg);" class="fi fi-rs-arrow-left-from-arc"></i>
                </div>
                <div class="act-txt-bx flex-row">
                    <div class="sts-cd">
                        <h3 class="attn_status">Check In</h3>
                        <p class="attn_date">${formattedDate}</p>
                    </div>
                    <div class="sts-cd">
                        <h3 class="attn_time">${checkInTime}</h3>
                        <p class="attn_remark">${checkInStatus}</p>
                    </div>
                </div>
            `;

            let checkOutCard = null;
            if (checkOutTime !== "00:00 AM") {
                checkOutCard = document.createElement("div");
                checkOutCard.classList.add("act-card", "flex", "box-styling");
                checkOutCard.innerHTML = `
                    <div class="act-cd-prf box-styling" >
                        <i class=" fi fi-rs-arrow-left-from-arc"></i>
                    </div>
                    <div class="act-txt-bx flex-row">
                        <div class="sts-cd">
                            <h3 class="attn_status">Check Out</h3>
                            <p class="attn_date">${formattedDate}</p>
                        </div>
                        <div class="sts-cd">
                            <h3 class="attn_time">${checkOutTime}</h3>
                            <p class="attn_remark">${checkOutStatus}</p>
                        </div>
                    </div>
                `;
            }

            fragment.appendChild(checkInCard);
            if (checkOutCard) fragment.appendChild(checkOutCard);
        });

        container.appendChild(fragment);
        document.getElementById("daily-atn").style.display = "block";
    }

    function applyDateFilter(allEntries) {
        let startDateSpan = document.getElementById("act-st-dt");
        let endDateSpan = document.getElementById("act-ed-dt");
    
        let startDateText = startDateSpan ? startDateSpan.innerText.trim() : "";
        let endDateText = endDateSpan ? endDateSpan.innerText.trim() : "";
    
        //console.log(`📌 Start Date (Raw): "${startDateText}"`);
        //console.log(`📌 End Date (Raw): "${endDateText}"`);
    
        let startDate = convertPickerDate(startDateText);
        let endDate = convertPickerDate(endDateText);
    
        if (!startDate || !endDate) {
            //console.log("⚠️ No valid date range selected. Showing all entries.");
            let sortedEntries = allEntries.sort((a, b) => new Date(b.Date) - new Date(a.Date)); // ✅ Sort in DESC order
            renderEntries(sortedEntries, allActCnt);
            return;
        }
    
        let startTimestamp = new Date(startDate).getTime();
        let endTimestamp = new Date(endDate).getTime();
    
        //console.log(`✅ Start Date (Timestamp): ${startTimestamp}`);
        //console.log(`✅ End Date (Timestamp): ${endTimestamp}`);
    
        let filteredEntries = allEntries
            .filter(entry => {
                let entryTimestamp = new Date(entry.Date).getTime();
                let isInRange = entryTimestamp >= startTimestamp && entryTimestamp <= endTimestamp;
    
                //console.log(`🔍 Checking: ${entry.Date} (${entryTimestamp}) ➝ In Range? ${isInRange}`);
                return isInRange;
            })
            .sort((a, b) => new Date(b.Date) - new Date(a.Date)); // ✅ Sorting in DESC order (Newest First)
    
        //console.log("✅ Sorted Filtered Entries (Descending):", filteredEntries);
        renderEntries(filteredEntries, allActCnt);
    }
    

    function convertPickerDate(dateString) {
        let parts = dateString.split(" ");
        if (parts.length !== 3) return null;
    
        let day = parts[0].padStart(2, "0"); // Ensuring "1" becomes "01"
        let month = parts[1]; // Month already in correct format
        let year = parts[2];
    
        return `${day} ${month} ${year}`;
    }
    

    function observeDateChanges() {
        let startDateSpan = document.getElementById("act-st-dt");
        let endDateSpan = document.getElementById("act-ed-dt");

        if (startDateSpan && endDateSpan) {
            let observer = new MutationObserver(() => {
                //console.log("🔄 Date changed, reapplying filter...");
                applyDateFilter(entries);
            });

            observer.observe(startDateSpan, { childList: true, subtree: true, characterData: true });
            observer.observe(endDateSpan, { childList: true, subtree: true, characterData: true });
        }
    }

    observeDateChanges();
}






function parseDate(input) {
    // Regex to match DD MMM YYYY format
    const regex = /^(\d{1,2})\s([A-Za-z]{3})\s(\d{4})$/;
    const match = input.match(regex);

    if (!match) return null;

    const [_, day, month, year] = match;
    const months = ["JAN", "FEB", "MAR", "APR", "MAY", "JUN", "JUL", "AUG", "SEP", "OCT", "NOV", "DEC"];
    const monthIndex = months.indexOf(month.toUpperCase());

    if (monthIndex === -1) return null;

    return new Date(year, monthIndex, day);
}

function formatDateToDDMMYY(date) {
    const day = String(date.getDate()).padStart(2, "0"); // Get day and add leading zero if needed
    const month = String(date.getMonth() + 1).padStart(2, "0"); // Get month (0-based index) and add leading zero
    const year = String(date.getFullYear()).slice(-2); // Get last two digits of the year
    return `${day}/${month}/${year}`;
}

function getCurrentDateInDDMMYY() {
    const today = new Date();
    return formatDateToDDMMYY(today); // Format today's date in dd/mm/yy
}

function updateAtnCells(data) {
    
    if (data !== undefined) {
        //console.log("Data received in updateAtnCells: ", data); // Log the data if it's not undefined

        resetAttenStatus();
     
        function formatTime(timeString) {
            const date = new Date(timeString);
            let hours = date.getHours();
            let minutes = date.getMinutes();
            const ampm = hours >= 12 ? 'pm' : 'am';
            hours = hours % 12;
            hours = hours ? hours : 12; // the hour '0' should be '12'
            minutes = minutes < 10 ? '0' + minutes : minutes;
            return hours + ':' + minutes + ' ' + ampm;
        }
        

        if (data.Check_in_time && data.Check_in_time.trim() !== "") {
           
            document.getElementById("checkInTime").textContent = formatTime(data.Check_in_time);
        }
        
        if (data.Check_out_time && data.Check_out_time.trim() !== "") {
            
            document.getElementById("checkOutTime").textContent = formatTime(data.Check_out_time);
        }
        
          
        if (data.Check_in_status && data.Check_in_status.trim() !== "") {
           
            document.getElementById("checkInStatus").textContent = data.Check_in_status;
        }

        if (data.Check_out_status && data.Check_out_status.trim() !== "") {
            
            document.getElementById("checkOutStatus").textContent = data.Check_out_status;
        }


        if (data.Status && data.Status.trim() !== "") {
           
            document.getElementById("finalStatus").textContent = data.Status;
        }
        
        if (data.Desicion && data.Desicion.trim() !== "") {
            
            document.getElementById("finalDecision").textContent = data.Desicion;
        }

        
        
    } else {
        //console.log("Data received in: undifined", );
    }
}

setInterval (updateAtnCellsByDate(formattedDate), 1000);

async function updateAtnCellsByDate(formattedDate) {
    if (!formattedDate) {
        console.error("formattedDate is not defined or invalid");
        return; // Return early if formattedDate is not available
    }

    //console.log("Data received in updateAtnCellsByDate: ", formattedDate);

    try {
        // Parse the JSON string from localStorage
        const activeTicket = localStorage.getItem('receiveData'); // Assuming activeTicket is stored in localStorage
        if (!activeTicket) {
            console.error("No active ticket data found in localStorage.");
            return; // Return early if there is no active ticket data
        }
        const ticketData = JSON.parse(activeTicket);
        const userId = ticketData.userId || 'N/A';
        const token = ticketData.token || 'N/A';

        // Log the active ticket object
        const ticketObject = { UserId: userId, Token: token };
        //console.log('Active Ticket:', ticketObject);

        // Extract day, month, and year from formattedDate (assuming it's in the format "dd/mm/yy")
        const dateParts = formattedDate.split('/');
        const day = dateParts[0]; // Extract day (e.g., "25")
        const month = dateParts[1]; // Extract month (e.g., "08")
        const year = dateParts[2]; // Format year (e.g., "25" -> "2025")

        // Get the last 3 digits of the userId
        const last3Digits = userId.slice(-3); // Get last 3 digits of userId

        // Create the atnToken using the day, month, year, and last 3 digits of userId
        const atnToken = `${day}${month}${year}${last3Digits}`;
        //console.log('Generated ATN Token:', atnToken);

        // Fetch the backend URL from config.json
        const response = await fetch('/TFC-Connect/App/config.json');
        const config = await response.json();
        const scriptUrl = config.scriptUrl;

        // Prepare the data to send
        const data = new URLSearchParams();
        data.append('action', 'getAttenData');
        data.append('token', token);
        data.append('userId', userId);
        data.append('atnToken', atnToken);  // Send the atnToken

        // Send the data to the backend via POST
        const backendResponse = await fetch(scriptUrl, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/x-www-form-urlencoded'
            },
            body: data
        });

      
        // Log the backend response before further processing
        //console.log("Backend Response:", backendResponse);

        // Check if the response is successful
        if (backendResponse.ok) {
            const backendData = await backendResponse.json();
            //console.log("Backend response data:", backendData);
            // Handle the backend data as needed
            if (backendData && backendData.data) {

                updateAtnCells(backendData.data); 
               
     
                let noRecd ;
                noRecd = "hide";
                localStorage.setItem('noRecd', noRecd);
                


            } else {

                //console.log("No data found in backend response.");
                resetAttenStatus();
               
                let noRecd ;
                noRecd = "show";
                localStorage.setItem('noRecd', noRecd);
             
                
                
              

            }
        } else {
            // If backend request is not OK
            console.error("Backend request failed with status:", backendResponse.status);
            resetAttenStatus(); // Call a function to reset the status
        }
    } catch (error) {
        console.error("Error in updateAtnCellsByDate:", error);
        resetAttenStatus(); // Call a function to reset the status
    }
}



function showRecdfun(){
    const noRecdRes = localStorage.getItem('noRecd');
    //console.log("noRecdRes", noRecdRes);
    
    if(noRecdRes === "show"){
        document.getElementById('crd-bx-cnt').style.display = "none";
        document.getElementById('noRecd').style.display = "flex";
    }


}


function hideRecdfun(){
    const noRecdRes = localStorage.getItem('noRecd');
    //console.log("noRecdRes", noRecdRes);
    
    if(noRecdRes === "hide"){
        document.getElementById('crd-bx-cnt').style.display = "block";
        document.getElementById('noRecd').style.display = "none";
    }


}



// Reset function to clear all status fields
function resetAttenStatus() {
    document.getElementById("checkInTime").textContent = "--:--";
    document.getElementById("checkOutTime").textContent = "--:--";
    document.getElementById("checkInStatus").textContent = "------";
    document.getElementById("checkOutStatus").textContent = "------";
    document.getElementById("finalStatus").textContent = "------";
    document.getElementById("finalDecision").textContent = "------";
}

function updateAttenStatus(){
    document.getElementById("checkInTime").textContent = "loading...";
      document.getElementById("checkOutTime").textContent = "loading...";
      document.getElementById("checkInStatus").textContent = "loading...";
      document.getElementById("checkOutStatus").textContent = "loading...";
      document.getElementById("finalStatus").textContent = "loading...";
      document.getElementById("finalDecision").textContent = "loading...";
}


function brkAlrt(){
    const brkAlertBox = document.getElementById('brkAlertBox');
    
    if (brkAlertBox) {
        brkAlertBox.classList.remove('visible'); // Slide out to hide
    }
}

function showAlrt(){
    const brkAlertBox = document.getElementById('brkAlertBox');
    
    if (brkAlertBox) {
        brkAlertBox.classList.add('visible'); // Slide in to show
    }
}




function showActivity(){
    const allActivity = document.getElementById('allActivity');
    
    if (allActivity) {
        allActivity.classList.add('visible'); // Slide out to hide
    }
}




function hideActivity(){
    const allActivity = document.getElementById('allActivity');
    
    if (allActivity) {
        allActivity.classList.remove('visible'); // Slide in to show
    }
}

function hideAttnRecord(){
    const allActivity = document.getElementById('allAttnRecord');
    
    if (allActivity) {
        allActivity.classList.remove('visible'); // Slide in to show
    }
}

function showAttnRecord(){
    const allActivity = document.getElementById('allAttnRecord');
    
    if (allActivity) {
        allActivity.classList.add('visible'); // Slide out to hide
    }
}




function findHoliday(attrecord) {
    //console.log("Function running: findHoliday");

    // Retrieve and parse the active ticket data from localStorage
    const activeTicket = JSON.parse(localStorage.getItem('receiveData'));

    if (!activeTicket) {
        console.error("No active ticket found.");
        return;
    }

    // Extract token and userId from the activeTicket object
    const tktuserToken = activeTicket.token;
    const tktuserId = activeTicket.userId;

    //console.log("Token:", tktuserToken);
    //console.log("UserId:", tktuserId);

    // Create data object to send to the backend, with action included
    const data = new URLSearchParams();
    data.append('action', 'findHoliday');
    data.append('token', tktuserToken);
    data.append('userId', tktuserId);

    //console.log('Data being sent from findHoliday:', data.toString());

    // Fetch config.json to get script URL
    fetch('/TFC-Connect/App/config.json')
        .then(response => {
            if (!response.ok) {
                throw new Error(`Failed to load config.json, status: ${response.status}`);
            }
            return response.json();
        })
        .then(config => {
            if (!config.scriptUrl) {
                throw new Error("scriptUrl not found in config.json");
            }

            // Make the POST request to the App Script endpoint
            return fetch(config.scriptUrl, {
                method: 'POST',
                headers: { 'Content-Type': 'application/x-www-form-urlencoded' },
                body: data
            });
        })
        .then(response => {
            if (!response.ok) {
                throw new Error(`Server error: ${response.status}`);
            }
            return response.json();
        })
        .then(result => {
            //console.log("Server response findHoliday:", result);
            createCalendarFromSpan(attrecord, result.holidays);
            updateHoliday( result.holidays );
            generateDates(attrecord, result.holidays);
            chkInOutRcd(attrecord);
        })
        .catch(error => {
            console.error("Error in findHoliday:", error);
        });
}


function updateHoliday( response) {
    if (!response) {
        console.error("❌ updateHoliday: Received undefined or null response");
        return;
    }

    //console.log("📌 Received Data response updateHoliday:", response);
    
    // Extract the target month and year from the span element
    const targetMonthYear = document.getElementById("ttl-mnt-cnt").textContent.trim().toUpperCase();
    //console.log("🎯 Target Month-Year:", targetMonthYear);
    
    // Convert target month-year format to proper format (MMM YYYY)
    const [targetMonth, targetYear] = targetMonthYear.split(" ");
    
    // Define mapping for months
    const monthMapping = {
        "JAN": 0, "FEB": 1, "MAR": 2, "APR": 3, "MAY": 4, "JUN": 5, 
        "JUL": 6, "AUG": 7, "SEP": 8, "OCT": 9, "NOV": 10, "DEC": 11
    };
    
    if (!(targetMonth in monthMapping)) {
        console.error("❌ Invalid target month format.");
        return;
    }
    
    const targetMonthNum = monthMapping[targetMonth];
    
    // Filter the response data based on the target month and year, and exclude entries where column 3 is 'Yes' or 'yes'
    const filteredEntries = response.filter(entry => {
        const entryDate = new Date(entry[0]); // Convert ISO date to Date object
        const workingStatus = entry[2].trim().toLowerCase(); // Normalize case
        return (
            entryDate.getMonth() === targetMonthNum &&
            entryDate.getFullYear().toString() === targetYear &&
            workingStatus !== 'yes' // Exclude if column 3 has 'Yes' (case insensitive)
        );
    });
    
    // Format count as 00 Days
    const formattedCount = filteredEntries.length.toString().padStart(2, '0');
    
    // Update the count in the holiday-count element with 'Days' suffix
    document.getElementById("holiday-count").textContent = `${formattedCount} Days`;
    //console.log("✅ Number of holidays updated:", formattedCount);
    
    // Get total days count from ttl-mnth-day
    const totalDays = parseInt(document.getElementById("ttl-mnth-day").textContent.trim(), 10);
    const holidayCount = parseInt(formattedCount, 10);
    
    // Calculate working days
    const workingDays = totalDays - holidayCount;
    const formattedWorkingDays = workingDays.toString().padStart(2, '0');
    
    // Update working days count
    document.getElementById("Working-count").textContent = `${formattedWorkingDays} Days`;
    //console.log("✅ Number of working days updated:", formattedWorkingDays);
    

}




function markAttnDays(response) {
    //console.log("markAttnDays record", response);
    
    let presentCount = 0;
    let lateCount = 0;
    let holidayCount = 0;
    let absentCount = 0;
    
    // Get the selected month and year from the element
    let selectedMonthYear = document.getElementById("ttl-mnt-cnt").textContent.trim();
    let totalWorkingDays = parseInt(document.getElementById("Working-count").textContent) || 1;
    
    response.forEach(record => {
        // Convert response.Date to Indian Standard Time (IST) and 'MMM YYYY' format
        let dateObj = new Date(record.Date);
        let istDateObj = new Date(dateObj.toLocaleString("en-US", {timeZone: "Asia/Kolkata"}));
        let formattedDate = istDateObj.toLocaleString('en-US', { month: 'short', year: 'numeric' }).toUpperCase();
        
        if (formattedDate === selectedMonthYear) {
            let mark = record.Mark.toUpperCase(); // Convert to uppercase to handle both cases
            switch (mark) {
                case "P":
                    presentCount++;
                    break;
                case "L":
                    lateCount++;
                    break;
                case "H":
                    holidayCount++;
                    break;
                case "A":
                    absentCount++;
                    break;
            }
        }
    });
    
    document.getElementById("ttl_prsnt").textContent = presentCount.toString().padStart(2, '0') + " Days";
    document.getElementById("ttl_late").textContent = lateCount.toString().padStart(2, '0') + " Days";
    document.getElementById("ttl_hday").textContent = holidayCount.toString().padStart(2, '0') + " Days";
    document.getElementById("ttl_absnt").textContent = absentCount.toString().padStart(2, '0') + " Days";
    
    // Calculate total attendance days (P + L + H)
    let totalAttendanceDays = presentCount + lateCount + holidayCount;
    let attendancePercent = totalWorkingDays > 0 ? Math.min((totalAttendanceDays / totalWorkingDays) * 100, 100) : 0;
    
    updateProgress(Math.round(attendancePercent));
    
    // Ensure percentages don't exceed 100%
    let presentPercent = totalWorkingDays > 0 ? Math.min((presentCount / totalWorkingDays) * 100, 100) : 0;
    let latePercent = totalWorkingDays > 0 ? Math.min((lateCount / totalWorkingDays) * 100, 100) : 0;
    let holidayPercent = totalWorkingDays > 0 ? Math.min((holidayCount / totalWorkingDays) * 100, 100) : 0;
    let absentPercent = totalWorkingDays > 0 ? Math.min((absentCount / totalWorkingDays) * 100, 100) : 0;
    
    // Store last known percentages to avoid fluctuations
    if (!window.lastPercentages) {
        window.lastPercentages = { present: 0, late: 0, holiday: 0, absent: 0 };
    }
    
    // Update progress bars and segments only if values change
    if (window.lastPercentages.present !== presentPercent) {
        updateBar(0, presentPercent, '#31e774'); // Green for present
        setSegmentPercentage(0, presentPercent);
        window.lastPercentages.present = presentPercent;
    }
    if (window.lastPercentages.late !== latePercent) {
        updateBar(1, latePercent, '#ffd606'); // Yellow for late
        setSegmentPercentage(1, latePercent);
        window.lastPercentages.late = latePercent;
    }
    if (window.lastPercentages.holiday !== holidayPercent) {
        updateBar(2, holidayPercent, '#ffa033'); // Orange for holiday
        setSegmentPercentage(2, holidayPercent);
        window.lastPercentages.holiday = holidayPercent;
    }
    if (window.lastPercentages.absent !== absentPercent) {
        updateBar(3, absentPercent, '#ff4000'); // Red for absent
        setSegmentPercentage(3, absentPercent);
        window.lastPercentages.absent = absentPercent;
    }
}



function chkInOutRcd(attrecord) {
    console.log("Updated attrecord by chkInOutRcd", attrecord);

    // Function to format the date from 'yyyy-mm-dd' to 'dd mmm yy'
    function formatDate(dateString) {
        if (!dateString) return '----';  // If the date is null or undefined
        const options = { day: '2-digit', month: 'short', year: '2-digit' };
        const date = new Date(dateString);
        return date.toLocaleDateString('en-GB', options);
    }

    // Function to convert the time (e.g., '1899-12-29T20:43:50.000Z') to 'hh:mm am/pm'
    function formatTime(timeString) {
        if (!timeString) return '----';  // If the time is null or undefined
        const time = new Date(timeString);
        let hours = time.getHours();
        let minutes = time.getMinutes();
        const ampm = hours >= 12 ? 'pm' : 'am';

        hours = hours % 12;
        hours = hours ? hours : 12; // the hour '0' should be '12'
        minutes = minutes < 10 ? '0' + minutes : minutes;

        return `${hours}:${minutes} ${ampm}`;
    }

    // Get the month and year from the month-display element
    const monthYearString = document.getElementById('month-display').innerText;
    const [monthName, year] = monthYearString.split(' ');  // Extract "March" and "2025"

    // Convert month name to number (e.g., "March" => 3)
    const monthNumber = new Date(`${monthName} 1, ${year}`).getMonth() + 1;

    // Sort the records in descending order based on Date
    attrecord.sort((a, b) => new Date(b.Date) - new Date(a.Date));  // Sort by Date in descending order

    // Find the container div for monthly display and clear its contents
    const container = document.querySelector('#tbl-bdy-cnt');
    container.innerHTML = ''; // Clear existing records

    // Loop through each attendance record and filter based on the month and year
    let count = 0;  // To limit the number of entries to 4
    attrecord.forEach(record => {
        const recordDate = new Date(record.Date);
        const recordMonth = recordDate.getMonth() + 1; // Get month number (1-12)
        const recordYear = recordDate.getFullYear(); // Get full year (e.g., 2025)

        // Filter records based on the month and year displayed in month-display
        if (recordMonth === monthNumber && recordYear === parseInt(year)) {
            if (count >= 4) return; // Stop adding records after 4 entries

            // Format the Date, Check_in_time, Check_out_time, and Image URL
            const formattedDate = formatDate(record.Date);
            const formattedCheckInTime = formatTime(record.Check_in_time);
            const formattedCheckOutTime = formatTime(record.Check_out_time);
            const imageId = record.Image ? record.Image.split('/d/')[1].split('/view')[0] : '';
            const formattedImageUrl = imageId ? `https://lh3.googleusercontent.com/d/${imageId}` : '';

            // Create a new div for each record and append it to the container
            const divElement = document.createElement('div');
            divElement.className = "t-data-row tb-rw-shd-frt td-ex-pol-thd-cont tbl-bdy-rw-frt flex-row";

            divElement.innerHTML = `
              <p class="entry-date cusName ex-td-nam-frm p-styling td-ex-tbl-hd-frt">${formattedDate}</p>
              <p class="entry-checkin cusContact ex-td-cnt-frm p-styling td-ex-tbl-hd-frt">${formattedCheckInTime}</p>
              <p class="entry-checkout cusPremium ex-td-prm-frm p-styling td-ex-tbl-hd-frt">${formattedCheckOutTime}</p>
              <p class="entry-status cusStatus ex-td-sts-frm p-styling td-ex-tbl-hd-frt">${record.Status || '----'}</p>
              <p class="cusAction p-styling p-icn-wdth td-ex-tbl-hd-frt">
                <a href="${formattedImageUrl}" class="entry-image call-link" target="_blank">
                  <i class="fi fi-rr-copy-image flex"></i>
                </a>
              </p>
            `;

            // Append the new div to the container
            container.appendChild(divElement);

            count++; // Increment count
        }
    });

    // Start Date and End Date for filtering allAttnRecordList
    const startDateStr = document.getElementById('rcd-st-dt').innerText; // Format: 01 MAR 2025
    const endDateStr = document.getElementById('rcd-ed-dt').innerText;   // Format: 25 MAR 2025

    const startDate = new Date(`${startDateStr.split(' ')[0]} ${startDateStr.split(' ')[1]} ${startDateStr.split(' ')[2]}`);
    const endDate = new Date(`${endDateStr.split(' ')[0]} ${endDateStr.split(' ')[1]} ${endDateStr.split(' ')[2]}`);

    // Find the container for allAttnRecordList and clear its contents
    const allRecordsContainer = document.querySelector('#allAttnRecordList');
    allRecordsContainer.innerHTML = ''; // Clear existing records

    // Loop through each attendance record and filter based on the start and end date
    attrecord.forEach(record => {
        const recordDate = new Date(record.Date);

        // Check if the record date falls between start and end date
        if (recordDate >= startDate && recordDate <= endDate) {
            // Format the Date, Check_in_time, Check_out_time, and Image URL
            const formattedDate = formatDate(record.Date);
            const formattedCheckInTime = formatTime(record.Check_in_time);
            const formattedCheckOutTime = formatTime(record.Check_out_time);
            const imageId = record.Image ? record.Image.split('/d/')[1].split('/view')[0] : '';
            const formattedImageUrl = imageId ? `https://lh3.googleusercontent.com/d/${imageId}` : '';

            // Create a new div for each record and append it to the container
            const divElement = document.createElement('div');
            divElement.className = "t-data-row tb-rw-shd-frt td-ex-pol-thd-cont tbl-bdy-rw-frt flex-row";

            divElement.innerHTML = `
              <p class="entry-date cusName ex-td-nam-frm p-styling td-ex-tbl-hd-frt">${formattedDate}</p>
              <p class="entry-checkin cusContact ex-td-cnt-frm p-styling td-ex-tbl-hd-frt">${formattedCheckInTime}</p>
              <p class="entry-checkout cusPremium ex-td-prm-frm p-styling td-ex-tbl-hd-frt">${formattedCheckOutTime}</p>
              <p class="entry-status cusStatus ex-td-sts-frm p-styling td-ex-tbl-hd-frt">${record.Status || '----'}</p>
              <p class="cusAction p-styling p-icn-wdth td-ex-tbl-hd-frt">
                <a href="${formattedImageUrl}" class="entry-image call-link" target="_blank">
                  <i class="fi fi-rr-copy-image flex"></i>
                </a>
              </p>
            `;

            // Append the new div to the allAttnRecordList container
            allRecordsContainer.appendChild(divElement);
        }
    });

    // Add event listener for clicks on the image link in both containers
    const imageLinks = document.querySelectorAll('.entry-image');

    imageLinks.forEach(link => {
        link.addEventListener('click', function(event) {
            // Find the icon element inside the link
            const icon = link.querySelector('i');

            // Change the icon to the loading one
            icon.classList.remove('fi-rr-copy-image');
            icon.classList.add('fi-tr-loading', 'rotating-icon');

            // After 3 seconds, reset the icon to the original
            setTimeout(() => {
                icon.classList.remove('fi-tr-loading', 'rotating-icon');
                icon.classList.add('fi-rr-copy-image');
            }, 3000); // 3 seconds
        });
    });
}
