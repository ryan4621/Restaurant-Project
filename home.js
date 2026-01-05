document.addEventListener('DOMContentLoaded', () => {

  // Home page code (run only on home.html)
  if (document.body.classList.contains('home-page')) {

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

    // const links = document.querySelectorAll(".nav-link");
    // const currentPage = window.location.pathname.split("/").pop();

    // links.forEach(link => {
    //   const linkPage = link.getAttribute("href").split("/").pop();

    //   if (linkPage === currentPage) {
    //     link.classList.add("active");
    //   } else {
    //     link.classList.remove("active");
    //   }
    // });

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
  }

  // Menu page code (run only on menu.html)
  if (document.body.classList.contains('menu-page')) {

    // const menuSlideLinks = document.querySelectorAll('.menu-slide-links');
    // const menuSlide = document.querySelector('.menu-slide');

    // menuSlideLinks.forEach(menuSlideLink => {
    //   window.addEventListener('scroll', () => {
    //     const linkBottom = menuSlide.getBoundingClientRect().bottom;
        
    //     if (linkBottom <= 110) {
    //       menuSlideLink.classList.add('sticky');
    //     } else {
    //       menuSlideLink.classList.remove('sticky');
    //     }
    //   });
    // });

    const foodLink = document.querySelector('.food-link');
    const drinksLink = document.querySelector('.drinks-link');
    const foodMenu = document.querySelector('.food-menu');
    const drinksMenu = document.querySelector('.drinks-menu');

    // Only run if elements exist (on menu page)
    if (foodLink && drinksLink && foodMenu && drinksMenu) {
      foodLink.classList.add('active');

      foodLink.addEventListener('click', (e) => {
          e.preventDefault();
          
          // Toggle menus
          foodMenu.style.display = 'block';
          drinksMenu.style.display = 'none';
          
          // Toggle active class
          foodLink.classList.add('active');
          drinksLink.classList.remove('active');
      });

      drinksLink.addEventListener('click', (e) => {
        e.preventDefault();
        
        // Toggle menus
        drinksMenu.style.display = 'block';
        foodMenu.style.display = 'none';
        
        // Toggle active class
        drinksLink.classList.add('active');
        foodLink.classList.remove('active');
      });
    }
  }
});