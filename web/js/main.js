const navLinks =document.querySelector(".nav-links")
const humbergur = document.querySelector(".humbergur")
const icons = document.querySelectorAll("i")


humbergur.addEventListener('click', function(event){
    const  isvible = navLinks.getAttribute('data-visible');
     if(isvible === "true"){
        navLinks.setAttribute('data-visible','false');
         icons[0].setAttribute('data-visible','true');
         icons[1].setAttribute('data-visible','false')
     }else{
        navLinks.setAttribute('data-visible','true');
         icons[0].setAttribute('data-visible','false');
         icons[1].setAttribute('data-visible','true')
     }
    
 })


 //slider in parteners section
 const slider = document.querySelector('.slider');
 let slideWidth = slider.children[0].offsetWidth + 20; // Width + margin
let autoSlideInterval;
 
// Start auto-slide
function startAutoSlide() {
    autoSlideInterval = setInterval(() => {
      slideNext();
    }, 3000);
}

// Function to move to the next slide
function slideNext() {
    // Move the first image to the end
    slider.style.transition = 'none'; // Disable transition for instant movement
    slider.appendChild(slider.children[0]); // Move first image to the end
    slider.style.transform = `translateX(0)`; // Reset position
    slider.style.transition = 'transform 0.5s ease-in-out'; // Re-enable smooth sliding
  
    // Trigger slide animation to the next position
    setTimeout(() => {
      slider.style.transform = `translateX(${-slideWidth}px)`;
    }, 0);
  }