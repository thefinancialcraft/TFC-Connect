// Function to generate dates

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
      atnBox.classList.add("atn-bx", "flex-coloum");
  
      // Add 'bx-anm' class to the first div only
      if (i === 0) {
        atnBox.classList.add("bx-anm");
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
          width: 10px;
          height: 3px;
          background-color: ${colors[colorIndex]};
          border-radius: 4px;
          margin-top: -2px;
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
  
  // Start camera function
  function startCamera() {
      if (!navigator.mediaDevices || !navigator.mediaDevices.getUserMedia) {
          console.error("getUserMedia is not supported in your browser.");
          alert("Your browser does not support camera access. Please try using a modern browser like Chrome, Firefox, or Safari.");
          return;
      }
  
      // Try to access the camera
      navigator.mediaDevices.getUserMedia({
          video: {
              width: 1920,  // Increase resolution for a wider field of view
              height: 1080  // Adjust height accordingly
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
  
  // Stop the camera and take a snapshot when the #cam-stp button is clicked
  document.getElementById('cam-stp').addEventListener('click', () => {
      if (videoElement && mediaStream) {
          // Capture a snapshot from the video
          const canvas = document.createElement('canvas');
          canvas.width = videoElement.videoWidth;  // Set canvas width to video width
          canvas.height = videoElement.videoHeight;  // Set canvas height to video height
          const ctx = canvas.getContext('2d');
          ctx.drawImage(videoElement, 0, 0, canvas.width, canvas.height);  // Draw the current frame of the video onto the canvas
  
          // Convert the canvas to an image (base64 format)
          const snapshot = canvas.toDataURL('image/png');
          
          // Display the snapshot image
          const snapshotImage = document.getElementById('snapshotImage');
          snapshotImage.src = snapshot; // Set the src of the snapshot image
          snapshotImage.style.display = 'block';
          snapshotImage.style.width = '100%';
          snapshotImage.style.height = '100%';
          snapshotImage.style.objectFit = 'cover';
          snapshotImage.style.transform = 'scaleX(-1)'; // Show the snapshot image
          
          // Stop the video and hide the video element
          videoElement.pause();  // Pause the video
          videoElement.srcObject = null;  // Disconnect the video stream
          videoElement.style.display = 'none'; // Hide the video element
  
          // Optionally stop the camera tracks
          mediaStream.getTracks().forEach(track => track.stop());  // Stop all media tracks
  
          // Hide the camCancel button and show the bcToDash and SnapWhts buttons
          document.getElementById('cam-stp').style.display = 'none';
          document.getElementById('camCancel').style.display = 'none';
          document.getElementById('bcToDash').style.display = 'block';
          document.getElementById('SnapWhts').style.display = 'block';
  
          // alert('Camera stopped and snapshot taken!');
      } else {
          // alert("No active camera stream found.");
      }
  });
  
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
  
      // Redirect to WhatsApp (can replace with specific link or action)
      window.location.href = "https://wa.me/"; // Redirect to WhatsApp (you can customize the link)
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
          startCamera();
      } else {
          slider.style.left = '0px'; // Snap back to the left
          sliderText.classList.remove('wait-animate'); // Remove animation
          sliderText.textContent = 'Check In'; // Reset the text
          checkinCont.style.display = "flex";
          actionCont.style.display = "none";
          camCont.style.display = "none";
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
