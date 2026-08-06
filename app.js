let cart = [];
let total = 0;

const prices = {
  "Chicken Biryani": 180,
  "Veg Thali": 120,
  "Fried Rice": 100,
  "Chicken Roll": 90,
  "Veg Roll": 50
};

function addToCart(item) {
  cart.push(item);
  total += prices[item];
  updateCart();
}

function updateCart() {
  let html = "<h2>🛒 Cart</h2>";

  cart.forEach(function(item) {
    html += "<p>" + item + "</p>";
  });

  html += "<hr>";
  html += "<h3>Total: ₹" + total + "</h3>";

  document.getElementById("cart").innerHTML = html;
}

function searchFood() {
  let input = document.getElementById("search").value.toLowerCase();
  let cards = document.getElementsByClassName("food-card");

  for (let i = 0; i < cards.length; i++) {
    let name = cards[i].getElementsByTagName("h2")[0].innerText.toLowerCase();

    if (name.indexOf(input) > -1) {
      cards[i].style.display = "";
    } else {
      cards[i].style.display = "none";
    }
  }
}
function sendWhatsAppOrder() {
let name = document.getElementById("name").value;
let phone = document.getElementById("phone").value;
let address = document.getElementById("address").value;

let message =
"🍽️ S&A Family Restaurant\n\n" +
"Name: " + name + "\n" +
"Phone: " + phone + "\n" +
"Address: " + address + "\n\n" +
"Order:\n" + cart.join("\n") +
"\n\nTotal: ₹" + total;

// यहाँ अपना WhatsApp नंबर डालो
let whatsappNumber = "98453270362

window.open(
"
https://wa.me/
" + whatsappNumber + "?text=" + encodeURIComponent(message),
"_blank"
);
}
function payNow() {
    alert("Please complete the payment and then click 'Order on WhatsApp'.");
}
