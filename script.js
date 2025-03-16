window.addEventListener('scroll', function() {
    var scrollPosition = window.scrollY;

    // Элемент, который будет двигаться
    var mainContent = document.querySelector('.first_page_main_content');
    var header = document.querySelector('.header');

    // Скорость параллакса для всего блока
    var parallaxSpeed = 0.5; // Чем меньше, тем медленнее будет движение
    var parallaxSpeedHeader = 0.8;

    // Применяем эффект параллакса только по оси Y
    mainContent.style.transform = 'translateY(calc(' + scrollPosition * parallaxSpeed + 'px))';
    header.style.transform = 'translateY(calc(' + scrollPosition * parallaxSpeedHeader + 'px))';
});
