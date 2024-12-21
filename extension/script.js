const authFields = document.querySelectorAll(".authFields");
const number = document.querySelector("#number");
const fullname = document.querySelector("#fullname");
const selectProvider = document.querySelector("#selectProvider");
const providerPrefix = document.querySelector("#providerPrefix");
const pin = document.querySelector("#pin");
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

fullname.addEventListener("input", clearError);
selectProvider.addEventListener("input", clearError);
pin.addEventListener("input", clearError);
number.addEventListener("input", clearError);

const updatePrefix = (provider) => {
  let prefix = "";

  // Assign prefix based on provider
  switch (provider) {
    case "hormuud":
      prefix = "61";
      break;
    case "somtel":
      prefix = "62";
      break;
    case "telesom":
      prefix = "63";
      break;
    case "golis":
      prefix = "09";
      break;
    case "somnet":
      prefix = "68";
      break;
    default:
      prefix = "";
      break;
  }
  providerPrefix.textContent = prefix;
};

document.addEventListener("DOMContentLoaded", () => {
  const defaultProvider = selectProvider.value;
  updatePrefix(defaultProvider); 
});

selectProvider.addEventListener("change", () => {
  const selectedProvider = selectProvider.value;
  updatePrefix(selectedProvider);
});


pin.addEventListener("input", () => {

  pin.value = pin.value.replace(/\D/g, "");

  if (pin.value.length === 4) {
    clearError();
  }
});


authForm.addEventListener("submit", async (e) => {
  e.preventDefault();
  clearError();

  const phoneNumber = `+252${providerPrefix.textContent}${number.value}`;
  const user = {
    fullname: !isSignIn ? fullname.value : undefined,
    number: phoneNumber,
    pin: pin.value,
    balance: 0,
  };

  if (isSignIn) {
    // Sign-in logic
    if (number.value.trim() === "") {
      showError("Please enter your phone number");
      return;
    }
    if (pin.value.length !== 4) {
      showError("Please enter your pin");
      return;
    }

    console.log(number.value);

    try {
      // Check with the server if user is not found locally
      const response = await fetch("http://localhost:8000/api/login", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ number: `+252${number.value}`, pin: pin.value }),
      });
      
      const data = await response.json();
      console.log('data:', data);
      if (data.status == true) {
        console.log(data.user);
        saveUserAndRedirect(data.user);
      } else {
        showError(data.error);
      }
    } catch (error) {
      showError(error);
    }
  } else {
    // Sign-up logic
    if (!validateFields()) return;

    try {
      const response = await fetch("http://localhost:8000/api/register", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ ...user }),
      });

      const data = await response.json();

      if (data.user) {
        showSuccess("Account created successfully!");
        setTimeout(switchAuthForm, 1000);
      } else {
        showError(data.error || "Error registering user.");
      }
    } catch (error) {
      showError(error);
    }
  }
});

function saveUserAndRedirect(user) {
  chrome.storage.local.set({ onlineUser: JSON.stringify(user) }, () => {
    window.location.href = "./dashboard.html";
  });
}

function validateFields() {
  if (fullname.value.trim() === "") {
    showError("Please enter your name");
    return false;
  }
  if (selectProvider.value === "") {
    showError("Please select a provider");
    return false;
  }
  if (number.value.trim() === "") {
    showError("Please enter your phone number");
    return false;
  }
  if (pin.value.length !== 4) {
    showError("pin must be exactly 4 digits long");
    return false;
  }
  return true;
}

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
  number.value = "";
  pin.value = "";
  if (fullname) fullname.value = "";
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

const togglepin = document.querySelector("#togglepin");

togglepin.addEventListener("click", () => {
  
  if (pin.type === "password") {
    pin.type = "text";
    togglepin.src = "./icons/show.svg";
  } else {
    pin.type = "password";
    togglepin.src = "./icons/Hide.svg";
  }
});
