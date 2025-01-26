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
  

  function generateQRCode() {
    const extSystemId = document.getElementById('extSystemId').value;
    const extAsignUser = document.getElementById('extAsignUser').value;

    const currentDate = new Date();
    const day = currentDate.getDate().toString().padStart(2, '0'); // Ensure two digits
    const month = (currentDate.getMonth() + 1).toString().padStart(2, '0'); // Ensure two digits

    const dateFormatted = day + month; // DDMM format

    if (extSystemId.trim() === '' || extAsignUser.trim() === '') {
        alert('userId and system id missing.');
        return;
    }

    const userIdLastThree = extAsignUser.slice(-3); // Get last 3 digits of extAsignUser

    // Get Indian Time (IST)
    const indianTime = new Date(currentDate.toLocaleString('en-US', { timeZone: 'Asia/Kolkata' }));
    const hours = indianTime.getHours().toString().padStart(2, '0'); // Ensure two digits
    const minutes = indianTime.getMinutes().toString().padStart(2, '0'); // Ensure two digits
    const seconds = indianTime.getSeconds().toString().padStart(2, '0'); // Ensure two digits

    const timeFormatted = hours + minutes + seconds; // HHMMSS format

    const qrInput = dateFormatted + extSystemId + userIdLastThree + timeFormatted;
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
    });
}

// Update QR code every 3 minutes (180,000 milliseconds)
setInterval(generateQRCode, 180000); // 3 minutes in milliseconds
