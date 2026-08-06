

let cart = [];
let total = 0;let deliveryCharge = 30;

document.getElementById("cart").innerHTML =
"<h2>🛒 Cart</h2>" +
cart.map(item => "<p>" + item + "</p>").join("") +
"<hr><h3>Food Total: ₹" + total + "</h3>" +
"<h3>Delivery Charge: ₹" + deliveryCharge + "</h3>" +
"<h2>Grand Total: ₹" + (total + deliveryCharge) + "</h2>";

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
<br><br>
<h3>💳 Pay with UPI</h3>

<p>UPI ID: 6000026478@okbizaxis</p>

<button onclick="alert('Payment complete? Then click Order on WhatsApp.')">
I Have Paid
</button>
  window.open(
    "https://wa.me/" + whatsapp + "?text=" + encodeURIComponent(message),
    "_blank"
  );
}function searchFood() {
  let input = document.getElementById("search").value.toLowerCase();
  let cards = document.getElementsByClassName("food-card");

  for (let i = 0; i < cards.length; i++) {
    let name = cards[i].getElementsByTagName("h2")[0].innerText.toLowerCase();

    if (name.includes(input)) {
      cards[i].style.display = "block";
    } else {
      cards[i].style.display = "none";
    }
  }
}
