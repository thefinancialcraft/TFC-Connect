// Function to generate dates
function generateDates() {
  const dateContainer = document.getElementById("dateContainer");
  const today = new Date();

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

      // Append to container
      dateContainer.appendChild(atnBox);
  }
}

// Call the function
generateDates();

const slider = document.getElementById('slider');
const checkinCont = document.getElementById('chknBtn');
const actionCont = document.getElementById('actBtn');
const sliderText = document.getElementById('sliderText');
const switchContainer = document.querySelector('.atn-switch');

let isTouching = false;
let startX = 0;
let sliderLeft = 0;

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
    } else {
        slider.style.left = '0px'; // Snap back to the left
        // sliderText.textContent = 'Check In ';
        sliderText.classList.remove('wait-animate'); // Remove animation
        checkinCont.style.display = "flex";
        actionCont.style.display = "none";
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
