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
  }

  const storedDate = localStorage.getItem('selectedDate');
  if (storedDate && storedTitle) {
    const selectionDate = document.querySelector('.selected-date');
    const modalInfo = document.querySelector('.modal-info');
    const ModalFirstP = modalInfo.children[0];
    selectionDate.textContent = storedDate;
    ModalFirstP.textContent = storedTitle;
  }

  const storedPrice = localStorage.getItem('selectedPrice');
  if (storedPrice  && storedDate) {
    const paymentPrice = document.querySelector('.payment-price');
    const modalInfo = document.querySelector('.modal-info');
    const ModalSecondP = modalInfo.children[1];
    paymentPrice.textContent = storedPrice +".00";
    ModalSecondP.textContent = storedDate;
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

  // const detailsModal = document.getElementById('details-modal');
  // const detailsModalOverlay = document.querySelector('.details-modal-overlay');

  // function formatToMySQLDate(dateStr) {
  //   const date = new Date(dateStr.replace(' at ', ' '));
  //   if (isNaN(date.getTime())) {
  //     console.error("Invalid date:", dateStr);
  //     return '';
  //   }

  //   const year = date.getFullYear();
  //   const month = String(date.getMonth() + 1).padStart(2, '0');
  //   const day = String(date.getDate()).padStart(2, '0');
  //   const hour = String(date.getHours()).padStart(2, '0');
  //   const minute = String(date.getMinutes()).padStart(2, '0');

  //   return `${year}-${month}-${day} ${hour}:${minute}:00`;
  // }

  // const addToCartBtn = document.querySelector('.add-btn');
  // if (addToCartBtn) {
  //   addToCartBtn.addEventListener('click', () => {
  //     console.log('Clicked!!!')
  //     const title = localStorage.getItem('selectedTitle');
  //     const date = localStorage.getItem('selectedDate');
  //     const price = localStorage.getItem('selectedPrice');

  //     if (!title || !date || !price) {
  //       alert('Missing item details.');
  //       return;
  //     }

  //     const cart = JSON.parse(localStorage.getItem('cart')) || [];
  //     const exists = cart.some(item => item.title === title && item.date === date);
      
  //     if (exists) {
  //       alert('This item has already been added to your cart.');
  //       return;
  //     }

  //     cart.push({ title, date, price });
  //     localStorage.setItem('cart', JSON.stringify(cart));
  //     // renderCartItems();
      
  //     detailsModal.classList.add('active')
  //     detailsModalOverlay.classList.add('active');
  //     document.body.classList.add('sidebar-open');
  //   });
  // }

  const detailsModal = document.getElementById('details-modal');
  const detailsModalOverlay = document.querySelector('.details-modal-overlay');
  
  const addToCartBtn = document.querySelector('.add-btn');
  const cartSection = document.querySelector('.cart-section');
  const cartContainer = document.createElement('div');
  cartContainer.classList.add('cart-items');
  cartSection.appendChild(cartContainer);

  const cartCount = cartSection.querySelector('.cart-name p:nth-child(2)');
  const emptyMessage = cartSection.querySelector('.empty-cart');

  if(addToCartBtn){
    addToCartBtn.addEventListener('click', () => {

      const title = localStorage.getItem('selectedTitle');
      const date = localStorage.getItem('selectedDate');
      const price = localStorage.getItem('selectedPrice');
  
      if (!title || !date || !price) {
        alert('Missing item details.');
        return;
      }
  
      const cart = JSON.parse(localStorage.getItem('cart')) || [];
  
      const exists = cart.some(item => item.title === title && item.date === date);
      if (exists) {
        detailsModal.style.display =  "none";
        detailsModalOverlay.style.display = "none";
        alert('This item has already been added to your cart.');
        return;
      }else{
        detailsModal.style.display = "flex";
        detailsModalOverlay.style.display = "block";
      }
  
      cart.push({ title, date, price });
      localStorage.setItem('cart', JSON.stringify(cart));
  
      renderCartItems();
      updateCartTotal();
    });
  }

  function renderCartItems() {
    const cart = JSON.parse(localStorage.getItem('cart')) || [];
    cartContainer.innerHTML = '';

    if (cart.length === 0) {
      emptyMessage.style.display = 'block';
      cartCount.textContent = '(0 items)';
      return;
    }

    emptyMessage.style.display = 'none';
    cartCount.textContent = `(${cart.length} item${cart.length > 1 ? 's' : ''})`;

    cart.forEach(({ title, date, price }) => {
      const item = document.createElement('div');
      item.className = 'cart-row';
      item.innerHTML = `
        <div class="carting-box">
          <div class="carting-left item">
            <div class="cart-item">
                <div class="cart-item-icon">
                  <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke-width="1.5" stroke="currentColor" class="size-6">
                    <path stroke-linecap="round" stroke-linejoin="round" d="M21 11.25v8.25a1.5 1.5 0 0 1-1.5 1.5H5.25a1.5 1.5 0 0 1-1.5-1.5v-8.25M12 4.875A2.625 2.625 0 1 0 9.375 7.5H12m0-2.625V7.5m0-2.625A2.625 2.625 0 1 1 14.625 7.5H12m0 0V21m-8.625-9.75h18c.621 0 1.125-.504 1.125-1.125v-1.5c0-.621-.504-1.125-1.125-1.125h-18c-.621 0-1.125.504-1.125 1.125v1.5c0 .621.504 1.125 1.125 1.125Z" />
                  </svg>
                </div>
                <div class="cart-item-1">
                    <span class="cart-item-title">${title}</span>
                    <span class="cart-item-date">${date}</span>
                </div>
            </div>
            <div class="cart-item-2">
                <span class="cart-item-price">${price}</span>
            </div>
            <svg xmlns="http://www.w3.org/2000/svg" "fill="none" viewBox="0 0 24 24" stroke-width="1.5" stroke="currentColor" class="btn-remove">
              <path stroke-linecap="round" stroke-linejoin="round" d="m14.74 9-.346 9m-4.788 0L9.26 9m9.968-3.21c.342.052.682.107 1.022.166m-1.022-.165L18.16 19.673a2.25 2.25 0 0 1-2.244 2.077H8.084a2.25 2.25 0 0 1-2.244-2.077L4.772 5.79m14.456 0a48.108 48.108 0 0 0-3.478-.397m-12 .562c.34-.059.68-.114 1.022-.165m0 0a48.11 48.11 0 0 1 3.478-.397m7.5 0v-.916c0-1.18-.91-2.164-2.09-2.201a51.964 51.964 0 0 0-3.32 0c-1.18.037-2.09 1.022-2.09 2.201v.916m7.5 0a48.667 48.667 0 0 0-7.5 0" />
            </svg>
          </div>
        </div>`;
      item.querySelector('.btn-remove').addEventListener('click', () => {
        removeFromCart(title, date);
        renderCartItems();
      });
      cartContainer.appendChild(item);
    });

    updateCartTotal();
  }

  function removeFromCart(title, date) {
    let cart = JSON.parse(localStorage.getItem('cart')) || [];
    cart = cart.filter(item => !(item.title === title && item.date === date));
    localStorage.setItem('cart', JSON.stringify(cart));

    renderCartItems();
    updateCartTotal();
  }

  function updateCartTotal() {
    const cart = JSON.parse(localStorage.getItem('cart')) || [];
    const totalElement = document.querySelector('.cart-total-price');
    if (!totalElement) return;
  
    const total = cart.reduce((sum, item) => {
      let price = item.price;
  
      if (typeof price === 'string') {
        price = parseFloat(price.replace(/[$,]/g, '').trim());
      }
  
      return sum + (isNaN(price) ? 0 : price);
    }, 0);
  
    totalElement.textContent = `$${total.toLocaleString(undefined, { minimumFractionDigits: 2, maximumFractionDigits: 2 })}`;
  }

  const closeModalBtn = document.querySelector('.modal-header svg');
  const viewCartButton = document.querySelector('.view-cart');

  if (closeModalBtn) {
    closeModalBtn.addEventListener('click', () => {
      detailsModal.style.display = "none";
      detailsModalOverlay.style.display = 'none'
    });
  }

  if (detailsModalOverlay) {
    detailsModalOverlay.addEventListener('click', () => {
      detailsModal.style.display = "none";
      detailsModalOverlay.style.display = 'none'
    });
  }

  viewCartButton.addEventListener('click', () => {
    localStorage.setItem('showCart', 'true');
    window.location.href = 'cart-page.html';
  });

  document.querySelector('.continue-browsing').addEventListener('click', () => {
    window.location.href = 'reservations.html';
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


  // addToCartBtn.addEventListener('click', (e) => {
  //   e.preventDefault();

  //   //Form and modal control

  //   const nameRegex = /^[A-Za-z\s]{2,}$/;
  //   const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  //   const phoneRegex = /^\+?[0-9]{7,15}$/;

  //   const name = nameInput.value.trim();
  //   const email = emailInput.value.trim();
  //   const phone = phoneInput.value.trim();

  //   // Clear previous errors
  //   nameError.textContent = '';
  //   emailError.textContent = '';
  //   phoneError.textContent = '';

  //   let isValid = true;
  //   let firstInvalidInput = null;


  //   if (!nameRegex.test(name)) {
  //     nameError.textContent = 'Invalid name';
  //     nameInput.classList.add('input-error');
  //     if (!firstInvalidInput) firstInvalidInput = nameInput;
  //     isValid = false;
  //   } else {
  //     nameInput.classList.remove('input-error');
  //   }
    
  //   if (!emailRegex.test(email)) {
  //     emailError.textContent = 'Invalid email';
  //     emailInput.classList.add('input-error');
  //     emailInput.style.boxShadow = "none";
  //     if (!firstInvalidInput) firstInvalidInput = emailInput;
  //     isValid = false;
  //   } else {
  //     emailInput.classList.remove('input-error');
  //   }
    
  //   if (!phoneRegex.test(phone)) {
  //     phoneError.textContent = 'Invalid phone number';
  //     phoneInput.classList.add('input-error');
  //     if (!firstInvalidInput) firstInvalidInput = phoneInput;
  //     isValid = false;
  //   } else {
  //     phoneInput.classList.remove('input-error');
  //   }       

  //   if (!isValid) {
  //     firstInvalidInput.focus();
  //     return;
  //   }        

  //   localStorage.setItem('userName', name);
  //   localStorage.setItem('userEmail', email);
  //   localStorage.setItem('userPhone', phone);

  //   const title = localStorage.getItem('selectedTitle');
  //   const rawDate = localStorage.getItem('selectedDate');
  //   const price = localStorage.getItem('selectedPrice');

  //   document.getElementById('reservation_title').value = title || '';
  //   document.getElementById('reservation_price').value = price || '';

  //   const formattedDate = formatToMySQLDate(rawDate);
  //   document.getElementById('reservation_date').value = formattedDate || '';



  //   console.log("Title:", title);
  //   console.log("Raw Date:", rawDate);
  //   console.log("Price:", price);
  //   console.log("Formatted Date:", formattedDate);

  //   document.getElementById('userForm').submit();
  // });

});