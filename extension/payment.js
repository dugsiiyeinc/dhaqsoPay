const enterButton = document.querySelector("#enter-button")
const checkPin = document.querySelector("#check_pin")
const errorMessage = document.querySelector(".error-message")
const popupRequest= document.querySelector(".popup-overlay-request")
const popupResponse= document.querySelector(".popup-overlay-response")
const okButton = document.querySelector("#ok-button");

enterButton.addEventListener("click", ()=> {
    if(checkPin.value.trim() == ""){
        errorMessage.textContent = "Please enter your PIN"
        errorMessage.style.display = "block"; 
    }else {
        popupRequest.style.display = "none"
        popupResponse.style.display = "flex"
    }
})
okButton.addEventListener("click", ()=> {
    popupResponse.style.display = "none"
})