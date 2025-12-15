// Week14/script.js

let currentSlide = 0;
const slides = document.querySelectorAll('.slide');

function showSlide(index) {
    // Wrap around
    if (index >= slides.length) currentSlide = 0;
    else if (index < 0) currentSlide = slides.length - 1;
    else currentSlide = index;

    // Toggle active class
    slides.forEach((slide, i) => {
        if (i === currentSlide) {
            slide.classList.add('active');
        } else {
            slide.classList.remove('active');
        }
    });
}

function moveSlide(direction) {
    showSlide(currentSlide + direction);
}

// Auto play
setInterval(() => {
    moveSlide(1);
}, 5000); // 5 seconds

console.log('Script loaded.');
