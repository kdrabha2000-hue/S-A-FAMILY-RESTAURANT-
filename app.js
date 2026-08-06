

let cart = [];
let total = 0;

const prices = {
  "Chicken Biryani": 180,
  "Veg Thali": 120,
  "Fried Rice": 100,
  "Chicken Roll": 90,
  "Veg Roll": 50
};

function addToCart(itemName) {
  cart.push(itemName);
  total += prices[itemName];

  document.getElementById("cart").innerHTML =
    "<h2>🛒 Cart</h2>" +
    cart.map(item => "<p>" + item + "</p>").join("") +
    "<hr><h3>Total: ₹" + total + "</h3>";
}
function sendOrder() {
  let name = document.getElementById("customerName").value;
  let phone = document.getElementById("customerPhone").value;
  let address = document.getElementById("customerAddress").value;

  let message =
    "🍽️ S&A Family Restaurant\n\n" +
    "Name: " + name + "\n" +
    "Phone: " + phone + "\n" +
    "Address: " + address + "\n\n" +
    "Order:\n" + cart.join("\n") +
    "\n\nTotal: ₹" + total;

  // 👇 यहाँ अपना WhatsApp नंबर डालना
  let whatsapp = "918453270362

  window.open(
    "https://wa.me/" + whatsapp + "?text=" + encodeURIComponent(message),
    "_blank"
  );
}