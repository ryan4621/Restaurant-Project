document.addEventListener('DOMContentLoaded', () => {
    const cartItemsList = document.querySelector('.cart-page-items-list');
    const subtotalElement = document.querySelector('.cart-page-subtotal');
    const checkoutBtn = document.querySelector('.cart-page-btn-checkout');

    function renderCartItems() {
        const cart = JSON.parse(localStorage.getItem('cart')) || [];
        
        if (cart.length === 0) {
          cartItemsList.innerHTML = '<p class="cart-page-empty-cart-message">Your cart is empty.</p>';
          subtotalElement.textContent = '$0';
          return;
        }

        cartItemsList.innerHTML = '';

        cart.forEach(({ title, date, price }) => {
            const cartRow = document.createElement('div');
            cartRow.className = 'cart-page-row';
            
            cartRow.innerHTML = `
                <div class="cart-page-carting-box">
                    <div class="cart-page-carting-left">
                        <div class="cart-page-item">
                            <div class="cart-page-item-icon">
                                <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke-width="1.5" stroke="currentColor">
                                    <path stroke-linecap="round" stroke-linejoin="round" d="M21 11.25v8.25a1.5 1.5 0 0 1-1.5 1.5H5.25a1.5 1.5 0 0 1-1.5-1.5v-8.25M12 4.875A2.625 2.625 0 1 0 9.375 7.5H12m0-2.625V7.5m0-2.625A2.625 2.625 0 1 1 14.625 7.5H12m0 0V21m-8.625-9.75h18c.621 0 1.125-.504 1.125-1.125v-1.5c0-.621-.504-1.125-1.125-1.125h-18c-.621 0-1.125.504-1.125 1.125v1.5c0 .621.504 1.125 1.125 1.125Z" />
                                </svg>
                            </div>
                            <div class="cart-page-item-1">
                                <span class="cart-page-item-title">${title}</span>
                                <span class="cart-page-item-date">${date}</span>
                            </div>
                        </div>
                        <div class="cart-page-item-price-wrapper">
                            <span class="cart-page-item-price">${price}</span>
                            <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke-width="1.5" stroke="currentColor" class="cart-page-btn-remove">
                                <path stroke-linecap="round" stroke-linejoin="round" d="m14.74 9-.346 9m-4.788 0L9.26 9m9.968-3.21c.342.052.682.107 1.022.166m-1.022-.165L18.16 19.673a2.25 2.25 0 0 1-2.244 2.077H8.084a2.25 2.25 0 0 1-2.244-2.077L4.772 5.79m14.456 0a48.108 48.108 0 0 0-3.478-.397m-12 .562c.34-.059.68-.114 1.022-.165m0 0a48.11 48.11 0 0 1 3.478-.397m7.5 0v-.916c0-1.18-.91-2.164-2.09-2.201a51.964 51.964 0 0 0-3.32 0c-1.18.037-2.09 1.022-2.09 2.201v.916m7.5 0a48.667 48.667 0 0 0-7.5 0" />
                            </svg>
                        </div>
                    </div>
                </div>
            `;

            cartRow.querySelector('.cart-page-btn-remove').addEventListener('click', () => {
                removeFromCart(title, date);
            });

            cartItemsList.appendChild(cartRow);
        });

        updateTotal();
    }

    function removeFromCart(title, date) {
        let cart = JSON.parse(localStorage.getItem('cart')) || [];
        cart = cart.filter(item => !(item.title === title && item.date === date));
        localStorage.setItem('cart', JSON.stringify(cart));
        renderCartItems();
    }

    function updateTotal() {
        const cart = JSON.parse(localStorage.getItem('cart')) || [];
        
        const total = cart.reduce((sum, item) => {
            let price = item.price;
            
            if (typeof price === 'string') {
                price = parseFloat(price.replace(/[$,]/g, '').trim());
            }
            
            return sum + (isNaN(price) ? 0 : price);
        }, 0);

        subtotalElement.textContent = `$${total.toLocaleString('en-US', { minimumFractionDigits: 0, maximumFractionDigits: 0 })}`;
    }

    function handleCheckout() {
        const cart = JSON.parse(localStorage.getItem('cart')) || [];
        
        if (cart.length === 0) {
            alert('Your cart is empty.');
            return;
        }

        alert('Thank you for your purchase!');
        localStorage.removeItem('cart');
        renderCartItems();
    }

    if (checkoutBtn) {
      checkoutBtn.addEventListener('click', handleCheckout);
    }

    renderCartItems();
});