document.addEventListener('DOMContentLoaded', () => {

  document.getElementById('backBtn').addEventListener('click', () => {
    window.history.back();
  });

  const storedTitle = localStorage.getItem('selectedTitle');
  const storedDate = localStorage.getItem('selectedDate');
  const storedPrice = localStorage.getItem('selectedPrice');

  if (storedTitle) {
    const selection = document.querySelector('.selection');
    const firstP = selection.children[0];
    firstP.textContent = storedTitle;
    document.getElementById('reservation_title').value = storedTitle;
  }

  if (storedDate && storedTitle) {
    const selectionDate = document.querySelector('.selected-date');
    const modalInfo = document.querySelector('.modal-info');
    const ModalFirstP = modalInfo.children[0];
    selectionDate.textContent = storedDate;
    ModalFirstP.textContent = storedTitle;
    document.getElementById('reservation_date').value = storedDate;
  }

  if (storedPrice && storedDate) {
    const paymentPrice = document.querySelector('.payment-price');
    const modalInfo = document.querySelector('.modal-info');
    const ModalSecondP = modalInfo.children[1];
    paymentPrice.textContent = storedPrice + ".00";
    ModalSecondP.textContent = storedDate;
    document.getElementById('reservation_price').value = storedPrice;
  }

  const bookingInfo = document.querySelector('.booking-info');
  const openBtn = document.querySelector('.booking-open');
  const closeBtn = document.querySelector('.booking-close');

  openBtn.addEventListener('click', () => {
    bookingInfo.classList.add('open');
    openBtn.style.display = "none";
    closeBtn.style.display = "block";
    document.querySelector('.client-section').style.height = "80vh";
  });

  closeBtn.addEventListener('click', () => {
    bookingInfo.classList.remove('open');
    closeBtn.style.display = "none";
    openBtn.style.display = "block";
    document.querySelector('.client-section').style.height = "70vh";
  });


  const nameInput = document.getElementById('name');
  const emailInput = document.getElementById('email');
  const phoneInput = document.getElementById('phone');

  const nameError = document.getElementById('nameError');
  const emailError = document.getElementById('emailError');
  const phoneError = document.getElementById('phoneError');

  function liveValidate(input, regex, errorElement, errorMsg) {
    input.addEventListener('input', () => {
      input.style.boxShadow = "none";
      const isValid = regex.test(input.value.trim());
      errorElement.textContent = isValid ? '' : errorMsg;
      input.classList.toggle('input-error', !isValid);
    });
  }
  
  liveValidate(nameInput, /^[A-Za-z\s]{2,}$/, nameError, 'Name must be at least 2 characters');
  liveValidate(emailInput, /^[^\s@]+@[^\s@]+\.[^\s@]+$/, emailError, 'Invalid email format');
  liveValidate(phoneInput, /^\+?[0-9]{10,15}$/, phoneError, 'Phone must be 10-15 digits');

  if (localStorage.getItem('userName')) nameInput.value = localStorage.getItem('userName');
  if (localStorage.getItem('userEmail')) emailInput.value = localStorage.getItem('userEmail');
  if (localStorage.getItem('userPhone')) phoneInput.value = localStorage.getItem('userPhone');

  const detailsModal = document.getElementById('details-modal');
  const detailsModalOverlay = document.querySelector('.details-modal-overlay');
  const closeModalBtn = document.querySelector('.modal-header svg');
  const viewCartButton = document.querySelector('.view-cart');

  if (closeModalBtn) {
    closeModalBtn.addEventListener('click', () => {
      detailsModal.classList.remove('active');
      detailsModalOverlay.classList.remove('active')
    });
  }

  if (detailsModalOverlay) {
    detailsModalOverlay.addEventListener('click', () => {
      detailsModal.classList.remove('active');
      detailsModalOverlay.classList.remove('active');
    });
  }

  viewCartButton.addEventListener('click', () => {
    localStorage.setItem('showCart', 'true');
    window.location.href = 'cart-page.html';
  });

  document.querySelector('.continue-browsing').addEventListener('click', () => {
    window.location.href = 'reservations.html';
  })


  const reservationForm = document.getElementById("userForm");
  const bookNowBtn = document.querySelector('.book-btn');

  bookNowBtn.addEventListener('click', (e) => {
    e.preventDefault();
    
    const name = nameInput.value.trim();
    const email = emailInput.value.trim();
    const phone = phoneInput.value.trim();

    let errors = [];

    if (name === "" || !/^[A-Za-z\s]{2,}$/.test(name)) {
      errors.push("Please enter a valid name (at least 2 characters)");
      nameError.textContent = "Name is required";
      nameInput.classList.add('input-error');
    }

    const emailPattern = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailPattern.test(email)) {
      errors.push("Invalid email address");
      emailError.textContent = "Invalid email format";
      emailInput.classList.add('input-error');
    }

    const phonePattern = /^\+?[0-9]{10,15}$/;
    if (!phonePattern.test(phone)) {
      errors.push("Phone must be 10 to 15 digits");
      phoneError.textContent = "Invalid phone number";
      phoneInput.classList.add('input-error');
    }

    if (!storedTitle || !storedDate || !storedPrice) {
      errors.push("Reservation details are missing");
    }

    if (errors.length > 0) {
      alert(errors.join("\n"));
      return;
    }

    localStorage.setItem('userName', name);
    localStorage.setItem('userEmail', email);
    localStorage.setItem('userPhone', phone);

    bookNowBtn.disabled = true;
    bookNowBtn.textContent = 'Processing...';

    const formData = new FormData(reservationForm);

    fetch('backend/submit_reservation.php', {
      method: 'POST',
      body: formData
    })
    .then(response => response.text())
    .then(data => {
      if (data.includes('Success')) {
        alert('Reservation confirmed! Check your email for details.');
        
        localStorage.removeItem('selectedTitle');
        localStorage.removeItem('selectedDate');
        localStorage.removeItem('selectedPrice');
        
        window.location.href = 'reservations.html';
      } else if (data.includes('already booked')) {
        alert('Sorry, this time slot is already booked. Please choose another time.');
      } else {
        alert('Error: ' + data);
      }
    })
    .catch(error => {
      console.error('Error:', error);
      alert('An error occurred. Please try again.');
    })
    .finally(() => {
      bookNowBtn.disabled = false;
      bookNowBtn.textContent = 'Book Now';
    });
  });

});