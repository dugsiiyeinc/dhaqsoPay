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

// change PIN
const changePIN = document.querySelector("#changePIN");

changePIN.addEventListener("click", () => {
  modal.style.display = "flex";
  modalTitle.textContent = "Change PIN";
  modalInput.type = "password";
  modalInput.placeholder = "Fadlan gali PIN-kaaga"
})

modalForm.addEventListener("submit", (event) => {
  event.preventDefault();
  if(modalInput.value)
  if (modalInput.value.length !== 4) {
     showError("PIN must be exactly 4 digits long");
     return;
  }else{
    window.location.href = "/dashboard.html"
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
  }
};