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