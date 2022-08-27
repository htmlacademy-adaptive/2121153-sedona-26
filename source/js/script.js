document.addEventListener('DOMContentLoaded', function() {
  let navMain = document.querySelector('.main-nav');
  let navToggle = document.querySelector('.main-nav__toggle');

  navMain.classList.remove('maim-nav--nojs');

  navToggle.addEventListener('click', function () {
    if (navMain.classList.contains('main-nav--opened')) {
      navMain.classList.remove('main-nav--opened');
    } else {
      navMain.classList.add('main-nav--opened');
    }
  });
});
