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