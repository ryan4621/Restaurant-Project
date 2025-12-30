document.addEventListener('DOMContentLoaded', () => {

  // Home page code (run only on home.html)
  if (document.body.classList.contains('home-page')) {

    // Home page specific code here
    const nav = document.querySelector('.navigate');
    if (nav) {
      window.addEventListener('scroll', function () {
        if (window.scrollY > 0) {
          nav.classList.add('scrolled');
        } else {
          nav.classList.remove('scrolled');
        }
      });
    }

    const links = document.querySelectorAll(".nav-link");
    const currentPage = window.location.pathname.split("/").pop();

    links.forEach(link => {
      const linkPage = link.getAttribute("href").split("/").pop();

      if (linkPage === currentPage) {
        link.classList.add("active");
      } else {
        link.classList.remove("active");
      }
    });

    document.querySelectorAll('.card-btn').forEach(btn => {
      btn.addEventListener('click', () => {
        const card = btn.closest('.card');

        const title = card.querySelector('h3').textContent;
        const price = card.querySelector('.price').textContent;

        localStorage.setItem('selectedTitle', title);
        localStorage.setItem('selectedPrice', price);

        window.location.href = 'calendar.html';
      });
    });
    // Testimonials code (only on home.html)
    const containers = document.querySelectorAll('.testimonials-container');
    if (containers.length > 0) {
      const dots = document.querySelectorAll('.pagination-dots .dot');
      const arrows = document.querySelectorAll('.testimonials svg');
      let current = 0;

      function showReview(index) {
        containers.forEach((container, i) => {
          container.classList.toggle('active', i === index);
        });

        dots.forEach((dot, i) => {
          dot.classList.toggle('active', i === index);
        });

        current = index;
      }

      arrows.forEach((arrow, direction) => {
        arrow.addEventListener('click', () => {
          const nextIndex = (current + (direction === 0 ? -1 : 1) + containers.length) % containers.length;
          showReview(nextIndex);
        });
      });
    }

    const closeCart = document.querySelector('.close-cart');
    const cartSection = document.querySelector('.cart-section');
    const overlay = document.querySelector('.overlay');

    if (closeCart && cartSection) {
      closeCart.addEventListener('click', () => {
        cartSection.style.display = 'none';
        overlay.style.display = "none";
        nav.classList.remove('scrolled');
        document.querySelector('.navigate').style.backgroundColor = 'rgba(41, 39, 39, 0.4)';
      });
    } else {
      console.log('Element not found');
    }

    document.querySelector('.cart-icon').addEventListener('click', () => {
      cartSection.style.display = "block";
      overlay.style.display = "block";
      document.querySelector('.navigate').style.backgroundColor = 'rgba(41, 39, 39, 0.1)';
    })

    const showCart = localStorage.getItem('showCart');

    if (showCart === 'true') {
      cartSection.style.display = "block";
      overlay.style.display = "block";
      localStorage.removeItem('showCart');
    }
  }

  // Menu page code (run only on menu.html)
  if (document.body.classList.contains('menu-page')) {

    const foodLink = document.querySelector('.food-link');
    const drinksLink = document.querySelector('.drinks-link');
    const foodMenu = document.querySelector('.food-menu');
    const drinksMenu = document.querySelector('.drinks-menu');
    const menuSlideBorder = document.querySelector('.menu-slide-border');

    if (foodLink && drinksLink && foodMenu && drinksMenu && menuSlideBorder) {
      foodLink.addEventListener('click', (e) => {
        e.preventDefault();
        foodMenu.style.display = 'block';
        drinksMenu.style.display = 'none';
        menuSlideBorder.style.alignSelf = 'flex-start';
      });

      drinksLink.addEventListener('click', (e) => {
        e.preventDefault();
        foodMenu.style.display = 'none';
        drinksMenu.style.display = 'block';
        menuSlideBorder.style.alignSelf = 'flex-end';
      });
    }
  }
    
});



//   const review1 = document.querySelectorAll('.testimonials-container')[0];
//   const review2 = document.querySelectorAll('.testimonials-container')[1];
//   const arrows = document.querySelectorAll('.testimonials svg');

//   arrows.forEach(arrow => {
//     arrow.addEventListener('click', () => {
//       if (review1.style.display === 'block') {
//         review1.style.display = 'none';
//         review2.style.display = 'block';
//       } else {
//         review1.style.display = 'block';
//         review2.style.display = 'none';
//       }
//     });
//   });