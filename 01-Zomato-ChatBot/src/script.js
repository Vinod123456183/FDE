// On http://localhost:3000 this is a same-origin call (no CORS needed).
// From Live Server (5500) or a file, it calls the Express server directly (needs CORS in app.ts).
const API_URL =
  location.port === "3000" ? "/api/chat" : "http://localhost:3000/api/chat";

const QUICK_ACTIONS = [
  {
    label: "Where is my order?",
    text: "Where is my order? Can you help me track it?",
  },
  {
    label: "My order is delayed",
    text: "My order is delayed. It has been much longer than the estimated delivery time.",
  },
  {
    label: "Request a refund",
    text: "I would like to request a refund for my order.",
  },
  {
    label: "Wrong or missing item",
    text: "I received a wrong or missing item in my order.",
  },
  { label: "Cancel my order", text: "I want to cancel my order." },
  {
    label: "Payment failed",
    text: "My payment failed but the money was deducted from my account.",
  },
  { label: "Refund policy", text: "What is your refund policy?", policy: true },
  {
    label: "Cancellation policy",
    text: "What is your cancellation policy?",
    policy: true,
  },
];

const messagesEl = document.getElementById("messages");
const chipsEl = document.getElementById("chips");
const form = document.getElementById("composer");
const input = document.getElementById("input");
const sendBtn = document.getElementById("send");
let busy = false;

function addMessage(text, type) {
  const div = document.createElement("div");
  div.className = "msg " + type;
  div.textContent = text; // textContent avoids HTML injection
  messagesEl.appendChild(div);
  messagesEl.scrollTop = messagesEl.scrollHeight;
  return div;
}

function showTyping() {
  const div = document.createElement("div");
  div.className = "msg bot typing";
  div.setAttribute("aria-label", "Support is typing");
  div.innerHTML = "<span></span><span></span><span></span>";
  messagesEl.appendChild(div);
  messagesEl.scrollTop = messagesEl.scrollHeight;
  return div;
}

function setBusy(state) {
  busy = state;
  sendBtn.disabled = state;
  input.disabled = state;
  chipsEl.querySelectorAll("button").forEach((b) => (b.disabled = state));
  if (!state) input.focus();
}

async function sendMessage(text) {
  text = text.trim();
  if (!text || busy) return;

  addMessage(text, "user");
  input.value = "";
  autoGrow();
  setBusy(true);
  const typing = showTyping();

  try {
    const res = await fetch(API_URL, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ message: text }),
    });
    const data = await res.json().catch(() => ({}));
    typing.remove();

    if (!res.ok) {
      const detail = data.details || data.error || "Something went wrong.";
      addMessage(
        "We could not get a reply (" +
          res.status +
          "). " +
          detail +
          "\n[Request sent to: " +
          API_URL +
          "]",
        "error",
      );
    } else {
      addMessage(data.reply, "bot");
    }
  } catch (err) {
    typing.remove();
    console.error("Chat request failed:", err);
    addMessage(
      "Cannot reach the server.\n" +
        "Reason: " +
        err.message +
        "\n" +
        "This page is open at: " +
        location.href +
        "\n" +
        "It tried to call: " +
        API_URL +
        "\n" +
        "Fix: open http://localhost:3000/ in the browser and make sure the server is running.",
      "error",
    );
  } finally {
    setBusy(false);
  }
}

// Build quick-action buttons
QUICK_ACTIONS.forEach((action) => {
  const btn = document.createElement("button");
  btn.type = "button";
  btn.className = "chip" + (action.policy ? " policy" : "");
  btn.textContent = action.label;
  btn.addEventListener("click", () => sendMessage(action.text));
  chipsEl.appendChild(btn);
});

// Composer behavior
function autoGrow() {
  input.style.height = "auto";
  input.style.height = Math.min(input.scrollHeight, 120) + "px";
}
input.addEventListener("input", autoGrow);
input.addEventListener("keydown", (e) => {
  if (e.key === "Enter" && !e.shiftKey) {
    e.preventDefault();
    form.requestSubmit();
  }
});
form.addEventListener("submit", (e) => {
  e.preventDefault();
  sendMessage(input.value);
});

// Welcome message
addMessage(
  "Hi, welcome to Tomato support. I can help with food orders, refunds, order tracking and our policies. What can I help you with?",
  "bot",
);
input.focus();
