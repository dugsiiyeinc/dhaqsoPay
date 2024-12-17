document.addEventListener("DOMContentLoaded", displayUserAccount);

function displayUserAccount() {
  chrome.storage.local.get("onlineUser", (result) => {
    if (result.onlineUser) {
      const user = JSON.parse(result.onlineUser);
      document.getElementById("fullnameDisplay").textContent =
        user.fullname || "fullname";
      document.getElementById("numberDisplay").textContent =
        user.number || "+2526xxxxxx";

      // Initialize WebSocket via background.js
      chrome.runtime.sendMessage(
        { type: "INIT_WEBSOCKET", number: user.number },
        (response) => {
          if (response.success) console.log("WebSocket initialized.");
        }
      );

      // Fetch pending requests (if any)
      chrome.runtime.sendMessage(
        { type: "GET_PENDING_PAYMENT" },
        (response) => {
          if (response.pendingRequest) {
            showPurchaseConfirmation(
              response.pendingRequest.amount,
              response.pendingRequest.platform
            );
          }
        }
      );
    } else {
      window.location.href = "./getstarted.html";
    }
  });
}

// Listen for messages from background.js
chrome.runtime.onMessage.addListener((message) => {
  if (message.type === "CONFIRM_PAYMENT") {
    const { amount, platform } = message.data;
    showPurchaseConfirmation(amount, platform);
  } else if (message.type === "PAYMENT_RESPONSE") {
    handlePaymentResponse(message.data);
  }
});

// Handle payment responses from WebSocket
function handlePaymentResponse(response) {
  console.log(response);
  if (response.error) {
    // Error case: Timeout, insufficient balance, incorrect pin, or cancellation
    modalMessage.textContent = response.error;
    modalInput.style.display = "none";
    SubmitBtn.textContent = "OK";
    SubmitBtn.addEventListener("click", resetModalUI);
    clearInputs();
  } else if (response.message) {
    // Success case: Show success popup
    const newBalance = response.newBalance;
    const amount = response.amount;
    const platform = response.platform;

    handleSuccessMessage(amount, platform, newBalance);
    resetModalUI();
    clearInputs();
    chrome.storage.local.get("onlineUser", (result) => {
      const user = JSON.parse(result.onlineUser || "{}");
      user.balance = newBalance;
      console.log(user);
    });
  }
}

// Show purchase confirmation modal
function showPurchaseConfirmation(amount, platform) {
  const topModalContent = document.querySelector(".topModalContent");
  currentAction = "purchase";
  modal.style.display = "flex";
  modalInput.style.display = "flex";
  modalInput.placeholder = "Fadlan gali pin-kaaga";
  modalMessage.textContent = `Ma hubtaa inaad $${amount} wax kaga iibsato ${platform}? Fadlan gali pin-kaaga si aad u dhammaystirto.`;
  modalMessage.style.textAlign = "left";
  pinInputs.style.display = "none";
  topModalContent.style.display = "none";
}

// Handle purchase confirmation
function handlePurchase() {
  const enteredPin = modalInput.value;
  if (!enteredPin || enteredPin.length !== 4) {
    showError("pin-ka waa inuu ahaadaa 4 lambar.");
    return;
  }

  chrome.storage.local.get("onlineUser", (result) => {
    const user = JSON.parse(result.onlineUser || "{}");
    if (enteredPin !== user.pin) {
      showError("pin-ka aad soo gelisay waa khalad.");
      return;
    }

    // Send payment confirmation to background.js
    chrome.runtime.sendMessage({
      type: "CONFIRM_PAYMENT",
      data: {
        type: "CONFIRM_PAYMENT",
        success: true,
        pin: enteredPin,
        number: user.number,
      },
    });
  });
}

// Handle success message
function handleSuccessMessage(amount, platform, newBalance) {
  modal.style.display = "none";
  const successPopup = document.querySelector(".success-popup");
  const successMessage = document.querySelector("#successMessage");

  successMessage.textContent = `Waxaad $${amount} u wareejisay ${platform}. Haraagaaga cusub waa $${newBalance}.`;
  successPopup.classList.add("show");
}

// Display error message
function showErrorMessage(message) {
  errorMessage.textContent = message;
  errorMessage.style.display = "block";
}

// Reset modal UI
function resetModalUI() {
  SubmitBtn.disabled = true;
  pinInputs.style.display = "none";
  modal.style.display = "none";
}

// Utility to clear inputs
function clearInputs() {
  inputs.forEach((input) => (input.value = ""));
  console.log(inputs);
}

const LogoutModal = document.getElementById("logoutModal");
const logoutBtn = document.getElementById("Logout");
const confirmLogout = document.getElementById("confirmLogout");
const cancelLogout = document.getElementById("cancelLogout");
logoutBtn.addEventListener("click", () => {
  LogoutModal.style.display = "flex";
});

confirmLogout.addEventListener("click", () => {
  chrome.storage.local.remove("onlineUser", () => {
    window.location.href = "./auth.html";
  });
});

cancelLogout.addEventListener("click", () => {
  document.getElementById("logoutModal").style.display = "none";
});

// modal
const modal = document.querySelector(".modal");
const modalTitle = document.querySelector("#modalTitle");
const modalMessage = document.querySelector("#modalMessage");
const modalInput = document.querySelector("#modalInput");
const modalForm = document.querySelector("#modalForm");
const errorMessage = document.querySelector("#errorMessage");
const inputs = document.querySelectorAll(".pin-input input");
const pinInputs = document.querySelector(".pin-input");
const SubmitBtn = document.querySelector("#SubmitBtn");

inputs.forEach((input, index) => {
  input.addEventListener("input", (e) => {
    // Allow only numeric input
    const value = e.target.value.replace(/[^0-9]/g, "");
    e.target.value = value;

    // Automatically move to the next input if valid number is entered
    if (value.length === 1 && index < inputs.length - 1) {
      inputs[index + 1].focus();
    }
  });

  input.addEventListener("keydown", (e) => {
    // Handle Backspace behavior
    if (e.key === "Backspace" && input.value === "") {
      if (index > 0) {
        inputs[index - 1].focus();
      }
    }
  });
});

function resetModal() {
  inputs.forEach((input) => (input.style.display = ""));
  modalInput.style.display = "";
  SubmitBtn.style.display = "block";
  errorMessage.style.display = "none";
}

let currentAction = "";

// Check BalancehandlePurchaseConfirmation

const CheckBalanceBTN = document.querySelector("#checkBalance");

CheckBalanceBTN.addEventListener("click", () => {
  currentAction = "checkBalance";
  modal.style.display = "flex";
  modalTitle.textContent = "Check Balance";
  modalMessage.textContent = "Fadlan gali pin-kaaga";
  modalInput.style.display = "none";
  pinInputs.style.display = "flex";
  SubmitBtn.textContent = "Check";
  clearInputs();
});

const CheckBalanceEyeToggle = document.querySelector("#CheckBalanceEyeToggle");

CheckBalanceEyeToggle.addEventListener("click", () => {
  resetModal();
  currentAction = "checkBalance";
  modal.style.display = "flex";
  modalTitle.textContent = "Check Balance";
  modalMessage.textContent = "Fadlan gali pin-kaaga";
  modalMessage.style.textAlign = "center";
  modalInput.style.display = "none";
  pinInputs.style.display = "flex";
  SubmitBtn.textContent = "Check";
  clearInputs();
});

// topup

const topupBTN = document.querySelector("#topUp");

topupBTN.addEventListener("click", () => {
  currentAction = "topUp";
  modal.style.display = "flex";
  modalTitle.textContent = "Top Up";
  modalMessage.textContent = "Fadlan gali lacagta aad rabto inaad ku shubto.";
  modalMessage.style.textAlign = "center";
  modalInput.style.display = "block";
  modalInput.placeholder = "$ 0.00";
  pinInputs.style.display = "none";
  SubmitBtn.textContent = "Submit";
  clearInputs();
});

// change pin
const changePin = document.querySelector("#changePin");

changePin.addEventListener("click", () => {
  resetModal();
  currentAction = "changePin";
  modal.style.display = "flex";
  modalTitle.textContent = "Change pin";
  modalMessage.textContent = "Fadlan gali pin-kaaga";
  modalMessage.style.textAlign = "center";
  modalInput.style.display = "none";
  pinInputs.style.display = "flex";
  SubmitBtn.textContent = "Enter";
  clearInputs();
});

// Form Submit Handler
modalForm.addEventListener("submit", (event) => {
  event.preventDefault();

  if (currentAction === "checkBalance") {
    handleCheckBalance();
  } else if (currentAction === "topUp") {
    handleTopUp();
  } else if (currentAction === "changePin") {
    handleChangePin();
  } else if (currentAction === "purchase") {
    handlePurchase();
  }
});

function handleCheckBalance() {
  const enteredPin = getenteredPin();

  if (enteredPin === "") {
    showError("Fadlan gali pin-kaaga.");
    return;
  }
  if (enteredPin.trim().length !== 4) {
    showError("pin-ka waa inuu ahaadaa 4 lambar.");
    return;
  }
  chrome.storage.local.get("onlineUser", (result) => {
    const onlineUser = JSON.parse(result.onlineUser || "{}");
    if (enteredPin !== onlineUser.pin) {
      showError("pin-ka aad soo gelisay waa khalad.");
      return;
    }

    const balance = onlineUser.balance || 0;
    modalMessage.textContent = `Haraagaagu waa $${balance}`;
    SubmitBtn.style.display = "none";
    pinInputs.style.display = "none";
    errorMessage.style.display = "none";
  });
}

function handleTopUp() {
  const amount = parseFloat(modalInput.value.trim());

  if (isNaN(amount)) {
    showError("Fadlan gali kaliya tiro sax ah!");
    return;
  }
  if (amount < 5) {
    showError("Wax ka yar $5 laguma shubi karo!");
    return;
  }
  if (amount > 1000000) {
    showError("Lacagta ugu badan ee lagu shubi karo waa $1,000,000!");
    return;
  }

  // Get online user
  chrome.storage.local.get("onlineUser", async (result) => {
    const onlineUser = JSON.parse(result.onlineUser || "{}");
    console.log(onlineUser);

    if (!onlineUser.number) {
      showError("Macluumaadka isticmaalaha lama helin.");
      return;
    }

    // Update local storage balance
    onlineUser.balance = (onlineUser.balance || 0) + amount;

    chrome.storage.local.set(
      { onlineUser: JSON.stringify(onlineUser) },
      async () => {
        console.log(onlineUser.number);

        try {
          // Send balance update to the server
          const response = await fetch(
            "http://localhost:8000/api/increase-balance",
            {
              method: "PUT",
              headers: { "Content-Type": "application/json" },
              body: JSON.stringify({ number: onlineUser.number, amount }),
            }
          );

          console.log("response", response);
          const data = await response.json();
          console.log(data);

          if (response.ok) {
            SubmitBtn.style.display = "none";
            modalInput.style.display = "none";
            errorMessage.style.display = "none";
            modalMessage.textContent = `Waxaad ku shubatay $${amount}. Haraagaaga cusub waa $${onlineUser.balance}`;
          } else {
            showError(data.error || "Server error occurred.");
          }
        } catch (error) {
          console.error("Server error:", error);
          showError("Failed to sync with server. Please try again.");
        }
      }
    );
  });
}

let newPin = "";
let changeStep = 1;

function handleChangePin() {
  const enteredPin = getenteredPin();

  chrome.storage.local.get("onlineUser", async (result) => {
    const onlineUser = JSON.parse(result.onlineUser || "{}");

    if (changeStep === 1) {
      if (enteredPin !== onlineUser.pin) {
        console.log(enteredPin, onlineUser);
        showError("pin-ka aad gelisay waa khalad.");
        return;
      }
      changeStep = 2;
      modalMessage.textContent = "Fadlan gali pin-kaaga cusub.";
      clearInputs();
    } else if (changeStep === 2) {
      if (!newPin) {
        newPin = enteredPin;
        modalMessage.textContent = "Fadlan ku celi pin-kaaga cusub.";
        clearInputs();
      } else if (newPin !== enteredPin) {
        showError("pin-kii hore iyo kan cusub iskuma eka.");
        return;
      } else {
        oldPin = onlineUser.pin;
        // Update local storage
        onlineUser.pin = newPin;

        chrome.storage.local.set(
          { onlineUser: JSON.stringify(onlineUser) },
          async () => {
            try {
              // Send PIN update to the server
              const response = await fetch(
                "http://localhost:8000/api/change-pin",
                {
                  method: "PUT",
                  headers: { "Content-Type": "application/json" },
                  body: JSON.stringify({
                    number: onlineUser.number,
                    oldPin,
                    newPin,
                  }),
                }
              );

              const data = await response.json();
              if (response.ok) {
                modalMessage.textContent =
                  "Waad ku guulaysatay inaad badasho pin-kaaga.";
              } else {
                showError(data.error || "Server error occurred.");
              }
            } catch (error) {
              console.error("Server error:", error);
              showError("Failed to sync with server. Please try again.");
            }

            errorMessage.style.display = "none";
            pinInputs.style.display = "none";
            SubmitBtn.style.display = "none";
            changeStep = 1;
            newPin = "";
          }
        );
      }
    }
  });
}

// Utility Functions
function clearInputs() {
  inputs.forEach((input) => (input.value = ""));
  modalInput.value = "";
}

function getenteredPin() {
  return Array.from(inputs)
    .map((input) => input.value)
    .join("");
}

function showError(message) {
  errorMessage.textContent = message;
  errorMessage.style.display = "block";
}

// Close Modal
window.onclick = function (event) {
  const successPopup = document.querySelector(".success-popup");
  if (event.target === modal) {
    modal.style.display = "none";
    changeStep = 1;
    successPopup.classList.remove("show");
    resetModal();
  }
  if (event.target === LogoutModal) {
    LogoutModal.style.display = "none";
  }
};
