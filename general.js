// general.js
document.addEventListener('DOMContentLoaded', () => {
    const hamburgerMenu = document.querySelector('.hamburger-menu');
    const mobileSidebar = document.querySelector('.mobile-sidebar');
    const mobileSidebarClose = document.querySelector('.mobile-sidebar-close');
    const overlay = document.querySelector('.overlay');
    const mobileNavLinks = document.querySelectorAll('.mobile-nav-link');
    const cartIcon = document.querySelector('.cart-icon');
    const closeCartIcon = document.querySelector('.close-cart');
    // const cartSection = document.querySelector('.cart-section');

    // Open mobile sidebar
    if (hamburgerMenu) {
        hamburgerMenu.addEventListener('click', () => {
            mobileSidebar.classList.add('active');
            overlay.classList.add('active');
            document.body.classList.add('sidebar-open');
        });
    }

    // Close mobile sidebar
    function closeMobileSidebar() {
        mobileSidebar.classList.remove('active');
        overlay.classList.remove('active');
        document.body.classList.remove('sidebar-open');
    }

    // Close cart
    function closeCart() {
        if (cartSection) {
            cartSection.classList.remove('active');
            overlay.classList.remove('active');
            document.body.classList.remove('sidebar-open');
        }
    }

    // Open cart
    if (cartIcon) {
        cartIcon.addEventListener('click', () => {
            cartSection.classList.add('active');
            overlay.classList.add('active');
            document.body.classList.add('sidebar-open');
        });
    }

    // Close cart button
    if (closeCartIcon) {
        closeCartIcon.addEventListener('click', closeCart);
    }

    // Close sidebar button
    if (mobileSidebarClose) {
        mobileSidebarClose.addEventListener('click', closeMobileSidebar);
    }

    // Overlay click - close both sidebar and cart
    if (overlay) {
        overlay.addEventListener('click', () => {
            closeMobileSidebar();
            closeCart();
        });
    }

    // Close sidebar when a link is clicked
    mobileNavLinks.forEach(link => {
        link.addEventListener('click', () => {
            closeMobileSidebar();
        });
    });

    // Set active link based on current page
    const currentPage = window.location.pathname.split('/').pop();
    mobileNavLinks.forEach(link => {
        const linkPage = link.getAttribute('href');
        if (linkPage === currentPage || (currentPage === '' && linkPage === 'home.html')) {
            link.classList.add('active');
        }
    });

    // Also set active for desktop nav
    const desktopNavLinks = document.querySelectorAll('.nav-link');
    desktopNavLinks.forEach(link => {
        const linkPage = link.getAttribute('href');
        if (linkPage === currentPage || (currentPage === '' && linkPage === 'home.html')) {
            link.classList.add('active');
        }
    });

    const cartSection = document.querySelector('.cart-section');
    const cartContainer = document.createElement('div');
    cartContainer.classList.add('cart-items');
    cartSection.appendChild(cartContainer);
    const cartCount = cartSection.querySelector('.cart-name p:nth-child(2)');
    const emptyMessage = cartSection.querySelector('.empty-cart');

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
    
    function addToCheckout() {
        const cart = JSON.parse(localStorage.getItem('cart')) || [];
        if (cart.length === 0) {
        alert('Your cart is empty.');
        return;
        }
    
        alert('Reservation complete!');
        document.querySelector('.cart-total').style.display = 'none';
        localStorage.removeItem('cart');
        renderCartItems();
        updateCartTotal();
    }

    renderCartItems();

    document.querySelector('.btn-purchase').addEventListener('click', addToCheckout);

});