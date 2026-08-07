let cart = [];
let total = 0;

const prices = {
  "Chicken Biryani": 180,
  "Veg Thali": 120,
  "Fried Rice": 100
};

function addToCart(item) {
  cart.push(item);
  total += prices[item];
  updateCart();
}

function updateCart() {
  let cartDiv = document.getElementById("cart");

  if (cart.length === 0) {
    cartDiv.innerHTML = `
      <h2>🛒 Your Cart</h2>
      <p>No items added.</p>
    `;
    return;
  }

  let html = "<h2>🛒 Your Cart</h2>";

  cart.forEach((item, index) => {
    html += `
      <p>${index + 1}. ${item}</p>
    `;
  });

  html += `
    <hr>
    <h3>Total: ₹${total}</h3>

    <input id="customerName" type="text"
    placeholder="Your Name"
    style="width:100%;padding:10px;margin-top:10px;">

    <input id="customerPhone" type="text"
    placeholder="Mobile Number"
    style="width:100%;padding:10px;margin-top:10px;">

    <textarea id="customerAddress"
    placeholder="Delivery Address"
    style="width:100%;padding:10px;margin-top:10px;"></textarea>

    <button onclick="sendWhatsAppOrder()"
    style="margin-top:15px;background:green;color:white;padding:15px;width:100%;border:none;border-radius:8px;">
      📱 Order on WhatsApp
    </button>
  `;

  cartDiv.innerHTML = html;
}

function searchFood() {
  let input = document
    .getElementById("search")
    .value
    .toLowerCase();

  let cards = document.querySelectorAll(".food-card");

  cards.forEach(card => {
    let name = card.querySelector("h2").innerText.toLowerCase();

    if (name.includes(input)) {
      card.style.display = "block";
    } else {
      card.style.display = "none";
    }
  });
}

function sendWhatsAppOrder() {

  let name = document.getElementById("customerName").value;
  let phone = document.getElementById("customerPhone").value;
  let address = document.getElementById("customerAddress").value;

  let message =
`🍽️ S&A Family Restaurant

Customer: ${name}
Phone: ${phone}
Address: ${address}

Order:
${cart.join("\n")}

Total: ₹${total}`;

  let whatsapp =
"https://wa.me/918453270362?text=" + encodeURIComponent(message);

  window.open(whatsapp, "_blank");
}