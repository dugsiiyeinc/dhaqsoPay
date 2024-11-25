const username = document.querySelector('#username');
const selectProvider = document.querySelector("#selectProvider");
const providerPrefix = document.querySelector('providerPrefix');
const UserphoneNumber = document.querySelector("#UserPhoneNumber");
const PIN = document.querySelector("#PIN");
const authSwitch = document.querySelector("#authSwitch");
const switchForm = document.querySelector('#switchForm');
const formGreting = document.querySelector('#formGreting');
const formtitle = document.querySelector('#formtitle');
const authForm = document.querySelector("#authForm");
const auth = document.querySelector("#auth");

let isSignIn = true;

document.body.addEventListener("click", (e) => {
    if (e.target.id !== "switchForm") return ;
    switchAuthForm()
})

function switchAuthForm() {
    isSignIn = !isSignIn;
    if (!isSignIn){
        formGreting.textContent = "Get Started with dhaqsoPay";
        formtitle.textContent = "Create your free account";
        username.style.display = "flex";
        selectProvider.display = "flex";
        providerPrefix.style.display = "flex";
        UserphoneNumber.value = "";
        PIN.value = "";
        authSwitch.textContent = `Already have an account? <a href="#" id="switchForm">Sign in</a>`;
    }else{
        formGreting.textContent = "Welcome back!";
        formtitle.textContent = "Login to your account";
        username.style.display = "none";
        selectProvider.display = "none";
        providerPrefix.style.display = "none";
        UserphoneNumber.value = "";
        PIN.value = "";
        authSwitch.textContent = `Don’t have an account? <a href="#" id="switchForm">Sign Up</a>`;
        auth.style.marginTop = "4rem";
    }
}