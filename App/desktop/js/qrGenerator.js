document.querySelectorAll('.notHome').forEach(function (element) {
    element.addEventListener('click', function () {
      document.querySelector('.construction-disp').style.display = 'block'; // Show construction-disp
      document.querySelector('.misc-info').style.display = 'none'; // Hide misc-info
    });
  });
  
  document.querySelectorAll('.home').forEach(function (element) {
    element.addEventListener('click', function () {
      document.querySelector('.construction-disp').style.display = 'none'; // Hide construction-disp
      document.querySelector('.misc-info').style.display = 'flex'; // Show misc-info
    });
  });
  

  let countdownInterval; // To store the countdown timer interval reference
  const countdownDuration = 120; // Countdown duration in seconds (1 minute)
  
  function generateQRCode() {
      const extSystemIdElement = document.getElementById('extSystemId');
      const extAsignUserElement = document.getElementById('extAsignUser');
      const qrTimeElement = document.querySelector('.qr-time'); // Select the element with class "qr-time"
  
      // Check if the elements exist before accessing their text content
      if (!extSystemIdElement || !extAsignUserElement) {
          console.error('Required elements not found.');
          return;
      }
  
      const extSystemId = extSystemIdElement.textContent.trim(); // Use textContent for <p> tags
      const extAsignUser = extAsignUserElement.textContent.trim(); // Use textContent for <p> tags
  
      // Check if both fields are filled
      if (extSystemId === '' || extAsignUser === '') {
          return; // Exit function if fields are not filled
      }
  
      const currentDate = new Date();
      const day = currentDate.getDate().toString().padStart(2, '0'); // Ensure two digits
      const month = (currentDate.getMonth() + 1).toString().padStart(2, '0'); // Ensure two digits
  
      const dateFormatted = day + month; // DDMM format
  
      const userIdLastThree = extAsignUser.slice(-3); // Get last 3 digits of extAsignUser
  
      // Get Indian Time (IST)
      const indianTime = new Date(currentDate.toLocaleString('en-US', { timeZone: 'Asia/Kolkata' }));
      const hours = indianTime.getHours().toString().padStart(2, '0'); // Ensure two digits
      const minutes = indianTime.getMinutes().toString().padStart(2, '0'); // Ensure two digits
      const seconds = indianTime.getSeconds().toString().padStart(2, '0'); // Ensure two digits
  
      const timeFormatted = hours + minutes + seconds; // HHMMSS format
  
      const qrInput = `TFC${dateFormatted}${extSystemId}${userIdLastThree}${timeFormatted}QR`;
      const qrCodeContainer = document.getElementById('qrCodeContainer');
  
      // Clear previous QR code if exists
      qrCodeContainer.innerHTML = '';
  
      // Generate QR code
      QRCode.toCanvas(qrInput, { width: 200 }, (error, canvas) => {
          if (error) {
              console.error(error);
              alert('Failed to generate QR code!');
              return;
          }
          qrCodeContainer.appendChild(canvas);
  
          // Reset and start the countdown
          if (qrTimeElement) {
              clearInterval(countdownInterval); // Clear any existing countdown
              startCountdown(qrTimeElement); // Start a new countdown
          }
      });
  }
  
  function startCountdown(qrTimeElement) {
      let timeLeft = countdownDuration; // Initialize time left
  
      // Update the countdown every second
      countdownInterval = setInterval(() => {
          if (timeLeft <= 0) {
              clearInterval(countdownInterval); // Stop the countdown when it reaches 0
              qrTimeElement.textContent = 'Generating new QR...';
          } else {
              timeLeft--;
              const minutes = Math.floor(timeLeft / 60).toString().padStart(2, '0');
              const seconds = (timeLeft % 60).toString().padStart(2, '0');
              qrTimeElement.textContent = `Next QR: ${minutes}:${seconds}`;
          }
      }, 1000);
  }
  
  // Check every 1 second (1000 milliseconds) for initial field values
  const checkInterval = setInterval(() => {
      const extSystemIdElement = document.getElementById('extSystemId');
      const extAsignUserElement = document.getElementById('extAsignUser');
  
      // Check if the elements exist before accessing their text content
      if (!extSystemIdElement || !extAsignUserElement) {
          console.error('Required elements not found.');
          return;
      }
  
      const extSystemId = extSystemIdElement.textContent.trim(); // Use textContent for <p> tags
      const extAsignUser = extAsignUserElement.textContent.trim(); // Use textContent for <p> tags
  
      // Run function only when both fields are filled
      if (extSystemId !== '' && extAsignUser !== '') {
          generateQRCode();
  
          // Clear the initial interval check
          clearInterval(checkInterval);
  
          // Start generating QR codes every 1 minute (60000 milliseconds)
          setInterval(() => {
              generateQRCode();
          }, 120000); // 1 minute
      }
  }, 1000); // 1 second in milliseconds
  