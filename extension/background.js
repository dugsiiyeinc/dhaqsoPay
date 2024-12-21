let ws = null;
let userNumber = null; // Store the user's number
let pendingRequest = null; // Store the pending payment request

// Function to initialize WebSocket
function initializeWebSocket(number) {
  if (ws && ws.readyState === WebSocket.OPEN) return; // Prevent multiple connections

  ws = new WebSocket("ws://localhost:8000"); // Replace with your WebSocket server URL

  ws.onopen = () => {
    console.log("WebSocket connection established.");

    // Register the user with their phone number
    userNumber = number;
    ws.send(
      JSON.stringify({
        type: "REGISTER",
        number: userNumber,
      })
    );
  };

  ws.onmessage = (event) => {
    const data = JSON.parse(event.data);

    if (data.type === "CONFIRM_PAYMENT") {
      pendingRequest = data; // Store pending payment request
      chrome.runtime.sendMessage({ type: "CONFIRM_PAYMENT", data });
    } else if (data.type === "PAYMENT_RESPONSE") {
      // Forward payment response to the popup
      chrome.runtime.sendMessage({ type: "PAYMENT_RESPONSE", data });
    }
  };

  ws.onclose = () => {
    console.log("WebSocket connection closed.");
  };

  ws.onerror = (error) => {
    console.error("WebSocket error:", error);
  };
}

// Function to send WebSocket messages
function sendWebSocketMessage(message) {
  if (ws && ws.readyState === WebSocket.OPEN) {
    ws.send(JSON.stringify(message));
  } else {
    console.error("WebSocket is not open.");
  }
}

// Listen for messages from the popup
chrome.runtime.onMessage.addListener((message, sender, sendResponse) => {
  if (message.type === "INIT_WEBSOCKET") {
    initializeWebSocket(message.number);
    sendResponse({ success: true });
  }

  if (message.type === "CONFIRM_PAYMENT") {
    sendWebSocketMessage(message.data); // Send payment confirmation
    pendingRequest = null; // Clear pending request
  }

  if (message.type === "GET_PENDING_PAYMENT") {
    sendResponse({ pendingRequest }); // Return pending request
  }
});
