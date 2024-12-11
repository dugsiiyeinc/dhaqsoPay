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

// // navigate to change pin Screen when clicked change pin ico

// modal
const modal = document.querySelector(".modal");
const modalTitle = document.querySelector("#modalTitle");
const modalMessage = document.querySelector("#modalMessage");
const modalInput = document.querySelector("#modalInput");
const modalForm = document.querySelector("#modalForm");
const errorMessage = document.querySelector("#errorMessage");
const inputs = document.querySelectorAll(".pin-input input");


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


// change PIN
const changePIN = document.querySelector("#changePIN");

changePIN.addEventListener("click", () => {
  modal.style.display = "flex";
  modalTitle.textContent = "Change PIN";
  modalMessage.textContent = "Fadlan gali PIN-kaaga";
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
    }else{
     modalMessage.textContent = "Fadlan Gali PIN-kaaga Cusub";
     inputs.forEach(input => {
      input.value = ''
     })
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