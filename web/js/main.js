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

// Function to handle when the user manually drags or swipes
let isDragging = false,
  startPos = 0,
  currentTranslate = 0,
  prevTranslate = 0;

  //add mousedown event to slider
  slider.addEventListener('mousedown', (e) => {
    isDragging = true;
    startPos = e.pageX;
    clearInterval(autoSlideInterval);
  });
  
   //add mouseUp event to slider
  slider.addEventListener('mouseup', () => {
    if (!isDragging) return;
    isDragging = false;
  
    const movedBy = currentTranslate - prevTranslate;
  
    if (movedBy < -50) slideNext();
    if (movedBy > 50) slidePrevious();
  
    startAutoSlide();
  });

 //add mousemove event to slider
  slider.addEventListener('mousemove', (e) => {
    if (!isDragging) return;
    const currentPosition = e.pageX;
    currentTranslate = prevTranslate + currentPosition - startPos;
    slider.style.transform = `translateX(${currentTranslate}px)`;
  });


  // Function to move to the previous slide
function slidePrevious() {
    slider.style.transition = 'none'; // Disable transition for instant movement
    slider.prepend(slider.children[slider.children.length - 1]); // Move last image to the front
    slider.style.transform = `translateX(${-slideWidth}px)`; // Position the slider
    slider.style.transition = 'transform 0.5s ease-in-out'; // Re-enable smooth sliding
  
    // Trigger slide animation to the original position
    setTimeout(() => {
      slider.style.transform = `translateX(0)`;
    }, 0);
  }

  // Start the auto-slide
startAutoSlide();

//  Cta images
const images = [
 
'./assets/cta-image1.png',
'./assets/cta-image2.png',
'./assets/cta-image3.png'
 ];

let currentIndex = 0;

function changeBackgroundImage() {
  document.querySelector('.cta-image').style.backgroundImage = `url(${images[currentIndex]})`;
  currentIndex = (currentIndex + 1) % images.length;
}
 setInterval(changeBackgroundImage, 5000);

 changeBackgroundImage();

//  faqs
const faqs = [
  {
    question: "What is the purpose of dhaqsoPay?",
    answer: "dhaqsoPay provides a simple and reliable payment testing solution for students and developers to test systems safely before integrating with real payment APIs.",
  },
  {
    question: "What features does dhaqsoPay offer?",
    answer: "It offers mock payment APIs, a browser extension for direct testing, a sandbox environment for secure payment flow testing, and detailed logs for insights.",
  },
  {
    question: "Is dhaqsoPay suitable for team projects?",
    answer: "Yes, dhaqsoPay is designed to support both individual developers and teams, offering tools like mock APIs and a sandbox environment for collaborative testing.",
  },
  {
    question: "Who can use dhaqsoPay?",
    answer: "It is open to students, developers, and teams who need a reliable environment for testing payment flows without relying on live APIs.",
  },
];
