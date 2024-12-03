const inputs = document.querySelectorAll('.pin-input input');
const checkButton = document.querySelector("#check-button");
const okButton = document.querySelector("#ok-button");
const errorMessage = document.querySelector(".error-message")
const popupCheck = document.querySelector(".popup-overlay")
const popupBalance = document.querySelector(".popup-overlay-balance")
inputs.forEach((input, index) => {
    input.addEventListener('input', (e) => {
        // Allow only numeric input
        const value = e.target.value.replace(/[^0-9]/g, ''); 
        e.target.value = value;

        // Automatically move to the next input if valid number is entered
        if (value.length === 1 && index < inputs.length - 1) {
            inputs[index + 1].focus();
        }
    });

    input.addEventListener('keydown', (e) => {
        // Handle Backspace behavior
        if (e.key === 'Backspace' && input.value === '') {
            if (index > 0) {
                inputs[index - 1].focus();
            }
        }
    });
});

checkButton.addEventListener("click", ()=>{
    let isEmpty = false;
    inputs.forEach(input => {
        if (input.value.trim() === "") {
            isEmpty = true;
        }
    });
    
    if (isEmpty) {
        errorMessage.textContent = "Fill All the inputs"
        errorMessage.style.display = "block"; 
    } else {
        errorMessage.style.display = "none";
        popupCheck.style.display ="none";
        popupBalance.style.display ="flex"
    }
});
okButton.addEventListener("click", ()=> {
    popupBalance.style.display = "none"
})


