const authFields = document.querySelectorAll(".authFields");
const UserPhoneNumber = document.querySelector("#UserPhoneNumber");
const username = document.querySelector("#username");
const selectProvider = document.querySelector("#selectProvider");
const providerPrefix = document.querySelector("#providerPrefix");
const PIN = document.querySelector("#PIN");
const authSwitch = document.querySelector("#authSwitch");
const formGreting = document.querySelector("#formGreting");
const formtitle = document.querySelector("#formtitle");
const authButton = document.querySelector("#authButton");
const authisignIN = document.querySelector(".auth");
const authForm = document.querySelector("#authForm");
const errorMessage = document.querySelector("#errorMessage");
const successMessage = document.querySelector("#successMessage");

let isSignIn = true;

document.body.addEventListener("click", (e) => {
  if (e.target.id !== "switchForm") return;
  switchAuthForm();
});

username.addEventListener("input", clearError);
selectProvider.addEventListener("input", clearError);
PIN.addEventListener("input", clearError);
UserPhoneNumber.addEventListener("input", clearError);

selectProvider.addEventListener("change", () => {
  const selectedtedProvider = selectProvider.value;
  if (selectedtedProvider === "hormuud") {
    providerPrefix.textContent = "61";
  } else if (selectedtedProvider === "somtel") {
    providerPrefix.textContent = "62";
  } else if (selectedtedProvider === "telesom") {
    providerPrefix.textContent = "63";
  } else if (selectedtedProvider === "golis") {
    providerPrefix.textContent = "09";
  } else if (selectedtedProvider === "somnet") {
    providerPrefix.textContent = "68";
  } else {
    showError("Please select a provider");
    providerPrefix.textContent = "";
    return;
  }
});

authForm.addEventListener("submit", (e) => {
  e.preventDefault();
  clearError();

  const phoneNumber = `+252${providerPrefix.textContent}${UserPhoneNumber.value}`;
  const user = {
    userName: !isSignIn ? username.value : undefined,
    userphoneNumber: phoneNumber,
    PIN: PIN.value,
  };

  if (isSignIn) {
    // Sign-in logic
    if (UserPhoneNumber.value.trim() === "") {
      showError("Please enter your phone number");
      return;
    }
    if (PIN.value.length !== 4) {
      showError("Plese enter your PIN");
      return;
    }
    chrome.storage.local.get("users", (result) => {
      const users = result.users ? JSON.parse(result.users) : [];
      const userExisting = users.find(
        (user) =>
          user.userphoneNumber === `+252${UserPhoneNumber.value}` &&
          user.PIN === PIN.value
      );
      if (userExisting) {
        chrome.storage.local.set(
          { onlineUser: JSON.stringify(userExisting) },
          () => {
            window.location.href = "./dashboard.html";
          }
        );
      } else {
        showError("Invalid phone number or PIN");
        return;
      }
    });
  } else {
    if (username.value.trim() === "") {
      showError("Please enter your name");
      return;
    }
    if (selectProvider.value === "") {
      showError("Please select a provider");
      return;
    }
    if (UserPhoneNumber.value.trim() === "") {
      showError("Please enter your phone number");
      return;
    }
    if (PIN.value.length !== 4) {
      showError("PIN must be exactly 4 digits long");
      return;
    }

    chrome.storage.local.get("users", (result) => {
      const users = result.users ? JSON.parse(result.users) : [];
      const phoneExists = users.find(
        (user) => user.userphoneNumber === phoneNumber
      );

      if (phoneExists) {
        showError("This phone number is already in use.");
        return;
      }
      users.push(user);
      chrome.storage.local.set({ users: JSON.stringify(users) }, () => {
        console.log("User successfully registered");
        showSuccess("Account created successfully!");
        setTimeout(() => {
          switchAuthForm();
        }, 1000);
      });
    });
  }
});

function switchAuthForm() {
  isSignIn = !isSignIn;

  if (!isSignIn) {
    formGreting.textContent = "Get Started with dhaqsoPay";
    formtitle.textContent = "Create your free account";
    authFields.forEach((field) => (field.style.display = "flex"));
    providerPrefix.style.display = "flex";
    authSwitch.innerHTML = `Already have an account? <a href="#" id="switchForm">Sign In</a>`;
    authButton.textContent = "Sign up";
    authisignIN.classList.remove("isSignIn");
    clearError();
  } else {
    formGreting.textContent = "Welcome back!";
    formtitle.textContent = "Login to your account";
    authFields.forEach((field) => (field.style.display = "none"));
    providerPrefix.style.display = "none";
    authSwitch.innerHTML = `Don’t have an account? <a href="#" id="switchForm">Sign Up</a>`;
    authButton.textContent = "Sign in";
    authisignIN.classList.add("isSignIn");
    clearError();
  }
  UserPhoneNumber.value = "";
  PIN.value = "";
  if (username) username.value = "";
  if (selectProvider) selectProvider.value = "";
}

function showError(message) {
  errorMessage.textContent = message;
  errorMessage.style.display = "block";
}
function showSuccess(message) {
  successMessage.textContent = message;
  successMessage.style.display = "block";
}
function clearError() {
  errorMessage.textContent = "";
  errorMessage.style.display = "none";
  successMessage.style.display = "none";
  successMessage.textContent = "";
}

const togglePIN = document.querySelector("#togglePIN");

togglePIN.addEventListener("click", () => {
  
  if (PIN.type === "password") {
    PIN.type = "text";
    togglePIN.src = "./icons/show.svg";
  } else {
    PIN.type = "password";
    togglePIN.src = "./icons/Hide.svg";
  }
});
