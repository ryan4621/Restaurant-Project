// Load data from localStorage on page load
document.addEventListener('DOMContentLoaded', () => {

  document.getElementById('backBtn').addEventListener('click', () => {
    window.history.back();
  });
    
  const storedTitle = localStorage.getItem('selectedTitle');
  if (storedTitle) {
    const selection = document.querySelector('.selection');
    const firstP = selection.children[0];
    firstP.textContent = storedTitle;
    // document.getElementById('reservation_title').value = storedTitle || '';
  }

  const storedDate = localStorage.getItem('selectedDate');
  if (storedDate && storedTitle) {
    const selectionDate = document.querySelector('.selected-date');
    const modalInfo = document.querySelector('.modal-info');
    const ModalFirstP = modalInfo.children[0];
    selectionDate.textContent = storedDate;
    ModalFirstP.textContent = storedTitle;
    // document.getElementById('reservation_date').value = storedDate || '';
  }

  const storedPrice = localStorage.getItem('selectedPrice');
  if (storedPrice  && storedDate) {
    const paymentPrice = document.querySelector('.payment-price');
    const modalInfo = document.querySelector('.modal-info');
    const ModalSecondP = modalInfo.children[1];
    paymentPrice.textContent = storedPrice +".00";
    ModalSecondP.textContent = storedDate;
    // document.getElementById('reservation_price').value = storedPrice || '';
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

  function liveValidate(input, regex, errorElement) {
    input.addEventListener('input', () => {
      input.style.boxShadow = "none";

      const isValid = regex.test(input.value.trim());
      errorElement.textContent = isValid ? '' : errorElement.textContent;
      input.classList.toggle('input-error', !isValid);
    });
  }
  
  liveValidate(nameInput, /^[A-Za-z\s]{2,}$/, nameError);
  liveValidate(emailInput, /^[^\s@]+@[^\s@]+\.[^\s@]+$/, emailError);
  liveValidate(phoneInput, /^\+?[0-9]{7,15}$/, phoneError);    

  if (localStorage.getItem('userName')) nameInput.value = localStorage.getItem('userName');
  if (localStorage.getItem('userEmail')) emailInput.value = localStorage.getItem('userEmail');
  if (localStorage.getItem('userPhone')) phoneInput.value = localStorage.getItem('userPhone');

  // const addToCart =  document.querySelector('.add-btn');
  const modal = document.getElementById('modal');
  const overlay = document.querySelector('.overlay');

  const addToCartBtn = document.querySelector('.add-btn');
  const cartSection = document.querySelector('.cart-section');


  function formatToMySQLDate(dateStr) {
    const date = new Date(dateStr.replace(' at ', ' '));
    if (isNaN(date.getTime())) {
      console.error("Invalid date:", dateStr);
      return '';
    }

    const year = date.getFullYear();
    const month = String(date.getMonth() + 1).padStart(2, '0');
    const day = String(date.getDate()).padStart(2, '0');
    const hour = String(date.getHours()).padStart(2, '0');
    const minute = String(date.getMinutes()).padStart(2, '0');

    return `${year}-${month}-${day} ${hour}:${minute}:00`;
  }



  addToCartBtn.addEventListener('click', (e) => {
    e.preventDefault();

    //Form and modal control

    const nameRegex = /^[A-Za-z\s]{2,}$/;
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    const phoneRegex = /^\+?[0-9]{7,15}$/;

    const name = nameInput.value.trim();
    const email = emailInput.value.trim();
    const phone = phoneInput.value.trim();

    // Clear previous errors
    nameError.textContent = '';
    emailError.textContent = '';
    phoneError.textContent = '';

    let isValid = true;
    let firstInvalidInput = null;


    if (!nameRegex.test(name)) {
      nameError.textContent = 'Invalid name';
      nameInput.classList.add('input-error');
      if (!firstInvalidInput) firstInvalidInput = nameInput;
      isValid = false;
    } else {
      nameInput.classList.remove('input-error');
    }
    
    if (!emailRegex.test(email)) {
      emailError.textContent = 'Invalid email';
      emailInput.classList.add('input-error');
      emailInput.style.boxShadow = "none";
      if (!firstInvalidInput) firstInvalidInput = emailInput;
      isValid = false;
    } else {
      emailInput.classList.remove('input-error');
    }
    
    if (!phoneRegex.test(phone)) {
      phoneError.textContent = 'Invalid phone number';
      phoneInput.classList.add('input-error');
      if (!firstInvalidInput) firstInvalidInput = phoneInput;
      isValid = false;
    } else {
      phoneInput.classList.remove('input-error');
    }       

    if (!isValid) {
      firstInvalidInput.focus();
      return;
    }        

    localStorage.setItem('userName', name);
    localStorage.setItem('userEmail', email);
    localStorage.setItem('userPhone', phone);

    const title = localStorage.getItem('selectedTitle');
    const rawDate = localStorage.getItem('selectedDate');
    const price = localStorage.getItem('selectedPrice');

    document.getElementById('reservation_title').value = title || '';
    document.getElementById('reservation_price').value = price || '';

    const formattedDate = formatToMySQLDate(rawDate);
    document.getElementById('reservation_date').value = formattedDate || '';



    console.log("Title:", title);
    console.log("Raw Date:", rawDate);
    console.log("Price:", price);
    console.log("Formatted Date:", formattedDate);

    document.getElementById('userForm').submit();
  });

  const closeModalBtn = document.querySelector('.modal-header svg');
  const viewCartButton = document.querySelector('.view-cart');
  const closeCartBtn = document.querySelector('.close-cart');
  const cartIcon = document.querySelector('.cart-icon');

  function updateOverlayVisibility() {
    const isModalVisible = modal.style.display === "flex";
    const isCartVisible = cartSection.style.display === "block";
    overlay.style.display = (isModalVisible || isCartVisible) ? "block" : "none";
  }

  // Close modal
  if (closeModalBtn) {
    closeModalBtn.addEventListener('click', () => {
      modal.style.display = "none";
      updateOverlayVisibility();
    });
  }

  // Show cart
  viewCartButton.addEventListener('click', () => {
    localStorage.setItem('showCart', 'true');
    window.location.href = 'home.html';
  });  

  // Close cart
  closeCartBtn.addEventListener('click', () => {
    cartSection.style.display = "none";
    updateOverlayVisibility();
  });

  // Show cart via cart icon
  cartIcon.addEventListener('click', () => {
    cartSection.style.display = "block";
    updateOverlayVisibility();
    document.querySelector('.navigate').style.backgroundColor = 'rgba(41, 39, 39, 0.1)';
  });

  document.querySelector('.continue-browsing').addEventListener('click', () => {
    window.location.href = 'home.html';
  })

  // const reservationForm = document.getElementById("userForm");

  // reservationForm.addEventListener("submit", function (e) {
  //   const name = reservationForm.names.value.trim();
  //   const email = reservationForm.email.value.trim();
  //   const phone = reservationForm.phone.value.trim();
  //   const date = reservationForm.reservation_date.value.trim();
  //   const price = reservationForm.reservation_price.value.trim();

  //   let errors = [];

  //   if (name === "") {
  //       errors.push("Name is required.");
  //   }

  //   const emailPattern = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  //   if (!emailPattern.test(email)) {
  //       errors.push("Invalid email address.");
  //   }

  //   const phonePattern = /^[0-9]{10,15}$/;
  //   if (!phonePattern.test(phone)) {
  //       errors.push("Phone must be 10 to 15 digits.");
  //   }

  //   if (date === "") {
  //       errors.push("Date is required.");
  //   }

  //   if (price === "" || isNaN(price)) {
  //       errors.push("Price must be a number.");
  //   }

  //   if (errors.length > 0) {
  //       e.preventDefault();
  //       alert(errors.join("\n"));
  //   }
  // });

});