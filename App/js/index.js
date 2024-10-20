


        // hero image autoslider

        const slider = document.querySelector('.slider');
    const slides = document.querySelectorAll('.slide');
    const totalSlides = slides.length;
    let currentIndex = 0;
    let slideWidth = slides[0].offsetWidth; // Get the width of a single slide
    
    // Clone the first slide and append it at the end to create an infinite loop effect
    const firstClone = slides[0].cloneNode(true);
    slider.appendChild(firstClone);
    
    function moveSlider() {
        // Move the slider by adjusting translateX for one image at a time
        slider.style.transform = `translateX(${-currentIndex * slideWidth}px)`;
        slider.style.transition = 'transform 0.5s ease'; // Smooth transition
        
        // Reset to the first slide when the last one (clone) is reached
        if (currentIndex === totalSlides) {
            setTimeout(() => {
                slider.style.transition = 'none'; // Remove transition for instant jump
                currentIndex = 0;
                slider.style.transform = `translateX(0px)`; // Move to first slide
            }, 500); // 500ms delay to show the last slide before reset
        }
    }
    
    // Set an interval to slide every 3 seconds
    setInterval(() => {
        currentIndex++;
        moveSlider();
    }, 3000); // Adjust the 3000ms for how long each image shows

    window.addEventListener('resize', () => {
        // Update the slide width on window resize
        slideWidth = slides[0].offsetWidth;
    });

        // JavaScript to handle showing/hiding forms
        const forgotIdContainer = document.getElementById('forgot-id-container');
        const loginContainer = document.getElementById('login-container');
        const loginContaineremail = document.getElementById('login-container-email');
        const forgotPasswordContainer = document.getElementById('forgot-password-container');

        document.getElementById('forgot-id-link').addEventListener('click', function() {
            loginContainer.style.display = 'none';
            forgotIdContainer.style.display = 'flex';
            resetId();
            
        });

       

        document.getElementById('forgot-password-link').addEventListener('click', function() {
            loginContainer.style.display = 'none';
            forgotPasswordContainer.style.display = 'flex';
            resetPassword();
        });

        document.getElementById('forgot-password-link2').addEventListener('click', function() {
            loginContaineremail.style.display = 'none';
            forgotPasswordContainer.style.display = 'flex';
            resetPassword();
        });


  



        document.getElementById('back-to-login').addEventListener('click', function() {
            forgotIdContainer.style.display = 'none';
            loginContainer.style.display = 'flex';
        });

        document.getElementById('back-to-login-password').addEventListener('click', function() {
            forgotPasswordContainer.style.display = 'none';
            loginContainer.style.display = 'flex';
        });

        

        // Initially show the login container
        loginContainer.style.display = 'flex';




    // hero button slider
    
    const sliderContainer = document.querySelector('.slider-container');
let isSwiped = false;
let startX;
let currentTranslateX = 0;

// Get references to the hero-container and form-container elements
const heroContainer = document.querySelector('.hero-container');
const formContainer = document.querySelector('.form-container');

sliderContainer.addEventListener('touchstart', (e) => {
    startX = e.touches[0].clientX; // Finger ka starting position
    currentTranslateX = parseInt(sliderContainer.style.transform.replace('translateX(', '').replace('px)', '')) || 0; // Current position ko track karein
});

sliderContainer.addEventListener('touchmove', (e) => {
    const currentX = e.touches[0].clientX; // Current position
    const deltaX = currentX - startX; // Swipe distance

    if (!isSwiped) {
        // Swipe ko move karein, limit karein to frame ke andar
        const newTranslateX = currentTranslateX + deltaX;
        sliderContainer.style.transform = `translateX(${Math.max(0, Math.min(newTranslateX, 230))}px)`; // 0 se 300px ke beech
    }
});

sliderContainer.addEventListener('touchend', () => {
    const translateValue = parseInt(sliderContainer.style.transform.replace('translateX(', '').replace('px)', ''));

    // Check if the button is swiped more than half
    if (translateValue > 150) {
        sliderContainer.style.transform = 'translateX(240px)'; // Move to the end if swiped more than half
        isSwiped = true;

        // Hide hero-container and show form-container
        heroContainer.style.display = 'none'; // Hide hero container
        formContainer.style.display = 'flex'; // Show form container

    } else {
        sliderContainer.style.transform = 'translateX(0)'; // Return to original position
        isSwiped = false;
    }
});


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
        


    function submitPassOtp(){
    document.getElementById("pass-otp-verify-form").style.display = "none";
    document.getElementById("upd-pass-form").style.display = "flex";
    document.getElementById("hero2").style.display = "none";
    document.getElementById("hero3").style.display = "flex";
    }

    function submitIdOtp(){
    document.getElementById("id-otp-verify-form").style.display = "none";
    document.getElementById("findId").style.display = "flex";
    document.getElementById("hero2").style.display = "none";
    document.getElementById("hero4").style.display = "flex";
    }

    function resetId(){
        document.getElementById("slider").style.display = "none";
    document.getElementById("hero2").style.display = "flex";
    document.getElementById("findId").style.display = "none";

    }

    function resetPassword(){
    document.getElementById("slider").style.display = "none";
    document.getElementById("hero2").style.display = "flex";
    }


    function loginEmail(){
    document.getElementById("login-container").style.display = "none";
    document.getElementById("login-container-email").style.display = "flex";
    }

    function loginUserid(){
    document.getElementById("login-container").style.display = "flex";
    document.getElementById("login-container-email").style.display = "none";
    }

    function backtologin(){
    document.getElementById("pass-otp-verify-form").style.display = "flex";
    document.getElementById("upd-pass-form").style.display = "none";
    document.getElementById("slider").style.display = "flex";
    document.getElementById("hero2").style.display = "none";
    document.getElementById("hero3").style.display = "none";
    document.getElementById("findId").style.display = "none";
    document.getElementById("id-otp-verify-form").style.display = "flex";
    }


    // Assuming this code is part of your form submission function

function submitForm(event) {
    event.preventDefault(); // Prevent default form submission
    const formData = new FormData(event.target);
    const data = {};
    formData.forEach((value, key) => {
        data[key] = value;
    });

    fetch('https://script.google.com/macros/s/AKfycbwirPyufQu-oKZWjTj_T9k-SfXCckuBvdCMLNlDUNpBv-HbuFwyeVixl_xd6ArukjNh/exec', {
        method: 'POST',
        body: new URLSearchParams(data)
    })
    .then(response => {
        // Check if the response is actually JSON
        if (response.headers.get('content-type')?.includes('application/json')) {
            return response.json();
        } else {
            throw new Error("Invalid JSON response");
        }
    })
    .then(result => {
        if (result.status === 'success') {
            // Construct the URL based on the userType
            const userType = result.userType.toLowerCase(); // Ensure the userType is in lowercase
            const validUserTypes = ['user', 'admin', 'agent']; // Define valid user types
            
            // Check if the userType is valid
            if (validUserTypes.includes(userType)) {
                window.location.href = `html/${userType}.html`; // Redirect dynamically
            } else {
                document.getElementById('error-message').innerText = 'Unexpected user type.';
            }
        } else {
            // Display error message
            document.getElementById('error-message').innerText = result.message;
        }
    })
    .catch(error => {
        console.error('Error:', error);
        document.getElementById('error-message').innerText = 'An error occurred';
    });
}





    