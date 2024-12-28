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
