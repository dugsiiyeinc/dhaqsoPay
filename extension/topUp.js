const app = document.querySelector("#app");

app.innerHTML = `
  <div class="container">
    <h1>Top Up</h1>
    <div class="divider"></div>
    <div class="input-group">
      <input type="number" id="amount" placeholder="$ 0.00" min="0">
    </div>
    <p class="error-message" id="error-msg">Wax ka yar $5 laguma shubi karo!</p>
    <button id="check-btn">Check</button>
    <div class="success-popup" id="success-popup">
    <div class="icon">
    <i class="fa-solid fa-check"></i>
    </div>      
      <h2>Success</h2>
      <p id="success-msg"></p>
      <button id="close-popup">OK</button>
    </div>
  </div>
`;

// Get references to the important DOM elements
const checkButton = document.querySelector("#check-btn");
const amountInput = document.querySelector("#amount");
const errorMessage = document.querySelector("#error-msg");
const successPopup = document.querySelector("#success-popup");
const successMessage = document.querySelector("#success-msg");
const closePopupButton = document.querySelector("#close-popup");

// Event listener for the Check button
checkButton.addEventListener("click", handleCheckButtonClick);

// Event listener for closing the success popup
closePopupButton.addEventListener("click", closeSuccessPopup);


// Function to handle Check button click
function handleCheckButtonClick() {
  const amount = parseFloat(amountInput.value); // Get the input value as a number

  // Validate input: amount must be at least $5
  if (isValidAmount(amount)) {
    hideErrorMessage();  // Hide error message if the input is valid
    displaySuccessPopup(amount); // Show success popup
  } else {
    displayErrorMessage(); // Show error message
    hideSuccessPopup(); // Hide success popup if there's an error
  }
}

// Function to validate the entered amount
function isValidAmount(amount) {
  return !isNaN(amount) && amount >= 5; // Amount should be a number and at least $5
}


// Function to show the success popup with the provided amount
function displaySuccessPopup(amount) {
  successMessage.textContent = `Waxaad ku guuleysatay inaad $${amount.toFixed(2)} ugu shubto akoonkaaga 6xxxxxxxx. Mahadsanid!`;
  successPopup.style.display = "block";
  successPopup.classList.add("show");
}




