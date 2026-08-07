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
  let cartDiv = document.getElementById("cart");

  let html = "<h2>🛒 Your Cart</h2>";

  if (cart.length === 0) {
    html += "<p>No items added.</p>";
  } else {
    cart.forEach(function(item) {
      html += "<p>" + item + "</p>";
    });

    html += "<hr>";
    html += "<h3>Total: ₹" + total + "</h3>";
  }

  cartDiv.innerHTML = html;
}

function searchFood() {
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
