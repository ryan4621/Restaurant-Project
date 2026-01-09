if (document.readyState == 'loading') {
  document.addEventListener('DOMContentLoaded', ready);
} else {
  ready();
}

function ready() {
  var removeCartItemButtons = document.getElementsByClassName('btn-remove');
  for (var i = 0; i < removeCartItemButtons.length; i++) {
    var button = removeCartItemButtons[i];
    button.addEventListener('click', removeCartItem);
  }

  const cartItems = JSON.parse(localStorage.getItem('cart')) || [];

  cartItems.forEach(item => {
    console.log("Adding item to cart:", item);
    addItemToCart(item.title, item.date, item.price, true);
  });

  updateCartTotal();
  showTotal();

  console.log("Loaded cart items:", cartItems);
  

  const purchaseBtn = document.getElementsByClassName('btn-purchase')[0];
  if (purchaseBtn) {
    purchaseBtn.addEventListener('click', purchaseClicked);
  }
}

function purchaseClicked() {
  alert('Thank you for your purchase');
  var cartItemsContainer = document.getElementsByClassName('cart-items')[0];
  while (cartItemsContainer.hasChildNodes()) {
    cartItemsContainer.removeChild(cartItemsContainer.firstChild);
  }

  const cartTotal = document.querySelector('.cart-total');
  cartTotal.style.display = 'none';

  // var cartBadge = document.getElementsByClassName("cart-badge")[0];
  // cartBadge.style.display = 'none';

  updateCartTotal();
}

function removeCartItem(event) {
  const buttonClicked = event.target;
  const cartRow = buttonClicked.closest('.cart-row');
  if (!cartRow) return;

  const titleElement = cartRow.querySelector('.cart-item-title');
  const dateElement = cartRow.querySelector('.cart-item-date');

  const titleToRemove = titleElement ? titleElement.textContent : null;
  const dateToRemove = dateElement ? dateElement.textContent : null;

  cartRow.remove();

  const storedCart = JSON.parse(localStorage.getItem('cart')) || [];
  const updatedCart = storedCart.filter(item => {
    return !(item.title === titleToRemove && item.date === dateToRemove);
  });
  localStorage.setItem('cart', JSON.stringify(updatedCart));

  updateCartTotal();
}


function showTotal() {
  const cartTotal = document.querySelector('.cart-total');
  cartTotal.style.display = 'flex';
  updateCartTotal();
}

function addToCartClicked() {
  const storedTitle = localStorage.getItem('selectedTitle');
  const storedDate = localStorage.getItem('selectedDate');
  const storedPrice = localStorage.getItem('selectedPrice');

  const title = storedTitle || "Untitled";
  const date = storedDate || "No date";
  const price = storedPrice || "$0.00";

  addItemToCart(title, date, price);
  updateCartTotal();
}

function addItemToCart(title, date, price) {
  const cart = JSON.parse(localStorage.getItem('cart')) || [];

  const alreadyExists = cart.some(item => item.title === title && item.date === date);
  if (alreadyExists) {
    alert('This item has already been added to your cart.');
    return;
  }

  cart.push({ title, date, price });
  localStorage.setItem('cart', JSON.stringify(cart));

  var cartRow = document.createElement('div');
  cartRow.classList.add('cart-row');
  var cartItemsContainer = document.getElementsByClassName('cart-items')[0];



  var cartRowContents = `
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
  cartRow.innerHTML = cartRowContents;
  cartItemsContainer.append(cartRow);

  cartRow.getElementsByClassName('btn-remove')[0].addEventListener('click', removeCartItem);
}

// function updateCartCount() {
//   var cartItemsContainer = document.getElementsByClassName('cart-items')[0];
//   var cartCount = cartItemsContainer.getElementsByClassName('cart-row').length;

//   var cartBadge = document.getElementsByClassName('cart-badge')[0];
//   cartBadge.textContent = cartCount;

//   if (cartCount === 0) {
//       cartBadge.style.display = 'none';
//   } else {
//       cartBadge.style.display = 'block';
//   }
// }

function updateCartTotal() {
  var cartItemContainer = document.getElementsByClassName('cart-items')[0];
  var cartRows = cartItemContainer.getElementsByClassName('cart-row');
  var total = 0;

  for (var i = 0; i < cartRows.length; i++) {
      var cartRow = cartRows[i];
      var priceElement = cartRow.getElementsByClassName('cart-item-price')[0];
      var price = parseFloat(priceElement.innerText.replace('$', ''));
      total += price;
  }

  total = total.toFixed(2);
  document.getElementsByClassName('cart-sub-total-price')[0].innerText = '$' + total;
  // document.getElementsByClassName('cart-total-price')[0].innerText = '$' + total;
}