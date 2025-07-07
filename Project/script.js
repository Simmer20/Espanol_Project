// Placeholder for interactivity (e.g., smooth scrolling, language switch, etc.)
console.log("Website loaded!");
// === Slideshow Function ===
let slideIndex = 0;
function showSlides() {
  const slides = document.querySelectorAll('.slide'); // ✅ corrected from .mySlides
  const dots = document.querySelectorAll('.dot');

  slides.forEach(s => s.style.display = 'none');
  dots.forEach(d => d.classList.remove('active'));

  slideIndex = (slideIndex + 1) % slides.length;
  slides[slideIndex].style.display = 'block';
  dots[slideIndex].classList.add('active');

  setTimeout(showSlides, 5000); // 5 seconds
}
document.addEventListener("DOMContentLoaded", showSlides);

// === Lightbox Functionality ===
const galleryImgs = document.querySelectorAll('.gallery img, .content-block img');
const lightbox = document.createElement('div');
lightbox.classList.add('lightbox');
document.body.appendChild(lightbox);

galleryImgs.forEach(img => {
  img.addEventListener('click', () => {
    lightbox.innerHTML = `<img src="${img.src}" alt="${img.alt}">`;
    lightbox.style.display = 'flex';
  });
});

lightbox.addEventListener('click', e => {
  if (e.target !== lightbox) return;
  lightbox.style.display = 'none';
});
