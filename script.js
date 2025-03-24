let lastScrollY = 0;
let ticking = false;

window.addEventListener('scroll', function() {
    if (!ticking) {
        window.requestAnimationFrame(function() {
            var scrollPosition = window.scrollY;

            var mainContent = document.querySelector('.first_page_main_content');
            var header = document.querySelector('.header');

            var parallaxSpeed = 0.5; // чем меньше, тем медленнее 
            var parallaxSpeedHeader = 0.8;

            mainContent.style.transform = 'translateY(' + (scrollPosition * parallaxSpeed) + 'px)';
            header.style.transform = 'translateY(' + (scrollPosition * parallaxSpeedHeader) + 'px)';
            
            ticking = false;
        });

        ticking = true;
    }
});
