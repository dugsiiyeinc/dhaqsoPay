document.addEventListener("DOMContentLoaded", displayUserAccount);
function displayUserAccount() {
  chrome.storage.local.get("onlineUser", (result) => {
    if (result.onlineUser) {
      const user = JSON.parse(result.onlineUser);
      document.getElementById("UserNamedisPlay").textContent =
        user.userName || "Username";
      document.getElementById("UserNumberdisPlay").textContent =
        user.userphoneNumber || "+2526xxxxxx";
    } else {
      window.location.href = "./getstarted.html";
    }
  });
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
const PINInputs = document.querySelector(".pin-input");
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

// Check Balance

const CheckBalanceBTN = document.querySelector("#checkBalance");

CheckBalanceBTN.addEventListener("click", () => {
  resetModal();
  currentAction = "checkBalance";
  modal.style.display = "flex";
  modalTitle.textContent = "Check Balance";
  modalMessage.textContent = "Fadlan gali PIN-kaaga";
  modalInput.style.display = "none";
  PINInputs.style.display = "flex";
  SubmitBtn.textContent = "Check";
  clearInputs();
});

const CheckBalanceEyeToggle = document.querySelector("#CheckBalanceEyeToggle");

CheckBalanceEyeToggle.addEventListener("click", () => {
  resetModal();
  currentAction = "checkBalance";
  modal.style.display = "flex";
  modalTitle.textContent = "Check Balance";
  modalMessage.textContent = "Fadlan gali PIN-kaaga";
  modalMessage.style.textAlign = "center";
  modalInput.style.display = "none";
  PINInputs.style.display = "flex";
  SubmitBtn.textContent = "Check";
  clearInputs();
});

// topup

const topupBTN = document.querySelector("#topUp");

topupBTN.addEventListener("click", () => {
  resetModal();
  currentAction = "topUp";
  modal.style.display = "flex";
  modalTitle.textContent = "Top Up";
  modalMessage.textContent = "Fadlan gali lacagta aad rabto inaad ku shubto.";
  modalMessage.style.textAlign = "center";
  modalInput.style.display = "block";
  modalInput.placeholder = "$ 0.00";
  PINInputs.style.display = "none";
  SubmitBtn.textContent = "Submit";
  clearInputs();
});

// change PIN
const changePIN = document.querySelector("#changePIN");

changePIN.addEventListener("click", () => {
  resetModal();
  currentAction = "changePIN";
  modal.style.display = "flex";
  modalTitle.textContent = "Change PIN";
  modalMessage.textContent = "Fadlan gali PIN-kaaga";
  modalMessage.style.textAlign = "center";
  modalInput.style.display = "none";
  PINInputs.style.display = "flex";
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
  } else if (currentAction === "changePIN") {
    handleChangePIN();
  } else if ( currentAction === "purchase"){
    handlePurchase(purchaseAmount, purchaseReceiver);
  }
});

function handleCheckBalance() {
  const enteredPIN = getEnteredPIN();

  if (enteredPIN === "") {
    showError("Fadlan gali PIN-kaaga.");
    return;
  }
  if (enteredPIN.trim().length !== 4) {
    showError("PIN-ka waa inuu ahaadaa 4 lambar.");
    return;
  }
  chrome.storage.local.get("onlineUser", (result) => {
    const onlineUser = JSON.parse(result.onlineUser || "{}");
    if (enteredPIN !== onlineUser.PIN) {
      showError("PIN-ka aad soo gelisay waa khalad.");
      return;
    }

    const balance = onlineUser.balance || 0;
    modalMessage.textContent = `Haraagaagu waa $${balance}`;
    SubmitBtn.style.display = "none";
    PINInputs.style.display = "none";
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
  if (amount > 100000000) {
    showError("Lacagta ugu badan ee lagu shubi karo waa $100,000,000!");
    return;
  }

  chrome.storage.local.get(["users", "onlineUser"], (result) => {
    const users = JSON.parse(result.users || "[]");
    const onlineUser = JSON.parse(result.onlineUser || "{}");

    const updatedUsers = users.map((user) => {
      if (user.name === onlineUser.name && user.PIN === onlineUser.PIN) {
        user.balance = (user.balance || 0) + amount; 
        onlineUser.balance = user.balance;
      }
      return user;
    });

    chrome.storage.local.set({
      users: JSON.stringify(updatedUsers),
      onlineUser: JSON.stringify(onlineUser),
    });

    modalMessage.textContent = `Waxaad ku shubatay $${amount}. Haraagaaga cusub waa $${onlineUser.balance}`;
    SubmitBtn.style.display = "none";
    modalInput.style.display = "none";
    errorMessage.style.display = "none";
  });
}


let newPIN = "";
let changeStep = 1;

// Handle PIN change process
function handleChangePIN() {
  const enteredPIN = getEnteredPIN();

  chrome.storage.local.get(["users", "onlineUser"], (result) => {
    const users = JSON.parse(result.users || "[]"); 
    const onlineUser = JSON.parse(result.onlineUser || "{}");

    if (changeStep === 1) {
      if (enteredPIN !== onlineUser.PIN) {
        showError("PIN-ka aad gelisay waa khalad.");
        return;
      }
      changeStep = 2;
      modalMessage.textContent = "Fadlan gali PIN-kaaga cusub.";
      clearInputs();
    } else if (changeStep === 2) {
      if (!newPIN) {
        newPIN = enteredPIN;
        modalMessage.textContent = "Fadlan ku celi PIN-kaaga cusub.";
        clearInputs();
      } else if (newPIN !== enteredPIN) {
        showError("PIN-kii hore iyo kan cusub iskuma eka.");
        return;
      } else {
        // Update the online user's PIN
        onlineUser.PIN = newPIN;

        const updatedUsers = users.map((user) => {
          if (user.name === onlineUser.name) {
            user.PIN = newPIN;
          }
          return user;
        });

        // Save updated users and onlineUser back to storage
        chrome.storage.local.set(
          {
            users: JSON.stringify(updatedUsers),
            onlineUser: JSON.stringify(onlineUser),
          },
          () => {
            modalMessage.textContent =
              "Waad ku guulaysatay inaad badasho PIN-kaaga.";
            errorMessage.style.display = "none";
            PINInputs.style.display = "none";
            SubmitBtn.style.display = "none";
            changeStep = 1;
            newPIN = "";
          }
        );
      }
    }
  });
}

// purchase
function showPurchaseConfirmation(amount, platform) {
  const topModalContent = document.querySelector(".topModalContent");
  currentAction = "purchase";
  modal.style.display = "flex";
  modalInput.style.display = "flex";
  modalInput.placeholder = 'Fadlan gali PIN-kaaga'
  modalMessage.textContent = `Ma hubtaa inaad $${amount} wax kaga iibsato ${platform}? Fadlan gali PIN-kaaga si aad u dhammaystirto.`;
  modalMessage.style.textAlign = "left";
  PINInputs.style.display = "none";
  topModalContent.style.display = "none";
}

const purchaseAmount = 100;
const purchaseReceiver = 'dugsiiye.com'

document.addEventListener("DOMContentLoaded", showPurchaseConfirmation(purchaseAmount, purchaseReceiver));

// function to handle purchase request
function handlePurchase(amount, platform) {
  const enteredPIN = modalInput.value.trim();

  if (enteredPIN === "") {
    showError("Fadlan gali PIN-kaaga.");
    return;
  }
  // Check if the entered PIN consists only of numbers
  if (!/^\d+$/.test(enteredPIN)) {
    showError("Fadlan gali lambar PIN oo kaliya.");
    return;
  }

  if (enteredPIN.trim().length !== 4) {
    showError("PIN-ka waa inuu ahaadaa 4 lambar.");
    return;
  }

  chrome.storage.local.get("onlineUser", (result) => {
    const onlineUser = JSON.parse(result.onlineUser || "{}");

    if (enteredPIN !== onlineUser.PIN) {
      showError("PIN-ka aad soo gelisay waa khalad.");
      return;
    }

    if (onlineUser.balance < amount) {
      modalMessage.textContent = "Waan ka xunnahay haraagaga kuma filna.";
      modalInput.style.display = "none";
      SubmitBtn.style.display = "none";
      errorMessage.style.display = "none";
      return;
    }

    onlineUser.balance -= amount;

    // Get the current date and time for the transaction
    const transactionTime = new Date().toLocaleString();

    // Save the updated user balance
    chrome.storage.local.get(["users"], (result) => {
      const users = JSON.parse(result.users || "[]");

      const updatedUsers = users.map((user) => {
        if (user.name === onlineUser.name) {
          user.balance = onlineUser.balance;
        }
        return user;
      });

      chrome.storage.local.set(
        {
          users: JSON.stringify(updatedUsers),
          onlineUser: JSON.stringify(onlineUser),
        },
        () => {
          // Show the success message
          handleSuccessMessage(amount, platform, onlineUser.balance);
          SubmitBtn.style.display = "none";
          modalInput.style.display = "none";
          errorMessage.style.display = "none";
        }
      );
    });
  });
}

function handleSuccessMessage(amount, platform, newBalance) {
  const successPopup = document.querySelector(".success-popup");
  const successMessage = document.querySelector("#successMessage");

  // Set the success message content
  successMessage.textContent = `Waxaad $${amount} u wareejisay ${platform}, Taariikhda: ${new Date().toLocaleString()}, Haraagaaga waa $${newBalance}.`;

  successPopup.classList.add("show");
}



// Utility Functions
function clearInputs() {
  inputs.forEach((input) => (input.value = ""));
  modalInput.value = "";
}

function getEnteredPIN() {
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
  }if (event.target === LogoutModal){
    LogoutModal.style.display = "none";
  } 
};
