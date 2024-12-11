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
      window.location.href = "./auth.html";
    }
  });
}

const logoutBtn = document.getElementById("Logout");
const confirmLogout = document.getElementById("confirmLogout");
const cancelLogout = document.getElementById("cancelLogout");
logoutBtn.addEventListener("click", () => {
  const modal = document.getElementById("logoutModal");
  modal.style.display = "flex";
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


// Check Balance

const CheckBalanceBTN = document.querySelector("#checkBalance");

CheckBalanceBTN.addEventListener("click", () => {
  console.log('btn checkBalance clicked');
  modal.style.display = "flex";
  modalTitle.textContent = "Check Balance";
  modalMessage.textContent = "Fadlan gali PIN-kaaga";
  modalInput.style.display = "none";
});

// topup

const topupBTN = document.querySelector("#topUp");

topupBTN.addEventListener("click", () => {
  modal.style.display = "flex";
  modalTitle.textContent = "Top Up";
  modalInput.placeholder = "$ 0.00";
  PINInputs.style.display = "none";
})


// change PIN
const changePIN = document.querySelector("#changePIN");

changePIN.addEventListener("click", () => {
  modal.style.display = "flex";
  modalTitle.textContent = "Change PIN";
  modalMessage.textContent = "Fadlan gali PIN-kaaga";
  modalInput.style.display = "none"
})

modalForm.addEventListener("submit", (event) => {
  event.preventDefault();
   let isEmpty = false;
    inputs.forEach(input => {
        if (input.value.trim() === "") {
            isEmpty = true;
        }
    });
    if (isEmpty) {
        showError("Fill All the inputs");
        return
    }if (modalInput.value.trim() === "" && modalInput.value.trim < 5) {

    }else{
    modalMessage.textContent = "Fadlan Gali PIN-kaaga Cusub";
    inputs.forEach(input => {
    input.value = ''
     })
    }

    if (modalInput.value.trim < 5){
      showError('Wax ka yar $5 laguma shubi karo!')
    }
});


function showError(message) {
  errorMessage.textContent = message;
  errorMessage.style.display = "block";
}

// close modal
window.onclick = function (event) {
  if (event.target == modal) {
    modal.style.display = "none";
    errorMessage.style.display = "none";
  }
};