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
  